# Laporan implementasi Tahap 1

10 September 2026 · CeritaJadiBuku · prototipe development lokal.

Implementasi teknis mengikuti arahan arsitek yang disetujui pemilik, blueprint 1.4, panduan implementasi 1.3, UI/UX 1.0, dan kajian 1.1. **Pilot kenyamanan manusia belum dilakukan.** Status ini tidak menyatakan aplikasi produksi atau seluruh gerbang Tahap 1 selesai.

## Pembaruan onboarding

Arahan pemilik 10 September 2026 menghapus buku contoh dari aplikasi dan mewajibkan ruang baru kosong. Perilaku serta bukti terbaru tercatat di [penyesuaian onboarding](penyesuaian-onboarding.md). Uraian dan jumlah tes di bawah adalah baseline implementasi awal; fixture Jepang kini hanya dipakai tes secara eksplisit.

## Hasil baseline awal

- Buku saya, pembuatan sampai tiga buku, ringkasan, tiga pilihan momen, topik sendiri, cerita bebas, dan refleksi opsional.
- Sesi dengan satu pertanyaan aktif, paling banyak empat pertanyaan, pertanyaan keempat menunggu tindakan, dua Lewati berhenti, serta satu pertanyaan refleksi.
- Draf otomatis ketika bahan cukup; cerita bebas cukup memakai 4 kredit contoh. Penggalian memakai 1 kredit sekali dan draf 4 kredit; plafon sesi teks 5. Jawaban, usulan, dan naskah diterima memiliki tempat penyimpanan yang berbeda.
- Tiptap untuk naskah manual, paragraf/judul/tebal/miring/daftar/kutipan, mode baca, penambahan bagian, serta penerapan usulan setelah tindakan eksplisit. Versi lama tidak menimpa revisi manual; usulan bisa disimpan di bagian terpisah.
- Tokoh diri Nara, nama pena Citra Senja, kartu pending, samaran/sebutan/nama asli pilihan pengguna, pratinjau penyamaran semua tokoh termasuk diri, dan pemeriksaan teks ekspor contoh. Pratinjau ekspor tidak membuat Word.
- Salinan lokal berversi dengan ID buku/sesi. Refresh memulihkan buffer, pertanyaan, jawaban, biaya, dan usulan. Pekerjaan yang terputus menunggu tindakan lanjut; tidak otomatis memanggil provider ulang.
- Kontrol demo: normal, cukup, singkat, pertanyaan bertumpuk, gagal, terlambat; saldo nol/tambah contoh; kegagalan simpan; reset eksplisit. Semua UI diberi label prototipe dan data contoh.

## Struktur dan batas tanggung jawab

| Lokasi | Tanggung jawab |
| --- | --- |
| `src/domain/session.ts` | Transisi murni, versi sesi, ID operasi, batas pertanyaan, biaya contoh |
| `src/domain/privacy.ts` | Pemilihan sumber, penanda identitas, nama ambigu, proyeksi dan review teks |
| `src/domain/manuscript.ts` | Pemeriksaan versi tujuan dan kebijakan sebelum menerapkan usulan |
| `src/domain/model.ts` | Skema snapshot Zod dan bentuk data |
| `src/demo/provider.ts` | Adapter deterministik tanpa HTTP/AI nyata |
| `src/demo/storage.ts` | Pembacaan tervalidasi, pemulihan, penyimpanan dan salinan penyelamatan |
| `src/demo/use-demo.ts` | Orkestrasi React, penyimpanan lokal, deduplikasi pekerjaan |
| `src/components/` | Alur UI dan editor |
| `src/lib/environment.ts`, `next.config.ts` | Validator startup, development saja |

Snapshot memakai key `ceritajadibuku:demo:v1`. `localStorage` menyimpan data contoh dan pemetaan sintetis pada browser yang sama. Ini bukan pemisahan data privat dengan autentikasi. Jangan memasukkan data sensitif nyata. Browser/tab lain tidak memiliki sinkronisasi atau arbitrasi konflik; gunakan satu tab untuk demo.

