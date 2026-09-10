import { describe, expect, it } from "vitest";
import { newBook } from "../demo/seed";
import { simulatedResult } from "../demo/provider";
import { createSession, transition, type Action } from "./session";
import { rememberNames } from "./privacy";
import { questionsFor, SUGGESTIONS } from "./product";

describe("cerita pengguna menentukan isi", () => {
  it("menawarkan topik umum dan menyimpan nama yang dipilih pengguna", () => {
    expect(SUGGESTIONS).toEqual(["Awal sebuah mimpi", "Pengalaman yang membekas", "Seseorang yang penting"]);
    const self = rememberNames(newBook("b").characters[0], "Pelangi", "pseudonym");
    expect(self.alias).toBe("Pelangi"); expect(self.displayName).toBe("Pelangi");
    expect(rememberNames(self, "", "pending").displayName).toBe("[Penulis]");
  });
  it.each([
    ["keluarga", "Aku memasak bersama keluarga.", "Apa yang kamu lakukan dalam pengalaman keluarga itu?"],
    ["karier", "Aku memulai karier baru.", "Apa langkah yang kamu ambil dalam perjalanan karier itu?"],
    ["usaha", "Aku membuka usaha kecil.", "Apa yang kamu lakukan dalam pengalaman usaha itu?"],
  ])("pertanyaan dan draf mengikuti bahan %s", (theme, story, expectedQuestion) => {
    const book = newBook("b");
    let session = createSession("s", theme, 1);
    let credits = 150;
    const act = (action: Action) => {
      const result = transition(session, action, session.version, { credits, characters: book.characters, privacyRevision: 1 });
      session = result.session; credits -= result.charge;
    };
    act({ type: "input", text: story }); act({ type: "submit" });
    let operation = session.operation!;
    act({ type: "resolve", operationId: operation.id, result: simulatedResult(operation, "normal", ["beginning"]) });
    expect(session.questions.at(-1)?.text).toBe(expectedQuestion);
    expect(session.state).toBe("awaiting_answer");
    act({ type: "draft" }); operation = session.operation!;
    act({ type: "resolve", operationId: operation.id, result: simulatedResult(operation, "normal", []) });
    expect(session.draft?.text).toBe(story);
    expect(session.spent).toBe(5);
    expect(JSON.stringify(session)).not.toMatch(/Jepang|Nara|Citra Senja/);
  });
  it("tema lain dan tema campuran tetap mendapat pertanyaan terbuka", () => {
    for (const story of ["Aku berlatih melukis.", "Aku menjadi pelanggan toko itu.", "Aku menemui ibu guru.", "Aku membangun usaha bersama keluarga."]) {
      expect(questionsFor(story)[1].text).toBe("Apa langkah pertama yang kamu lakukan?");
    }
  });
});
