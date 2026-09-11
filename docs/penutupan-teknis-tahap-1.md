# Penutupan teknis Tahap 1

Tanggal: 11 September 2026. Pekerjaan lokal sesuai arahan pemilik; tanpa push, merge, deployment, layanan baru, atau provider nyata. Pilot manusia masih pending.

## Kondisi sebelum perubahan

- Branch `main`, HEAD `f944ea2f71e28c247da7ab20e486f069be1a2880`.
- Remote fetch/push: `https://github.com/opanandhika/ceritajadibuku.git`.
- `git status --short` kosong; tidak ada perubahan pengguna yang perlu dipindahkan atau ditimpa.
- AGENTS.md dan sepuluh dokumen kerja dibaca. Panduan Next.js lokal untuk client components, TypeScript, dan `next typegen` diperiksa sebelum menulis kode.
- Empat hash SHA-256 awal cocok dengan tabel historis di `docs/hasil-verifikasi.md` (4/4).
- Key aktif `ceritajadibuku:workspace:v2`; key legacy/recovery `ceritajadibuku:demo:v1`.

## Temuan awal

Loader membuang setiap buku ber-ID `jepang`, termasuk yang sudah diedit, dan membersihkan alias tertentu secara khusus. Snapshot legacy memang dipertahankan, tetapi tulisan yang diedit tidak ikut sebagai buku aktif. Tes lama justru mengharapkan perilaku tersebut.

Kredit/langganan menampilkan tanggal tetap September–Oktober 2026. Playwright mewajibkan Chrome sistem, memakai server yang kebetulan sudah berjalan, dan menulis screenshot ke berkas dokumentasi tracked pada setiap run. `next-env.d.ts` masih tracked meskipun dihasilkan ulang oleh Next.js. Belum tersedia workflow CI. Laporan masih mencampurkan jumlah tes historis dan kondisi runtime terbaru.

## Perubahan dan alasan

| Berkas | Perubahan / alasan |
| --- | --- |
| src/demo/migrations/legacy-v1.ts | Modul migrasi berversi, fingerprint SHA-256 buku mentah lengkap, normalisasi pending generik |
| src/demo/migrations/legacy-v1.test.ts | Uji seed persis, ID mirip/sama, seluruh jenis edit, sesi dengan buffer/jawaban/draf, alias terkonfirmasi, kegagalan hashing |
| src/demo/storage.ts | Loader umum memanggil migrator, membedakan key tidak ada dan rusak, recovery juga menyertakan kolom lama tak dikenal |
| src/demo/storage.test.ts | Adaptasi async, sumber legacy tidak berubah, v2 rusak tidak ditimpa, recovery kolom tambahan |
| src/demo/use-demo.ts | Menunggu loader async dan memeriksa live/generation sebelum menerapkan hasil |
| src/components/workspace.tsx | Mengganti tanggal akun tetap dengan aturan bulan kalender/langganan dan 30 hari/top-up berlabel simulasi |
| src/lib/environment.test.ts | Penolakan keempat adapter non-mock dan penerimaan konfigurasi mock eksplisit |
| playwright.config.ts | Chromium default, Chrome opt-in, port 3100 khusus, server baru, mock/development, telemetri nonaktif |
| tests/fixtures/test.ts | Fixture otomatis yang memblokir serta menggagalkan upaya HTTP/WebSocket eksternal |
| tests/fixtures/evidence.ts | Screenshot dokumentasi hanya ketika UPDATE_E2E_EVIDENCE=1 |
| tests/e2e/onboarding.spec.ts | Mempertahankan delapan skenario awal dan menambah lima regresi: buku edited, ID sama, dua snapshot aktif rusak, tanggal simulasi |
| tests/e2e/prototype.spec.ts | Sepuluh skenario lama tetap; memakai guard jaringan dan bukti opt-in |
| tests/e2e/recovery-accessibility.spec.ts | Empat skenario lama tetap; memakai guard jaringan dan bukti opt-in |
| package.json | typecheck menjalankan next typegen sebelum tsc untuk checkout tanpa cache |
| .gitignore | Mengabaikan next-env.d.ts yang dihasilkan framework |
| next-env.d.ts | Dikeluarkan dari index Git; berkas lokal dihasilkan Next dan tetap termasuk tsconfig |
| .github/workflows/stage-1.yml | CI minimum seluruh gerbang, Node dari .node-version, contents:read, tanpa secret/deploy |
| scripts/check-discovery.mjs | Memeriksa laporan baru dan SHA-256 empat dokumen induk terhadap baseline historis |
| README.md | Instruksi clean checkout, browser, port, migrasi, generated files, CI, dan status pilot |
| docs/discovery.md | Penanda eksplisit bahwa kondisi tanpa kode/legacy hanya baseline Tahap 0 |
| docs/hasil-verifikasi.md | Tautan hasil Tahap 1 terbaru; tabel hash dan catatan Tahap 0 dipertahankan |
| docs/keputusan-teknis.md | Keputusan migrasi, test portabel, CI, generated types, serta utang refactor |
| docs/progres-implementasi.md | Status teknis/pilot dan rujukan gerbang aktual |
| docs/laporan-tahap-1.md | Rekonsiliasi laporan runtime dan jumlah tes terkini |
| docs/penyesuaian-onboarding.md | Kontrak migrasi baru, klasifikasi fixture, batas recovery v2 lama |
| docs/panduan-pilot-tahap-1.md | Seluruh tugas pilot manusia termasuk tiga jalur cerita, satu pertanyaan, Lewati/jeda/draf, identitas dan simulasi |
| docs/peta-privasi.md | Memisahkan kondisi discovery tanpa legacy dari migrasi browser yang kini tersedia |
| docs/panduan-operasional.md | Key aktif/recovery, migrasi konservatif, clean checkout dan artefak opt-in |
| docs/penutupan-teknis-tahap-1.md | Catatan awal, perubahan, perintah aktual, batas bukti, integritas dan status akhir |

