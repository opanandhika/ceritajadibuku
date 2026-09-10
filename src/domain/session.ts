import type { Book, Operation, Session } from "./model";
import { QUESTIONS, PRODUCT, questionsFor } from "./product";
import { allowedSources, ambiguousNames, forProvider, fromProvider, providerOutputAllowed } from "./privacy";

export type ProviderResult = { action: "ask"; text: string; targets: string[] } | { action: "draft" } | { action: "written"; text: string };
export type Action =
  | { type: "input"; text: string }
  | { type: "inputPrivacy"; flag: "inputNoAI" | "inputNoBook"; value: boolean }
  | { type: "submit" | "skip" | "draft" | "pause" | "resume" | "retry" | "complete" }
  | { type: "resolve"; operationId: string; result: ProviderResult }
  | { type: "reject"; operationId: string };
export type Context = { credits: number; characters: Book["characters"]; privacyRevision: number; otherJobActive?: boolean };
export type Transition = { session: Session; charge: number };

function nextQuestion(session: Session) {
  const available = QUESTIONS.find((question) => !session.questions.some((asked) => asked.target === question.target));
  return available ?? QUESTIONS[3];
}
export function createSession(id: string, focus: string, baseRevision: number, kind: Session["kind"] = "story", free = false, targetSectionId = "section-1"): Session {
  const question = kind === "reflection"
    ? { text: "Apa arti pengalaman ini untukmu sekarang?", target: "reflection" }
    : QUESTIONS[0];
  return {
    id, focus, kind, baseRevision, targetSectionId, state: free ? "awaiting_story" : "awaiting_answer", resumeState: null,
    version: 0, input: "", inputNoAI: false, inputNoBook: false, answers: [],
    questions: free ? [] : [{ ...question, id: `${id}:q1`, status: "active" }],
    skips: 0, interviewed: false, spent: 0, operation: null, retryKind: null, error: null, draft: null,
  };
}
function begin(session: Session, kind: Operation["kind"], context: Context) {
  const sources = allowedSources(session.answers);
  session.operation = null;
  session.retryKind = kind;
  if (sources.some((source) => ambiguousNames(source.text, context.characters).length)) {
    session.state = "blocked";
    session.error = "Sebutan ini merujuk ke lebih dari satu tokoh. Perjelas pilihan nama pada Tokoh & privasi, atau tulis bahan baru memakai penanda tokoh yang unik. Tulisan tetap dipertahankan tanpa biaya.";
    return;
  }
  if (context.otherJobActive) {
    session.state = "blocked";
    session.error = "Masih ada satu pekerjaan simulasi yang berjalan. Bahan tetap disimpan; lanjutkan setelah pekerjaan itu selesai.";
    return;
  }
  if (sources.length === 0) {
    session.state = "saved_incomplete";
    session.error = "Bahan belum dikirim atau tidak diizinkan untuk draf. Bahan dan teks yang belum dikirim tetap disimpan.";
    return;
  }
  const price = kind === "draft" ? PRODUCT.draftCredits : session.interviewed ? 0 : PRODUCT.interviewCredits;
  if (context.credits < price) {
    session.state = "blocked";
    session.error = `Saldo contoh belum cukup. Tahap ini membutuhkan ${price} kredit. Setelah menambah saldo, pilih Lanjutkan proses.`;
    return;
  }
  session.state = kind === "draft" ? "generating_draft" : "evaluating";
  session.error = null;
  session.operation = {
    id: `${session.id}:op${session.version}`, kind, version: session.version,
    privacyRevision: context.privacyRevision, sourceIds: sources.map((source) => source.id), sourceVersions: sources.map((source) => source.version),
    payload: sources.map((source) => forProvider(source.text, context.characters)),
  };
}

