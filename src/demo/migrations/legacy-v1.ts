import { demoSchema, type Book, type Demo } from "../../domain/model";
import { initialDemo } from "../seed";

// SHA-256 of the complete, unmodified book from prototype commit 5e367b7.
// The original content lives only in tests/fixtures. Any change keeps the book.
const ORIGINAL_BOOK_SHA256 = "df87b5b8df41e3e792362c3764d8f3a8f87b441f57dfa7878ab7d940332138cc";

/** Canonical JSON: sorted object keys, original array order and scalar values. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(object[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

async function isUnmodifiedPrototypeBook(rawBook: unknown): Promise<boolean> {
  try {
    const bytes = new TextEncoder().encode(canonicalJson(rawBook));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("") === ORIGINAL_BOOK_SHA256;
  } catch {
    // Without a reliable fingerprint, preserve the book instead of guessing.
    return false;
  }
}

function normalizeUnconfirmedAliases(book: Book): Book {
  let changed = false;
  const characters = book.characters.map((character) => {
    // rememberNames records a confirmed name in knownNames, including after Atur nanti.
    if (character.mode !== "pending" || character.displayName !== character.placeholder || !character.alias || character.knownNames.includes(character.alias)) return character;
    changed = true;
    return { ...character, alias: "" };
  });
  return changed ? { ...book, characters, privacyRevision: book.privacyRevision + 1 } : book;
}

/** Pure versioned migration; caller alone reads/writes storage. Legacy input is never mutated. */
export async function migrateLegacyV1(raw: string): Promise<Demo | null> {
  if (raw.length > 3_000_000) return null;
  let decoded: unknown;
  try { decoded = JSON.parse(raw); } catch { return null; }
  const parsed = demoSchema.safeParse(decoded);
  if (!parsed.success) return null;
  const rawBooks = (decoded as { books: unknown[] }).books;
  // Compare raw books before schema stripping, alias normalization, or session recovery.
  const original = await Promise.all(rawBooks.map(isUnmodifiedPrototypeBook));
  const books = parsed.data.books.filter((_, index) => !original[index]).map(normalizeUnconfirmedAliases);
  return {
    ...initialDemo(), books,
    activeBookId: books.find((book) => book.id === parsed.data.activeBookId)?.id ?? books[0]?.id ?? "",
  };
}
