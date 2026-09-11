# Panduan operasional awal

Status 11 September 2026: prototipe Tahap 1 tersedia secara lokal. Belum ada database, deployment, scheduler, transaksi nyata atau cadangan layanan. Prosedur produksi di bawah masih kebutuhan tahap berikut.

## Operasi lokal yang tersedia

```powershell
npm.cmd ci
npm.cmd run dev
# Buka http://127.0.0.1:3000
# Pemeriksaan terpisah:
npm.cmd run check:discovery
git status --short
```

Instalasi memakai lockfile. Server mengikat loopback 127.0.0.1; hentikan dengan Ctrl+C. Tidak perlu menyalin `.env.example`. Jika port 3000 dipakai, ikuti URL yang dicetak atau hentikan proses proyek yang memang dimaksud. Untuk build lokal gunakan `npm.cmd run build`, lalu `npm.cmd run start`. Baca [README](../README.md) dan [laporan](laporan-tahap-1.md).

Snapshot browser memakai key `ceritajadibuku:workspace:v2`; pilih satu tab kerja. Bila penyimpanan gagal, salin melalui Selamatkan tulisan sebelum menutup halaman. Kosongkan data lokal mengosongkan buku dan riwayat setelah pilihan eksplisit; tidak ada pemulihan buku contoh. Namespace lama `ceritajadibuku:demo:v1` hanya menjadi sumber migrasi pertama dan salinan penyelamatan teks. Fingerprint SHA-256 seluruh buku mentah mengenali seed historis yang masih persis sama; hanya seed utuh yang tidak ikut ke daftar. Buku yang sudah diedit atau kebetulan memiliki ID/nama sama tetap dipertahankan. Alias pending tanpa bukti konfirmasi dibersihkan secara generik; sumber/naskah tidak ditulis ulang. Saldo/riwayat simulasi direset. Salin tulisan lama melalui Pengaturan demo → Salin tulisan dari prototipe sebelumnya. Snapshot lama tidak ditimpa atau dihapus. Snapshot v2 yang sudah ada selalu diprioritaskan, termasuk setelah reset; versi baru tidak mengimpor ulang buku yang pernah dikeluarkan versi sebelumnya. Tulisan itu tetap tersedia melalui salinan recovery. Rincian ada pada [penyesuaian onboarding](penyesuaian-onboarding.md). Memulihkan saldo demo tidak otomatis melanjutkan proses.

## Pengujian dari checkout bersih

Jalankan `npm ci`, `npx playwright install chromium`, lalu seluruh gerbang pada [README](../README.md). Chromium adalah default; `PLAYWRIGHT_CHANNEL=chrome` hanya pilihan untuk Chrome sistem. Port pengujian khusus `127.0.0.1:3100` harus kosong. Masalah instalasi browser dicatat sebagai masalah lingkungan. Laporan dan trace berada di direktori ignored, screenshot dokumentasi hanya diperbarui dengan `UPDATE_E2E_EVIDENCE=1`.

`next-env.d.ts` merupakan keluaran generated yang tidak dilacak. `npm run typecheck` membuat tipe melalui `next typegen` dari checkout tanpa cache. CI minimum telah disiapkan untuk menjalankan gerbang lokal dengan mock; eksekusi GitHub belum dilakukan. Hasil aktual dan status pilot ada di [laporan penutupan](penutupan-teknis-tahap-1.md).

## Pemetaan environment yang direncanakan

| Nama | Fungsi | Batas akses / kebutuhan |
| --- | --- | --- |
| `APP_ENV` | Identitas development/staging/production | Server; berbeda dari `NODE_ENV` |
| `DATA_PROVIDER`, `AI_PROVIDER`, `PAYMENT_PROVIDER`, `EMAIL_PROVIDER` | Pilihan adapter | Server; validator Tahap 1 hanya menerima mock dan development |
| `ENABLE_TESTER_GRANTS` | Grant untuk tester terkontrol | Default false; dilarang production; tidak diaktifkan dari request pengguna |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Klien Supabase | Nilai publik dari proyek yang tepat, dengan RLS teruji |
| `SUPABASE_SECRET_KEY`, `DATABASE_URL` | Server/migrasi data | Rahasia; tidak ke browser; ownership tetap diperiksa |
| `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL`, `OPENAI_TRANSCRIPTION_MODEL` | Adapter AI nyata | Server; key rahasia; model dipilih setelah verifikasi Tahap 6–7 |
| `AI_ACCOUNT_FAILURE_BUDGET_IDR`, `AI_GLOBAL_FAILURE_BUDGET_IDR` | Batas biaya kegagalan | Server; nilai wajib ditetapkan sebelum provider aktif; belum ada nilai produksi |
| `DUITKU_ENV`, `DUITKU_MERCHANT_CODE`, `DUITKU_API_KEY` | Lingkungan dan identitas merchant | API key rahasia; pisahkan sandbox/production |
| `DUITKU_CALLBACK_URL`, `DUITKU_RETURN_URL` | Tujuan callback dan navigasi | Nilai aktual baru ditetapkan saat integrasi; return tidak memberi saldo |
| `RESEND_API_KEY`, `EMAIL_FROM` | Email pengingat aplikasi | Server; kunci rahasia, domain pengirim terverifikasi |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | SMTP untuk Auth | Secret manager/control plane Auth terpisah; password rahasia |
| `CRON_SECRET` | Autentikasi scheduler ke worker | Server, rahasia; keberadaan variabel tidak membuktikan job berjalan |
| `IDENTITY_ENCRYPTION_KEY` | Enkripsi pemetaan privat | Rahasia terpisah dari DB; format/rotasi/pemulihan dirancang Tahap 2 |

