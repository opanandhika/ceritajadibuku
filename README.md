# CeritaJadiBuku

Pendamping menulis pengalaman hidup menjadi buku. Tahap 0 selesai; **Tahap 1 teknis siap untuk pilot manusia; pilot_pending**. Tahap 1 belum selesai sepenuhnya; pilot kenyamanan manusia tetap `pilot_pending`. AI, kredit, dan pembayaran memakai simulasi. Ruang buku baru selalu kosong; tidak ada buku contoh di aplikasi.

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

Pengaturan demo menyediakan enam skenario provider, saldo nol/tambah contoh, gagal simpan, dan reset eksplisit. Saldo contoh mulai dari 150; tidak ada transaksi uang. Snapshot berada di `localStorage` dengan key `ceritajadibuku:workspace:v2`, pada browser yang sama, satu tab kerja. Migrasi mengeluarkan hanya seed historis yang seluruh isi dan metadatanya identik. Buku yang sudah diedit atau sekadar memiliki ID/nama sama tetap dipertahankan; saldo serta riwayat simulasi dimulai ulang. Tulisan dari prototipe lama tetap dapat disalin melalui Pengaturan demo. Saat gagal simpan, gunakan **Selamatkan tulisan** sebelum meninggalkan halaman. Salinan teks tersebut bukan cadangan proyek.

Gunakan data sintetis. Prototipe belum memiliki login, pemisahan pemetaan privat server, cloud, AI nyata, audio, ekspor Word, atau pembayaran Duitku. Snapshot lokal bukan penyimpanan produksi.

## Pemeriksaan

```powershell
npm.cmd ci
npx.cmd playwright install chromium
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:unit
npm.cmd run test:e2e
npm.cmd run build
npm.cmd run check:discovery
```

Default tes memakai Chromium yang dikelola Playwright. Pada Linux CI, pasang lewat `npx playwright install --with-deps chromium`. Kegagalan unduh/pemasangan browser adalah kegagalan prasyarat lingkungan, bukan bukti kegagalan logika aplikasi. Untuk Chrome sistem yang sudah terpasang, PowerShell: `$env:PLAYWRIGHT_CHANNEL = "chrome"; npm.cmd run test:e2e`; setelah itu `Remove-Item Env:PLAYWRIGHT_CHANNEL`. Linux/macOS: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`.

Playwright memulai server miliknya sendiri di `http://127.0.0.1:3100`; pastikan port tersebut kosong. Server yang sudah berjalan tidak dipakai ulang. Semua tes memblokir dan melaporkan upaya request HTTP/WebSocket keluar origin lokal. Server manual tetap memakai port 3000.

Laporan HTML, screenshot gagal, dan trace berada di `playwright-report/` serta `test-results/`, keduanya diabaikan Git. Run biasa tidak menulis ke `docs/bukti-*`. Bukti dokumentasi yang sudah ada adalah rekaman historis sintetis; pembaruan disengaja memakai `UPDATE_E2E_EVIDENCE=1` dan harus ditinjau sebelum dimasukkan ke commit. Fixture buku hanya di `tests/fixtures`, dimuat secara eksplisit oleh tes.

`npm run typecheck` menjalankan `next typegen` sebelum TypeScript. `next-env.d.ts` dan `.next` dihasilkan otomatis dan diabaikan Git. Workflow [CI Tahap 1](.github/workflows/stage-1.yml) menjalankan seluruh gerbang dengan Node dari `.node-version`, mock/development, izin `contents: read`, tanpa secret dan tanpa deployment. Workflow baru ini belum dijalankan di GitHub; pekerjaan ini tidak melakukan push. Pemeriksaan discovery hanya memeriksa artefak dan konfigurasi, bukan pengganti tes aplikasi.

## Dokumentasi kerja

- [Laporan penutupan teknis dan hasil gerbang terbaru](docs/penutupan-teknis-tahap-1.md)
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
