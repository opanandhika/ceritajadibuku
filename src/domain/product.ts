export const PRODUCT = {
  version: "blueprint-1.4-demo-1",
  name: "CeritaJadiBuku",
  planPrice: 79000,
  planCredits: 150,
  projectLimit: 3,
  storageBytes: 1_000_000_000,
  interviewCredits: 1,
  draftCredits: 4,
  topups: [{ credits: 50, price: 29000 }, { credits: 150, price: 59000 }],
  topupDays: 30,
  readDays: 15,
} as const;

export const rupiah = (amount: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(amount);
export const words = (text: string) => text.trim().split(/\s+/u).filter(Boolean).length;

export const QUESTIONS = [
  { target: "beginning", text: "Apa yang paling ingin kamu ceritakan tentang momen ini?" },
  { target: "action", text: "Apa langkah pertama yang kamu lakukan?" },
  { target: "moment", text: "Momen apa yang paling kamu ingat dari pengalaman itu?" },
  { target: "detail", text: "Detail mana yang paling ingin kamu pertahankan dalam cerita ini?" },
] as const;
export const SUGGESTIONS = ["Awal sebuah mimpi", "Pengalaman yang membekas", "Seseorang yang penting"];

/** Bounded mock follow-ups based only on permitted story text; unknown or mixed themes stay open-ended. */
export function questionsFor(story: string): { target: string; text: string }[] {
  const themes = [
    { pattern: /\bkeluarga\b/iu, text: "Apa yang kamu lakukan dalam pengalaman keluarga itu?" },
    { pattern: /\b(karier|karir)\b/iu, text: "Apa langkah yang kamu ambil dalam perjalanan karier itu?" },
    { pattern: /\b(usaha|bisnis)\b/iu, text: "Apa yang kamu lakukan dalam pengalaman usaha itu?" },
  ].filter((theme) => theme.pattern.test(story));
  return QUESTIONS.map((question) => question.target === "action" && themes.length === 1 ? { ...question, text: themes[0].text } : question);
}
