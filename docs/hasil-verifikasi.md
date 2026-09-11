# Hasil verifikasi proyek

Hasil aplikasi Tahap 1 terkini tercatat di [laporan penutupan teknis](penutupan-teknis-tahap-1.md) dan [laporan implementasi](laporan-tahap-1.md). Catatan berikut dipertahankan sebagai baseline Tahap 0; pernyataan belum ada aplikasi/tes berlaku saat discovery tersebut.

# Hasil verifikasi Tahap 0

Tanggal: 10 September 2026. Lingkungan: Windows/PowerShell, workspace lokal CeritaJadiBuku. Git baru diinisialisasi pada `main`; belum ada commit. Pemeriksaan berlaku pada artefak kerja Tahap 0, tanpa mode provider aktif, data pengguna, atau koneksi layanan.

## Inventaris yang dijalankan

| Perintah / pemeriksaan | Hasil nyata | Batas kesimpulan |
| --- | --- | --- |
| `Get-ChildItem -Force` dan `rg --files --hidden ...` | Awalnya hanya empat dokumen Markdown | Tidak ada kode atau konfigurasi proyek awal |
| Pencarian `AGENTS.md` pada proyek/rantai induk | Tidak ditemukan | Tidak menyatakan instruksi sesi tidak berlaku |
| `git status --short` sebelum init | `fatal: not a git repository` | Tidak ada repo/riwayat yang perlu dipertahankan di folder ini |
| `git init --initial-branch=main` | Berhasil menginisialisasi repo lokal | Tidak membuat remote, commit, atau publikasi |
| `node --version` | `v24.20.0` | Runtime tersedia, bukan build aplikasi |
| `npm.cmd --version` | `11.19.0` | npm tersedia; belum ada instalasi proyek |
| `git --version` | `2.53.0.windows.2` | Binary tersedia |
| `python --version` | `3.14.3` | Bukan dependensi aplikasi yang dipasang |
| `docker --version` / `docker compose version` | `29.7.2` / `v5.5.1` | CLI tersedia; daemon belum terbukti |
| `docker info --format {{.ServerVersion}}` melalui `spawnSync` dengan timeout 10 detik | `EPERM`, tidak mendapat status server | Pemeriksaan dibatasi lingkungan; tidak menyimpulkan daemon mati |
| `Get-Command ...` untuk Supabase/Vercel/psql | Tidak ditemukan | Belum ada tool database/hosting proyek yang siap di PATH |
| `npm.cmd ls --global --depth=0` | Firebase CLI dan ngrok tersedia | Tidak digunakan/dihubungkan untuk proyek |
| Pencarian nama environment provider, tanpa membaca nilainya | Tidak ditemukan kecocokan pada proses | Tidak membuktikan akun provider tidak ada di luar workspace |
| Pembacaan empat dokumen dan audit paralel | Versi/harga/retensi/privasi konsisten | Harga provider adalah snapshot, tidak diverifikasi sebagai harga produksi |
| Dokumen resmi Next.js dan Supabase CLI | Minimum runtime/arah instalasi ditinjau | Tidak melakukan instalasi, startup Supabase, atau panggilan provider |

Pencarian pertama dengan glob literal `-- *.md` tidak didukung cara ekspansi shell ini; diulang dengan `rg -g '*.md' .` dan berhasil. Ini tidak merupakan kegagalan aplikasi.

## Pemeriksaan artefak akhir

Perintah berikut dijalankan terhadap artefak Tahap 0, tanpa mengklaim tes aplikasi:

| Pemeriksaan | Status |
| --- | --- |
| `node --check scripts/check-discovery.mjs` | Lulus; kode keluar 0, sintaks valid |
| `node scripts/check-discovery.mjs` | Lulus; kode keluar 0, 15 berkas tersedia, contoh rahasia kosong, nama konfigurasi tidak duplikat |
| Tautan lokal dokumentasi kerja | 22 tautan diperiksa, seluruh tujuan berkas ditemukan; anchor tidak diperiksa |
| Hash SHA-256 empat masukan tetap sama | Lulus, 4/4 cocok dengan baseline di bawah |
| `git branch --show-current`, `git remote`, `git status --short`, `git ls-files --stage` | Branch `main`, tanpa remote, seluruh berkas untracked, index kosong; belum ada commit |
| `git check-ignore -v -- .env .env.local .env.production private-data/sample.txt node_modules/example.txt` | Kelima path tercakup ignore; tidak perlu membuat berkas rahasia untuk menguji |
| `git check-ignore --no-index .env.example` | Keluar 1 (tidak diabaikan), hasil yang diharapkan |

`git diff --check` juga dijalankan tanpa temuan, tetapi belum ada berkas tracked sehingga hasil tersebut **tidak** dijadikan bukti pemeriksaan whitespace pada berkas baru. Pemeriksaan Git tidak memasukkan berkas ke staging atau membuat commit.

## Integritas dokumen pemilik

Hash byte awal sebelum implementasi, diperoleh memakai `Get-FileHash -Algorithm SHA256`. Pemeriksaan akhir membandingkan nilai yang sama; dokumen tidak diganti nama atau dinormalisasi isinya.

| Berkas | SHA-256 awal |
| --- | --- |
| `blueprint(3).md` | `C0D307FF1EF3A9645E9808210B4FB95459592074224DD1C197C5522675E9085F` |
| `langkah-implementasi(1).md` | `874B39BDD8F3076576B43905A698F2C8F382E0974DAC0FFEE451845A2B9144A4` |
| `ui-ux-spec (1).md` | `A042A7933402E606CA97DD4FBE791287A7128A6DC4506D4E14A6CAFB642EFE54` |
| `kajian-harga-dan-penulisan.md` | `5292E0E25054D479E78DF31779607731AE6D4A8BFBD0FF2DE213ECB8D7341CE9` |

## Yang belum diuji

Belum ada `lint`, `typecheck`, unit/integration/e2e test aplikasi, `build`, atau server yang dapat dicoba. Runner serta skrip tersebut dibuat pada tahap implementasi terkait. Tidak ada uji browser/HP, pilot pengguna, RLS, ledger, callback Duitku, mutu AI/transkripsi, email, ekspor Word, restore, maupun penghapusan.

Khusus privasi: belum ada snapshot naskah/`privacy_revision` yang diuji, matcher yang dieksekusi, payload AI yang diperiksa, atau paket ekspor yang dibuat. [Peta privasi](peta-privasi.md) adalah rancangan dan skenario uji lanjutan. Pengujian dasar satu nama pun belum dilakukan karena kontrolnya belum ada.

Dokumentasi resmi dibaca pada tanggal pemeriksaan: [Instalasi Next.js](https://nextjs.org/docs/app/getting-started/installation), [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started). Tidak ada pembelian, deployment, atau transaksi eksternal dalam verifikasi ini.
