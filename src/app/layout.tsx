import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CeritaJadiBuku — Ruang menulismu",
  description: "Prototipe lokal dengan data contoh. Ceritakan satu momen, lalu susun menjadi naskah dengan kendalimu sendiri.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
