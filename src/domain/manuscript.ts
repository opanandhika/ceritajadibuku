import type { Book, Section, Session } from "./model";
import { allSources } from "./privacy";

function appendRichContent(section: Section, draft: string): string | null {
  if (!section.richContent) return null;
  try {
    const document = JSON.parse(section.richContent);
    if (document.type !== "doc" || !Array.isArray(document.content)) return null;
    document.content.push(...draft.split("\n\n").map((text) => ({ type: "paragraph", content: text ? [{ type: "text", text }] : [] })));
    return JSON.stringify(document);
  } catch { return null; }
}

export function applyDraft(book: Book, session: Session, section: Section): { ok: true; section: Section } | { ok: false; error: string } {
  const draft = session.draft;
  if (!draft || draft.applied) return { ok: false, error: "Usulan tidak tersedia atau sudah digunakan." };
  if (section.id !== session.targetSectionId) return { ok: false, error: "Usulan ini dibuat untuk bagian lain. Buka bagian tujuan atau simpan usulan terpisah." };
  if (draft.baseRevision !== section.revision) return { ok: false, error: "Bagian ini sudah berubah sejak usulan dibuat. Bandingkan dengan tulisan terbaru sebelum menerapkan." };
  if (draft.privacyRevision !== book.privacyRevision) return { ok: false, error: "Pilihan privasi berubah sejak usulan dibuat. Simpan usulan terpisah untuk ditinjau, lalu periksa privasinya kembali." };
  const sources = allSources(book);
  if (draft.sourceIds.some((id) => !sources.find((source) => source.id === id) || sources.find((source) => source.id === id)?.noBook)) {
    return { ok: false, error: "Ada bahan usulan yang tidak diizinkan masuk buku. Selesaikan pilihan sumber terlebih dahulu." };
  }
  return { ok: true, section: { ...section, text: [section.text, draft.text].filter(Boolean).join("\n\n"), richContent: appendRichContent(section, draft.text), revision: section.revision + 1, sourceIds: [...new Set([...section.sourceIds, ...draft.sourceIds])] } };
}
