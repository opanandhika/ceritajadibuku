# Arahan Arsitek — Tahap 1 CeritaJadiBuku

| Metadata | Nilai |
| --- | --- |
| Versi arahan | 1.0 |
| Tanggal | 10 September 2026 |
| Pemilik produk | Novan Andhika |
| Pelaksana | Codex pada repositori lokal milik pengguna |
| Lokasi yang dilaporkan | C:/Users/user/Documents/CeritaJadiBuku |
| Tahap | 1 — Fondasi aplikasi dan prototipe sesi |
| Acuan | Blueprint v1.4; langkah implementasi v1.3; UI/UX v1.0; kajian harga dan penulisan v1.1 |

## 1. Status dan keputusan arsitek

Pemilik menyampaikan laporan Codex bahwa Tahap 0 selesai dan terverifikasi lokal: empat dokumen dipelajari, Git lokal serta discovery/keputusan/progres disiapkan, contoh konfigurasi tersedia, dan pemeriksaan 15 berkas serta 22 tautan lulus. Status ini berdasarkan laporan pelaksana; arsitek pada percakapan ini belum mengakses repositori Windows, membaca README hasil discovery, atau menjalankan pemeriksaannya secara langsung.

Pemeriksaan berkas dan tautan menjadi bukti kesiapan dokumentasi. Keberhasilan alur aplikasi perlu dibuktikan melalui implementasi dan pengujian Tahap 1. Pekerjaan Tahap 0 tidak perlu diulang kecuali ditemukan ketidakcocokan nyata pada dokumen, struktur proyek, atau keputusan teknis.

**Keputusan: lanjutkan pembangunan Tahap 1 dengan provider simulasi dan data sintetis. Gunakan arah visual A — Ruang menulis hangat pada ui-ux-spec.md.** Stitch atau Claude Design dapat menjadi referensi bila tersedia, tetapi bukan prasyarat tahap ini.

Ikuti instruksi pengguna terbaru serta instruksi lingkungan dan repositori yang berlaku. Gunakan hasil discovery yang sudah ada. Keputusan implementasi rutin dapat diambil pelaksana dan dicatat tanpa meminta persetujuan pada setiap langkah. Empat dokumen induk tidak diubah diam-diam untuk menyesuaikan implementasi yang menyimpang.

## 2. Hasil yang harus bisa dicoba

Pengguna dapat membuka buku contoh, memilih atau menulis momen, menjalani sesi satu pertanyaan per giliran, melewati pertanyaan atau menjeda, memperoleh draf simulasi, meninjaunya, lalu memasukkannya ke bagian naskah.

Pengguna juga dapat mencoba kartu tokoh sintetis, membedakan identitas akun/nama tokoh diri/nama pena sampul, serta melihat pratinjau penyamaran seluruh tokoh termasuk dirinya. Biaya, hasil provider, dan status simpan harus sesuai kemampuan prototipe serta berlabel simulasi bila belum nyata.

Hasil tahap ini adalah prototipe aplikasi yang berjalan pada tampilan HP dan laptop. Scaffold, halaman kosong, atau mockup statis saja belum memenuhi hasil tersebut.

## 3. Cakupan Tahap 1

| Bagian | Hasil minimum |
| --- | --- |
| Fondasi proyek | Next.js dan TypeScript atau fondasi kompatibel hasil discovery; dependensi dikunci pada lockfile |
| Sistem visual | Token warna, tipografi, jarak, tombol, input, fokus, dan keadaan komponen bersama |
| Buku saya | Buku contoh, keadaan kosong, dan tindakan melanjutkan pekerjaan |
| Ruang proyek | Ringkasan buku dan akses ke cerita, naskah, tokoh, serta kredit |
| Mulai cerita | Tiga saran, Tulis topik sendiri, dan Langsung bercerita |
| Sesi cerita | Satu pertanyaan aktif, Kirim jawaban, Lewati, Buat draf sekarang, Simpan dan jeda |
| Draf dan editor | Usulan simulasi, bahan asal, edit manual dasar, dan penerapan eksplisit ke naskah |
| Tokoh dan Privasi Buku | Mode identitas, kartu bertahap, Atur nanti, tokoh diri, nama pena, pratinjau penyamaran massal |
| Tinjau Privasi Buku | Prototipe pemeriksaan nama sintetis yang diketahui dan perbaikan sebelum ekspor contoh |
| Kredit dan langganan | Informasi paket/saldo/biaya contoh serta keadaan saldo tidak cukup, tanpa transaksi nyata |
| Provider simulasi | Skenario bahan cukup, singkat, pertanyaan bertumpuk, gagal, dan respons terlambat |
| Verifikasi | Tes logika sesi, perjalanan UI, bukti visual, serta keterbatasan |
| Pilot kenyamanan | Skenario tugas dan hasil percobaan manusia jika peserta tersedia |

