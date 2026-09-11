# Laporan implementasi Tahap 1

Diperbarui 11 September 2026. **Tahap 1 teknis siap untuk pilot manusia; pilot_pending**. Pilot belum dilakukan dan Tahap 1 belum selesai sepenuhnya. Seluruh hasil di bawah berlaku untuk patch lokal atas HEAD f944ea2; tidak ada push, merge atau deployment dalam pekerjaan penutupan ini.

## Hasil runtime terkini

| Area | Perilaku yang dapat dicoba |
| --- | --- |
| Ruang buku | Instalasi baru nol buku, satu tombol Buat buku, tiga slot untuk pengguna, judul boleh menyusul |
| Memulai cerita | Awal sebuah mimpi, Pengalaman yang membekas, Seseorang yang penting; topik sendiri atau langsung bercerita |
| Sesi | Satu pertanyaan aktif, maksimal empat, pertanyaan keempat menunggu, dua Lewati berhenti, refleksi opsional satu pertanyaan |
| Biaya | Simulasi 1 kredit penggalian sekali + 4 draf; cerita bebas cukup langsung draf 4; manual tetap tersedia saat saldo nol |
| Editor | Bahan asli, usulan, naskah diterima terpisah; revisi lama tidak menimpa tulisan terbaru; format dipertahankan |
| Identitas | Nama pena kosong dan tokoh diri [Penulis] sampai dipilih; Atur nanti tidak mengonfirmasi nama; preview tidak memasang nama otomatis |
| Privasi | no-AI/no-book, proyeksi penanda, pemeriksaan hasil sebelum biaya, nama lama/ambigu, review judul/naskah sebelum pratinjau ekspor |
| Pemulihan | Input, jawaban dan draf tetap; pekerjaan terputus menunggu tindakan; hasil usang setelah jeda/reset tidak diterapkan |
| Kredit/langganan | Aturan umum bulan kalender dan 30 hari, selalu simulasi; tidak ada periode akun tetap September–Oktober 2026 |

## Penyimpanan dan migrasi

Key aktif **ceritajadibuku:workspace:v2**, dengan skema isi formatVersion 1. **ceritajadibuku:demo:v1** hanya legacy/recovery. Loader umum memanggil modul migrasi berversi; hanya seed yang seluruh objek mentahnya cocok fingerprint SHA-256 historis yang dikeluarkan. Buku yang sudah diedit atau hanya memiliki ID/nama sama tetap dipertahankan. Tidak ada aturan penghapusan berdasarkan satu ID atau nama.

Alias pending tanpa bukti konfirmasi dibersihkan secara generik, nama terkonfirmasi dan nama pena tetap, revisi privasi naik bila perlu, sumber/naskah tidak ditulis ulang. Saldo/riwayat simulasi legacy direset. Snapshot asal tidak pernah ditimpa/dihapus dan tersedia lewat Salin tulisan dari prototipe sebelumnya. Snapshot v2 yang sudah ada selalu diprioritaskan; data rusak tidak ditimpa. [Rincian dan batas migrasi](penyesuaian-onboarding.md).

## Struktur implementasi

| Lokasi | Tanggung jawab |
| --- | --- |
| src/domain/session.ts | Transisi murni, versi, batas sesi, operasi dan biaya simulasi |
| src/domain/privacy.ts, manuscript.ts | Proyeksi/izin/temuan identitas serta penerapan naskah tanpa menimpa revisi baru |
| src/domain/model.ts | Validasi snapshot Zod |
| src/demo/migrations/legacy-v1.ts | Migrasi legacy konservatif dan fingerprint seed utuh |
| src/demo/storage.ts, use-demo.ts | Penyimpanan, recovery, lifecycle async, orkestrasi React |
| src/demo/provider.ts | Adapter deterministik tanpa HTTP atau AI nyata |
| src/components/ | Alur UI dan Tiptap; pemecahan besar workspace.tsx ditunda |
| src/lib/environment.ts, next.config.ts | Hanya APP_ENV=development dan mock; tester grant server nonaktif |

