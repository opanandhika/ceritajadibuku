# Keputusan teknis awal

> Status terkini: prototipe lokal Tahap 1 telah diimplementasikan; lihat [laporan dan bukti](laporan-tahap-1.md). Bagian awal dokumen ini dipertahankan sebagai baseline historis Tahap 0. Pernyataan “belum dibuat/belum diuji” pada baseline berlaku saat discovery; realisasi simulasi dijelaskan pada bagian pembaruan Tahap 1 di bawah. Kontrol produksi dan pilot manusia masih belum selesai.

Tanggal: 10 September 2026. Status: keputusan penerapan Tahap 0; fitur aplikasi belum dibuat. Sumber perilaku tetap blueprint 1.4.

## 001 — Cakupan dan sumber tunggal

Pertahankan empat berkas pemilik dengan nama aslinya dan hubungkan dari README. Jangan menggandakan blueprint ke nama lain sehingga dua salinan dapat berbeda. Tahap 0 menghasilkan struktur dokumentasi dan alat pemeriksaan; aplikasi dimulai pada Tahap 1. Git dibuat lokal pada `main`, tanpa remote yang dikarang.

## 002 — Runtime dan fondasi aplikasi

Gunakan Node lokal `24.20.0` dan npm `11.19.0`. Pilih Next.js App Router, React, dan TypeScript strict sesuai blueprint. Buat manifest serta `package-lock.json` pada instalasi pertama Tahap 1; setelah itu instalasi berulang menggunakan `npm ci`. Jangan membuat lockfile kosong atau skrip build/test yang hanya mengembalikan sukses.

