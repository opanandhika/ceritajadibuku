import { afterEach, describe, expect, it, vi } from "vitest";
import { exampleDemo } from "../../../tests/fixtures/demo";
import { newBook } from "../seed";
import type { Book } from "../../domain/model";
import { createSession } from "../../domain/session";
import { migrateLegacyV1 } from "./legacy-v1";

afterEach(() => vi.restoreAllMocks());
describe("migration demo:v1 to workspace:v2", () => {
  it("excludes only the exact historical seed and retains a user book", async () => {
    const old = exampleDemo(); const own = newBook("mine", "Catatan perjalanan karier");
    own.authorName = "Pena Pilihan"; own.sections[0].text = "Tulisan sintetis milik pengguna.";
    old.books.push(own); old.credits = 12; old.events = [{ id: "usage", label: "Simulasi", amount: -138 }];
    const raw = JSON.stringify(old);
    const result = await migrateLegacyV1(raw);
    expect(result).toMatchObject({ books: [own], activeBookId: "mine", credits: 150, events: [] });
    expect(JSON.stringify(old)).toBe(raw);
  });
  it("handles reordered JSON object keys without relying on IDs", async () => {
    const old = exampleDemo();
    old.books[0] = Object.fromEntries(Object.entries(old.books[0]).reverse()) as Book;
    expect((await migrateLegacyV1(JSON.stringify(old)))?.books).toEqual([]);
  });
  it.each(["jepang", "jepang-2", "mine"])("keeps non-demo books even with a matching or similar ID: %s", async (id) => {
    const old = exampleDemo(); const own = newBook(id, old.books[0].title);
    own.authorName = old.books[0].authorName;
    own.sections[0].text = "Aku memulai pekerjaan pertamaku."; old.books = [own];
    expect((await migrateLegacyV1(JSON.stringify(old)))?.books).toEqual([own]);
  });
  it.each<[string, (book: Book) => void]>([
    ["title", (book) => { book.title = "Judul pilihanku"; }],
    ["author", (book) => { book.authorName = "Pena Baru"; }],
    ["manuscript", (book) => { book.sections[0].text += " Tulisan tambahan."; }],
    ["rich content", (book) => { book.sections[0].richContent = '{"type":"doc","content":[]}'; }],
    ["source", (book) => { book.sources[0].text = "Bahan yang diubah."; }],
    ["privacy", (book) => { book.sources[0].noAI = true; }],
    ["character", (book) => { book.characters[0].displayName = "Pilihan baru"; }],
    ["revision", (book) => { book.privacyRevision += 1; }],
    ["session with input, source and draft", (book) => {
      const session = createSession("saved-session", "Cerita karier", 1);
      session.input = "Tulisan yang belum dikirim.";
      session.answers = [{ id: "answer", text: "Bahan sintetis dari pengguna.", noAI: false, noBook: false, version: 1 }];
      session.draft = { id: "draft", text: "Usulan yang belum diterima.", sourceIds: ["answer"], baseRevision: 1, privacyRevision: 1, applied: false };
      session.state = "draft_review";
      book.sessions.push(session);
    }],
    ["unknown field", (book) => { Object.assign(book, { note: "Catatan tambahan jangan hilang" }); }],
  ])("retains a book after any change to %s", async (_, edit) => {
    const old = exampleDemo(); edit(old.books[0]);
    const result = await migrateLegacyV1(JSON.stringify(old));
    expect(result?.books).toHaveLength(1);
    expect(result?.books[0]).toMatchObject({ id: old.books[0].id, title: old.books[0].title, authorName: old.books[0].authorName, sources: old.books[0].sources, sections: old.books[0].sections, sessions: old.books[0].sessions });
  });
  it("clears unconfirmed aliases generically and changes the privacy revision once", async () => {
    const old = exampleDemo(); const book = newBook("mine");
    book.characters[0].alias = "Alias bawaan apa pun";
    book.characters.push({ ...book.characters[0], id: "02", self: false, alias: "Samaran otomatis", knownNames: ["Nama dari sumber"] });
    old.books = [book];
    const result = await migrateLegacyV1(JSON.stringify(old));
    expect(result?.books[0].characters.map((character) => character.alias)).toEqual(["", ""]);
    expect(result?.books[0].privacyRevision).toBe(book.privacyRevision + 1);
    expect(book.characters[0].alias).toBe("Alias bawaan apa pun");
  });
  it.each(["pending", "pseudonym", "real", "role"] as const)("preserves previously confirmed identity in mode %s and the pen name", async (mode) => {
    const old = exampleDemo(); const book = newBook("mine");
    book.authorName = "Nama Pena Pilihanku";
    Object.assign(book.characters[0], { mode, alias: "Pilihan saya", knownNames: ["Pilihan saya"], displayName: mode === "pending" ? "[Penulis]" : "Pilihan saya" });
    old.books = [book];
    expect((await migrateLegacyV1(JSON.stringify(old)))?.books).toEqual([book]);
  });
  it("retains books if fingerprinting is unavailable", async () => {
    vi.spyOn(crypto.subtle, "digest").mockRejectedValue(new Error("Unavailable"));
    expect((await migrateLegacyV1(JSON.stringify(exampleDemo())))?.books).toHaveLength(1);
  });
});