Penggantian nama memakai satu lintasan dan nama terpanjang didahulukan. Nama lama tetap diketahui sesudah pilihan diganti. Dua tokoh berpanggilan Budi menjadi fixture ambiguitas: pekerjaan yang memuat Budi ditahan tanpa biaya sampai bahan memakai penanda yang unik, misalnya `[Tetangga]`. Aplikasi tidak memilih kartu pertama. Bahan waktu perkiraan tidak dipastikan menjadi tanggal faktual.

`no-AI` tetap boleh disalin pengguna ke naskah manual. `no-book` menahan pemakaian di buku dan pratinjau ekspor. Demo mengecualikan keduanya dari generasi; izin konteks terpisah belum dibuat. Review hanya mengenali nama terdaftar, teks, judul, nama pena, dan relasi sumber; belum dapat membuktikan anonimitas, memeriksa foto, metadata Word, atau pemetaan privat produksi.

Biaya merupakan simulasi pada snapshot browser. Belum ada reserve/capture/release, ledger transaksional, langganan aktif, grant tester server, maupun pembelian. Penambahan saldo contoh tidak memulai ulang pekerjaan tertahan.

## Pemeriksaan nyata

Pemeriksaan dijalankan pada Node 24.20.0, npm 11.19.0, Windows, dan Google Chrome terpasang. Bukti dari eksekusi yang gagal juga dipakai memperbaiki implementasi: pembaruan berulang Tiptap diperbaiki dengan perubahan mode tanpa memancarkan perubahan konten; review kode memperbaiki nama lama, judul buku, keluaran provider terlarang, nama ambigu, dan pemeliharaan format.

| Pemeriksaan | Hasil akhir |
| --- | --- |
| HTTP `http://127.0.0.1:3000` | 200, halaman lokal dapat dibuka |
| `npm.cmd run test:unit` | Lulus: 42 tes, 4 berkas, kode keluar 0 |
| `npm.cmd run typecheck` | Lulus, kode keluar 0 |
| `npm.cmd run lint` | Lulus, kode keluar 0 |
| `npm.cmd run build` | Lulus: build optimal Next.js, pemeriksaan TypeScript dan prerender, kode keluar 0 |
| `npm.cmd run test:e2e` | Lulus akhir: 14 skenario, 3,2 menit, kode keluar 0; screenshot diperbarui dan ditinjau |
| `npm.cmd run check:discovery` | Lulus: artefak, 44 tautan lokal, dan template tanpa rahasia; kode keluar 0 |
| Integritas empat dokumen sumber | Lulus: 4/4 hash SHA-256 sesuai baseline Tahap 0; salinan arahan arsitek identik |

## Pemetaan penerimaan

| ID | Bukti implementasi/pengujian |
| --- | --- |
| T1-01 | Startup Next.js, navigasi buku/sesi/editor, HTTP lokal |
| T1-02 | Cerita cukup → draf, 4 kredit untuk cerita bebas; tanpa pertanyaan otomatis setelah draf |
| T1-03 | Pertanyaan keempat tetap menunggu; jumlah pertanyaan maksimal empat |
| T1-04 | Dua skip kosong berhenti tanpa biaya; satu jawaban lalu dua skip mempertahankan jawaban dan buffer |
| T1-05 | Respons bertumpuk ditolak dan diganti pertanyaan katalog satu fokus |
| T1-06 | Respons melewati jeda tidak menghidupkan sesi atau menagih |
| T1-07 | Refresh pertanyaan kedua memulihkan fokus, buffer, jawaban dan 1 kredit yang sudah terpakai |
| T1-08 | Sumber dan usulan tetap terpisah; naskah belum berubah sebelum penerapan |
| T1-09 | Konflik versi menahan overwrite; simpan usulan terpisah mempertahankan bagian asli |
| T1-10 | Tokoh diri/pending, pratinjau massal, nama pena terpisah; review nama lama dan judul |
| T1-11 | no-AI tidak dikirim; manual masih boleh; no-book menahan ekspor contoh; nama ambigu ditahan |
| T1-12 | 4/5/0 kredit, editor saat saldo nol, top-up contoh tidak melanjutkan otomatis |
| T1-13 | Penyimpanan gagal menunjukkan status gagal dan salinan penyelamatan; tidak mengaku berhasil |
| T1-14 | Screenshot laptop/HP, overflow viewport, keyboard dan mode baca; batas emulasi tercatat |
| T1-15 | Build, typecheck, lint, unit dan browser test dalam tabel hasil akhir |
| T1-16 | Klik ganda kirim dan aksi/respons berversi yang sama tidak menggandakan jawaban/biaya |

