# CeritaJadiBuku

Pendamping menulis pengalaman hidup menjadi buku. Tahap 0 selesai; **prototipe lokal Tahap 1 sudah diimplementasikan**. Pilot kenyamanan manusia masih menunggu pelaksanaan. AI, kredit, dan pembayaran memakai simulasi. Ruang buku baru selalu kosong; tidak ada buku contoh di aplikasi.

## Menjalankan

Gunakan Node.js 24 (baseline 24.20.0) dan npm 11.19.0. Dari folder proyek:

```powershell
npm.cmd ci
npm.cmd run dev
```

Buka [prototipe lokal](http://127.0.0.1:3000). Jika port sudah dipakai, ikuti URL yang dicetak Next.js. Tidak perlu mengisi rahasia atau menyalin berkas environment. Dependensi dikunci di `package-lock.json`.

Untuk build optimal yang tetap dijalankan lokal, hentikan dev lalu jalankan `npm.cmd run build` dan `npm.cmd run start`. Validator server hanya menerima `APP_ENV=development`; staging/production dan adapter nyata ditolak. `NODE_ENV=production` pada build tidak mengubah identitas lingkungan aplikasi.

## Mencoba alur

Pilih **Buat buku** dari ruang kosong → isi judul atau biarkan **Buku tanpa judul** → Tambahkan cerita → pilih saran umum, Tulis topik sendiri, atau Langsung bercerita → kirim jawaban → tinjau draf → Gunakan di naskah. Judul dapat diubah melalui **Ubah judul**. Nama pena dan nama tokoh ditentukan pengguna. Bahan asal, usulan, dan naskah diterima terpisah. Menu Tokoh & privasi menyediakan tokoh diri, nama pena, penanda pending, dan pratinjau penyamaran. Tinjau privasi buku membuka ekspor contoh tanpa membuat Word.

Pengaturan demo menyediakan enam skenario provider, saldo nol/tambah contoh, gagal simpan, dan reset eksplisit. Saldo contoh mulai dari 150; tidak ada transaksi uang. Snapshot berada di `localStorage` dengan key `ceritajadibuku:workspace:v2`, pada browser yang sama, satu tab kerja. Pembaruan menghapus buku bawaan lama dari daftar dan mempertahankan buku lain; saldo serta riwayat simulasi dimulai ulang. Tulisan dari prototipe lama tetap dapat disalin melalui Pengaturan demo. Saat gagal simpan, gunakan **Selamatkan tulisan** sebelum meninggalkan halaman. Salinan teks tersebut bukan cadangan proyek.

Gunakan data sintetis. Prototipe belum memiliki login, pemisahan pemetaan privat server, cloud, AI nyata, audio, ekspor Word, atau pembayaran Duitku. Snapshot lokal bukan penyimpanan produksi.

## Pemeriksaan

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:unit
npm.cmd run test:e2e
npm.cmd run build
npm.cmd run check:discovery
```

Tes browser memakai Google Chrome yang terpasang. Playwright dapat memulai server lokal sendiri pada port 3000. Laporan HTML ada di `playwright-report`; bukti onboarding baru ada di `docs/bukti-onboarding`. Data buku sintetis hanya dimuat secara eksplisit oleh tes di `tests/fixtures`; screenshot regresi fixture ada di `docs/bukti-tahap-1`. Pemeriksaan discovery hanya memeriksa artefak dan konfigurasi, bukan pengganti tes aplikasi.

## Dokumentasi kerja

- [Penyesuaian onboarding dan penghapusan buku contoh](docs/penyesuaian-onboarding.md)
- [Laporan Tahap 1, bukti dan batas pengujian](docs/laporan-tahap-1.md)
- [Panduan pilot manusia — belum dilakukan](docs/panduan-pilot-tahap-1.md)
- [Discovery awal](docs/discovery.md)
- [Keputusan teknis](docs/keputusan-teknis.md)
- [Progres Tahap 0–12](docs/progres-implementasi.md)
- [Hasil verifikasi](docs/hasil-verifikasi.md)
- [Peta privasi](docs/peta-privasi.md)
- [Panduan operasional](docs/panduan-operasional.md)
- [Contoh konfigurasi tanpa rahasia](.env.example)

## Acuan produk

Nama berkas dari pemilik dipertahankan. Rujukan nama sederhana di dalam spesifikasi dipadankan sebagai berikut:

| Rujukan | Berkas yang digunakan | Versi |
| --- | --- | --- |
| `blueprint.md` | [blueprint(3).md](blueprint%283%29.md) | 1.4 |
| `langkah-implementasi.md` | [langkah-implementasi(1).md](langkah-implementasi%281%29.md) | 1.3 |
| `ui-ux-spec.md` | [ui-ux-spec (1).md](ui-ux-spec%20%281%29.md) | 1.0 |
| Kajian pendamping | [kajian-harga-dan-penulisan.md](kajian-harga-dan-penulisan.md) | 1.1 |

Keputusan terbaru pemilik mengungguli blueprint; blueprint menentukan perilaku produk. Panduan menentukan urutan teknis Tahap 0–12. UI menerjemahkan perilaku tersebut ke antarmuka, sedangkan kajian menyimpan alasan dan asumsi biaya.


Arahan arsitek Tahap 1 disimpan sebagai [salinan referensi](docs/referensi/arahan-arsitek-tahap-1.md). Empat dokumen awal tetap utuh. Repositori proyek: [opanandhika/ceritajadibuku](https://github.com/opanandhika/ceritajadibuku), cabang `main`. Tidak ada deployment atau pembelian layanan.