Next.js diperiksa melalui dokumentasi resmi, tetapi patch framework/React/TypeScript belum dikunci karena belum ada instalasi. Pilih rilis stabil yang kompatibel saat Tahap 1, catat versi aktual, lalu buktikan build dan typecheck. Root sudah berisi dokumen: gunakan pemasangan manual yang mempertahankan isinya, bukan scaffold yang menimpa root. [Instalasi Next.js](https://nextjs.org/docs/app/getting-started/installation)

Rencana antarmuka: arah A "Ruang menulis hangat", CSS tokens/CSS Modules, font sistem serif dan sans-serif dari UI Bagian 4, Tiptap open source pada editor. Tidak ada kebutuhan font eksternal atau aset berbayar untuk mulai. Versi ekstensi Tiptap dan lisensinya diperiksa saat dipasang.

## 003 — Modul dalam satu aplikasi

Struktur sasaran berikut **belum dibuat**; direktori ditambahkan saat memiliki implementasi:

```text
src/
  app/                 halaman dan API Next.js
  components/          kontrol serta komponen UI bersama
  features/            books, sessions, editor, characters, billing
  domain/              state machine, hak, tarif, kebijakan privasi murni
  server/              services, repositories, context builder, provider adapters
  lib/                 config terverifikasi, waktu, utilitas bersama
  test/                fixture sintetis dan bantuan tes
supabase/
  migrations/          skema SQL, constraint, RLS, fungsi transaksi
  tests/               isolasi akun dan transaksi nyata
tests/e2e/              jalur pengguna dan kegagalan lintas komponen
docs/                   keputusan dan bukti
scripts/                utilitas proyek
```

State machine domain harus dapat diuji tanpa React dan kelak dipakai server sebagai sumber kebenaran. `ProjectService`, `SessionService`, `CharacterService`, `PrivacyService`, `ContextService`, `WritingService`, `CreditService`, `BillingService`, `RetentionService`, dan `ExportService` adalah batas modul, bukan sepuluh microservice. Kredensial istimewa dan provider adapter berada di server.

## 004 — Data, migrasi, dan hak

Gunakan Supabase Auth/PostgreSQL/Storage sesuai blueprint. Migrasi SQL berversi memungkinkan constraint/FK/RLS dan transaksi ledger dinyatakan eksplisit. Pasang Supabase CLI sebagai dev dependency terkunci pada Tahap 2. Stack lokal memerlukan runtime container yang berjalan; saat ini daemon belum terverifikasi. [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

Pisahkan database, bucket, callback, email, dan kredensial development/staging/production. Tidak ada `db push` ke remote atau reset database produksi untuk prototipe. Periksa target sebelum migrasi; schema production baru dipromosikan setelah bukti staging serta prosedur pemulihan tersedia.

Cloud memegang versi yang diterima server. IndexedDB nanti menyimpan salinan kerja dan antrean akun; label Tersinkron hanya sesudah acknowledgment server. Mutation memerlukan ownership, hak, versi dasar, idempotensi, dan Origin/CSRF pada cookie. Job service-role tetap harus memeriksa pemilik serta proyek. Media privat diunggah langsung melalui upload intent, lalu divalidasi server.

## 005 — Lingkungan, simulasi, dan rahasia

`APP_ENV` membedakan development/staging/production; `NODE_ENV` tetap milik runtime framework dan tidak dipakai untuk membedakan staging. Adapter dipilih dari konfigurasi server, tidak dari query, body, atau tombol browser. Default rancangan Tahap 1 adalah mock dengan data sintetis dan label contoh. Tester grant default nonaktif.

`.env.example` mencatat nama dan tujuan konfigurasi, **belum merupakan validator**. Pada Tahap 1 buat validasi konfigurasi; kombinasi produksi + mock/tester harus gagal saat startup. Pada integrasi berikutnya, provider nyata tidak boleh fallback ke mock ketika kunci hilang. Staging boleh memakai sandbox sesuai kontrak masing-masing, tanpa grant tester publik.

Kredensial server, database, AI, Duitku, email, cron, dan enkripsi identitas tidak boleh berprefiks `NEXT_PUBLIC_`. Hanya URL Supabase serta publishable key yang direncanakan untuk browser, dengan RLS teruji. Nilai rahasia disimpan di environment/secret manager dan tidak dimasukkan ke log atau dokumen.

## 006 — Identitas dan privasi sejak model data

Pisahkan `publication_author_name`, `narrator_character_id`, nama tampil tokoh, serta profil akun/tagihan. Default mode buku `mixed`, tokoh baru `pending`; nama asli opsional termasuk untuk penulis. Perubahan mode bukan persetujuan semua nama. Identitas publik tidak pernah memakai fallback nama akun/email.

Data kartu `characters` terpisah dari `character_private_identities`. Field sensitif juga mungkin berada pada `character_mentions`, `identity_rules`, snapshot, dan temuan `privacy_reviews`, sehingga filter harus berbasis field/proyeksi. Rencanakan akses privat khusus pemilik, pemeriksaan ownership di server, dan enkripsi nilai privat dengan kunci server terpisah serta rancangan rotasi pada Tahap 2. Jangan menaruh kunci di tabel yang dienkripsinya.

Nama asli hanya dibuka melalui tindakan eksplisit pemilik pada endpoint privat. Proses internal untuk pencocokan/proyeksi dapat memakai pemetaan yang diperlukan tanpa mengembalikannya ke API biasa, browser cache, log, dukungan, atau provider. Semua akses internal mengikuti sumber dan kepemilikan.

Urutan konteks: pilih sumber yang sah → keluarkan no-AI beserta turunannya → tangani no-book/izin konteks terpisah → samarkan salinan konteks dengan matcher internal → validasi payload → periksa `privacy_revision` → provider. Ulangi pemeriksaan versi, izin, dan hasil sebelum commit/capture. Penggantian nama tidak membolehkan sumber no-AI dikirim. Bahan no-book dikeluarkan dari generasi jika pemisahan isinya tidak dapat dijamin.

Tinjauan ekspor terikat snapshot naskah, versi media, proyeksi, dan `privacy_revision`; perubahan salah satunya membuat review lama tidak berlaku. Export generator memakai snapshot yang sama dan memeriksa paket Word/metadata. Cadangan tanpa pemetaan menyaring seluruh representasi terstruktur privat, namun sumber/audio tetap dapat berisi nama; impor tidak merekonstruksi pemetaan yang dihilangkan.

Tidak ada data legacy sekarang. Impor mendatang mempertahankan sumber, membuat ID milik proyek tujuan, menjadikan pilihan identitas lama yang belum disetujui `pending`, serta meminta tinjauan ekspor baru. [Model, akses, dan matriks permukaan privasi](peta-privasi.md) menjadi bagian keputusan ini. Semua kontrol tersebut belum teruji.

## 007 — Ledger sebelum AI nyata

Tahap 5 membangun ledger sebelum provider nyata pada Tahap 6. Gunakan integer rupiah, 60.000 unit/kredit, waktu UTC, dan tampilan Asia/Jakarta. Langganan memakai bulan kalender berjangkar; top-up tepat 30 × 24 jam dari grant pertama; baca/ekspor tepat 15 × 24 jam dari `paid_until`.

Reservasi, capture, release, expiry, dan adjustment memakai transaksi serta constraint unik. Job tahan lama menyimpan lease, generation/fencing token, state/source/privacy/pricing version; hasil dan capture committed atomik. Maksimal satu AI job aktif per akun, recovery/reservasi maksimal 15 menit, serta dua percobaan tambahan dalam satu kali anggaran ulang total per jenis token. Hasil gagal dan biaya provider dicatat terpisah dari tagihan pengguna.

Pilihan awal executor adalah worker terlindungi yang mengambil job PostgreSQL dengan lease. Penempatan/runtime/scheduler final ditentukan pada Tahap 6 setelah durasi dan hosting diuji. Jangan menjalankan kerja panjang sebagai promise yang hilang setelah respons HTTP. Kebutuhan worker/backup tambahan tetap masuk anggaran operasional.

Model teks/transkripsi dalam blueprint adalah kandidat, belum bukti akses API atau mutu. Verifikasi model, harga, batas, kebijakan data, dan akun pada Tahap 6–7. Tidak membuat panggilan AI nyata untuk discovery.

## 008 — Strategi verifikasi bertahap

Saat ini gunakan skrip Node tanpa dependensi untuk pemeriksaan discovery. Rencana Tahap 1: ESLint, TypeScript `tsc --noEmit`, Vitest untuk state machine/aturan, dan Playwright untuk alur UI. Versi runner dikunci bersamaan dengan instalasi. Tahap 2 menambahkan pengujian database nyata untuk ownership/RLS; Tahap 5–6 menambahkan balapan transaksi/ledger/job; Tahap 8 memeriksa ekspor dan restore nyata; Tahap 9 membuktikan callback sandbox.

Prioritaskan kehilangan tulisan, kebocoran, pertanyaan berulang, serta tagihan ganda. Pilot kenyamanan/penilaian suara harus melibatkan penulis yang diotorisasi; screenshot viewport dan fixture tidak menggantikannya. Jangan menambahkan skrip tes palsu hanya untuk memenuhi nama pemeriksaan.

## 009 — Keputusan yang ditunda sampai bukti tersedia

| Keputusan | Waktu | Bukti yang dibutuhkan |
| --- | --- | --- |
| Patch dependency dan runner | Tahap 1 | Instalasi, lockfile, build/typecheck/tes |
| Enkripsi privat/rotasi kunci dan region layanan | Tahap 2 | Threat model, akses terbatas, pemulihan kunci, konfigurasi aktual |
| Model API, biaya, budget kegagalan, penempatan worker | Tahap 6–7 | Akun, pengujian kontrak/mutu, durasi dan biaya pilot |
| Format backup/ekspor, backup database+objek | Tahap 8 | Restore nyata dan bukti RPO/RTO |
| Versi/signature Duitku, kanal, refund | Tahap 9 | Dokumen resmi dan transaksi sandbox merchant |
| Sisa kredit hapus akun dan durasi arsip keuangan | Sebelum rilis fitur terkait | Keputusan eksplisit pemilik |
| Domain, pengirim email, publikasi | Gerbang rilis | Kepemilikan/konfigurasi, bukti staging, otorisasi publikasi |

Keputusan ini tidak mengubah harga/kuota/privasi atau membolehkan integrasi produksi otomatis.

## 010 — Implementasi lokal Tahap 1

Next.js App Router, React, TypeScript strict, Zod, Tiptap, Vitest, ESLint dan Playwright dipasang dengan versi pasti di package-lock.json. Domain sesi dan privasi berupa fungsi murni; React mengorkestrasi input, penyimpanan dan adapter mock. Versi paket aktual ada pada package.json. Panduan Next.js dibaca dari node_modules/next/dist/docs sesuai AGENTS.md yang dibuat oleh next dev.

Navigasi prototipe memakai hash di satu route; URL sesi menyimpan ID. Ini keputusan lokal sementara, bukan arsitektur routing akun/server Tahap 2. localStorage menyimpan snapshot isi formatVersion 1 pada key aktif `ceritajadibuku:workspace:v2`; ruang pengguna baru kosong, sedangkan `ceritajadibuku:demo:v1` hanya legacy/recovery; seluruh aplikasi demo dibatasi validator APP_ENV=development. Build optimal lokal tetap boleh menggunakan NODE_ENV=production.

## 011 — Penolakan hasil usang dan pemisahan naskah

Setiap aksi membawa versi sesi; operasi membawa ID unik dan versi kebijakan/sumber. Hasil yang datang sesudah jeda, refresh atau perubahan kebijakan tidak dapat menulis draf atau memotong saldo. Refresh pekerjaan aktif menjadi tertahan dan memerlukan tindakan pengguna. Buffer belum dikirim tidak masuk skip atau permintaan draf. Harga dicatat untuk hasil tahap yang diterima, paling banyak 1+4 kredit contoh.

Bahan asal, draf dan bagian diterima tidak saling menimpa. Penerapan membandingkan revisi bagian tujuan dan kebijakan. Konflik menawarkan usulan terpisah; format naskah diterima dipertahankan ketika draf ditambahkan atau nama disamarkan. Ini belum transaksi server atau ledger nyata.

## 012 — Privasi konservatif pada simulasi

Mode no-book dikeluarkan dari generasi bersama no-AI; izin konteks terpisah belum dibangun. Identitas diproyeksikan ke penanda sebelum adapter; hasil bernama terlarang atau berpenanda tak dikenal ditolak sebelum biaya draf. Review meliputi judul buku/bagian, naskah, nama pena, nama lama yang diketahui, dan relasi sumber.

Pencocokan nama satu lintasan memakai nama terpanjang secara global. Sebutan yang menunjuk beberapa tokoh ditahan, tidak dipilih berdasarkan urutan kartu. Atur nanti tidak mengonfirmasi nama yang baru diketik. Pratinjau ekspor dan penyamaran tidak merupakan sertifikasi anonimitas atau ekspor Word nyata. Lihat laporan Tahap 1 untuk pengujian dan batasnya.

## 013 — Penutupan teknis Tahap 1, 11 September 2026

Migrasi legacy v1 dipisah ke modul berversi. SHA-256 atas canonical JSON buku mentah lengkap mengenali hanya seed historis yang belum berubah. Setiap edit mempertahankan buku; literal judul/nama tidak menjadi aturan penghapusan. Snapshot asal tidak dimutasi, dan pilihan identitas terkonfirmasi dipertahankan. Fingerprinting asynchronous dilindungi lifecycle/generation sebelum hasil load diterapkan. Rincian pada [onboarding](penyesuaian-onboarding.md).

Chromium Playwright menjadi default; Chrome sistem opt-in. Server E2E khusus port 3100 tidak memakai server yang kebetulan sudah hidup. Jaringan tes dibatasi ke origin lokal, dan screenshot dokumentasi opt-in. CI berizin contents:read menjalankan mock/development tanpa secrets/deployment. next-env.d.ts tidak dilacak sesuai panduan Next.js; typecheck diawali next typegen.

Utang teknis: workspace.tsx masih memuat banyak tampilan. Pemecahan besar ditunda agar penutupan Tahap 1 tidak berubah menjadi refactor fitur. Status keseluruhan tetap pilot_pending; [laporan penutupan](penutupan-teknis-tahap-1.md) mencatat gerbang aktual.