Tiga layar yang paling dipoles adalah beranda/ringkasan buku, ruang bercerita, dan editor/peninjauan draf. Layar pendukung tetap memiliki kerangka yang dapat dinavigasi serta interaksi prototipe yang diwajibkan.

Autentikasi produksi, database privat/RLS, ledger nyata, antrean provider, rekaman/transkripsi nyata, sinkronisasi cloud, berkas ekspor nyata, Duitku, dan penghapusan operasional mengikuti tahap masing-masing. UI boleh memperlihatkan contoh keadaan, tetapi tidak menyatakan integrasi tersebut sudah aktif. Landing page pemasaran lengkap dan fitur di luar blueprint bukan target tahap ini.

## 4. Batas arsitektur sejak awal

### 4.1 Mesin status sesi terpisah dari UI

Mesin status berada pada modul yang tidak bergantung pada React atau komponen tampilan. Modul menerima keadaan dan aksi yang sah, kemudian menghasilkan keadaan berikutnya serta pekerjaan yang diizinkan. Nama berkas/fungsi mengikuti struktur proyek yang ditemukan.

| Tanggung jawab | Penempatan konseptual |
| --- | --- |
| Aturan pertanyaan, skip, jeda, dan batas sesi | Logika domain yang dapat diuji tanpa UI |
| Provider dan respons terlambat | Orkestrasi serta adapter |
| Layout, dialog, label, dan fokus | Presentasi |
| Penyimpanan/rehidrasi snapshot prototipe | Adapter demo terpisah |
| Nilai paket, tarif tampilan, dan batas produk | Konfigurasi bersama berversi; keputusan tagihan produksi nantinya tetap berasal dari server |

Jangan menyebarkan hitungan pertanyaan ke beberapa komponen atau memakai efek render untuk membuat sesi/panggilan baru. Mesin ini nantinya digunakan pada jalur server yang berwenang, disertai validasi hak dan transaksi pada tahap berikutnya. Jangan membuat aturan frontend dan backend yang berbeda.

### 4.2 Provider simulasi yang menguji kegagalan

Gunakan antarmuka provider yang dapat diganti. Respons simulasi dibuat deterministik agar pengujian dapat diulang. Pemilihan skenario pengembang hanya tersedia pada mode demo/development; jangan menyediakan jalur untuk mengubah hasil atau saldo melalui parameter pengguna produksi.

Simulasikan minimal:

1. Bahan cukup: langsung menuju draf tanpa pertanyaan yang tidak diperlukan.
2. Bahan singkat: satu pertanyaan relevan berikutnya.
3. Pertanyaan bertumpuk: ditolak atau diperbaiki sebelum tampil.
4. Respons gagal: jawaban dipertahankan dan tersedia pemulihan.
5. Respons terlambat sesudah jeda: tidak menghidupkan sesi atau memulai pekerjaan berikutnya.

Respons salah tidak ditampilkan sengaja kepada pengguna hanya untuk membuktikan fixture berjalan. Yang diuji adalah kemampuan aplikasi menahannya. Identitas operasi dan versi sesi harus mencegah respons lama memengaruhi sesi yang sudah berubah.

### 4.3 Penyimpanan prototipe yang jujur

Jeda dan lanjutkan mempertahankan fokus, pertanyaan aktif, hitungan, jawaban, dan tahap simulasi yang sudah selesai. Untuk membuktikan refresh pada perangkat yang sama, gunakan snapshot demo dengan ID sesi dan versi format, melalui adapter terpisah dari penyimpanan produksi.

Jika snapshot berada di perangkat, gunakan label **Tersimpan di perangkat · Data contoh**. Jangan menampilkan **Tersinkron** tanpa layanan cloud. Jika simpan lokal gagal, nyatakan belum tersimpan dan sediakan cara menyalin teks yang masih ada. Reset demo merupakan tindakan eksplisit; reload biasa tidak diam-diam mereset sesi yang telah disimpan.

Snapshot lokal bukan bukti autentikasi, kepemilikan lintas akun, persistensi server, atau sinkronisasi antarperangkat. Kontrak tersebut tetap dibangun dan diuji pada tahap selanjutnya.

