import { describe, expect, it } from "vitest";
import { exampleDemo } from "../../tests/fixtures/demo";
import { loadDemo, previousText, rescueText, saveDemo, STORAGE_KEY, PREVIOUS_STORAGE_KEY, type StoragePort } from "./storage";
import { initialDemo, newBook } from "./seed";
import { createSession } from "../domain/session";

function memory(): StoragePort {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
}
describe("snapshot demo", () => {
  it("akun baru kosong tanpa identitas, isi, atau aktivitas contoh", async () => {
    expect(initialDemo()).toMatchObject({ books: [], activeBookId: "", credits: 150, events: [] });
    const book = newBook("personal");
    expect(book).toMatchObject({ title: "Buku tanpa judul", authorName: "", sources: [], sessions: [] });
    expect(book.characters).toEqual([{ id: "01", displayName: "[Penulis]", alias: "", placeholder: "[Penulis]", mode: "pending", self: true, knownNames: [], role: "Tokoh saya dalam cerita" }]);
    expect(book.sections[0]).toMatchObject({ text: "", sourceIds: [] });
  });
  it("migrasi menghapus buku bawaan dari proyek tanpa menghapus buku buatan pengguna atau salinan tulisan lama", async () => {
    const storage = memory();
    const old = exampleDemo();

    old.books.push(newBook("mine", "Catatan keluarga"));
    old.credits = 93; old.events.push({ id: "old", label: "Aktivitas prototipe", amount: -57 });
    const raw = JSON.stringify(old);
    storage.setItem(PREVIOUS_STORAGE_KEY, raw);
    const result = await loadDemo(storage);
    expect(result).toEqual({ kind: "ok", value: { ...initialDemo(), books: [old.books[1]], activeBookId: "mine" } });
    expect(previousText(storage)).toContain(old.books[0].sections[0].text);
    expect(storage.getItem(PREVIOUS_STORAGE_KEY)).toBe(raw);
    if (result.kind !== "ok") throw Error("Expected migration");
    expect(saveDemo(storage, { ...result.value, books: [], activeBookId: "" })).toBe(true);
    expect(await loadDemo(storage)).toEqual({ kind: "ok", value: initialDemo() });
    expect(storage.getItem(PREVIOUS_STORAGE_KEY)).toBe(raw);
  });
  it.each(["{rusak", '{"formatVersion":9}'])("data lama rusak tidak menghalangi ruang baru dan tetap bisa disalin: %s", async (raw) => {
    const storage = memory(); storage.setItem(PREVIOUS_STORAGE_KEY, raw);
    expect(await loadDemo(storage)).toEqual({ kind: "empty" });
    expect(saveDemo(storage, initialDemo())).toBe(true);
    expect(previousText(storage)).toBe(raw);
    expect(storage.getItem(PREVIOUS_STORAGE_KEY)).toBe(raw);
  });
  it("membersihkan alias bawaan yang belum dipilih dan mempertahankan samaran yang dikonfirmasi", async () => {
    const storage = memory(); const old = initialDemo();
    const pending = newBook("pending"); pending.characters[0].alias = "Nara";
    const chosen = newBook("chosen");
    Object.assign(chosen.characters[0], { alias: "Nara", displayName: "Nara", mode: "pseudonym", knownNames: ["Nara"] });
    old.books = [pending, chosen]; storage.setItem(PREVIOUS_STORAGE_KEY, JSON.stringify(old));
    const result = await loadDemo(storage);
    if (result.kind !== "ok") throw Error("Expected migration");
    expect(result.value.books[0].characters[0].alias).toBe("");
    expect(result.value.books[1]).toEqual(chosen);
  });
  it("roundtrip memulihkan ID, buffer, hitungan, jawaban, dan biaya", async () => {
    const demo = exampleDemo(); const session = createSession("s", "Fokus", 1);
    session.input = "Belum terkirim"; session.spent = 1; session.interviewed = true;
    demo.books[0].sessions.push(session);
    const storage = memory(); expect(saveDemo(storage, demo)).toBe(true);
    expect(await loadDemo(storage)).toEqual({ kind: "ok", value: demo });
  });
  it.each(["", "{rusak", '{"formatVersion":2}'])("snapshot aktif rusak tidak memicu migrasi atau ditimpa: %s", async (raw) => {
    const storage = memory(); storage.setItem(STORAGE_KEY, raw);
    storage.setItem(PREVIOUS_STORAGE_KEY, JSON.stringify(exampleDemo()));
    expect((await loadDemo(storage)).kind).toBe("error"); expect(storage.getItem(STORAGE_KEY)).toBe(raw);
  });
  it("quota/security error tidak mengklaim simpan sukses, teks dapat diselamatkan", async () => {
    const storage: StoragePort = { getItem() { throw new Error("SecurityError"); }, setItem() { throw new Error("QuotaExceeded"); }, removeItem() {} };
    const demo = exampleDemo(); const session = createSession("s", "Fokus", 1); session.input = "Tulisan penting belum dikirim"; demo.books[0].sessions.push(session);
    expect(saveDemo(storage, demo)).toBe(false); expect((await loadDemo(storage)).kind).toBe("error");
    expect(rescueText(demo)).toContain("Tulisan penting belum dikirim");
  });
  it("salinan recovery tetap menyertakan tulisan dalam kolom legacy yang belum didukung", async () => {
    const storage = memory(); const old = exampleDemo();
    Object.assign(old.books[0], { additionalNote: "Tulisan lama di kolom tambahan." });
    storage.setItem(PREVIOUS_STORAGE_KEY, JSON.stringify(old));
    expect((await loadDemo(storage)).kind).toBe("ok");
    expect(previousText(storage)).toContain("Tulisan lama di kolom tambahan.");
  });
});