/** Pure domain transitions. UI must pass the rendered version; old actions/results are ignored. */
export function transition(current: Session, action: Action, expectedVersion: number, context: Context): Transition {
  const unchanged = { session: current, charge: 0 };
  if (current.version !== expectedVersion) return unchanged;
  const session = structuredClone(current);
  const waiting = current.state === "awaiting_answer" || current.state === "awaiting_story";
  session.version += 1;
  let charge = 0;
  if (action.type === "input") {
    if (!waiting) return unchanged;
    session.input = action.text;
  } else if (action.type === "inputPrivacy") {
    if (!waiting) return unchanged;
    session[action.flag] = action.value;
  } else if (action.type === "submit") {
    if (!waiting || !session.input.trim()) return unchanged;
    session.answers.push({ id: `${session.id}:a${session.answers.length + 1}`, text: session.input.trim(), noAI: session.inputNoAI, noBook: session.inputNoBook, version: 1 });
    session.input = "";
    session.inputNoAI = false;
    session.inputNoBook = false;
    session.skips = 0;
    const active = session.questions.find((question) => question.status === "active");
    if (active) active.status = "answered";
    begin(session, "evaluate", context);
  } else if (action.type === "skip") {
    if (current.state !== "awaiting_answer") return unchanged;
    const active = session.questions.find((question) => question.status === "active");
    if (!active) return unchanged;
    active.status = "skipped";
    session.skips += 1;
    const limit = session.kind === "reflection" ? 1 : 4;
    if (session.skips >= 2 || session.questions.length >= limit) begin(session, "draft", context);
    else {
      session.questions.push({ ...nextQuestion(session), id: `${session.id}:q${session.questions.length + 1}`, status: "active" });
    }
  } else if (action.type === "draft") {
    if (!waiting && current.state !== "saved_incomplete") return unchanged;
    begin(session, "draft", context);
  } else if (action.type === "pause") {
    if (["paused", "completed", "draft_review"].includes(current.state)) return unchanged;
    session.resumeState = current.state;
    session.state = "paused";
    session.operation = null;
    session.error = null;
  } else if (action.type === "resume") {
    if (current.state !== "paused") return unchanged;
    const prior = session.resumeState;
    session.resumeState = null;
    if (prior === "evaluating" || prior === "generating_draft") {
      session.state = "blocked";
      session.error = "Pemrosesan sebelumnya dihentikan. Pilih Lanjutkan proses untuk mencoba bahan yang sama.";
    } else session.state = prior ?? "awaiting_story";
  } else if (action.type === "retry") {
    if (current.state !== "blocked" && current.state !== "saved_incomplete") return unchanged;
    if (allowedSources(session.answers).length === 0) {
      session.state = session.questions.some((question) => question.status === "active") ? "awaiting_answer" : "awaiting_story";
      session.error = null;
    } else begin(session, session.retryKind ?? "evaluate", context);
  } else if (action.type === "resolve" || action.type === "reject") {
    const operation = current.operation;
    if (!operation || operation.id !== action.operationId || operation.version !== current.version || !["evaluating", "generating_draft"].includes(current.state)) return unchanged;
    const sourceIds = allowedSources(session.answers).map((source) => source.id);
    if (operation.privacyRevision !== context.privacyRevision || operation.sourceIds.some((id, index) => !sourceIds.includes(id) || session.answers.find((source) => source.id === id)?.version !== operation.sourceVersions[index])) {
      session.state = "blocked";
      session.operation = null;
      session.error = "Pilihan privasi berubah. Hasil lama tidak digunakan. Tinjau bahan lalu lanjutkan proses.";
      return { session, charge: 0 };
    }
    session.operation = null;
    if (action.type === "reject") {
      session.state = "blocked";
      session.error = "Respons simulasi gagal. Jawabanmu tetap ada dan tahap yang gagal tidak memotong kredit.";
      return { session, charge: 0 };
    }
    if (operation.kind === "draft") {
      if (action.result.action !== "written" || !action.result.text.trim() || !providerOutputAllowed(action.result.text, context.characters)) {
        session.state = "blocked";
        session.error = "Draf belum dapat digunakan. Bahan tetap utuh; coba kembali.";
      } else if (context.credits < PRODUCT.draftCredits) {
        session.state = "blocked";
        session.error = "Saldo berubah selama proses. Draf belum ditagih; lanjutkan setelah saldo cukup.";
      } else {
        charge = PRODUCT.draftCredits;
        session.spent += charge;
        session.state = "draft_review";
        session.draft = { id: `${session.id}:draft`, text: fromProvider(action.result.text, context.characters), sourceIds: operation.sourceIds, baseRevision: session.baseRevision, privacyRevision: context.privacyRevision, applied: false };
        session.retryKind = null;
      }
    } else {
      if (action.result.action === "written") {
        session.state = "blocked";
        session.error = "Respons tidak sesuai tahap penggalian. Bahan tetap disimpan; coba kembali.";
        return { session, charge: 0 };
      }
      const limit = session.kind === "reflection" ? 1 : 4;
      const shouldDraft = action.result.action === "draft" || session.questions.length >= limit;
      // A direct, sufficient story uses the draft tariff only; no interview stage occurred.
      const interviewPrice = !session.interviewed && !(shouldDraft && current.questions.length === 0) ? PRODUCT.interviewCredits : 0;
      if (context.credits < interviewPrice) {
        session.state = "blocked";
        session.error = "Saldo contoh berubah. Pilih Lanjutkan proses setelah saldo cukup.";
        return { session, charge: 0 };
      }
      charge = interviewPrice;
      if (interviewPrice) session.interviewed = true;
      session.spent += charge;
      if (shouldDraft) begin(session, "draft", { ...context, credits: context.credits - charge });
      else {
        const fallback = nextQuestion(session);
        const result = action.result;
        const known = result.action === "ask" && result.targets.length === 1
          ? questionsFor(operation.payload.join(" ")).find((question) => question.target === result.targets[0] && question.text === result.text && !session.questions.some((asked) => asked.target === question.target))
          : undefined;
        session.questions.push({ ...(known ?? fallback), id: `${session.id}:q${session.questions.length + 1}`, status: "active" });
        session.state = "awaiting_answer";
      }
    }
  } else if (action.type === "complete") {
    if (!["draft_review", "saved_incomplete"].includes(current.state)) return unchanged;
    session.state = "completed";
  }
  return { session, charge };
}

export function recoverSession(session: Session): Session {
  if (session.operation || ["evaluating", "generating_draft"].includes(session.state)) {
    return { ...session, version: session.version + 1, operation: null, state: "blocked", error: "Halaman dimuat ulang saat proses belum selesai. Bahan tersimpan; lanjutkan proses secara eksplisit." };
  }
  return session;
}