Pemetaan ini menunjuk cakupan tes; keputusan lulus mengikuti hasil eksekusi di atas. Jaminan transaksi lintas proses bukan cakupan prototipe. Kontras teks warna inti terhadap latar diuji minimal 4,5:1; ini bukan audit WCAG menyeluruh. Viewport 320, 360, 390, 768, 1024 dan 1440 px diperiksa tanpa overflow horizontal pada alur yang diuji.

## Bukti visual

| Alur | Laptop 1440 × 900 | HP 390 × 844 |
| --- | --- | --- |
| Buku saya | [Buku laptop](bukti-tahap-1/01-buku-desktop.png) | [Buku HP](bukti-tahap-1/04-buku-hp.png) |
| Sesi cerita | [Sesi laptop](bukti-tahap-1/02-sesi-desktop.png) | [Sesi HP](bukti-tahap-1/05-sesi-hp.png) |
| Editor | [Editor laptop](bukti-tahap-1/03-editor-desktop.png) | [Editor HP](bukti-tahap-1/06-editor-hp.png) |

Tangkapan utama memakai `fullPage`, sehingga tinggi berkas dapat melebihi viewport; dialog privasi memakai viewport. Animasi dinonaktifkan saat pengambilan agar transisi ukuran layar tidak tertangkap di tengah gerakan. Tambahan: [pratinjau privasi](bukti-tahap-1/07-privasi-preview.png), [provider gagal](bukti-tahap-1/08-respons-gagal.png), [buku kosong](bukti-tahap-1/09-buku-kosong.png), serta [proses berjalan](bukti-tahap-1/10-proses-berjalan.png).

Pemasangan npm berhasil dengan 0 kerentanan pada saat instalasi. Tes yang memerlukan child process dijalankan setelah sandbox awal menolak spawn dengan EPERM. Build menampilkan peringatan bahwa lockfile di folder induk pengguna diabaikan karena di luar repository; lockfile proyek tetap dipakai dan build berhasil. Berkas induk tersebut tidak diubah.

## Batas yang masih terbuka

- Pilot manusia: belum ada peserta; [panduan pilot](panduan-pilot-tahap-1.md) siap digunakan.
- Pengujian memakai Chrome desktop dan ukuran viewport; keyboard virtual, lifecycle HP fisik, lintas browser, pembaca layar, dan zoom perangkat belum dibuktikan.
- Auth, database, RLS, pemetaan privat server, job persisten, AI nyata/transkripsi, audio, sinkronisasi cloud, Word, backup proyek, pembayaran Duitku, email dan retensi tetap tahap berikutnya.
- Belum ada hasil yang dikirim ke layanan eksternal atau deploy produksi. Mutu tulisan mock adalah susunan bahan verbatim dan tidak mewakili mutu AI nyata.

Tahap 2 dimulai setelah hasil teknis ditinjau dan gerbang kenyamanan diselesaikan atau keputusan pemilik terhadap hasil pilot dicatat.