### 4.4 Isi dan identitas

Pisahkan bahan asli, usulan draf, dan naskah diterima. Penerapan usulan memerlukan aksi pengguna. Bila versi naskah berubah sejak usulan dibuat, tampilkan konflik atau simpan usulan terpisah; jangan menimpa tulisan baru.

Identitas akun, nama publik sampul, dan tokoh diri menggunakan field berbeda. Tokoh sintetis mempunyai ID stabil. Nama asli opsional; tokoh belum ditinjau memakai penanda. Penyamaran deterministik tidak dianggap pekerjaan AI berbayar.

Perbedaan **Jangan kirim ke AI** dan **Jangan masukkan ke buku** dikenali prototipe. Bahan yang dilarang tetap dikecualikan dari alur simulasi sesuai kontrak yang diuji; mock tidak menjadi alasan mengabaikan pemilihan sumber.

## 5. Arah UI yang digunakan

Gunakan detail ui-ux-spec.md. Arah A menjadi default bila belum ada desain terpilih lain.

| Elemen | Acuan |
| --- | --- |
| Latar | Krem #F7F3EA |
| Utama | Hijau gelap #264E46 |
| Teks utama | #243230 |
| Aksen | Terakota #C77856 untuk dekorasi; bukan teks kecil atau label putih tombol biasa |
| Tipografi | Serif untuk nuansa buku; sans-serif untuk navigasi/kontrol |
| Editor | Ukuran awal sekitar 18 px, tinggi baris sekitar 1,7, lebar baca nyaman |
| HP | Satu area utama; kontrol jawaban dapat dijangkau ketika keyboard terbuka |
| Laptop | Navigasi bab dapat dilipat; panel usulan tidak mempersempit editor berlebihan |
| Interaksi | Tindakan utama jelas, Lewati/jeda mudah ditemukan, fokus keyboard terlihat |

Gunakan data sintetis **Langkah Menuju Jepang**, tokoh diri **Nara**, dan nama pena **Citra Senja**, atau padanan sintetis yang dicatat. Ini bukan pernyataan tentang pengalaman nyata keluarga pemilik. Jangan memasukkan cerita pribadi atau nama asli untuk membuat prototipe tampak realistis.

Penilaian visual mencakup keadaan kosong, tulisan panjang, pertanyaan aktif, pemrosesan, usulan tersedia, dan kegagalan. Tampilan halaman awal saja tidak mencukupi.

## 6. Kontrak interaksi dan biaya contoh

1. Maksimal tiga saran cerita. Pilihan topik adalah navigasi; pertanyaan substantif pertama sesudahnya ikut batas sesi.
2. Setiap giliran meminta satu informasi, termasuk judul, deskripsi, dan placeholder yang dibaca bersama.
3. Maksimal empat pertanyaan tampil pada sesi biasa. Pertanyaan keempat tetap menunggu jawaban atau tindakan pengguna.
4. Dua Lewati berturut-turut menghentikan penggalian. Detail yang dilewati tidak dikejar melalui redaksi lain.
5. Autosave bukan Kirim jawaban. Teks belum dikirim tidak diam-diam diproses saat memilih Lewati atau Buat draf sekarang.
6. Bahan cukup dapat menghasilkan draf dalam plafon yang telah diizinkan. Setelah draf tidak ada pertanyaan/sesi baru otomatis.
7. Simpan dan jeda tidak memicu transkripsi, pertanyaan, atau draf baru. Respons lama sesudah jeda tidak menghidupkan sesi.
8. Refleksi opsional. Jika prototipe membuka sesi refleksi terpisah, batasnya satu pertanyaan. Lewati atau Belum menemukan maknanya menghentikannya.
9. Tinjau tokoh sesudah draf dibuka melalui tindakan pengguna. Atur nanti mempertahankan penanda dan tidak memberi izin nama asli.
10. Plafon sesi teks contoh paling banyak lima kredit: penggalian satu dan draf empat. Langsung draf tanpa penggalian empat kredit. Membuka sesi atau skip tanpa bahan substantif tidak membuat potongan penggalian.
11. Paket Rp79.000/150 kredit; top-up 50/Rp29.000 dan 150/Rp59.000. Tambahan berlaku 30 hari; baca/ekspor setelah langganan berakhir 15 hari. Label tanggal memakai WIB.
12. Saldo contoh nol tidak mengunci editor manual bila langganan contoh aktif. Menambah saldo demo tidak otomatis menjalankan pekerjaan tertahan.
13. Jika kontrol rekaman ditampilkan, beri label simulasi bila belum merekam. Batas tetap 10 menit atau 25 MB per berkas. Transkripsi terpisah satu kredit per menit berhasil.