## Migrasi sebelum dan sesudah

Sebelum perubahan, setiap buku ber-ID jepang dikeluarkan, termasuk yang telah menerima tulisan pengguna; alias Nara dibersihkan secara khusus. Sesudah perubahan, loader umum memanggil migrasi v1 terpisah. SHA-256 canonical JSON seluruh objek buku mentah harus cocok persis dengan seed commit 5e367b7. Satu perubahan pada isi, metadata, tokoh, source, rich content, sesi, atau kolom tambahan membuat buku dipertahankan. Jika hashing tidak tersedia, buku dipertahankan.

Fingerprint diverifikasi sebelum normalisasi dan session recovery. Alias pending tanpa bukti konfirmasi dibersihkan secara generik; nama yang tercatat telah dikonfirmasi dan nama pena dipertahankan. Revisi privasi naik sekali bila alias berubah, tanpa menulis ulang bahan atau naskah. Saldo/riwayat simulasi direset; snapshot demo:v1 asli tidak pernah dihapus atau ditimpa.

Key workspace:v2 yang sudah ada diprioritaskan, termasuk keadaan kosong setelah reset. Nilai aktif rusak (termasuk string kosong) tidak memicu migrasi. Tulisan yang dulu dikeluarkan versi f944ea2 tidak diimpor ulang ke v2 yang sudah ada; pengguna dapat menyalinnya melalui Pengaturan demo → Salin tulisan dari prototipe sebelumnya. Kolom tak dikenal tetap tersedia sebagai JSON mentah di jalur recovery. Ini bukan impor/cadangan proyek terverifikasi.

## Hasil gerbang aktual

Lingkungan: Windows, Node 24.20.0, npm 11.19.0, paket sesuai lockfile. Cache .next lama dibersihkan sebelum typecheck/build untuk membuktikan generated types tidak memerlukan hasil run sebelumnya.

