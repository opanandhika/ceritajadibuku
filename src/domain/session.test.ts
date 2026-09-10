import { describe, expect, it } from "vitest";
import { createSession, recoverSession, transition, type Action, type Context } from "./session";
import type { Scenario, Session } from "./model";
import { simulatedResult } from "../demo/provider";
import { exampleDemo } from "../../tests/fixtures/demo";

function harness(free = false, kind: Session["kind"] = "story") {
  let session = createSession("test", "Awal mimpi ke Jepang", 1, kind, free);
  const context: Context = { credits: 150, characters: exampleDemo().books[0].characters, privacyRevision: 1 };
  function act(action: Action, version = session.version) {
    const result = transition(session, action, version, context);
    context.credits -= result.charge;
    session = result.session;
    return result;
  }
  function answer(text = "Aku mulai belajar.") { act({ type: "input", text }); act({ type: "submit" }); }
  function resolve(scenario: Scenario = "short") {
    const op = session.operation!;
    act({ type: "resolve", operationId: op.id, result: simulatedResult(op, scenario, session.questions.map((question) => question.target)) });
  }
  return { get session() { return session; }, context, act, answer, resolve };
}

describe("kontrak sesi cerita", () => {
  it("nama panggilan ambigu tidak masuk provider atau ditagih", () => {
    const h = harness(); h.answer("Budi meminjamkan buku.");
    expect(h.session.state).toBe("blocked"); expect(h.session.operation).toBeNull();
    expect(h.session.spent).toBe(0); expect(h.session.answers[0].text).toContain("Budi");
  });
  it.each(["Nadia menulis cerita.", "[TOKOH_tidak_dikenal] menulis."])("keluaran provider terlarang ditolak sebelum biaya draf: %s", (text) => {
    const h = harness(true); h.answer(); h.resolve("enough");
    const operation = h.session.operation!;
    h.act({ type: "resolve", operationId: operation.id, result: { action: "written", text } });
    expect(h.session.state).toBe("blocked");
    expect(h.session.draft).toBeNull(); expect(h.session.spent).toBe(0);
  });
  it("cerita bebas cukup langsung draf, 4 kredit, tanpa pertanyaan otomatis setelahnya", () => {
    const h = harness(true);
    h.answer("Aku menuliskan sebuah mimpi."); h.resolve("enough");
    expect(h.session.state).toBe("generating_draft");
    expect(h.session.spent).toBe(0);
    h.resolve();
    expect(h.session.state).toBe("draft_review");
    expect(h.session.questions).toHaveLength(0);
    expect(h.session.spent).toBe(4);
    expect(h.session.operation).toBeNull();
  });
  it("pertanyaan keempat tetap menunggu jawaban, tanpa pertanyaan kelima", () => {
    const h = harness();
    for (let i = 0; i < 3; i++) { h.answer(); h.resolve(); }
    expect(h.session.questions).toHaveLength(4);
    expect(h.session.state).toBe("awaiting_answer");
    expect(h.session.operation).toBeNull();
    h.answer(); h.resolve(); h.resolve();
    expect(h.session.questions).toHaveLength(4);
    expect(h.session.spent).toBe(5);
  });
  it("dua Lewati kosong menyimpan bahan tanpa draf rekaan atau tagihan", () => {
    const h = harness();
    h.act({ type: "skip" }); h.act({ type: "skip" });
    expect(h.session.state).toBe("saved_incomplete");
    expect(h.session.questions).toHaveLength(2);
    expect(h.session.spent).toBe(0);
    expect(h.session.draft).toBeNull();
  });
  it("jawaban substantif mereset skip; detail yang dilewati tidak dikejar lagi", () => {
    const h = harness(); h.act({ type: "skip" }); h.answer(); h.resolve(); h.act({ type: "skip" });
    expect(h.session.skips).toBe(1);
    expect(new Set(h.session.questions.map((question) => question.target)).size).toBe(h.session.questions.length);
  });
  it("sesi refleksi satu pertanyaan berakhir setelah satu skip", () => {
    const h = harness(false, "reflection"); h.act({ type: "skip" });
    expect(h.session.questions).toHaveLength(1);
    expect(h.session.state).toBe("saved_incomplete");
    expect(h.context.credits).toBe(150);
  });
  it("pertanyaan bertumpuk diperbaiki berdasarkan katalog satu fokus", () => {
    const h = harness(); h.answer(); h.resolve("stacked");
    expect(h.session.questions.at(-1)?.text).toBe("Apa langkah pertama yang kamu lakukan?");
    expect(h.session.questions.at(-1)?.text).not.toContain("siapa");
  });
  it("input/autosave dan skip tidak mengirim buffer secara diam-diam", () => {
    const h = harness(); h.act({ type: "input", text: "Rahasia belum dikirim" }); h.act({ type: "skip" });
    expect(h.session.input).toBe("Rahasia belum dikirim");
    expect(h.session.answers).toHaveLength(0);
    expect(h.session.operation).toBeNull();
  });
  it("Buat draf sekarang hanya memakai jawaban terkirim", () => {
    const h = harness(); h.answer("Sumber yang dikirim"); h.resolve();
    h.act({ type: "input", text: "BUFFER TIDAK BOLEH DIKIRIM" }); h.act({ type: "draft" });
    expect(h.session.operation?.payload.join(" ")).not.toContain("BUFFER");
    expect(h.session.input).toBe("BUFFER TIDAK BOLEH DIKIRIM");
  });
  it("whitespace tidak menjadi jawaban dan tidak ditagih", () => {
    const h = harness(); h.act({ type: "input", text: "  \n " }); const before = h.session;
    h.act({ type: "submit" }); expect(h.session).toBe(before); expect(h.context.credits).toBe(150);
  });
  it("pause membatalkan efek respons terlambat dan hasil tidak ditagih", () => {
    const h = harness(); h.answer(); const op = h.session.operation!;
    h.act({ type: "pause" });
    h.act({ type: "resolve", operationId: op.id, result: { action: "draft" } }, op.version);
    expect(h.session.state).toBe("paused"); expect(h.session.spent).toBe(0);
    expect(h.session.answers).toHaveLength(1);
    h.act({ type: "resume" }); expect(h.session.state).toBe("blocked"); expect(h.session.operation).toBeNull();
    h.act({ type: "retry" }); expect(h.session.operation?.id).not.toBe(op.id);
  });
  it("refresh saat proses tidak memanggil ulang provider", () => {
    const h = harness(); h.answer();
    const recovered = recoverSession(h.session);
    expect(recovered.state).toBe("blocked"); expect(recovered.operation).toBeNull();
    expect(recovered.answers).toEqual(h.session.answers);
  });
  it("refresh paused mempertahankan pertanyaan, input dan biaya", () => {
    const h = harness(); h.answer(); h.resolve(); h.act({ type: "input", text: "Draf lokal" }); h.act({ type: "pause" });
    expect(recoverSession(h.session)).toEqual(h.session);
    h.act({ type: "resume" }); expect(h.session.state).toBe("awaiting_answer"); expect(h.session.input).toBe("Draf lokal");
    h.answer(); h.resolve(); expect(h.session.spent).toBe(1);
  });
  it("retry setelah gagal tidak menduplikasi jawaban atau tahap sukses", () => {
    const h = harness(); h.answer(); const op = h.session.operation!;
    h.act({ type: "reject", operationId: op.id }); expect(h.session.spent).toBe(0);
    h.act({ type: "retry" }); h.resolve(); expect(h.session.answers).toHaveLength(1);
    expect(h.session.spent).toBe(1);
  });
  it("aksi/hasil identik hanya dapat mengubah state satu kali", () => {
    const h = harness(); h.act({ type: "input", text: "Satu jawaban" }); const version = h.session.version;
    h.act({ type: "submit" }, version); h.act({ type: "submit" }, version);
    expect(h.session.answers).toHaveLength(1);
    const op = h.session.operation!; const action = { type: "resolve", operationId: op.id, result: { action: "draft" } } as const;
    h.act(action, op.version); h.act(action, op.version); expect(h.session.spent).toBe(1);
  });
  it("saldo bertambah tidak melanjutkan proses tertahan sampai retry eksplisit", () => {
    const h = harness(); h.context.credits = 0; h.answer();
    expect(h.session.state).toBe("blocked"); h.context.credits = 50;
    expect(h.session.state).toBe("blocked"); expect(h.session.operation).toBeNull();
    h.act({ type: "retry" }); expect(h.session.state).toBe("evaluating");
  });
  it.each(["inputNoAI", "inputNoBook"] as const)("%s mengecualikan sumber dari provider", (flag) => {
    const h = harness(); h.act({ type: "inputPrivacy", flag, value: true }); h.answer("Tidak boleh diproses");
    expect(h.session.state).toBe("saved_incomplete"); expect(h.session.operation).toBeNull(); expect(h.session.spent).toBe(0);
    expect(h.session.answers[0].text).toBe("Tidak boleh diproses");
  });
  it("payload sudah memakai penanda sebelum masuk adapter", () => {
    const h = harness(); h.answer("Nadia bertemu Ayu di perpustakaan.");
    expect(h.session.operation?.payload[0]).toBe("[TOKOH_01] bertemu [TOKOH_02] di perpustakaan.");
  });
  it("kebijakan berubah ketika provider berjalan menolak hasil dan charge", () => {
    const h = harness(); h.answer(); h.context.privacyRevision += 1; h.resolve();
    expect(h.session.state).toBe("blocked"); expect(h.session.spent).toBe(0);
  });
  it("hanya satu pekerjaan aktif per akun contoh", () => {
    const h = harness(); h.context.otherJobActive = true; h.answer();
    expect(h.session.state).toBe("blocked"); expect(h.session.operation).toBeNull(); expect(h.session.answers).toHaveLength(1);
  });
});
