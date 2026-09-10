import { describe, expect, it } from "vitest";
import { initialDemo } from "./seed";
import { loadDemo, rescueText, saveDemo, STORAGE_KEY, type StoragePort } from "./storage";
import { createSession } from "../domain/session";

function memory(): StoragePort {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
}
describe("snapshot demo", () => {
  it("roundtrip memulihkan ID, buffer, hitungan, jawaban, dan biaya", () => {
    const demo = initialDemo(); const session = createSession("s", "Fokus", 1);
    session.input = "Belum terkirim"; session.spent = 1; session.interviewed = true;
    demo.books[0].sessions.push(session);
    const storage = memory(); expect(saveDemo(storage, demo)).toBe(true);
    expect(loadDemo(storage)).toEqual({ kind: "ok", value: demo });
  });
  it("snapshot rusak/versi tak dikenal dilaporkan, tidak ditimpa", () => {
    const storage = memory(); storage.setItem(STORAGE_KEY, '{"formatVersion":2}');
    expect(loadDemo(storage).kind).toBe("error"); expect(storage.getItem(STORAGE_KEY)).toBe('{"formatVersion":2}');
  });
  it("quota/security error tidak mengklaim simpan sukses, teks dapat diselamatkan", () => {
    const storage: StoragePort = { getItem() { throw new Error("SecurityError"); }, setItem() { throw new Error("QuotaExceeded"); }, removeItem() {} };
    const demo = initialDemo(); const session = createSession("s", "Fokus", 1); session.input = "Tulisan penting belum dikirim"; demo.books[0].sessions.push(session);
    expect(saveDemo(storage, demo)).toBe(false); expect(loadDemo(storage).kind).toBe("error");
    expect(rescueText(demo)).toContain("Tulisan penting belum dikirim");
  });
});
