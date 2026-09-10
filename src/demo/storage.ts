import { demoSchema, type Demo } from "../domain/model";
import { recoverSession } from "../domain/session";
import { initialDemo } from "./seed";

export const STORAGE_KEY = "ceritajadibuku:workspace:v2";
export const PREVIOUS_STORAGE_KEY = "ceritajadibuku:demo:v1";
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type LoadResult = { kind: "empty" } | { kind: "ok"; value: Demo } | { kind: "error"; message: string };
export function loadDemo(storage: StoragePort): LoadResult {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      // Remove the old built-in book from the workspace while retaining user-created books.
      // Keep the original snapshot intact as a text recovery source for edits made inside that book.
      const previous = storage.getItem(PREVIOUS_STORAGE_KEY);
      if (!previous || previous.length > 3_000_000) return { kind: "empty" };
      let decoded: unknown;
      try { decoded = JSON.parse(previous); } catch { return { kind: "empty" }; }
      const parsed = demoSchema.safeParse(decoded);
      if (!parsed.success) return { kind: "empty" };
      const books = parsed.data.books.filter((book) => book.id !== "jepang");
      for (const book of books) {
        book.sessions = book.sessions.map(recoverSession);
        for (const character of book.characters) {
          if (character.self && character.mode === "pending" && character.displayName === character.placeholder && character.alias === "Nara" && character.knownNames.length === 0) character.alias = "";
        }
      }
      return { kind: "ok", value: { ...initialDemo(), books, activeBookId: books.find((book) => book.id === parsed.data.activeBookId)?.id ?? books[0]?.id ?? "" } };
    }
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
export function previousText(storage: StoragePort): string {
  const raw = storage.getItem(PREVIOUS_STORAGE_KEY);
  if (!raw) return "Tidak ada tulisan lama di perangkat ini.";
  try { return rescueText(demoSchema.parse(JSON.parse(raw))); }
  catch { return raw; }
}
export function rescueText(demo: Demo): string {
  return demo.books.map((book) => [book.title, ...book.sources.map((source) => source.text),
    ...book.sessions.flatMap((session) => [`Momen: ${session.focus}`, ...session.answers.map((answer) => answer.text), session.input, session.draft?.text ?? ""]),
    ...book.sections.map((section) => `${section.title}\n${section.text}`),
  ].filter(Boolean).join("\n\n")).join("\n\n---\n\n");
}
