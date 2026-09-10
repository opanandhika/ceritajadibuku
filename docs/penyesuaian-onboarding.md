# Penyesuaian onboarding — 10 September 2026

Arahan terbaru pemilik: **hapus buku contoh dari aplikasi**. Keputusan ini memperbarui arahan arsitek Tahap 1 yang sebelumnya memakai cerita Jepang untuk prototipe. Dokumen sumber dipertahankan sebagai referensi; perilaku implementasi terbaru mengikuti keputusan ini.

## Perilaku aplikasi

- Pengguna baru melihat “Buku pertamamu dimulai dari satu cerita.” dan satu tombol Buat buku. Tidak ada buku bawaan, tombol Lihat contoh, atau pemulihan buku contoh.
- Pembuatan buku tanpa judul memakai Buku tanpa judul. Ubah judul tersedia dari ringkasan buku. Nama pena kosong; tokoh diri memakai [Penulis] sampai pengguna memilih nama. Pratinjau penyamaran tidak mengisi nama atau nama pena otomatis.
- Semua buku memakai saran Awal sebuah mimpi, Pengalaman yang membekas, dan Seseorang yang penting, serta Tulis topik sendiri dan Langsung bercerita.
- Provider tetap simulasi lokal. Pertanyaan lanjutan memakai katalog terbatas berdasarkan penyebutan tema eksplisit dalam bahan yang diizinkan. Tema lain atau campuran memakai pertanyaan terbuka. Draf merangkai bahan kiriman tanpa menambahkan kisah Jepang; ini belum menguji mutu AI nyata.
- Buku, sumber, jumlah kata, dan riwayat hanya berasal dari pekerjaan pengguna. Saldo awal 150 tetap saldo simulasi. Reset mengosongkan ruang dan riwayat; respons lama tidak dapat menghidupkan pekerjaan yang sudah direset.

## Pembaruan penyimpanan lama

Snapshot baru berada pada `ceritajadibuku:workspace:v2`; skema isi tetap `formatVersion: 1`. Namespace berubah untuk membedakan ruang pengguna dari prototipe yang dulu diisi otomatis.

Saat namespace baru belum ada, data valid pada `ceritajadibuku:demo:v1` dibaca sekali: buku bawaan ber-ID `jepang` dikeluarkan, buku lain dipertahankan, dan ID buku aktif disesuaikan. Alias bawaan Nara dibersihkan hanya bila masih pending, sama dengan placeholder, dan belum pernah dikonfirmasi. Pilihan nama yang sudah dikonfirmasi tetap utuh. Saldo dan riwayat simulasi dimulai ulang karena aktivitas contoh lama tidak dapat dipisahkan secara andal.

Snapshot lama tidak ditimpa, sehingga tambahan tulisan pengguna di buku bawaan tetap dapat disalin melalui Pengaturan demo → Salin tulisan dari prototipe sebelumnya. Salinan ini bukan proyek aktif dan tidak dihitung sebagai buku, penggunaan kredit, atau statistik. Data lama rusak tetap bisa disalin sebagai teks mentah; tidak menghalangi pembuatan ruang baru. Snapshot baru yang rusak tidak ditimpa otomatis.

## Pengujian dan bukti

Fixture Jepang berada hanya di `tests/fixtures/demo.ts`. Tes regresi lama memasukkannya secara eksplisit untuk menguji konflik naskah, nama ambigu, dan privasi. Aplikasi tidak mengimpor fixture atau menyediakan jalur untuk membukanya.

Tes onboarding terpisah mulai tanpa fixture. Cakupannya: ruang kosong, judul menyusul, nama pilihan pengguna, tiga tema cerita, tiga slot buku, migrasi data lama, data rusak, dan reset saat respons terlambat. Bukti awal baru tersedia di [desktop](bukti-onboarding/kosong-1440.png), [HP](bukti-onboarding/kosong-390.png), [layar 320 px](bukti-onboarding/kosong-320.png), dan [saran umum](bukti-onboarding/saran-umum.png).

Hasil pengujian lokal:

| Pemeriksaan | Hasil |
| --- | --- |
| Unit | 52 tes, 5 berkas, lulus (kode keluar 0) |
| Browser | 21 skenario lulus pada run lengkap; 1 tes onboarding gagal menemukan select dengan selector label persis. Selector diganti ke role combobox, lalu tes tersebut lulus pada run ulang (kode keluar 0). Seluruh 22 skenario tercakup dan lulus. |
| TypeScript dan lint | Lulus (kode keluar 0) |
| Discovery | Lulus; tautan dokumentasi dan artefak lokal diperiksa |
| Visual | Ruang kosong 320/390/1440 px dan saran umum diperiksa dari screenshot |

Build optimal lokal Next.js lulus (kode keluar 0), termasuk pemeriksaan TypeScript dan prerender. Nama buku Jepang dan nama pena fixture tidak ditemukan pada JavaScript hasil build di `.next/static`. Pilot kenyamanan manusia dan uji HP fisik masih belum dilakukan.