| Perintah | Hasil |
| --- | --- |
| npm ci | Lulus, exit 0; 429 paket terpasang, audit 430 paket, 0 vulnerabilities pada saat pemeriksaan |
| npm run typecheck | Lulus, exit 0; next typegen lalu tsc --noEmit |
| npm run lint | Lulus, exit 0 |
| npm run test:unit | Lulus, exit 0; 81 tes, 6 berkas |
| npm run build | Lulus, exit 0; compile, TypeScript dan prerender / serta /_not-found |
| npx playwright install chromium | Lulus, exit 0; Chromium 153.0.8010.12 / revision 1243 dan dependensi pengujiannya terpasang |
| npm run test:e2e | Lulus, exit 0; 27 skenario dalam 7,1 menit, termasuk seluruh 22 baseline |
| npm run check:discovery | Lulus, exit 0; 54 tautan lokal valid dan 4/4 hash dokumen induk cocok |
| git diff --check; git diff --cached --check | Keduanya lulus, exit 0 |

Instalasi pertama npm ci --no-audit --no-fund gagal karena spawn EPERM/cache sandbox Windows; npm ci dijalankan ulang dengan izin proses yang diperlukan dan berhasil. Ini kegagalan lingkungan, bukan assertion aplikasi. npm melaporkan deprecation ESLint yang terkunci serta pemberitahuan install-scripts unrs-resolver; versi dependency tidak diubah dan lint/build/test tetap dijalankan. Next memberi peringatan lockfile di direktori induk di luar repo; build tetap memakai repository ini dan lulus.

Pemeriksaan negatif CLI Next typegen dijalankan enam kali: APP_ENV=staging, APP_ENV=production, dan masing-masing DATA_PROVIDER/AI_PROVIDER/PAYMENT_PROVIDER/EMAIL_PROVIDER=forbidden. Semua berhenti dengan exit 1 dan pesan validator yang diharapkan; harness verifikasi keluar 0. Tidak ada server atau provider nyata diaktifkan oleh pemeriksaan tersebut.

CI hanya berupa file workflow lokal. Eksekusi di GitHub belum dilakukan, dan tidak disamakan dengan hasil Windows lokal.

## Data sintetis dan pekerjaan yang ditunda

Fixture historis lengkap tetap di tests/fixtures/demo.ts untuk tes eksplisit, termasuk nama Nara/Citra Senja dan kisah Jepang. Dokumentasi induk serta screenshot bukti yang telah ditetapkan masih memuat konteks historis itu. Runtime baru mulai tanpa buku, sumber, naskah, nama pena, atau alias default. Runtime migrator hanya menyimpan digest seed historis, bukan teks seed baru.

Belum dilakukan: pilot kenyamanan manusia, uji HP fisik, eksekusi CI Linux/GitHub, auth, database, RLS, AI nyata, audio, email, pembayaran, ekspor Word, deployment, atau layanan baru. Prototipe tetap satu browser/tab lokal tanpa sinkronisasi atau jaminan penyimpanan produksi. Pemecahan besar workspace.tsx dicatat sebagai utang teknis; perubahan UI tugas ini hanya teks tanggal simulasi.

Status: **Tahap 1 teknis siap untuk pilot manusia; pilot_pending**. Pilot belum dilakukan dan Tahap 1 belum selesai sepenuhnya.


## Integritas dan stabilitas

Hash SHA-256 sebelum dan sesudah pekerjaan dibandingkan dengan baseline docs/hasil-verifikasi.md. Keempat dokumen induk tetap byte-for-byte identik:

| Berkas | SHA-256 sebelum = sesudah |
| --- | --- |
| blueprint(3).md | C0D307FF1EF3A9645E9808210B4FB95459592074224DD1C197C5522675E9085F |
| langkah-implementasi(1).md | 874B39BDD8F3076576B43905A698F2C8F382E0974DAC0FFEE451845A2B9144A4 |
| ui-ux-spec (1).md | A042A7933402E606CA97DD4FBE791287A7128A6DC4506D4E14A6CAFB642EFE54 |
| kajian-harga-dan-penulisan.md | 5292E0E25054D479E78DF31779607731AE6D4A8BFBD0FF2DE213ECB8D7341CE9 |

