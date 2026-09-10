# Progres implementasi

Diperbarui: 10 September 2026. Acuan urutan: panduan implementasi 1.3 Bagian 4–5. Tahap 0 selesai. Prototipe teknis Tahap 1 diimplementasikan setelah arahan arsitek disetujui; pilot manusia belum dilakukan.

`teruji_lokal` pada Tahap 0 hanya berarti pemeriksaan discovery dan artefak lokal telah dijalankan. Tidak berarti aplikasi, RLS, AI, pembayaran, atau perlindungan identitas telah teruji.

## Status per tahap

| Tahap | Fokus | Prasyarat | Status | Bukti atau keluaran yang masih diperlukan |
| --- | --- | --- | --- | --- |
| 0 | Discovery | Blueprint, workspace | `teruji_lokal` | Inventaris, Git lokal, keputusan, peta privasi, lingkungan, dan pemeriksaan artefak; lihat hasil verifikasi |
| 1 | Fondasi aplikasi dan prototipe | 0 | `teruji_lokal; pilot_pending` | [Laporan teknis dan bukti](laporan-tahap-1.md); 52 unit + 22 skenario browser lulus; [onboarding kosong tanpa buku contoh](penyesuaian-onboarding.md); pilot kenyamanan belum dilakukan |
| 2 | Identitas, data, dan privasi | 1 | `belum_dikerjakan` | Auth, migrasi, RLS, sumber berversi, kartu/pemetaan privat, context dry run, email Auth |
| 3 | Sesi persisten dan refleksi | 2 | `belum_dikerjakan` | Transisi atomik, jeda/resume, batas sesi, tagihan tahap, pengaturan tokoh eksplisit |
| 4 | Editor dan struktur buku | 2, 3 | `belum_dikerjakan` | Tiptap, revisi/usulan, susun potongan, konflik, konsistensi penyebutan |
| 5 | Hak langganan dan ledger | 2 | `belum_dikerjakan` | Hak/kuota, lot, reserve/capture/release/expiry, waktu, tes transaksi bersamaan |
| 6 | Antrean dan AI teks | 3, 4, 5 | `belum_dikerjakan` | Job tahan gangguan, fencing, anggaran, proyeksi konteks, adapter teks, bukti payload/biaya |
| 7 | Rekaman dan transkripsi | 5, 6 | `belum_dikerjakan` | Rekam/direct upload, validasi server, interval parsial, ledger durasi, perangkat |
| 8 | Sinkronisasi, ekspor, cadangan | 4, 6, 7 | `belum_dikerjakan` | Konflik dua perangkat, review snapshot, Word bersih, backup/impor, restore layanan |
| 9 | Pembayaran Duitku | 5, mekanisme job 6 | `belum_dikerjakan` | Merchant sandbox, invoice, callback/verifikasi, grant tunggal, rekonsiliasi, email |
| 10 | Retensi dan operasi | 8, 9 | `belum_dikerjakan` | Deadline/pengingat, purge lengkap, jurnal, dukungan, alarm, backup harian |
| 11 | Uji terpadu dan pengguna | 6–10 | `belum_dikerjakan` | Bukti lintas fitur, perangkat nyata, pilot beberapa hari, biaya aktual |
| 12 | Penyiapan rilis | 11 | `belum_dikerjakan` | Paket build/config/migrasi, bukti staging, gerbang komersial, tinjauan pemilik |

## Penerimaan Tahap 0

| ID | Kriteria | Hasil | Bukti |
| --- | --- | --- | --- |
| T0-01 | Acuan dan instruksi berlaku dipahami | Selesai | Pemetaan versi/nama di README; inventaris AGENTS di discovery |
| T0-02 | Kondisi Git dan perubahan pemilik diketahui | Selesai | Semula empat dokumen dan tanpa Git; `git init` lokal; hash dokumen tetap |
| T0-03 | Stack, lockfile, skrip, runner, migrasi, hosting diketahui | Selesai | Tabel kondisi awal dan toolchain; yang belum ada ditandai eksplisit |
| T0-04 | Keberadaan konfigurasi provider diinventarisasi tanpa nilai | Selesai | Tidak ditemukan pada workspace/environment proses; template kosong tersedia |
| T0-05 | Development, staging, production dibedakan | Selesai | Matriks lingkungan; tidak ada koneksi/migrasi remote |
| T0-06 | Keputusan dan struktur implementasi konkret | Selesai | Keputusan teknis 001–009 dan rancangan direktori bertahap |
| T0-07 | Tahap 0–12, dependensi, status, hambatan tercatat | Selesai | Tabel tahap di dokumen ini |
| T0-08 | Peta tokoh/privasi dan migrasi lama dicatat | Selesai | Peta privasi mencakup data, akses privat, seluruh permukaan, dan impor pending |
| T0-09 | Perintah menjalankan dan batasnya jelas | Selesai | Skrip discovery tersedia; server aplikasi belum ada dan dialokasikan ke Tahap 1 |
| T0-10 | Hasil pemeriksaan dapat ditinjau | Selesai | [Hasil verifikasi](hasil-verifikasi.md), perintah dan keterbatasan aktual |

## Status privasi pada akhir discovery Tahap 0

Tabel berikut adalah baseline historis. Cakupan kontrol simulasi Tahap 1 ada di [laporan](laporan-tahap-1.md); kontrol produksi tetap belum dibangun.

| Area | Discovery/rancangan | Implementasi | Bukti perilaku |
| --- | --- | --- | --- |
| Akun vs nama pena vs tokoh diri | Dipetakan | Belum | Belum |
| Kartu tokoh vs pemetaan privat dan field tersebar | Dipetakan | Belum | Belum |
| Kepemilikan, RLS, bucket privat | Dipetakan | Belum | Belum |
| No-AI/no-book, lineage, penyamaran sebelum provider | Dipetakan | Belum | Belum |
| Invalidasi `privacy_revision` pada job/cache/review | Dipetakan | Belum | Belum |
| Audio/transkrip dan penjelasan pemrosesan | Dipetakan | Belum | Belum |
| Snapshot ekspor, metadata Word, tinjauan foto | Dipetakan | Belum | Belum |
| Cadangan tanpa pemetaan dan pemulihan | Dipetakan | Belum | Belum |
| Purge data identitas dan replay jurnal penghapusan | Dipetakan | Belum | Belum |

## Langkah berikutnya

Tinjau [laporan Tahap 1](laporan-tahap-1.md) dan lakukan [pilot manusia](panduan-pilot-tahap-1.md). Implementasi teknis lokal tidak menggantikan gerbang kenyamanan. Auth, database, RLS dan pemetaan privat server tetap Tahap 2; AI, pembayaran dan layanan produksi mengikuti dependensi tahap berikut.