## Hasil gerbang teknis

Dijalankan setelah npm ci, dengan cache .next lama dibersihkan. Node 24.20.0, npm 11.19.0, Windows; browser default Playwright Chromium 153.0.8010.12 (revision 1243).

| Gerbang | Hasil aktual |
| --- | --- |
| npm ci | Lulus, exit 0; 429 paket terpasang |
| npm run typecheck | Lulus, exit 0; typegen dan TypeScript |
| npm run lint | Lulus, exit 0 |
| npm run test:unit | Lulus, exit 0; **81 tes / 6 berkas** |
| npm run build | Lulus, exit 0; compile, TypeScript, prerender |
| npx playwright install chromium | Lulus, exit 0; browser dikelola Playwright |
| npm run test:e2e | Lulus, exit 0; **27 skenario / 7,1 menit**, termasuk seluruh 22 baseline |
| Gerbang dokumentasi/whitespace/integritas | Hasil akhir lengkap di [laporan penutupan](penutupan-teknis-tahap-1.md) |

Enam probe CLI Next menolak staging, production, dan setiap provider non-mock dengan pesan validator yang sesuai. Semua E2E memblokir dan mengassert request HTTP/WebSocket keluar origin lokal; tidak ada upaya layanan nyata pada alur yang diuji. Sebelum/sesudah build dan E2E, hash **71 berkas tracked tetap sama**, termasuk seluruh screenshot dokumentasi. next-env.d.ts merupakan file generated ignored, tidak lagi tracked.

CI minimum tersedia sebagai workflow lokal dengan contents:read, mock/development, Node dari .node-version, tanpa secret atau deployment. CI GitHub/Linux **belum dijalankan** dan tidak dinyatakan lulus berdasarkan pengujian Windows.

## Bukti dan cakupan

Regresi mencakup batas pertanyaan, buffer, jeda/refresh, respons terlambat/gagal, saldo nol, konflik revisi, format editor, no-AI/no-book, nama pena/tokoh, review privasi, keyboard, dan viewport 320–1440 px. Penutupan menambah migrasi seed utuh/edited/ID sama, snapshot aktif rusak, pilihan identitas, dan tanggal simulasi generik. Uji tema keluarga, karier dan usaha memakai data sintetis.

Screenshot di docs/bukti-tahap-1 dan docs/bukti-onboarding adalah bukti historis yang ditetapkan pada 10 September 2026; gambar fixture Jepang bukan default produk. Run normal tidak memperbaruinya. UPDATE_E2E_EVIDENCE=1 diperlukan untuk pembaruan sengaja, yang harus ditinjau. Laporan HTML, screenshot gagal dan trace berada pada folder ignored.

## Batas penerimaan

Prototipe satu browser/tab lokal, belum memiliki login, database, RLS, pemetaan privat server, ledger/transaksi nyata, sinkronisasi, AI nyata, email, audio, Word, pembayaran, deployment atau layanan baru. Matcher hanya mengenali nama terdaftar; bukan jaminan anonimitas. Pilihan sumber dalam simulasi tidak membuktikan payload provider nyata.

[Dokumen pilot manusia](panduan-pilot-tahap-1.md) meminta tugas ruang kosong, tiga jalur cerita, satu pertanyaan, Lewati/jeda/draf, pemisahan bahan/usulan/naskah, identitas, biaya simulasi, serta HP/laptop. Pemilik harus mencatat hasil pilot dan keputusan penerimaan. Gerbang teknis tidak menggantikan pilot atau menyatakan aplikasi produksi.

Riwayat: commit 5e367b7 membangun prototipe awal dengan fixture, f944ea2 membuat onboarding kosong. Patch penutupan ini memperbaiki migrasi, portabilitas tes, CI dan dokumentasi. Empat dokumen induk tetap utuh; catatan Tahap 0 berada di [hasil verifikasi historis](hasil-verifikasi.md).
