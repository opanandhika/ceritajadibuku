# Discovery Tahap 0

> Catatan historis Tahap 0. Kondisi aplikasi, migrasi browser dan gerbang terbaru ada di [laporan penutupan teknis Tahap 1](penutupan-teknis-tahap-1.md); pernyataan belum ada kode/legacy di bawah berlaku pada pemeriksaan awal.

Tanggal pemeriksaan: 10 September 2026. Lokasi: `C:\Users\user\Documents\CeritaJadiBuku`.

## Mandat dan sumber

Permintaan yang dikerjakan adalah mempelajari proyek dan melaksanakan **Tahap 0** pada panduan Bagian 5. Cakupannya inventaris, struktur awal, keputusan teknis, lingkungan, hambatan, serta pemetaan privasi. Fondasi aplikasi dan prototipe berada pada Tahap 1.

Keempat dokumen masukan telah dipelajari, dengan audit terpisah pada panduan/UI/kajian dan pada privasi blueprint. Versi aktif serta pemetaan nama berkas ada di [README](../README.md). Tidak ditemukan benturan aktif pada harga, retensi, sesi, atau privasi. Penyebutan versi sebelumnya dan harga Rp69.000 merupakan riwayat, bukan katalog aktif. Tujuh kelompok hasil pada blueprint Bagian 22 tidak menggantikan urutan teknis 0–12.

