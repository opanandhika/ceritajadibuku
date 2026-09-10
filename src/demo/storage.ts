import { demoSchema, type Demo } from "../domain/model";
import { recoverSession } from "../domain/session";

export const STORAGE_KEY = "ceritajadibuku:demo:v1";
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type LoadResult = { kind: "empty" } | { kind: "ok"; value: Demo } | { kind: "error"; message: string };
export function loadDemo(storage: StoragePort): LoadResult {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { kind: "empty" };
    if (raw.length > 3_000_000) throw new Error("Snapshot too large");
    const value = demoSchema.parse(JSON.parse(raw));
    for (const book of value.books) book.sessions = book.sessions.map(recoverSession);
    return { kind: "ok", value };
  } catch {
    return { kind: "error", message: "Data perangkat tidak dapat dibaca. Data lama belum ditimpa. Kamu dapat mencoba lagi atau mereset demo secara eksplisit." };
  }
}
export function saveDemo(storage: StoragePort, demo: Demo): boolean {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(demo)); return true; }
  catch { return false; }
}
export function rescueText(demo: Demo): string {
  return demo.books.map((book) => [book.title, ...book.sources.map((source) => source.text),
    ...book.sessions.flatMap((session) => [`Momen: ${session.focus}`, ...session.answers.map((answer) => answer.text), session.input, session.draft?.text ?? ""]),
    ...book.sections.map((section) => `${section.title}\n${section.text}`),
  ].filter(Boolean).join("\n\n")).join("\n\n---\n\n");
}
