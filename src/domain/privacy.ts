import type { Book, Character, Source } from "./model";

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function replaceName(text: string, name: string, replacement: string) {
  if (!name.trim()) return text;
  return text.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegex(name)}(?![\\p{L}\\p{N}_])`, "giu"), () => replacement);
}
export const publicName = (character: Character) => character.mode === "pending" ? character.placeholder : character.displayName;
export function rememberNames(character: Character, nextName: string, nextMode: Character["mode"]): Character {
  return { ...character, mode: nextMode, displayName: nextMode === "pending" ? character.placeholder : nextName,
    knownNames: [...new Set([...character.knownNames, character.displayName, ...(nextMode === "pending" ? [] : [nextName])].filter((name) => name.trim() && !name.startsWith("[")))],
  };
}
export function providerOutputAllowed(text: string, characters: Character[]) {
  // Provider output may contain only project placeholders, not known identity strings.
  if (characters.some((character) => [...character.knownNames, character.displayName, character.alias]
    .some((name) => name && !name.startsWith("[") && replaceName(text, name, "") !== text))) return false;
  const valid = new Set(characters.map((character) => `[TOKOH_${character.id}]`));
  return [...text.matchAll(/\[TOKOH_[^\]]+\]/g)].every(([token]) => valid.has(token));
}
export const allowedSources = (sources: Source[]) => sources.filter((source) => !source.noAI && !source.noBook && source.text.trim());
function nameIndex(characters: Character[]) {
  const index = new Map<string, Set<string>>();
  for (const character of characters) {
    for (const name of [...character.knownNames, character.displayName, character.alias, character.placeholder]) {
      if (!name.trim()) continue;
      const key = name.toLocaleLowerCase("id-ID");
      const ids = index.get(key) ?? new Set<string>();
      ids.add(character.id); index.set(key, ids);
    }
  }
  const alternatives = [...index.keys()].sort((a, b) => b.length - a.length).map(escapeRegex);
  return { index, pattern: alternatives.length ? new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alternatives.join("|")})(?![\\p{L}\\p{N}_])`, "giu") : null };
}
export function ambiguousNames(text: string, characters: Character[]) {
  const { index, pattern } = nameIndex(characters);
  if (!pattern) return [];
  return [...new Set([...text.matchAll(pattern)].map(([name]) => name).filter((name) => index.get(name.toLocaleLowerCase("id-ID"))!.size > 1))];
}
function transformNames(text: string, characters: Character[], provider: boolean) {
  const { index, pattern } = nameIndex(characters);
  if (!pattern) return text;
  return text.replace(pattern, (name) => {
    const ids = index.get(name.toLocaleLowerCase("id-ID"))!;
    if (ids.size !== 1) return name;
    const id = [...ids][0];
    return provider ? `[TOKOH_${id}]` : publicName(characters.find((character) => character.id === id)!);
  });
}
export function forProvider(text: string, characters: Character[]) {
  if (ambiguousNames(text, characters).length) throw new Error("Sebutan tokoh belum jelas.");
  return transformNames(text, characters, true);
}
export function fromProvider(text: string, characters: Character[]) {
  return characters.reduce((result, character) => result.replaceAll(`[TOKOH_${character.id}]`, publicName(character)), text);
}
export function allSources(book: Book) { return [...book.sources, ...book.sessions.flatMap((session) => session.answers)]; }
export function reviewBook(book: Book, text = book.sections.map((section) => `${section.title}\n${section.text}`).join("\n"), author = book.authorName, title = book.title) {
  const findings: string[] = [];
  const content = `${title}\n${text}\n${author}`;
  for (const name of ambiguousNames(content, book.characters)) findings.push(`Sebutan “${name}” merujuk ke lebih dari satu tokoh. Perjelas dengan nama atau penanda yang unik.`);
  for (const character of book.characters) {
    for (const name of character.knownNames.filter((name) => name !== publicName(character))) {
      if (replaceName(content, name, "") !== content) findings.push(`Nama “${name}” masih muncul. Pilihan tokoh: ${publicName(character)}.`);
    }
  }
  for (const source of allSources(book).filter((source) => source.noBook)) {
    if (book.sections.some((section) => section.sourceIds.includes(source.id)) || (source.text.trim() && text.includes(source.text.trim()))) {
      findings.push("Ada bahan bertanda Jangan masukkan ke buku yang masih digunakan. Tinjau bagian naskah terkait.");
    }
  }
  return findings;
}
export function projectNames(text: string, characters: Character[]) {
  return transformNames(text, characters, false);
}
export function projectRichContent(content: string | null, characters: Character[]): string | null {
  if (!content) return null;
  try {
    return JSON.stringify(JSON.parse(content, (key, value: unknown) => key === "text" && typeof value === "string" ? projectNames(value, characters) : value));
  } catch { return null; }
}
