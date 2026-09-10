import type { Book, Demo } from "../domain/model";

export function newBook(id: string, title = "Buku tanpa judul", example = false): Book {
  return {
    id, title, authorName: example ? "Citra Senja" : "", narratorId: "01", identityMode: "mixed", privacyRevision: 1,
    characters: example ? [
      { id: "01", displayName: "Nara", alias: "Nara", placeholder: "[Penulis]", mode: "pseudonym", self: true, knownNames: ["Nadia"], role: "Tokoh saya dalam cerita" },
      { id: "02", displayName: "Lila", alias: "Lila", placeholder: "[Sahabat A]", mode: "pseudonym", self: false, knownNames: ["Ayu"], role: "Sahabat semasa sekolah" },
      { id: "03", displayName: "[Teman A]", alias: "Raka", placeholder: "[Teman A]", mode: "pending", self: false, knownNames: ["Dimas"], role: "Teman seperjalanan" },
      { id: "04", displayName: "[Teman sekolah]", alias: "Arga", placeholder: "[Teman sekolah]", mode: "pending", self: false, knownNames: ["Budi"], role: "Teman sekolah · panggilan Budi" },
      { id: "05", displayName: "[Tetangga]", alias: "Bayu", placeholder: "[Tetangga]", mode: "pending", self: false, knownNames: ["Budi"], role: "Tetangga · panggilan Budi" },
    ] : [{ id: "01", displayName: "[Penulis]", alias: "Nara", placeholder: "[Penulis]", mode: "pending", self: true, knownNames: [], role: "Tokoh saya dalam cerita" }],
    sources: example ? [
      { id: "seed-1", text: "Keinginan sekolah di Jepang bermula dari buku yang kubaca di perpustakaan. Aku menuliskan keinginan itu di halaman terakhir buku catatanku. Belum ada rencana yang pasti, tetapi aku ingin mencoba.", noAI: false, noBook: false, version: 1 },
      { id: "seed-2", text: "Catatan pribadi sintetis: ada bagian perjalanan ini yang ingin kusimpan untuk diriku sendiri.", noAI: true, noBook: true, version: 1 },
      { id: "seed-3", text: "Sekitar akhir masa SMA—tahun pastinya belum kuingat—Budi pernah meminjamkan buku. Belum kupastikan apakah ini teman sekolah atau tetanggaku.", noAI: true, noBook: true, version: 1 },
    ] : [],
    sections: [{ id: `${id}-section-1`, title: example ? "Sebuah mimpi yang pelan-pelan tumbuh" : "Bagian pertama", text: example ? "Keinginan itu bermula dari sebuah buku di perpustakaan. Di antara halaman-halamannya, aku menemukan gambaran tentang tempat yang belum pernah kukunjungi.\n\nAku menulis satu kalimat di halaman terakhir buku catatanku: suatu hari, aku ingin belajar di Jepang. Saat itu belum ada rencana yang pasti. Hanya keinginan kecil yang ingin kujaga." : "", revision: 1, richContent: null, sourceIds: example ? ["seed-1"] : [] }],
    sessions: [],
  };
}
export function initialDemo(): Demo {
  return { formatVersion: 1, books: [newBook("jepang", "Langkah Menuju Jepang", true)], activeBookId: "jepang", credits: 150, events: [] };
}