Nominal dan peristiwa kredit Tahap 1 mendemonstrasikan UI. Ini tidak menggantikan ledger atomik Tahap 5 atau membuktikan ekonomi penggunaan provider.

## 7. Urutan kerja

1. Periksa README, discovery, keputusan teknis, instruksi repositori, versi dokumen, dan Git. Gunakan hasil Tahap 0; jangan membuat repositori pengganti tanpa kebutuhan.
2. Lengkapi fondasi aplikasi sesuai lingkungan yang ditemukan. Pakai package manager terpilih, kunci dependensi, dan catat perintah menjalankan.
3. Bangun token, komponen bersama, serta navigasi. Gunakan arah visual A bila tidak ada mockup terpilih.
4. Implementasikan model sintetis, mesin sesi, provider simulasi, dan skenario gagal/terlambat.
5. Hubungkan Buku saya/Ruang proyek, momen, sesi, serta draf/editor sebagai satu perjalanan.
6. Lengkapi interaksi tokoh, penyamaran diri/nama pena, tinjauan privasi contoh, dan layar kredit.
7. Periksa alur dan tampilan browser, termasuk layar kecil serta tulisan panjang; perbaiki temuan.
8. Perbarui progres/verifikasi, kumpulkan bukti, dan siapkan pilot kenyamanan manusia.

Lanjutkan sampai keluaran Tahap 1 konkret dan dapat dicoba. Jangan berhenti pada scaffolding atau typecheck sementara alur inti belum tersambung. Nama komponen, pembagian modul, dan penyesuaian visual rutin dapat diputuskan tanpa persetujuan berulang.

## 8. Verifikasi yang diperlukan

Jalankan pemeriksaan yang relevan dengan risiko berikut. Pengujian otomatis, pemeriksaan browser, dan pilot manusia dilaporkan terpisah.

| ID | Skenario | Bukti yang diperlukan |
| --- | --- | --- |
| T1-01 | Jalankan aplikasi | Perintah nyata berhasil dan rute inti dapat dibuka |
| T1-02 | Cerita cukup | Draf muncul tanpa menghabiskan empat pertanyaan |
| T1-03 | Pertanyaan keempat | Tetap menunggu; pertanyaan kelima tidak muncul |
| T1-04 | Dua Lewati | Penggalian berhenti; bahan tidak hilang atau diganti cerita rekaan |
| T1-05 | Respons bertumpuk | Ditahan atau diperbaiki sebelum ditampilkan |
| T1-06 | Jeda saat respons tertunda | Hasil terlambat tidak membuka pertanyaan/draf baru |
| T1-07 | Lanjutkan dan refresh | Snapshot demo memulihkan sesi/hitungan tanpa penggalian ganda |
| T1-08 | Draf tersedia | Menunggu tindakan; sumber, usulan, dan naskah diterima dibedakan |
| T1-09 | Versi naskah berubah | Penerapan usulan lama tidak menimpa versi terbaru |
| T1-10 | Seluruh tokoh disamarkan | Tokoh diri ikut pratinjau; sampul berbeda dari akun; Atur nanti memakai penanda |
| T1-11 | Privasi sumber | No-AI dan no-book berbeda; nama sintetis terlarang dapat ditinjau sebelum ekspor contoh |
| T1-12 | Kredit contoh | Sesuai tindakan; saldo nol aktif tetap bisa edit; saldo bertambah tidak otomatis melanjutkan AI |
| T1-13 | Simpan lokal gagal | Tidak ada klaim simpan palsu; teks di memori dapat diselamatkan |
| T1-14 | Responsif | Alur berjalan di HP/laptop; teks membungkus dan kontrol tidak tertutup |
| T1-15 | Pemeriksaan proyek | Build, typecheck, lint bila tersedia, serta tes relevan dijalankan dengan hasil nyata |
| T1-16 | Klik ganda | Satu aksi tidak menggandakan transisi, pertanyaan, atau pekerjaan simulasi |

Gunakan ukuran utama 390 × 844 dan 1440 × 900, ditambah pemeriksaan lebar 320/360 serta 768/1024 CSS px sesuai UI spec. Periksa fokus keyboard dan kontras aktual. Emulasi viewport desktop tidak membuktikan keyboard virtual, mikrofon, atau lifecycle HP; catat apakah perangkat nyata sudah dicoba.