Setelah patch kode/config dibuat, SHA-256 71 berkas tracked dicatat sebelum build/E2E, lalu dibandingkan sesudahnya: **0 perubahan oleh verifikasi**. Seluruh 14 screenshot bukti tetap sama. Dokumentasi kemudian diselaraskan secara sengaja dengan hasil akhir ini. next-env.d.ts yang regenerated diabaikan Git; staged deletion-nya adalah perubahan konfigurasi yang disengaja sesuai panduan Next.js lokal.

Daftar .env/sertifikat/kunci yang terlacak hanya .env.example berisi placeholder kosong. Tidak ada credential atau .env nyata ditambahkan. Pencarian nama/judul fixture di source runtime (tanpa *.test.ts) dan JavaScript hasil build .next/static tidak menemukan kecocokan. Network guard E2E lulus untuk semua 27 skenario, sehingga tidak ada upaya HTTP/WebSocket eksternal oleh aplikasi pada alur yang diuji.

## Snapshot Git akhir

HEAD tetap `f944ea2f71e28c247da7ab20e486f069be1a2880` pada branch `main`. Tidak dibuat commit, push, merge, atau deployment. Ada 22 berkas tracked yang diedit, satu penghapusan dari index untuk generated file, dan enam berkas baru. Berkas baru belum masuk index sehingga tidak dihitung oleh `git diff --stat`.

Hasil `git diff --stat`:

```text
 .gitignore                               |   1 +
 README.md                                |  15 +++-
 docs/discovery.md                        |   2 +
 docs/hasil-verifikasi.md                 |   2 +-
 docs/keputusan-teknis.md                 |  10 ++-
 docs/laporan-tahap-1.md                  | 133 ++++++++++++-------------------
 docs/panduan-operasional.md              |  10 ++-
 docs/panduan-pilot-tahap-1.md            |  30 ++++---
 docs/penyesuaian-onboarding.md           |  42 +++++-----
 docs/peta-privasi.md                     |   4 +-
 docs/progres-implementasi.md             |   6 +-
 package.json                             |   2 +-
 playwright.config.ts                     |  17 +++-
 scripts/check-discovery.mjs              |  10 +++
 src/components/workspace.tsx             |   2 +-
 src/demo/storage.test.ts                 |  42 ++++++----
 src/demo/storage.ts                      |  34 ++++----
 src/demo/use-demo.ts                     |   8 +-
 src/lib/environment.test.ts              |   7 ++
 tests/e2e/onboarding.spec.ts             |  66 +++++++++++++--
 tests/e2e/prototype.spec.ts              |  24 +++---
 tests/e2e/recovery-accessibility.spec.ts |   5 +-
 22 files changed, 276 insertions(+), 196 deletions(-)
```

Hasil `git diff --cached --stat`:

```text
 next-env.d.ts | 7 -------
 1 file changed, 7 deletions(-)
```

Hasil `git status --short`:

```text
 M .gitignore
 M README.md
 M docs/discovery.md
 M docs/hasil-verifikasi.md
 M docs/keputusan-teknis.md
 M docs/laporan-tahap-1.md
 M docs/panduan-operasional.md
 M docs/panduan-pilot-tahap-1.md
 M docs/penyesuaian-onboarding.md
 M docs/peta-privasi.md
 M docs/progres-implementasi.md
D  next-env.d.ts
 M package.json
 M playwright.config.ts
 M scripts/check-discovery.mjs
 M src/components/workspace.tsx
 M src/demo/storage.test.ts
 M src/demo/storage.ts
 M src/demo/use-demo.ts
 M src/lib/environment.test.ts
 M tests/e2e/onboarding.spec.ts
 M tests/e2e/prototype.spec.ts
 M tests/e2e/recovery-accessibility.spec.ts
?? .github/
?? docs/penutupan-teknis-tahap-1.md
?? src/demo/migrations/
?? tests/fixtures/evidence.ts
?? tests/fixtures/test.ts
```
