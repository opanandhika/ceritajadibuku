import type { Book, Demo } from "../domain/model";

export function newBook(id: string, title = "Buku tanpa judul"): Book {
  return {
    id, title, authorName: "", narratorId: "01", identityMode: "mixed", privacyRevision: 1,
    characters: [{ id: "01", displayName: "[Penulis]", alias: "", placeholder: "[Penulis]", mode: "pending", self: true, knownNames: [], role: "Tokoh saya dalam cerita" }],
    sources: [],
    sections: [{ id: id + "-section-1", title: "Bagian pertama", text: "", revision: 1, richContent: null, sourceIds: [] }],
    sessions: [],
  };
}
export function initialDemo(): Demo {
  return { formatVersion: 1, books: [], activeBookId: "", credits: 150, events: [] };
}
