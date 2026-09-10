import { describe, expect, it } from "vitest";
import { exampleDemo } from "../../tests/fixtures/demo";
import { allSources, allowedSources, ambiguousNames, forProvider, fromProvider, projectNames, projectRichContent, rememberNames, replaceName, reviewBook } from "./privacy";
import { applyDraft } from "./manuscript";
import { createSession } from "./session";

describe("privasi dan naskah contoh", () => {
  it("panggilan identik ditahan, penanda unik tetap bisa diproses", () => {
    const book = exampleDemo().books[0];
    expect(ambiguousNames("BUDI meminjamkan buku", book.characters)).toEqual(["BUDI"]);
    expect(() => forProvider("Budi", book.characters)).toThrow();
    expect(projectNames("Budi", book.characters)).toBe("Budi");
    expect(forProvider("[Tetangga]", book.characters)).toBe("[TOKOH_05]");
  });
  it("nama terpanjang menang secara global dan penggantian tidak berantai", () => {
    const base = exampleDemo().books[0].characters;
    const characters = [{ ...base[0], knownNames: ["Budi"], displayName: "Ayu" }, { ...base[1], knownNames: ["Budi Santoso", "Ayu"] }];
    expect(forProvider("Budi Santoso lalu Budi", characters)).toBe("[TOKOH_02] lalu [TOKOH_01]");
    expect(projectNames("Budi", characters)).toBe("Ayu");
  });
  it("Atur nanti tidak mengonfirmasi nama yang baru diketik", () => {
    const character = exampleDemo().books[0].characters[0];
    expect(rememberNames(character, "Belum Dipilih", "pending").knownNames).not.toContain("Belum Dipilih");
  });
  it("proyeksi nama mempertahankan format editor", () => {
    const content = JSON.stringify({ type: "doc", content: [{ type: "text", text: "Nadia", marks: [{ type: "bold" }] }] });
    const projected = JSON.parse(projectRichContent(content, exampleDemo().books[0].characters)!);
    expect(projected.content[0]).toEqual({ type: "text", text: "Nara", marks: [{ type: "bold" }] });
  });
  it("nama lama tetap diketahui setelah diganti dan judul ikut ditinjau", () => {
    const book = exampleDemo().books[0];
    book.characters[0] = rememberNames(book.characters[0], "Nama Pilihan", "real");
    expect(book.characters[0].knownNames).toContain("Nara");
    expect(reviewBook(book, "", "Citra Senja", "Perjalanan Nadia dan Nara")).toHaveLength(2);
    expect(reviewBook(book, "Nama Pilihan menulis.", "Citra Senja", "Perjalanan")).toEqual([]);
    expect(forProvider("Nama Pilihan bersama Nara", book.characters)).toBe("[TOKOH_01] bersama [TOKOH_01]");
  });
  it("pencocokan nama tidak mengganti substring/Unicode atau regex tak sengaja", () => {
    expect(replaceName("Budi Budiman ÉBudi Budi-san", "Budi", "A")).toBe("A Budiman ÉBudi A-san");
    expect(replaceName("A+B menemani", "A+B", "$&")).toBe("$& menemani");
  });
  it("pending menjadi penanda dan narator boleh disamarkan", () => {
    const book = exampleDemo().books[0];
    const text = forProvider("Nadia bersama Dimas", book.characters);
    expect(text).not.toContain("Nadia");
    expect(fromProvider(text, book.characters)).toBe("Nara bersama [Teman A]");
  });
  it("no-AI tetap boleh diekspor manual; no-book memblokir", () => {
    const book = exampleDemo().books[0];
    book.sources[0].noAI = true;
    expect(reviewBook(book)).toEqual([]);
    book.sources[0].noBook = true;
    expect(reviewBook(book).join(" ")).toContain("Jangan masukkan ke buku");
    expect(allowedSources(allSources(book))).toEqual([]);
  });
  it("review menahan nama sintetis terlarang dan proyeksi membersihkan teks", () => {
    const book = exampleDemo().books[0];
    expect(reviewBook(book, "Nadia dan Ayu belajar.")).toHaveLength(2);
    expect(reviewBook(book, projectNames("Nadia dan Ayu belajar.", book.characters))).toEqual([]);
    expect(book.authorName).toBe("Citra Senja");
  });
  it("usulan lama tidak menimpa versi baru atau tujuan lain", () => {
    const book = exampleDemo().books[0]; const section = book.sections[0];
    const session = createSession("s", "cerita", section.revision, "story", false, section.id);
    session.draft = { id: "d", text: "Usulan", sourceIds: ["seed-1"], baseRevision: section.revision, privacyRevision: book.privacyRevision, applied: false };
    expect(applyDraft(book, session, { ...section, revision: 2 })).toMatchObject({ ok: false });
    expect(applyDraft(book, session, { ...section, id: "lain" })).toMatchObject({ ok: false });
    expect(applyDraft(book, session, section)).toMatchObject({ ok: true });
    expect(section.text).not.toContain("Usulan");
    const rich = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: section.text, marks: [{ type: "italic" }] }] }] };
    const result = applyDraft(book, session, { ...section, richContent: JSON.stringify(rich) });
    if (!result.ok) throw new Error(result.error);
    const appended = JSON.parse(result.section.richContent!);
    expect(appended.content[0]).toEqual(rich.content[0]);
    expect(appended.content[1].content[0].text).toBe("Usulan");
  });
  it("perubahan kebijakan atau sumber no-book menahan apply", () => {
    const book = exampleDemo().books[0]; const section = book.sections[0];
    const session = createSession("s", "cerita", 1, "story", false, section.id);
    session.draft = { id: "d", text: "Usulan", sourceIds: ["seed-1"], baseRevision: 1, privacyRevision: 1, applied: false };
    expect(applyDraft({ ...book, privacyRevision: 2 }, session, section)).toMatchObject({ ok: false });
    book.sources[0].noBook = true;
    expect(applyDraft(book, session, section)).toMatchObject({ ok: false });
  });
});