APP_ENV, empat *_PROVIDER, serta ENABLE_TESTER_GRANTS dibaca validator startup. Nama layanan lainnya masih kontrak rencana. Sesuaikan daftar dengan konfigurasi yang benar-benar dibaca ketika adapter dibangun. Jangan memasukkan nilai rahasia ke contoh, laporan, output terminal, atau commit. `.gitignore` menutup `.env` dan `.env.*` kecuali contoh kosong; ini membantu pengelolaan berkas, bukan pemindai rahasia menyeluruh.

## Pemisahan lingkungan

Aplikasi development mulai dengan ruang kosong. Pengujian dapat memasukkan fixture sintetis secara eksplisit. Staging memakai database/storage/account provider uji tersendiri. Production memakai kredensial, domain, callback, bucket, serta anggaran tersendiri. Tidak ada ketiganya yang otomatis ditautkan hanya karena CLI tersedia di mesin.

Konfigurasi production harus gagal tertutup bila provider/secret wajib tidak valid atau mock/tester aktif. Tidak ada fallback simulasi untuk pembayaran/AI nyata yang gagal. Sebelum migrasi, periksa lingkungan dan target proyek tanpa mencetak connection string. Jangan menjalankan reset/destructive migration pada data produksi untuk pengembangan.

## Runbook yang harus dibuktikan

| Area | Kebutuhan operasional | Tahap / bukti |
| --- | --- | --- |
| Email Auth | Signup/verifikasi/reset ke alamat non-tim; SPF/DKIM/DMARC dan pengirim | 2; bukti pengiriman aktual, tanpa menonaktifkan verifikasi |
| Job | Lease/heartbeat, retry terbatas, recovery `unknown` ≤15 menit, fencing, slot akun dilepas | 6; crash/timeout/late worker dan transaksi hasil+ledger |
| Anggaran | Catat biaya sukses/gagal/unknown; alarm dan pemutus per akun/global | 6–7; nilai anggaran dan pengukuran nyata |
| Media | Direct upload privat, finalisasi ukuran/checksum/durasi, cleanup yatim | 7–8; uji staging berkas 25 MB dan unduh >4,5 MB |
| Pembayaran | Signature dan order diverifikasi; satu grant; rekonsiliasi terbatas | 9; merchant sandbox, callback palsu/ganda, status tidak berurutan |
| Pengingat | Antrean terpisah dari Auth, deduplikasi, retry dan pembatalan saat hak berubah | 9–10; saat `paid_until`, H-7/H-1 sebelum batas retensi |
| Ekspor | Snapshot/privacy/media/proyeksi cocok; Word final diperiksa | 8; naskah, properti, komentar, revisi, metadata media |
| Cadangan pengguna | Manifest, checksum, versi format; pemetaan privat opt-in | 8; restore dengan/tanpa pemetaan, tidak mengimpor saldo/owner file |
| Cadangan layanan | Database dan media terkoordinasi setidaknya setiap 24 jam | 8–10; manifest, alarm kegagalan, latihan restore layanan |
| Penghapusan | Mencakup isi/tokoh/pemetaan/cache/job/ekspor; kuota bebas setelah primer terhapus | 10; target normal 15 menit, batas primer 7 hari, backup 30 hari setelah purge primer |
| Dukungan | Metadata minimum; akses isi dengan izin terbatas dan audit | 10; jalur pemetaan privat tidak terbuka ke dukungan biasa |

## Pemulihan layanan dan retensi

RPO maksimal 24 jam dan RTO maksimal 24 jam adalah **target rekayasa belum teruji**. Pembuatan backup atau impor satu proyek tidak membuktikannya. Latihan layanan harus memulihkan database beserta objek media yang cocok, menjalankan jurnal penghapusan yang tersimpan di luar rollback, lalu merekonsiliasi hak, ledger, pembayaran, dan job sebelum membuka akses. Jangan otomatis memutar ulang AI atau grant setelah restore.

Hitungan waktu menggunakan UTC: langganan satu bulan kalender pada jangkar; top-up 30 × 24 jam dari grant pertama; baca/ekspor 15 × 24 jam dari `paid_until`; sampah proyek 7 hari tanpa memperpanjang retensi. Pembayaran pada/setelah deadline retensi tidak membatalkan purge lama. Pemulihan isi yang telah dihapus tidak dijanjikan. Proyeksi privasi ekspor manual tersedia selama hak baca yang sah, tanpa mengaktifkan editor umum/AI.

Masa arsip keuangan dan perlakuan saldo/refund pada hapus akun belum diputuskan. Tetapkan sebelum fitur dipublikasikan; jangan menyisipkan isi buku atau identitas tokoh ke arsip transaksi untuk menghindari penghapusan.

## Status rilis

Belum ada URL staging/production, domain terverifikasi, merchant, email produksi, atau latihan pemulihan. Pekerjaan ini tidak membeli layanan atau memublikasikan aplikasi. Sebelum rilis gunakan seluruh gerbang blueprint Bagian 23.2 dan panduan Tahap 12, beserta bukti aktual pada [hasil verifikasi](hasil-verifikasi.md).