Tidak ada `AGENTS.md` pada root proyek, direktori turunannya saat awal pemeriksaan, maupun rantai induk `C:\`, `C:\Users`, `C:\Users\user`, dan `C:\Users\user\Documents`. Instruksi sesi dan batas akses workspace tetap berlaku. `.openai/hosting.json` tidak ditemukan; tidak ada jalur Sites yang perlu dipertahankan. Ini pekerjaan discovery, belum pembangunan atau publikasi situs.

## Kondisi awal dan perubahan tahap ini

| Komponen | Fakta awal | Hasil Tahap 0 |
| --- | --- | --- |
| Berkas | Hanya empat dokumen Markdown masukan | Dokumen asli dipertahankan; ditambah dokumentasi kerja, contoh env, dan skrip discovery |
| Git | `git status --short` gagal karena belum ada repositori | `git init --initial-branch=main` berhasil di folder ini; tanpa remote, staging, atau commit |
| Framework/bahasa aplikasi | Tidak ada kode | Next.js App Router + TypeScript dipilih untuk Tahap 1; belum terpasang |
| Package manager/lockfile | Tidak ada manifest atau lockfile | npm dipilih; lockfile akan dihasilkan saat instalasi pertama |
| Skrip/test runner | Tidak ada | Skrip discovery tanpa dependensi tersedia; test runner aplikasi belum dipasang |
| Database/migrasi | Tidak ada skema, seed, konfigurasi Supabase, atau koneksi database proyek | Rancangan batas modul dan migrasi dicatat; tidak menjalankan migrasi |
| Hosting | Tidak ada `.openai/hosting.json`, `.vercel`, atau konfigurasi deployment proyek | Vercel mengikuti pilihan blueprint, belum provisioned/terhubung |
| UI/aset | Spesifikasi UI saja; tidak ada mockup, aset, atau hasil pilot | Arah A dan font sistem dipilih sebagai titik awal Tahap 1 |

## Toolchain yang benar-benar terdeteksi

| Alat | Hasil | Implikasi |
| --- | --- | --- |
| Node.js | `v24.20.0` | Baseline lokal dicatat di `.node-version` |
| npm | `11.19.0` melalui `npm.cmd` | Dipilih untuk dependensi proyek berikutnya |
| Git | `2.53.0.windows.2` | Repositori lokal dapat dibuat |
| Python | `3.14.3` | Tersedia, belum menjadi dependensi aplikasi |
| Docker CLI | `29.7.2` | Binary tersedia; bukan bukti daemon berjalan |
| Docker Compose | `v5.5.1` | Binary tersedia; belum menjalankan stack |
| Supabase CLI / Vercel CLI / psql | Tidak ditemukan di PATH yang diperiksa | Belum ada tool database/hosting proyek terpasang |
| pnpm | Shim tersedia dari runtime Codex | Tidak dipilih; tidak mencampur package manager |
| npm global | `firebase-tools@15.11.0`, `ngrok@5.0.0-beta.2` | Tidak diperlukan dan tidak diaktifkan untuk proyek |

Pemeriksaan daemon melalui proses Node mendapat `EPERM` sebelum hasil `docker info` tersedia. **Status daemon belum diketahui**, bukan disimpulkan mati. Jalur database lokal diverifikasi kembali pada Tahap 2; tidak menghalangi prototipe simulasi Tahap 1. Hasil perintah dan batas bukti dicatat di [hasil verifikasi](hasil-verifikasi.md).

Dokumentasi resmi instalasi Next.js yang diperiksa mensyaratkan Node minimal 20.9 dan mendukung Windows. Versi lokal memenuhi minimum tersebut; kompatibilitas seluruh dependensi tetap perlu dibuktikan melalui instalasi/build Tahap 1. [Instalasi Next.js](https://nextjs.org/docs/app/getting-started/installation)

## Inventaris konfigurasi tanpa nilai rahasia

Awalnya tidak ada `.env*`, manifest provider, atau konfigurasi hosting di workspace. Pencarian nama environment proses mencakup Supabase, OpenAI, Duitku, Resend, SMTP, database, Vercel, serta penanda lingkungan; tidak menemukan nama yang cocok. Tidak membaca penyimpanan kredensial global atau mencetak nilai environment.

| Layanan | Konfigurasi proyek ditemukan | Koneksi/akun terverifikasi | Diperlukan |
| --- | --- | --- | --- |
| Supabase Auth/PostgreSQL/Storage | Tidak | Tidak | Tahap 2 untuk integrasi data |
| OpenAI teks/transkripsi | Tidak | Tidak | Tahap 6–7 setelah privasi dan ledger |
| Duitku POP sandbox/production | Tidak | Tidak | Tahap 9 untuk bukti merchant/callback |
| Email SMTP/Resend | Tidak | Tidak | Tahap 2 untuk Auth; Tahap 9–10 untuk pengingat |
| Vercel/domain | Tidak | Tidak | Staging/rilis pada tahap terkait |

`.env.example` yang ditambahkan hanya rancangan konfigurasi kosong dengan mode development/mock. Keberadaan template tidak mengubah status integrasi menjadi tersedia.

## Lingkungan data

| Lingkungan | Status nyata | Rencana dan pembatasan |
| --- | --- | --- |
| Development | Workspace lokal, tanpa database atau data pengguna | Data sintetis, adapter mock; Supabase lokal terisolasi mulai Tahap 2 |
| Sandbox/staging | Belum dibuat atau ditautkan | Proyek/database/storage tersendiri, Duitku sandbox, email uji; tidak memakai salinan naskah produksi |
| Production | Tidak diketahui ada di luar workspace; tidak ada target terkonfigurasi di sini | Kredensial, host, data, dan anggaran terpisah; tidak aktif melalui template lokal |

Tidak ada data tokoh lama yang dapat dimigrasikan. Saat kelak menerima impor/legacy, nama yang ditemukan tidak dianggap mendapat izin terbit: mode awal `pending`, pemetaan privat tetap terpisah, dan tinjauan ekspor baru wajib. [Pemetaan lengkap](peta-privasi.md)

## Hambatan dan tindak lanjut

| Kebutuhan belum tersedia | Dampak | Tindakan pada tahap terkait |
| --- | --- | --- |
| Manifest, dependensi, dan lockfile | Aplikasi belum dapat dijalankan | Buat dan uji fondasi Tahap 1 menggunakan npm |
| Supabase CLI dan daemon terverifikasi | RLS/transaksi/storage belum dapat diuji | Pasang CLI terkunci sebagai dev dependency dan verifikasi container lokal pada Tahap 2 |
| Kredensial provider | Integrasi nyata belum dapat dibuktikan | Lanjutkan kontrak/mock; konfigurasi rahasia lewat environment saat integrasi diperlukan |
| Eksekutor job produksi dan kapasitas | Ketahanan job/biaya belum terbukti | Putuskan dan ukur pada Tahap 6; tidak mengandalkan background setelah respons HTTP |
| Merchant, domain email, domain web | Pembayaran/email publik/deploy belum teruji | Verifikasi di sandbox/staging dan gerbang rilis |
| Refund/sisa saldo hapus akun/arsip keuangan | Kebijakan komersial belum final | Catat sebagai keputusan sebelum rilis fitur, bukan hambatan discovery |

Tidak ada hambatan untuk menyelesaikan Tahap 0 atau memulai fondasi simulasi ketika Tahap 1 ditugaskan. Perintah yang berjalan sekarang adalah `node scripts/check-discovery.mjs`; server aplikasi belum tersedia.
