import { demoSchema, type Demo } from "../domain/model";
import { recoverSession } from "../domain/session";
import { canonicalJson, migrateLegacyV1 } from "./migrations/legacy-v1";

export const STORAGE_KEY = "ceritajadibuku:workspace:v2";
export const PREVIOUS_STORAGE_KEY = "ceritajadibuku:demo:v1";
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type LoadResult = { kind: "empty" } | { kind: "ok"; value: Demo } | { kind: "error"; message: string };
export async function loadDemo(storage: StoragePort): Promise<LoadResult> {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      const previous = storage.getItem(PREVIOUS_STORAGE_KEY);
      if (previous === null) return { kind: "empty" };
      const value = await migrateLegacyV1(previous);
      if (!value) return { kind: "empty" };
      for (const book of value.books) book.sessions = book.sessions.map(recoverSession);
      return { kind: "ok", value };
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
  try {
    const decoded: unknown = JSON.parse(raw);
    const value = demoSchema.parse(decoded);
    const text = rescueText(value);
    // Preserve unknown legacy fields in the explicit recovery copy as well.
    return canonicalJson(decoded) === canonicalJson(value) ? text : `${text}\n\nData lama lengkap (termasuk kolom yang belum didukung):\n${raw}`;
  }
  catch { return raw; }
}
export function rescueText(demo: Demo): string {
  return demo.books.map((book) => [book.title, ...book.sources.map((source) => source.text),
    ...book.sessions.flatMap((session) => [`Momen: ${session.focus}`, ...session.answers.map((answer) => answer.text), session.input, session.draft?.text ?? ""]),
    ...book.sections.map((section) => `${section.title}\n${section.text}`),
  ].filter(Boolean).join("\n\n")).join("\n\n---\n\n");
}
