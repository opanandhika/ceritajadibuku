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
export const SUGGESTIONS = ["Awal mimpi ke Jepang", "Perjuangan mewujudkannya", "Orang yang berkesan"];
