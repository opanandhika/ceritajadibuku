# Onboarding dan migrasi prototipe lokal

Diperbarui 11 September 2026. Arahan pemilik menghapus buku contoh dari aplikasi. Dokumen induk dan salinan arahan arsitek tetap referensi historis; kisah Jepang dalam sumber tersebut bukan default produk.

## Perilaku runtime

Pengguna baru melihat “Buku pertamamu dimulai dari satu cerita.” dan satu tombol Buat buku. Buku baru tidak memiliki sumber atau naskah terisi. Judul boleh kosong (Buku tanpa judul) lalu diubah dari ringkasan buku. Nama pena kosong; tokoh diri memakai [Penulis] sampai dipilih pengguna. Pratinjau penyamaran tidak mengisi nama atau nama pena otomatis.

Semua buku memakai saran Awal sebuah mimpi, Pengalaman yang membekas, dan Seseorang yang penting, serta Tulis topik sendiri dan Langsung bercerita. Provider lokal deterministik memakai bahan yang diizinkan untuk pertanyaan katalog terbatas dan draf; belum menilai mutu AI nyata. Tema campuran/tidak dikenal memakai pertanyaan terbuka.

Buku, jumlah kata, dan bahan berasal dari pekerjaan pengguna. Saldo 150 adalah simulasi. Tidak ada Lihat contoh atau Pulihkan contoh awal. Reset mengosongkan ruang dan riwayat setelah pilihan pengguna; respons lama tidak menghidupkan pekerjaan kembali.

## Migrasi legacy v1 ke workspace v2

Key aktif adalah `ceritajadibuku:workspace:v2`; skema isi tetap `formatVersion: 1`. Key `ceritajadibuku:demo:v1` hanya namespace legacy/recovery dan tidak pernah ditimpa/dihapus oleh migrasi.

Jika key aktif belum ada, loader memanggil modul `src/demo/migrations/legacy-v1.ts`. Fingerprint SHA-256 canonical JSON **seluruh objek buku mentah**, termasuk metadata, tokoh, sumber, naskah, rich content, sesi, dan properti tambahan, dibandingkan dengan seed historis commit 5e367b7. Urutan key objek tidak berpengaruh; nilai dan urutan array berpengaruh. Runtime menyimpan digest pembanding, bukan teks/nama fixture sebagai seed baru.

Hanya buku yang masih persis identik dengan seed dikeluarkan. Buku yang diedit, berganti nama pena, berisi sesi, memiliki properti tambahan, atau kebetulan memiliki ID/nama sama tetap menjadi buku pengguna. Jika fingerprint tidak dapat dihitung, buku dipertahankan. Identifikasi dilakukan sebelum normalisasi dan pemulihan sesi.

Alias dibersihkan secara generik jika tokoh pending masih menampilkan placeholder dan aliasnya tidak tercatat sebagai nama yang pernah dikonfirmasi di knownNames. Pilihan alias terkonfirmasi dan nama pena tetap utuh. Revisi privasi naik sekali jika alias berubah; bahan/naskah tidak diganti. Saldo dan riwayat simulasi legacy direset karena aktivitas contoh lama tidak dapat dipisahkan andal. Sesi yang terputus dipulihkan menjadi tertahan dan tidak diproses ulang otomatis.

Snapshot aktif yang sudah ada selalu menang, termasuk ruang kosong setelah reset. Nilai aktif rusak, bahkan string kosong, tidak ditimpa dan tidak memicu migrasi. Legacy rusak tidak menghalangi ruang baru dan tetap dapat disalin mentah. Pemuatan asynchronous memeriksa lifecycle/generation sebelum menulis state.

Pada perangkat yang sudah mempunyai workspace:v2 dari versi sebelumnya, buku yang dahulu dikeluarkan tidak diimpor ulang otomatis. Pengguna tetap dapat mengambil tulisan melalui **Pengaturan demo → Salin tulisan dari prototipe sebelumnya**. Kolom lama yang belum didukung disertakan sebagai JSON mentah dalam salinan recovery. Ini salinan penyelamatan, bukan impor proyek atau cadangan terverifikasi.

## Bukti dan batas

Fixture sintetis lengkap hanya di `tests/fixtures/demo.ts`, dipasang secara eksplisit oleh tes regresi. Tes onboarding mulai tanpa fixture. Kasus mencakup ruang kosong, judul/nama pilihan, keluarga/karier/usaha, tiga slot, migrasi seed utuh, buku edited/ID sama, data rusak, dan reset saat provider terlambat. Jumlah serta hasil aktual ada di [laporan penutupan](penutupan-teknis-tahap-1.md).

Screenshot [desktop kosong](bukti-onboarding/kosong-1440.png), [HP](bukti-onboarding/kosong-390.png), [320 px](bukti-onboarding/kosong-320.png), dan [saran umum](bukti-onboarding/saran-umum.png) adalah bukti historis yang ditetapkan 10 September. Run tes normal tidak mengubahnya; pembaruan opt-in memakai UPDATE_E2E_EVIDENCE=1. Pilot manusia dan HP fisik tetap pending.