Petakan kriteria UI/UX yang bergantung pada layanan: **terbukti dengan simulasi**, **terbukti pada implementasi lokal**, atau **menunggu tahap relevan**. Jangan menuntut seluruh pembayaran/ekspor/retensi produksi selesai pada Tahap 1 atau menyatakan integrasi lulus hanya karena mock berhasil.

Jika alat browser belum tersedia, selesaikan kode dan pemeriksaan lain yang dapat dilakukan, lalu nyatakan tinjauan visual belum terverifikasi. Jangan mengisi status lulus berdasarkan dugaan.

## 9. Pilot kenyamanan kecil

Siapkan petunjuk menjalankan demo sintetis. Minta peserta mencoba tanpa arahan langkah demi langkah:

- Memulai satu cerita dan memahami lingkup sesi.
- Menemukan Lewati serta jeda, lalu melanjutkan.
- Memahami biaya contoh sebelum memulai dan hasil sesudahnya.
- Meninjau draf kemudian memasukkannya ke naskah.
- Menyamarkan tokoh diri dan memilih nama pena berbeda dari akun.

Catat peserta dengan identitas minimum yang diperlukan, perangkat, tugas selesai, titik bingung, dan perbaikannya. Mock tidak membuktikan mutu tulisan AI atau kemauan membayar.

Jika peserta belum tersedia, tandai **pilot manusia belum dilaksanakan** dan sertakan skenario siap coba. Kode/pengujian lokal dapat dilaporkan selesai sesuai buktinya, tetapi jangan menyatakan seluruh kriteria Tahap 1 termasuk pilot telah dipenuhi. Tidak perlu mengarang hasil atau menghentikan pekerjaan implementasi independen untuk menutup laporan.

## 10. Bukti yang dikirim kembali kepada arsitek

| Bukti | Isi |
| --- | --- |
| Ringkasan | Fitur yang berjalan, keadaan simulasi, dan hal yang belum dibangun |
| Perintah lokal | Menjalankan aplikasi, build, dan tes yang benar-benar digunakan |
| Catatan verifikasi | Skenario, hasil, kegagalan yang diperbaiki, serta keterbatasan |
| Bukti visual | Tiga layar inti pada HP/laptop, contoh privasi tokoh, dan satu keadaan gagal; rekaman alur bila tersedia |
| Peta berkas | Modul sesi, provider simulasi, adapter demo, komponen utama, dan tes |
| Perubahan Git | Ringkasan perubahan serta commit/checkpoint bila dibuat |
| Progres | docs/progres-implementasi.md dan docs/hasil-verifikasi.md sesuai kenyataan |
| Pilot | Temuan pengguna atau status belum dilakukan beserta petunjuk percobaan |

Arsitek memerlukan lampiran, isi berkas, atau akses repositori yang tersedia untuk audit langsung. Tautan C:/... menunjukkan lokasi pada komputer pemilik; tautan itu tidak dengan sendirinya memberikan akses ke percakapan arsitek.

README hasil discovery dan catatan keputusan teknis dapat disertakan pada laporan Tahap 1 agar penilaian berikutnya mempertimbangkan struktur kode yang sebenarnya. Ketiadaan akses langsung arsitek tidak perlu membuat pelaksana mengulang Tahap 0 atau menghentikan pekerjaan yang sudah dapat dilakukan.

## 11. Format laporan pelaksana

~~~text
Tahap 1 — [status sesuai bukti]

Yang dapat dicoba:
- ...

Cara menjalankan:
- ...

Pemeriksaan:
- Perintah/skenario — hasil

Bukti tampilan:
- HP — berkas
- Laptop — berkas
- Privasi dan keadaan gagal — berkas

Keputusan teknis:
- ...

Keterbatasan:
- Integrasi yang masih simulasi
- Pemeriksaan yang belum dilakukan
- Pilot manusia: sudah/belum, dengan temuan bila ada

Perubahan dan progres:
- Modul/berkas utama
- Commit/checkpoint bila ada
- Status tahap dalam dokumen progres

Temuan yang benar-benar memerlukan keputusan:
- ...
~~~

Instruksi mulai untuk Codex: **Kerjakan Tahap 1 sampai prototipe dapat dicoba berdasarkan arahan ini dan empat dokumen acuan. Gunakan discovery yang sudah tersedia, lanjutkan pekerjaan yang diotorisasi tanpa meminta persetujuan setiap langkah, dan laporkan bukti serta batas pengujiannya secara jujur.**

