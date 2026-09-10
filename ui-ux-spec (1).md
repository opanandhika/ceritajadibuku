# Spesifikasi UI/UX CeritaJadiBuku

| Metadata | Nilai |
| --- | --- |
| Versi | 1.0 |
| Tanggal | 10 September 2026 |
| Pemilik produk | Novan Andhika |
| Acuan produk | `blueprint.md` versi 1.4 |
| Acuan pelaksanaan | `langkah-implementasi.md` versi 1.3 |
| Kajian pendamping | `kajian-harga-dan-penulisan.md` versi 1.1 |
| Pengguna dokumen | Pemilik produk, perancang di Stitch atau Claude Design, dan Codex/pengembang |
| Status | Spesifikasi dan brief desain; belum merupakan mockup, kode aplikasi, atau hasil uji pengguna |

## 1. Tujuan dan kedudukan dokumen

CeritaJadiBuku adalah web app yang membantu orang mengubah pengalaman pribadi menjadi buku. Antarmuka harus membuat pengguna berani memulai, nyaman bercerita, mudah melanjutkan setelah jeda, dan tetap memegang kendali atas tulisannya.

Dokumen ini menerjemahkan blueprint menjadi tampilan, navigasi, komponen, teks antarmuka, dan kondisi interaksi yang dapat diimplementasikan. Blueprint tetap menentukan tarif, hak akses, privasi, penyimpanan, dan aturan sesi. Koreksi terbaru pemilik produk mengungguli dokumen sebelumnya. Bila contoh desain bertentangan dengan kontrak produk, perbaiki desainnya.

Angka ukuran, warna tambahan, tata letak, dan target kenyamanan di sini adalah keputusan desain awal untuk diuji. Pemeriksaan beberapa pasangan warna tidak berarti aplikasi telah memenuhi seluruh persyaratan aksesibilitas. Jangan menyatakan mockup atau implementasi sudah lolos pengujian hanya karena mengikuti dokumen ini.

Keluaran pekerjaan desain adalah tiga layar inti dalam versi HP dan laptop, satu arah visual terpilih, daftar komponen serta kondisinya, dan alur prototipe yang dapat dicoba. Implementasi produksi tetap mengikuti tahapan pada panduan implementasi.

## 2. Pengalaman yang ingin dibangun

**Arah utama: ruang menulis yang hangat, personal, dan elegan.**

Nama merek ditulis **CeritaJadiBuku**. Tagline: **Ceritamu, menjadi buku.** Sapaan antarmuka adalah **kamu**. Gunakan bahasa Indonesia yang sederhana dan menghargai suara penulis.

Setiap layar membantu pengguna menjawab tiga hal: sedang mengerjakan apa, apakah hasilnya sudah tersimpan, dan tindakan berikutnya yang tersedia. Informasi biaya muncul sebelum tindakan berbayar. Informasi privasi muncul saat pengguna memilih sumber, memproses rekaman, mengatur tokoh, atau mengekspor buku.

Prinsip pengalaman:

1. Cerita boleh dimulai dari satu momen. Judul, daftar isi, tokoh, fokus, dan hikmah dapat dilengkapi bertahap.
2. Satu giliran hanya meminta satu informasi. Tidak ada pertanyaan bertumpuk dalam judul, deskripsi, maupun placeholder.
3. Satu tindakan utama menonjol pada setiap keadaan layar. Pilihan Lewati dan jeda tetap mudah ditemukan.
4. Pengguna melihat perbedaan bahan asli, usulan AI, dan naskah yang sudah diterima.
5. Kemajuan ditunjukkan melalui hasil nyata, seperti cerita tersimpan dan bagian yang selesai ditinjau. Jangan menciptakan persentase selesai dari target buku yang belum dipilih.
6. Tidak ada hukuman karena jeda, streak wajib, atau pesan yang mempermalukan pengguna karena belum menulis.
7. Cerita yang sedih, belum selesai, atau belum menemukan makna tetap dapat ditulis.
8. Tampilan harus tetap nyaman ketika berisi teks panjang dan sedang dipakai melalui keyboard HP.

## 3. Batas produk yang wajib tampak di UI

| Area | Kontrak tampilan dan perilaku |
| --- | --- |
| Saran cerita | Maksimal tiga pilihan, ditambah Tulis topik sendiri dan Langsung bercerita |
| Wawancara biasa | Satu momen, satu pertanyaan per giliran, maksimal empat pertanyaan yang ditampilkan |
| Lewati | Selalu tersedia pada pertanyaan; dua Lewati berturut-turut mengakhiri penggalian biasa |
| Pertanyaan keempat | Tetap menunggu jawaban, Lewati, Buat draf sekarang, atau Simpan dan jeda |
| Draf lebih awal | Bahan cukup dapat langsung menjadi draf sesuai izin biaya awal; tidak wajib menghabiskan empat pertanyaan |
| Setelah hasil | Tidak ada pertanyaan baru atau sesi lanjutan otomatis |
| Refleksi | Opsional; sesi refleksi terpisah hanya satu pertanyaan dan dapat dilewati |
| Audio | Maksimal 10 menit atau 25 MB per berkas, mana yang tercapai lebih dahulu |
| Paket | Rp79.000 per bulan kalender, 150 kredit, tiga proyek termasuk arsip/sampah, 1 GB total akun |
| Top-up | 50 kredit/Rp29.000 dan 150 kredit/Rp59.000; masing-masing berlaku 30 hari sejak pembayaran terverifikasi |
| Penggunaan AI | Memerlukan langganan aktif, saldo yang sesuai, dan sumber yang diizinkan |
| Saldo nol | Penulisan manual tetap tersedia selama langganan aktif |
| Setelah langganan | Baca dan ekspor selama 15 hari sejak `paid_until`, termasuk proyeksi privasi ekspor manual |
| Nama | Semua tokoh, termasuk diri penulis, boleh memakai samaran; nama pena sampul dipilih terpisah |
| Sumber | Bahan asli dipertahankan; usulan tidak menimpa naskah yang lebih baru tanpa peninjauan |
| Pembayaran | Duitku dengan perpanjangan invoice manual pada versi pertama |
| Ekspor awal | Word dan cadangan proyek; PDF baca menunggu tahap sesudah ekspor Word stabil |

Desain versi pertama tidak menawarkan trial publik otomatis, paket tahunan, galeri buku publik, kolaborasi langsung, percakapan suara langsung, sampul AI berbayar, atau publikasi marketplace. Sampul yang terlihat pada kartu proyek merupakan tampilan judul sederhana; jangan menganggapnya layanan desain sampul cetak.

## 4. Sistem visual

### 4.1 Palet dan penggunaan

Pertahankan palet inti blueprint. Warna tambahan di bawah berfungsi untuk kondisi antarmuka dan keterbacaan.

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `canvas` | `#F7F3EA` | Latar halaman krem |
| `surface` | `#FFFFFF` | Editor, input, dialog, kartu utama |
| `surface-soft` | `#EEF2ED` | Pilihan aktif dan area pendukung |
| `primary` | `#264E46` | Tombol utama, tautan, identitas merek |
| `primary-hover` | `#1D3F38` | Hover tombol utama |
| `text` | `#243230` | Teks utama |
| `text-muted` | `#5B6B65` | Keterangan, metadata, placeholder yang tetap terbaca |
| `accent` | `#C77856` | Ilustrasi dan aksen dekoratif terakota |
| `accent-text` | `#8E472D` | Teks bernuansa terakota pada latar terang |
| `divider` | `#D9DFD8` | Pemisah dekoratif; bukan satu-satunya penanda batas kontrol |
| `control-border` | `#7A8781` | Batas input/kontrol bila dibutuhkan untuk dikenali |
| `success-text` | `#264E46` | Status sukses, dengan teks atau ikon |
| `warning-text` | `#785016` | Peringatan pada `#FBF1D8` |
| `danger-text` | `#9B3434` | Kesalahan pada `#FBEDED` dan tindakan destruktif |

Pasangan solid yang dihitung saat spesifikasi dibuat:

| Pasangan | Rasio perkiraan | Keputusan |
| --- | ---: | --- |
| Teks utama pada krem | 12,05:1 | Layak sebagai teks utama |
| Teks sekunder pada krem | 5,08:1 | Layak untuk teks kecil |
| Putih pada hijau utama | 9,29:1 | Dipakai pada tombol utama |
| Hijau utama pada krem | 8,39:1 | Dipakai untuk tautan dan penekanan |
| Terakota gelap pada krem | 6,14:1 | Alternatif teks aksen |
| Terakota asli pada krem | 3,03:1 | Jangan dipakai untuk teks kecil |
| Putih pada terakota asli | 3,36:1 | Jangan dipakai untuk label tombol ukuran biasa |
| Batas kontrol pada krem | 3,38:1 | Dasar awal batas kontrol; periksa keadaan aktual |

Angka dibulatkan untuk pelaporan; keputusan implementasi memakai nilai tanpa pembulatan. Opasitas, latar, ukuran, keadaan fokus, dan penumpukan elemen dapat mengubah hasil. Uji warna yang benar-benar dirender.

### 4.2 Tipografi

Gunakan serif untuk judul buku dan mode baca naskah, serta sans-serif untuk navigasi, formulir, dan status. Pilihan awal menggunakan font sistem agar prototipe tidak bergantung pada unduhan font: `Georgia, "Times New Roman", serif` dan `system-ui, -apple-system, "Segoe UI", sans-serif`.

| Peran | HP | Laptop | Catatan |
| --- | --- | --- | --- |
| Judul layar | 28–32 px | 32–40 px | Tinggi baris sekitar 1,2; judul panjang membungkus |
| Judul bagian | 20–24 px | 24–28 px | Hierarki jelas dan konsisten |
| Pertanyaan aktif | 22–26 px | 26–30 px | Maksimal satu permintaan informasi |
| Isi UI dan input | 16 px | 16 px | Label tetap terlihat ketika input terisi |
| Editor dan mode baca | Awal 18 px | Awal 18–20 px | Pengguna dapat memilih 16/18/20/22 px |
| Keterangan sekunder | 14 px | 14 px | Informasi biaya/tenggat penting tetap 16 px |

Tinggi baris isi naskah awal 1,7. Lebar baca di laptop sekitar 60–72 karakter dengan batas lebar sekitar 720 px. Ukuran menggunakan unit relatif pada implementasi agar mengikuti pembesaran teks. Pengaturan tampilan editor tidak mengubah ukuran font pada ekspor Word secara otomatis.

### 4.3 Jarak, bentuk, ikon, dan gerak

Gunakan skala jarak 4, 8, 12, 16, 24, 32, 48, dan 64 px. Margin HP awal 16 px; laptop 24–40 px sesuai lebar. Radius kontrol 10 px, kartu 16 px, dialog 20 px. Bayangan lembut hanya untuk lapisan yang memang terangkat; bidang naskah mengutamakan keterbacaan.

Pakai satu keluarga ikon bergaris dengan ukuran visual sekitar 20–24 px. Ikon dekoratif tidak dibaca pembaca layar. Ikon tindakan memiliki nama yang jelas; tindakan utama menggunakan teks. Tombol sentuh ditargetkan minimal 44 × 44 CSS px dengan jarak yang cukup. Ini target produk, lebih besar dari minimum dasar 24 CSS px pada WCAG 2.2 SC 2.5.8 yang memiliki ketentuan pengecualian.

Transisi ringan sekitar 120–180 ms boleh dipakai untuk membuka panel atau perubahan pilihan. Hormati preferensi pengurangan gerak. Hindari efek mengetik karakter demi karakter pada naskah panjang, konfeti setelah cerita sensitif, suara otomatis, dan animasi latar saat mengetik.

### 4.4 Pilihan eksplorasi visual

Buat maksimal tiga alternatif pada layar inti yang sama. Rekomendasi awal adalah A.

| Alternatif | Penekanan | Yang tetap sama |
| --- | --- | --- |
| A — Ruang menulis hangat | Krem dominan, judul serif, bidang naskah putih, hijau sebagai tindakan utama | Palet inti, copy, navigasi, dan seluruh kontrak produk |
| B — Editorial lapang | Putih lebih dominan, hierarki tipografi kuat, dekorasi sangat sedikit | Alur, kontrol, biaya, dan isi layar sama dengan A |
| C — Studio lembut | Area hijau pucat lebih terlihat pada navigasi dan pilihan, kartu sedikit lebih membulat | Isi, keterbacaan, serta batas sesi tetap sama |

Perbandingan menilai susunan, kepadatan, dan karakter visual. Setelah satu arah dipilih, gunakan komponen dan tokennya pada seluruh layar. Jangan mencampur tiga sistem tombol atau tipografi dalam satu aplikasi.

## 5. Navigasi dan perilaku responsif

### 5.1 Struktur informasi

| Tingkat | Tujuan | Isi |
| --- | --- | --- |
| Publik | Beranda | Manfaat, contoh tampilan, cara kerja, harga, privasi, Masuk/Daftar |
| Akun | Buku saya | Daftar proyek dan lanjutkan pekerjaan |
| Akun | Kredit dan langganan | Saldo, lot, riwayat, invoice, pembelian/perpanjangan |
| Akun | Pengaturan dan bantuan | Akun, penyimpanan, bantuan, penghapusan |
| Buku | Ringkasan | Pekerjaan terakhir, cerita, kerangka, dan naskah |
| Buku | Cerita saya | Bahan asli dan rekaman; tindakan mulai sesi cerita |
| Buku | Naskah | Bab/subbab, editor, mode baca, dan kerangka |
| Buku | Tokoh dan Privasi | Kartu tokoh, tokoh diri, nama pena, aturan penyamaran |
| Buku | Peta cerita | Linimasa, tema, fakta, dan ketidakpastian; akses melalui menu buku |
| Buku | Ekspor dan cadangan | Dua jalur keluaran dengan cakupan berbeda |

Halaman pada blueprint tidak semuanya harus menjadi tab utama. Peta cerita, kerangka, dan ekspor tetap dapat ditemukan dari tindakan berlabel di ruang buku. Navigasi buku selalu memperlihatkan judul proyek agar pengguna tahu data mana yang sedang dikerjakan.

### 5.2 Tata letak menurut lebar

| Lebar awal | Perilaku |
| --- | --- |
| Di bawah 768 px | Satu area kerja utama; panel bab, tokoh, atau usulan dibuka bergantian |
| 768–1279 px | Satu area utama dan navigasi yang dapat dilipat; panel usulan menggantikan panel samping bila ruang sempit |
| Mulai 1280 px | Navigasi/daftar bab sekitar 240 px, editor fleksibel, panel usulan sekitar 300–340 px jika dibuka |

Breakpoint adalah acuan awal; komponen harus dapat menyusut di antaranya. Pada laptop kecil jangan memaksa tiga kolom sehingga editor terlalu sempit. Pada HP, menu Buku, Cerita, Naskah, dan Lainnya dapat menjadi navigasi bawah di luar mode fokus. Ketika sesi atau editor aktif, tampilkan judul ringkas, tombol kembali, dan kontrol pekerjaan yang relevan; jangan menumpuk dua bilah navigasi tetap.

Saat keyboard muncul, input aktif, Kirim jawaban, dan Lewati tetap dapat dijangkau. Bilah tindakan mengikuti ruang layar yang benar-benar terlihat dan safe area. Jika tidak muat, izinkan gulir vertikal; jangan menutupi baris terakhir atau membuat pengguna harus menutup keyboard untuk menemukan Lewati. Tidak ada fungsi yang hanya muncul saat hover.

## 6. Daftar layar dan urutan pengerjaan

| ID | Layar | Kelompok |
| --- | --- | --- |
| U01 | Beranda publik | Pendukung peluncuran |
| U02 | Masuk, daftar, verifikasi, pemulihan sandi | Pendukung peluncuran |
| U03 | Buku saya dan ringkasan buku | Prototipe inti |
| U04 | Pilih cerita atau langsung bercerita | Prototipe inti |
| U05 | Sesi cerita dan rekaman | Prototipe inti |
| U06 | Peninjauan draf dan editor naskah | Prototipe inti |
| U07 | Kerangka, susun potongan, dan tinjauan bagian | Pengembangan inti |
| U08 | Cerita saya dan peta cerita | Pengembangan inti |
| U09 | Tokoh, nama pena, dan privasi | Pengembangan inti |
| U10 | Kredit, langganan, dan pembayaran | Pendukung peluncuran |
| U11 | Ekspor dan cadangan | Pengembangan inti |
| U12 | Penyimpanan, masa retensi, dan penghapusan | Pendukung peluncuran |
| U13 | Bantuan dan pelaporan hasil bermasalah | Pendukung peluncuran |

Prototipe awal boleh memakai data tiruan dan provider simulasi. Ini tidak memberi izin mengaktifkan AI berbayar sebelum fondasi kredit/privasi siap atau memublikasikan pembayaran produksi.

## 7. U03 — Buku saya dan ringkasan buku

### 7.1 Pengguna baru

Judul: **Buku pertamamu dimulai dari satu cerita.** Penjelasan: **Kamu bisa mulai dari pengalaman yang paling ingin kamu ceritakan. Judul dan susunannya bisa dilengkapi nanti.** Tindakan utama: **Buat buku**.

Judul proyek boleh kosong saat mulai; gunakan **Buku tanpa judul** sebagai penanda yang dapat diubah. Jangan menampilkan nama akun pada nama penulis publik. Akun yang belum memiliki hak menulis mengikuti halaman paket sebelum fitur berlangganan digunakan; prototipe tester tidak boleh terlihat sebagai trial publik yang dijanjikan.

### 7.2 Pengguna yang sudah menulis

Tampilkan kartu buku dengan sampul tipografis sederhana, judul, waktu terakhir disimpan, dan ringkasan hasil seperti **6 cerita tersimpan · 2 bagian naskah**. Angka berasal dari isi yang benar-benar ada. Hindari label selesai otomatis untuk draf yang belum ditinjau.

Tindakan utama pada buku terakhir adalah **Lanjutkan ceritamu** jika ada sesi yang dijeda, atau **Buka naskah** jika pekerjaan terakhir adalah editor. Menu sekunder memuat ubah judul, arsipkan, ekspor, dan hapus. Hapus memakai gaya bahaya serta konfirmasi yang sesuai dampaknya.

Di ringkasan buku, tampilkan pekerjaan terakhir, cerita yang belum ditempatkan, dan akses ke naskah. **Tambahkan cerita** tersedia sebagai tindakan sekunder. Jangan menampilkan daftar kewajiban panjang mengenai hikmah, tokoh, atau target kata.

Ketika tiga slot terpakai, tombol membuat buku menjelaskan: **Tiga slot bukumu sedang terpakai. Kelola buku dan sampah untuk menyediakan tempat.** Arsip tidak dianggap membebaskan slot.

## 8. U04–U05 — Memilih cerita dan sesi satu pertanyaan

### 8.1 Pilih cerita

Untuk buku kosong, tampilkan tiga kartu: **Awal sebuah mimpi**, **Pengalaman yang membekas**, dan **Seseorang yang penting**. Di bawahnya ada **Tulis topik sendiri** serta **Langsung bercerita**. Semua kartu adalah pilihan navigasi, bukan pertanyaan tambahan.

Untuk buku yang konteks Jepangnya telah diberikan, contoh saran adalah **Awal mimpi ke Jepang**, **Perjuangan mewujudkannya**, dan **Orang yang berkesan**. Jangan menganggap pengguna pernah gagal beasiswa atau mengalami konflik tertentu jika belum diceritakan.

Sebelum memulai penggalian, tampilkan ringkasan biaya: **Sesi teks ini memakai paling banyak 5 kredit: penggalian 1 kredit dan draf 4 kredit. Transkripsi rekaman dihitung terpisah.** Tombol utama: **Mulai sesi — maks. 5 kredit**. Penjelasan singkat menyebut draf dapat dibuat otomatis ketika bahan cukup. Persetujuan ini tidak diulang setelah setiap jawaban.

Jalur langsung draf dari bahan yang sudah siap menampilkan **Buat draf — 4 kredit** dan tidak menagih penggalian yang tidak dilakukan. Jalur Langsung bercerita yang dapat memerlukan penggalian menggunakan plafon sesi yang dijelaskan sebelum diproses.

### 8.2 Susunan ruang bercerita

Bagian atas memuat judul momen, nama buku, dan keadaan simpan. Tengah layar memuat satu pertanyaan, area jawaban, serta pilihan **Ketik** atau **Rekam**. Jawaban sebelumnya dapat dilihat kembali melalui **Lihat percakapan sesi ini** tanpa memunculkan pertanyaan baru.

Indikator: **Pertanyaan 2 · maksimal 4**. Teks penjelas opsional: **Bisa selesai lebih cepat saat bahan sudah cukup.** Jangan memakai indikator yang menyiratkan penulis harus menjawab empat pertanyaan.

Contoh pertanyaan tunggal: **Apa yang pertama kali membuatmu ingin sekolah di Jepang?** Placeholder cukup **Tulis ceritamu di sini…**; jangan menambahkan pertanyaan tentang waktu, orang, perasaan, dan hikmah di placeholder.

Kontrol saat menunggu jawaban:

| Kontrol | Letak dan efek |
| --- | --- |
| Kirim jawaban | Tombol utama; mengirim jawaban secara eksplisit |
| Lewati | Tombol teks/sekunder dekat Kirim, tetap terbaca dan dapat dijangkau |
| Buat draf sekarang | Kontrol terpisah yang mudah ditemukan; memakai bahan yang telah dikirim |
| Simpan dan jeda | Kontrol terlihat; menyimpan tanpa memulai pekerjaan AI baru |

Autosave tidak mengirim jawaban. Enter membuat paragraf baru pada area cerita; gunakan tombol Kirim jawaban atau shortcut yang dijelaskan, misalnya Ctrl/Cmd+Enter. Saat pengguna memilih Buat draf sekarang atau Lewati dengan teks yang belum dikirim, simpan teks lokal dan jelaskan statusnya; jangan diam-diam memasukkannya ke AI. Sediakan tindakan eksplisit mengirim teks terlebih dahulu atau melanjutkan tanpa mengirimnya, tanpa kehilangan teks tersebut.

### 8.3 Perubahan keadaan

| Keadaan | Yang terlihat | Tindakan dan batas |
| --- | --- | --- |
| Menunggu jawaban | Satu pertanyaan dan area jawaban | Kirim, Lewati, Buat draf sekarang, Simpan dan jeda |
| Sedang memproses | **Sedang membaca ceritamu…** | Cegah kirim ganda; jeda mengikuti aturan job; jangan membuat pertanyaan sementara palsu |
| Bahan cukup | **Sedang menyusun draf dari ceritamu…** | Draf dapat berjalan dalam plafon yang telah diizinkan |
| Dua Lewati berurutan | Penggalian berhenti | Gunakan bahan yang cukup untuk draf atau simpan bahan belum lengkap |
| Bahan belum cukup | **Ceritamu tersimpan sebagai bahan. Kamu bisa melanjutkannya nanti.** | Baca bahan, lanjutkan secara eksplisit, atau selesai |
| Dijeda | **Sesi dijeda. Jawaban yang tersimpan bisa dilanjutkan nanti.** | Lanjutkan memulihkan sesi, hitungan, dan tagihan yang sama |
| Tertahan | Alasan saldo, kapasitas, akses, atau konflik | Bahan tetap tersedia; setelah masalah selesai pengguna memilih Lanjutkan |
| Hasil tersedia | Draf dengan label **Usulan tulisan** | Menunggu peninjauan, tidak mengajukan pertanyaan berikutnya |

Pada pertanyaan keempat, jangan membuat draf sebelum pengguna menyelesaikan pertanyaan melalui jawaban, Lewati, atau pilihan lain yang sah. Jawaban kosong tidak diperlakukan sebagai cerita. Lewati tidak meminta alasan dan detail yang dilewati tidak dikejar lagi dengan redaksi baru.

## 9. Rekaman dan transkripsi

Kontrol rekaman berada di ruang jawaban yang sama. Transkripsi rekaman adalah langkah tersendiri; antarmuka tidak menggambarkannya sebagai percakapan suara langsung dengan AI.

| Keadaan | Elemen dan perilaku |
| --- | --- |
| Sebelum merekam | **Satu rekaman maksimal 10 menit atau 25 MB.** Izin mikrofon diminta saat pengguna memilih Rekam |
| Merekam | Timer berjalan, indikator rekam dengan teks, tombol **Hentikan rekaman**; batas yang lebih dulu tercapai menghentikan berkas dengan aman |
| Rekaman selesai | Putar ulang, durasi, status unggahan, **Simpan tanpa transkripsi**, dan tindakan transkripsi berbiaya |
| Unggahan belum lengkap | Progres byte bila diketahui, lanjutkan unggahan bila didukung; jangan tampilkan siap ditranskripsi sebelum server memvalidasi |
| Siap diproses | Contoh **Transkripsikan — maks. 3 kredit** untuk durasi sah tiga menit |
| Transkripsi selesai | Teks dapat dikoreksi, lalu **Kirim jawaban** tetap merupakan tindakan terpisah |
| Berhasil sebagian | Tampilkan rentang yang selesai, kredit yang terpakai, dan pilihan mencoba bagian gagal saja |
| Izin ditolak/format gagal | Penjelasan singkat dengan **Gunakan teks** dan, bila didukung, unggah rekaman yang sesuai |

Sebelum mengirim audio, jelaskan: **Rekaman akan diproses layanan transkripsi. Nama asli yang terucap ikut diproses. Kamu bisa menggunakan samaran sejak merekam atau menulis jawabannya sendiri.** Rekaman berlabel Jangan kirim ke AI tidak dikirim untuk transkripsi.

Beberapa rekaman boleh menjadi satu jawaban. Selesainya rekaman atau transkripsi tidak otomatis mengirim jawaban dan tidak menambah hitungan pertanyaan. Jangan menampilkan **Jatah rekaman bulan ini: 10 menit**.

Tarif adalah satu kredit per menit durasi sah yang berhasil, tanpa pembulatan satu menit untuk setiap berkas pendek. UI dapat menampilkan desimal yang mudah dibaca dan rincian durasi; nilai tagihan sebenarnya mengikuti ledger server. Contoh hasil parsial: **5 dari 10 menit berhasil ditranskripsi. Terpakai 5 kredit.** Biaya percobaan ulang tidak mencakup interval yang sudah berhasil.

Ketika aplikasi masuk latar belakang atau layar terkunci, jangan menjanjikan rekaman tetap berjalan pada semua perangkat. Jika terjadi interupsi, jelaskan bagian yang berhasil disimpan dan sediakan kelanjutan yang telah diuji pada perangkat sasaran.

## 10. U06 — Peninjauan draf dan editor naskah

### 10.1 Hasil sesi

Tampilkan judul momen, **Usulan tulisan**, rujukan ke bahan asal, keadaan simpan, dan pemakaian kredit tahap yang berhasil. Jangan menampilkan draf sebagai naskah final yang otomatis disetujui.

Tindakan hasil sesi: **Edit tulisan**, **Perdalam bagian ini**, **Ceritakan momen lain**, serta **Simpan dan selesai**. Tindakan untuk memasukkan usulan ke naskah adalah **Gunakan di naskah**; jika bagian tujuan belum dipilih, pengguna memilihnya melalui kontrol navigasi. Menyimpan usulan atau bahan tidak sama dengan menerapkannya ke naskah.

Seluruh tindakan manual tersebut tidak memotong kredit. Memilih pendalaman baru menampilkan cakupan dan biaya baru sebelum diproses. Sesudah draf muncul, layar tetap menunggu tindakan pengguna.

### 10.2 Editor

Editor memuat judul bagian, isi, toolbar dasar, jumlah kata sekunder, keadaan simpan, dan akses **Mode baca**. Toolbar awal mencakup paragraf/judul bagian, tebal, miring, kutipan, serta daftar. Tautan sumber dan keterangan foto ditangani sesuai format naskah. Hindari kontrol tata letak cetak yang belum didukung ekspor.

Daftar bab/subbab dapat dilipat. Pada laptop lebar, usulan AI muncul di panel kanan. Pada HP, usulan menggunakan tampilan tersendiri dengan tombol kembali ke naskah; pengguna tidak perlu membaca dua kolom sempit.

Memilih teks menampilkan tindakan **Rapikan tulisan — 2 kredit**, dengan batas masukan 1.000 kata. Preview menjelaskan cakupan yang akan dikirim. Jika melebihi batas, pengguna memilih bagian yang lebih kecil; tidak ada pemotongan diam-diam.

### 10.3 Membandingkan usulan

Bandingkan isi saat ini dengan usulan, menggunakan label **Tulisan saat ini** dan **Usulan**. Warna perubahan disertai penanda tambah/hapus atau penjelasan tekstual. Pengguna dapat menerapkan per unit usulan yang memang disediakan, atau menolak keseluruhan. Jangan menawarkan terima per kalimat jika implementasi belum dapat menjaga versi dan sumbernya.

Sebelum penerapan, periksa versi dasar. Bila bagian sudah berubah, tampilkan: **Bagian ini sudah berubah sejak usulan dibuat. Bandingkan dengan tulisan terbaru sebelum menerapkan.** Sediakan baca versi terbaru, simpan usulan terpisah, dan kembali. Jangan menimpa perubahan baru.

Penolakan karena selera tidak otomatis mengembalikan kredit hasil yang valid. Tindakan **Laporkan hasil bermasalah** tersedia untuk kesalahan fakta, tokoh, keluaran tidak dapat dipakai, atau pelanggaran cakupan. Jangan menampilkan status refund berhasil sebelum keputusan penyesuaian benar-benar tercatat.

### 10.4 Refleksi dan hikmah

Pengaturan gaya menyediakan **Cerita saja**, **Refleksi pribadi yang menyatu**, atau **Pesan yang dinyatakan jelas**. Gaya adalah pilihan, bukan kewajiban mengisi hikmah pada setiap subbab.

Tombol **Tambahkan refleksi** ditempatkan dalam Perdalam bagian ini. Jika dipilih setelah sesi selesai, jelaskan bahwa sesi baru memakai paling banyak lima kredit teks dan hanya satu pertanyaan. Contoh: **Apa arti pengalaman ini untukmu sekarang?** Tersedia **Lewati**, **Belum menemukan maknanya**, dan pilihan menulis sendiri. Tidak ada pertanyaan lanjutan setelah pengguna melewati refleksi.

## 11. U07–U08 — Kerangka, penyusunan, dan bahan cerita

### 11.1 Kerangka dan susun bagian

Kerangka memperlihatkan bab, subbab, urutan, fungsi bagian, dan status peninjauan. Pengguna dapat memindahkan bagian dengan seret atau tombol **Pindah ke atas/Pindah ke bawah**; seret bukan satu-satunya cara.

Penyusunan manual tidak memotong kredit. Bantuan AI dimulai dari pilihan dua atau lebih potongan, total maksimal 2.000 kata. Tampilkan nama potongan, jumlah kata, bagian tujuan, dan **Susun bagian — 6 kredit**. Hasil maksimal 1.200 kata merupakan batas operasi, bukan janji bahwa semua bahan akan masuk seluruhnya.

Jika tujuan bagian belum jelas, gunakan satu pertanyaan yang dapat dilewati. Jika pertanyaan ini muncul dalam wawancara aktif, ia memakai sisa batas sesi yang sama, bukan pertanyaan tambahan di luar batas. Jangan menyisipkan formulir panjang mengenai tema, emosi, pesan, dan pembaca. Pengguna dapat memilih struktur waktu atau tema; urutan penyajian tidak dianggap mengubah urutan kejadian yang sebenarnya.

Usulan gabungan memperlihatkan sumber per paragraf/unit, pengurangan pengulangan, dan transisi. Bahan asli tetap tersedia. Terapkan hanya setelah peninjauan dan pemeriksaan versi seluruh bagian terdampak.

### 11.2 Tinjauan bagian terpilih

Label tindakan wajib **Tinjau bagian terpilih — 10 kredit**. Pengguna boleh memilih bagian dari beberapa bab sampai total 5.000 kata. Ringkasan cakupan menyebut judul bagian dan jumlah kata yang benar-benar dipilih. Hasil laporan maksimal 1.200 kata.

Contoh penjelasan: **Tinjauan mencakup dua bagian yang kamu pilih. Bagian lain belum diperiksa.** Temuan dapat berupa pengulangan atau urutan yang membingungkan. Jangan mengklaim seluruh buku sudah konsisten atau membuka sesi pertanyaan otomatis dari setiap temuan.

### 11.3 Cerita saya dan peta cerita

Daftar bahan membedakan catatan, jawaban, transkrip, rekaman, dan dokumen. Setiap bahan memperlihatkan judul, tipe, tanggal, status, dan penanda privasi. Buka bahan lengkap melalui tindakan pengguna; jangan menampilkan cuplikan sensitif pada notifikasi perangkat.

Peta cerita membedakan fakta yang dikonfirmasi, waktu perkiraan, dan informasi yang belum jelas. Koreksi fakta tidak otomatis menulis ulang seluruh naskah; bagian turunan diberi status **Perlu ditinjau**. Nama tampilan tokoh mengikuti pilihan privasi terbaru.

## 12. U09 — Tokoh, nama pena, dan privasi

### 12.1 Tiga identitas yang berbeda

| Label UI | Makna |
| --- | --- |
| Nama di sampul | Nama asli atau nama pena yang dipilih untuk terbit |
| Tokoh saya dalam cerita | Tokoh diri/narator; boleh menggunakan nama samaran sambil tetap bercerita dengan aku/saya |
| Akun dan tagihan | Identitas penggunaan layanan; bukan sumber nama publik otomatis |

Mode buku **Nama asli**, **Nama samaran**, dan **Kombinasi** merupakan pengaturan awal. Mode awal Kombinasi tidak memberi izin menerbitkan semua nama asli yang ditemukan. Tokoh yang belum dipilih memakai penanda seperti **[Teman A]**.

Tindakan **Samarkan semua tokoh, termasuk saya** membuka pratinjau seluruh tokoh, penyebutan terdampak, dan nama sampul yang perlu diperiksa. Penulis memilih alias/penanda dan menerapkan perubahan secara eksplisit. Mengubah mode buku tidak otomatis mengganti sampul. Nama asli boleh tidak pernah dimasukkan ke aplikasi.

### 12.2 Kartu tokoh bertahap

Sesudah draf, tampilkan tombol **Tinjau 3 tokoh** bila ada tiga kandidat. Jangan otomatis membuka wawancara tokoh.

Saat tombol dipilih, satu kartu menanyakan **Tokoh ini ingin disebut dengan nama apa di buku?** Pilihan: Nama asli, Nama samaran, Sebutan umum, dan **Atur nanti**. Atur nanti mempertahankan penanda; perpindahan ke kartu berikutnya dilakukan atas tindakan pengguna.

Pemetaan privat nama asli hanya dibuka lewat tindakan **Lihat catatan identitas pribadi**. Kartu biasa dan konteks AI tidak menampilkan pemetaan tersebut. Jangan meminta pengguna memberi label antagonis atau menceritakan konflik sebagai syarat memakai samaran.

### 12.3 Penanda sumber

Tampilkan dua kontrol berbeda: **Jangan masukkan ke buku** dan **Jangan kirim ke AI**. Penjelasan menerangkan bahwa tidak masuk buku tidak otomatis melarang pemrosesan AI, dan izin memakai bahan sebagai konteks harus ditentukan terpisah. Jangan kirim ke AI selalu diutamakan.

Saat penanda berubah, jelaskan dampak pada bagian turunan dan usulan yang perlu ditinjau. Jangan menyatakan perubahan menghapus data yang sudah diproses provider. Nama samaran juga tidak menjamin orang tidak dapat dikenali dari detail cerita.

Pengaturan tokoh, pratinjau penggantian deterministik, dan pemeriksaan privasi dasar tidak memotong kredit. Labelnya harus berbeda dari tinjauan tulisan AI berbayar.

## 13. U10 — Kredit, langganan, dan Duitku

### 13.1 Informasi saldo

Tampilkan **Saldo tersedia**, **Sedang digunakan untuk pekerjaan**, dan **Riwayat pemakaian** secara berbeda. Saldo terpesan tidak disebut sudah habis. Gunakan penjelasan sederhana ketika pekerjaan sedang diproses.

Daftar lot memperlihatkan sumber kredit, sisa, tanggal serta jam kedaluwarsa dalam WIB. Kredit bulanan berakhir bersama periode asal; kredit tambahan berakhir tepat 30 × 24 jam dari grant pembayaran pertama kali terverifikasi. Pembelian tambahan/perpanjangan tidak memperpanjang lot sebelumnya.

Contoh keterangan sebelum top-up: **Kredit tambahan berlaku 30 hari sejak pembayaran terverifikasi. Pemakaian AI memerlukan langganan aktif. Kredit tambahan tidak memperpanjang langganan atau masa simpan buku.** Perlihatkan status langganan dan jalur perpanjangan bila belum aktif.

Paket Menulis memperlihatkan Rp79.000 per bulan kalender, 150 kredit, tiga proyek, dan 1 GB. Top-up menampilkan 50 kredit/Rp29.000 serta 150 kredit/Rp59.000. Informasi biaya final kanal pembayaran berasal dari invoice server dan ditampilkan sebelum pengguna membayar; jangan menghitung nominal tepercaya dari browser.

### 13.2 Penjelasan biaya pekerjaan

| Pekerjaan | Label biaya | Cakupan yang diperlihatkan |
| --- | --- | --- |
| Sesi penggalian + draf | Maks. 5 kredit | Satu momen, maksimal empat pertanyaan, draf sampai 800 kata |
| Langsung draf | 4 kredit | Bahan tersedia, hasil sampai 800 kata |
| Rapikan tulisan | 2 kredit | Pilihan sampai 1.000 kata; hasil sampai 1.200 kata |
| Susun bagian | 6 kredit | Dua atau lebih potongan, masukan sampai 2.000 kata; hasil sampai 1.200 kata |
| Tinjau bagian terpilih | 10 kredit | Pilihan sampai 5.000 kata; laporan sampai 1.200 kata |
| Transkripsi | 1 kredit/menit berhasil | Durasi sah yang diproses; terpisah dari pekerjaan teks |

Tidak ada meter biaya yang terus berkedip selama pengguna mengetik. Tampilkan plafon sebelum proses dan pemakaian aktual setelah hasil tersedia. Membuka sesi, autosave, atau menekan Lewati tanpa bahan substantif tidak otomatis memotong kredit penggalian.

### 13.3 Keadaan pembayaran

| Status | Microcopy dan tindakan |
| --- | --- |
| Invoice dibuat | **Lanjutkan pembayaran melalui Duitku.** Tampilkan produk, nominal final, dan masa berlaku invoice |
| Menunggu | **Pembayaran belum terkonfirmasi.** Kembali ke invoice yang sama; jangan membuat invoice ganda dari klik ulang |
| Kembali dari Duitku | **Memeriksa status pembayaran…** Redirect bukan bukti pembayaran berhasil |
| Terverifikasi | Tampilkan hasil yang benar-benar diberikan server: periode aktif/terjadwal atau saldo tambahan |
| Gagal/kedaluwarsa | Tampilkan alasan yang aman dan pilihan membuat pembayaran baru secara eksplisit |
| Status belum pasti | **Status pembayaran sedang diperiksa.** Tampilkan referensi invoice dan akses bantuan; jangan meminta pengguna langsung membayar lagi |

Perpanjangan saat masih aktif menambah periode setelah hak berjalan berakhir. Kredit periode berikutnya tidak langsung diberikan sebelum periode baru dimulai. UI membedakan **Perpanjangan terjadwal** dan **Kredit tersedia sekarang**.

Saldo nol tidak mengunci editor manual yang masih berhak. Setelah top-up, pekerjaan yang tertahan tetap menunggu tombol **Lanjutkan**; pembelian tidak menjadi izin otomatis menjalankan AI.

## 14. U11 — Ekspor naskah dan cadangan proyek

Tampilkan dua pilihan dengan fungsi berbeda: **Ekspor naskah Word** untuk dibaca/diedit sebagai buku, dan **Unduh cadangan proyek** untuk pemulihan bahan beserta struktur. Jangan memberi label bahwa keduanya sama-sama aman dibagikan kepada pembaca.

Sebelum ekspor naskah, pengguna meninjau nama di sampul, tokoh, detail pengenal, foto/keterangan, dan catatan pengantar. Pemeriksaan dasar tidak memakai kredit AI. Temuan jelas seperti nama yang dilarang, pemetaan privat, atau bahan tidak untuk buku harus diselesaikan. Petunjuk kontekstual ditampilkan untuk pertimbangan manusia tanpa skor pasti anonim.

Contoh pesan terhalang: **Ada nama yang kamu pilih untuk disamarkan tetapi masih muncul di naskah. Tinjau bagian tersebut sebelum mengunduh.** Berikan tautan ke temuan. Catatan pengantar sesuai perubahan nyata dan tidak mengklaim semua pihak telah menyetujui cerita.

Ekspor memakai versi naskah, aturan privasi, dan media yang sudah diperiksa. Jika berubah sebelum berkas dihasilkan, periksa ulang bagian terdampak. Nama publik juga diterapkan pada properti penulis dokumen; jika belum dipilih, properti itu dikosongkan tanpa mengambil identitas akun. Pemetaan privat, komentar kerja, dan riwayat tersembunyi tidak ikut ekspor naskah. Status **Siapkan berkas**, **Sedang menyiapkan**, **Siap diunduh**, **Tautan kedaluwarsa**, dan **Gagal menyiapkan** harus berbeda. Jangan menampilkan tombol unduh seolah berhasil sebelum berkas tersedia.

Pada cadangan, pilihan **Sertakan pemetaan identitas pribadi** secara bawaan tidak dicentang. Penjelasan: **Bahan asli dan rekaman masih dapat memuat nama asli meskipun pemetaan tidak disertakan. Simpan cadangan ini secara pribadi.** Impor meminta peninjauan privasi baru; laporan ekspor lama tidak otomatis berlaku.

Dalam masa baca/ekspor 15 hari, pengguna tetap dapat memperbaiki proyeksi nama/detail untuk ekspor secara manual tanpa membuka editor umum atau AI. Jangan mengharuskan perpanjangan hanya untuk menyelesaikan pemeriksaan privasi ekspor.

## 15. U12–U13 — Penyimpanan, retensi, penghapusan, dan bantuan

### 15.1 Penyimpanan

Tampilkan pemakaian dari kapasitas total akun, misalnya **640 MB dari 1 GB**, dengan rincian naskah/bahan/media/versi yang tersedia dari server. Semua buku berbagi kuota. Pembersihan menampilkan file yang dipilih serta dampaknya, bukan menghapus otomatis media yang dianggap kurang penting.

Ketika penuh: **Penyimpananmu penuh. Kamu masih bisa membaca, mengunduh, dan mengelola berkas. Sediakan ruang sebelum menyimpan hasil baru.** Tombol mengarah ke pengelolaan berkas. Jangan menawarkan pembelian kapasitas yang belum ada dalam katalog.

### 15.2 Setelah langganan berakhir

Selama 15 × 24 jam sejak `paid_until`, tampilkan banner dengan waktu pasti: **Langgananmu berakhir. Buku masih bisa dibaca dan diekspor sampai [tanggal, jam WIB].** Aksi: **Ekspor buku** dan **Perpanjang langganan**. Tampilkan hak terbatas secara konsisten pada menu, editor, dan tindakan AI.

Pemberitahuan diberikan saat periode berakhir, kemudian H-7 dan H-1 sebelum tenggat retensi. Jadwal berhenti ketika tidak lagi relevan. Selain email, deadline tetap terlihat di aplikasi; kegagalan email tidak boleh membuat tampilan menyatakan pesan telah terkirim.

Pada atau setelah tenggat, akses isi lama berakhir dan proses penghapusan dimulai. Sebelum pembayaran baru, jelaskan bahwa perpanjangan setelah tenggat tidak memulihkan proyek lama. Kredit tambahan yang masih sah tetap tercatat secara terpisah; saldo tidak memperpanjang retensi proyek.

Masa 15 hari merupakan jendela baca/ekspor. Rincian penghapusan primer dan kedaluwarsa cadangan mengikuti blueprint; jangan menyatakan semua salinan hilang tepat pada hari ke-15.

### 15.3 Penghapusan

Hapus proyek biasa masuk sampah tujuh hari, kecuali tenggat retensi lebih awal. Hapus permanen menjelaskan kehilangan akses dan cakupan bahan/versi/media. Slot serta kuota baru dibebaskan setelah penghapusan primer dikonfirmasi server.

Status **Menunggu penghapusan**, **Sedang dihapus**, **Penghapusan selesai**, dan **Perlu penanganan** dapat ditampilkan sesuai keadaan nyata. Target operasi normal 15 menit tidak boleh ditampilkan sebagai hitung mundur yang menjamin selesai. Batas penanganan gangguan tujuh hari dan cadangan hingga 30 hari sesudah penghapusan primer dijelaskan pada rincian kebijakan.

Hapus akun memakai dialog terpisah dengan dampak terhadap proyek, akses, dan saldo. Perlakuan sisa saldo yang belum diputuskan pada blueprint merupakan gerbang rilis fitur; jangan mengarang janji refund atau kebijakan penghangusan dalam desain.

### 15.4 Bantuan

Bantuan tersedia dari menu akun dan keadaan gagal yang relevan. Formulir memuat kategori, penjelasan, serta referensi transaksi/pekerjaan bila ada. Pengguna memilih sendiri bila ingin melampirkan isi cerita; isi dan pemetaan tokoh tidak otomatis dikirim bersama laporan.

Tampilkan target respons pertama **maksimal dua hari kerja** sesuai blueprint. Jangan menampilkan dukungan 24 jam atau konsultasi menulis pribadi sebagai fasilitas paket.

## 16. U01–U02 — Halaman publik dan autentikasi

Beranda publik memuat manfaat konkret, cuplikan tiga layar inti, cara kerja singkat, harga, penjelasan kredit, privasi, dan pertanyaan umum. Contoh hero: **Mulai dari satu cerita. Susun menjadi bukumu.** Penjelasan: **Tulis atau rekam pengalamanmu, dapatkan bantuan menyusun draf, lalu kembangkan dengan suaramu sendiri.**

Contoh tampilan menggunakan bahan sintetis yang jelas diberi label. Tidak ada testimoni, jumlah pengguna, logo penerbit, atau keberhasilan penjualan buku yang dibuat-buat. Batas 10 menit per berkas, kredit tambahan 30 hari, dan masa baca/ekspor 15 hari dapat ditemukan sebelum pembelian.

Masuk/daftar menggunakan metode yang benar-benar diimplementasikan. UI memiliki label input permanen, validasi yang jelas, pilihan menampilkan sandi, tautan pemulihan, dan keadaan sedang diproses. Jangan mengiklankan login sosial bila belum tersedia.

Halaman verifikasi dan pemulihan membedakan terkirim, perlu menunggu sebelum kirim ulang, tautan tidak valid/kedaluwarsa, dan berhasil. Gunakan pesan yang tidak mengungkap apakah email tertentu terdaftar pada alur yang berisiko enumerasi. Membuka email di tab lain tidak menyebabkan formulir atau cerita yang belum tersimpan hilang.

## 17. Komponen bersama dan penanganan keadaan

| Komponen | Varian/keadaan wajib | Aturan |
| --- | --- | --- |
| Tombol | Utama, sekunder, teks, bahaya, fokus, loading, tidak tersedia | Label tetap menjelaskan tindakan; alasan ketidaktersediaan dapat dibaca |
| Input/textarea | Kosong, terisi, fokus, invalid, read-only | Label bukan hanya placeholder; kesalahan tidak menghapus masukan |
| Kartu buku/cerita | Kosong, aktif, dijeda, perlu ditinjau, arsip/sampah | Tindakan tidak bergantung hover |
| Panel/drawer | Tertutup, terbuka, loading, gagal | Fokus dikelola; tutup mengembalikan fokus ke pemicu |
| Dialog | Konfirmasi biaya baru, privasi, konflik, hapus | Satu keputusan utama; tutup tidak diam-diam menyetujui |
| Ringkasan biaya | Estimasi, reservasi, berhasil, penyesuaian | Estimasi dan tagihan aktual tidak disamakan |
| Status simpan | Perangkat, menyinkronkan, tersinkron, gagal | Klaim sesuai tempat dan keberhasilan simpan |
| Pemrosesan AI | Antre, berjalan, belum pasti, selesai, gagal | Jangan membuat persentase/waktu selesai fiktif |
| Notifikasi | Info, berhasil, peringatan, gagal | Keputusan penting tetap ada pada layar, tidak hanya toast |
| Daftar perubahan | Baru, diterapkan, ditolak, kedaluwarsa | Versi naskah dan status persetujuan dapat dibedakan |

Microcopy penyimpanan dan gangguan:

| Kondisi | Pesan | Pemulihan |
| --- | --- | --- |
| Berhasil disimpan lokal saja | **Tersimpan di perangkat · Belum tersinkron.** Tambahkan **Menunggu koneksi** hanya jika benar-benar offline | Pertahankan buffer yang tersedia; AI baru memakai sumber yang sudah tersimpan dan sah di server |
| Sedang dikirim | **Menyinkronkan…** | Jangan tampilkan centang tersinkron lebih awal |
| Server menerima | **Tersinkron · [jam]** | Berdasarkan konfirmasi server |
| Penyimpanan lokal gagal | **Perubahan ini belum tersimpan. Salin tulisan sebelum meninggalkan halaman.** | Sediakan salin/unduh teks bila masih tersedia di memori |
| Konflik dua perangkat | **Ada versi lain dari tulisan ini. Pilih setelah membandingkan.** | Pertahankan kedua versi; tidak otomatis menimpa |
| Kredit tidak cukup | **Kredit belum cukup untuk pekerjaan ini. Ceritamu tetap tersimpan.** | Tambah kredit, kembali menulis manual, atau selesai sesuai hak |
| AI gagal tanpa hasil | **Pemrosesan belum berhasil. Tahap yang gagal tidak ditagih.** | Tampilkan hasil/tarif tahap lain yang memang berhasil |
| Hasil belum pasti | **Hasil sedang diperiksa. Jangan kirim ulang dulu.** | Rekonsiliasi terbatas; slot dan reservasi tidak menggantung tanpa tenggat |
| Layanan terganggu | **Layanan AI sedang mengalami gangguan. Kamu bisa melanjutkan menulis manual.** | Sesuaikan dengan hak aktif dan kemampuan simpan nyata |

Status hasil belum pasti mengikuti tenggat reservasi blueprint, maksimal 15 menit untuk rancangan awal. Pengguna dapat meninggalkan layar dan melihat status pekerjaan lagi. Setelah gagal terminal, **Coba lagi** merupakan tindakan baru yang jelas; hasil terlambat tidak boleh menagih ulang.

Versi pertama tidak menjanjikan penyuntingan offline penuh. Saat logout dengan perubahan belum tersinkron, tampilkan pilihan menyelesaikan sinkronisasi atau menyelamatkan salinan yang tersedia sebelum keluar. Akun berikutnya tidak melihat cerita akun sebelumnya.

## 18. Aksesibilitas dan kenyamanan baca

Target peluncuran adalah WCAG 2.2 tingkat AA pada alur yang dibangun, dengan pemeriksaan otomatis dan manual. Daftar berikut merupakan fokus minimum untuk desain dan pengujian, bukan keseluruhan standar.

1. Teks biasa minimal 4,5:1 terhadap latar; teks besar mengikuti ambang 3:1 yang sesuai definisi standar. Gunakan rasio 4,5:1 juga untuk teks penting yang meragukan kategorinya. [WCAG: kontras teks](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
2. Tampilan dapat mengalir ulang pada lebar 320 CSS px tanpa gulir dua arah pada alur baca/menulis biasa. Uji pembesaran hingga 400% pada viewport yang sesuai. [WCAG: reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
3. Kontrol utama ditargetkan 44 × 44 CSS px. Ketentuan WCAG AA SC 2.5.8 memiliki minimum dasar 24 × 24 CSS px dengan pengecualian; 44 px adalah keputusan produk untuk kenyamanan. [WCAG: ukuran target](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
4. Fokus keyboard terlihat dan tidak tertutup bilah tindakan, dialog, atau panel buatan aplikasi. Uji juga keyboard virtual pada perangkat nyata. [WCAG: fokus tidak tertutup](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
5. Struktur heading, label, nama tombol, urutan Tab, dan pengembalian fokus setelah dialog mengikuti urutan tugas. Tautan lewati navigasi tersedia.
6. Toast/progres menggunakan pengumuman yang tidak menginterupsi terus-menerus. Timer rekaman tidak dibacakan setiap detik oleh pembaca layar.
7. Status dibedakan melalui teks atau ikon selain warna. Penandaan perubahan naskah dapat dipahami tanpa warna merah/hijau.
8. Pengurutan bab memiliki alternatif tombol, bukan hanya drag-and-drop. Dialog tidak menjebak pengguna tanpa jalan keluar.
9. Input mendukung karakter Indonesia, nama Jepang, tanda baca panjang, dan paragraf yang membungkus tanpa merusak tata letak.
10. Pengurangan gerak, ukuran teks, dan mode baca tidak merusak akses ke kontrol penting. Tidak ada audio yang diputar otomatis.

## 19. Prototipe, bahan contoh, dan kriteria penerimaan

### 19.1 Bahan contoh

Gunakan proyek sintetis **Langkah Menuju Jepang**, tokoh diri **Nara**, dan nama pena sampul **Citra Senja**. Semua nama dan isi contoh dibuat untuk pengujian; bukan riwayat istri pemilik produk. Nama akun tester tidak dimasukkan ke sampul.

Siapkan satu momen pendek, satu jawaban panjang, satu bagian dengan waktu perkiraan, dua tokoh dengan nama panggilan yang sama, dan satu bahan berlabel Jangan kirim ke AI. Rekaman uji berasal dari bahan sintetis atau bahan yang pemiliknya secara eksplisit izinkan.

### 19.2 Alur prototipe pertama

Buka buku, pilih momen, setujui plafon biaya simulasi, jawab satu pertanyaan, lewati satu pertanyaan, pilih Buat draf sekarang, tinjau usulan, lalu gunakan di bagian naskah. Tambahkan jalur jeda dan lanjutkan pada hari berbeda. Seluruh transaksi/AI dalam prototipe diberi status simulasi; tidak mengesankan telah memproses pembayaran atau naskah nyata.

Frame utama: 390 × 844 untuk HP dan 1440 × 900 untuk laptop. Tambahkan pemeriksaan 320, 360, 768, dan 1024 CSS px, serta kondisi keyboard HP terbuka. Ukuran frame adalah titik uji, bukan ukuran layar yang dikunci dalam kode.

### 19.3 Pemeriksaan penerimaan

| ID | Skenario | Bukti kelulusan |
| --- | --- | --- |
| UX01 | Mulai buku baru | Dapat mulai tanpa daftar isi, tokoh, atau hikmah wajib; judul sementara sah |
| UX02 | Pilih cerita | Maksimal tiga saran; topik sendiri dan langsung bercerita tersedia |
| UX03 | Satu pertanyaan | Judul, isi, dan placeholder bersama-sama hanya meminta satu informasi |
| UX04 | Pertanyaan keempat | Menunggu tindakan; tidak mengeluarkan pertanyaan kelima |
| UX05 | Lewati berurutan | Dua Lewati menghentikan penggalian biasa; bahan tetap ada |
| UX06 | Jeda/refresh/perangkat lain | Jumlah pertanyaan dan tagihan sesi tidak direset |
| UX07 | Audio | Batas per berkas, izin, transkripsi terpisah, koreksi, dan Kirim jawaban dapat dibedakan |
| UX08 | Audio parsial | Lima menit berhasil dari sepuluh menampilkan lima kredit; retry tidak menagih interval pertama |
| UX09 | Hasil draf | Tidak ada pertanyaan baru otomatis; usulan dapat ditinjau sebelum masuk naskah |
| UX10 | Refleksi | Opsional; satu pertanyaan pada sesi terpisah; Lewati tidak menghasilkan hikmah buatan |
| UX11 | Tokoh diri | Seluruh tokoh dan nama sampul dapat disamarkan; identitas akun tidak terisi otomatis |
| UX12 | Privasi | Penanda no-AI dan no-book berbeda; pratinjau penggantian dan ekspor mengikuti pilihan terbaru |
| UX13 | Kredit/entitlement | Saldo nol tidak mengunci edit manual aktif; top-up tidak otomatis melanjutkan AI |
| UX14 | Deadline | Top-up 30 hari, baca/ekspor 15 hari, tanggal/jam WIB, serta H-7/H-1 konsisten |
| UX15 | Duitku | Halaman kembali menunggu verifikasi; klik berulang tidak menambah invoice/grant |
| UX16 | Simpan/konflik | Status lokal/cloud berbeda; kedua versi selamat saat konflik; logout mengisolasi akun |
| UX17 | Ekspor saat retensi | Proyeksi privasi manual tersedia sampai tenggat tanpa perpanjangan |
| UX18 | Kapasitas penuh | Baca/unduh/kelola tetap tersedia; hasil gagal disimpan tidak ditagih |
| UX19 | Pekerjaan terbatas | Susun bagian dan tinjauan menunjukkan sumber, jumlah kata, biaya, serta batas cakupan |
| UX20 | Aksesibilitas | Kontras aktual, keyboard, fokus, pembaca layar, reflow, dan target sentuh diperiksa |
| UX21 | Tulisan panjang di HP | Keyboard tidak menutupi kontrol; baris akhir terbaca; tidak ada gulir horizontal biasa |
| UX22 | Waktu retensi habis | Akses ditutup sesuai server; pembayaran setelah tenggat tidak menjanjikan pemulihan isi lama |

Pengujian kenyamanan awal meminta calon penulis memulai, melewati pertanyaan, menjeda, meninjau draf, dan menemukan ekspor tanpa arahan langkah demi langkah. Catat titik bingung dan komentar, lalu perbaiki. Skor tampilan atau kesukaan pribadi bukan pengganti pengujian tugas.

## 20. Prompt siap pakai untuk Stitch atau Claude Design

### 20.1 Prompt eksplorasi

Salin prompt berikut. Lampirkan dokumen ini jika alat mendukung berkas; jika tidak, sertakan bagian yang relevan. Semua teks UI harus bahasa Indonesia. Prompt ini meminta desain/prototipe, bukan publikasi aplikasi.

```text
Design a responsive web app called CeritaJadiBuku that helps ordinary people turn personal experiences into a memoir. Use Indonesian UI copy with the pronoun "kamu". The brand is warm, patient, clear, and respectful of the writer's voice. Tagline: "Ceritamu, menjadi buku."

Create three connected core screens, each at mobile 390x844 and desktop 1440x900:
1. Book home: current book, saved stories, recent work, and a clear "Lanjutkan ceritamu" action.
2. Storytelling session: exactly one active question, a multiline answer, text or recording input, and visible "Kirim jawaban", "Lewati", "Buat draf sekarang", and "Simpan dan jeda" controls.
3. Manuscript workspace: collapsible chapter outline, a spacious editor, and an AI proposal that the writer reviews before applying.

Show two visual directions first using the same content and flow: A, a warm writing room with cream surfaces and editorial headings; B, a spacious editorial workspace with more white. Keep both within the same brand palette. Do not generate many unrelated screens or mix design systems.

Brand colors: background #F7F3EA, primary green #264E46, main text #243230, white surfaces, secondary text #5B6B65. Use terracotta #C77856 only as a decorative accent; use #8E472D if small accent text is required. White text on primary green is the default primary button. Use serif book headings and manuscript reading text, with sans-serif UI controls. Start editor text at 18px with generous line spacing. Keep meaningful controls readable, with 44px touch targets and visible focus states.

On mobile show one main workspace at a time. A chapter drawer or proposal view replaces side panels. Account for the on-screen keyboard: the answer and Send/Skip controls must remain reachable. On wide desktop the outline, editor, and optional proposal panel may sit beside each other. Use restrained motion and no animation behind writing text.

Product rules:
- Topic selection shows at most three suggestions, plus "Tulis topik sendiri" and "Langsung bercerita".
- Each interview covers one moment. Ask exactly one information request at a time, at most four displayed questions including skipped ones. Two consecutive skips end the interview. The fourth question still waits for the user's action.
- A sufficient story may become a draft early under the session's accepted price ceiling. After a draft appears, no question or next session starts automatically.
- Reflection is optional. A separate reflection session has one skippable question. Do not force a moral lesson or a positive ending.
- Show the maximum text-session cost before starting: 5 credits, made up of 1 interview credit and 4 draft credits. Audio transcription is separate at 1 credit per successfully processed minute. A recording is at most 10 minutes or 25MB per file, not per month. Ending a recording never sends the answer automatically.
- AI output is a proposal. Preserve source material and distinguish applying a proposal from saving it.
- All characters, including the writer as narrator, may use pseudonyms. The cover pen name is separate from account identity. Never fill the cover name from the account.
- Show truthful local/cloud save states and recoverable errors. Do not promise full offline editing.

Use synthetic sample content only: book "Langkah Menuju Jepang", self character "Nara", publication pen name "Citra Senja". Do not invent real testimonials or user statistics.

Supply the default screens plus variants for empty book, active recording, AI processing, draft review, and failed synchronization. Keep all states in the same component system. If interactive prototyping is supported, connect book home -> moment selection -> one-question session -> draft review -> manuscript. Otherwise provide annotated frames describing the same transitions. Do not simulate a successful real payment or real AI processing.

Document palette, typography, spacing, components, responsive behavior, and unresolved design choices. Provide the available design/code export and a concise handoff for implementation. Follow ui-ux-spec.md and blueprint.md when an example conflicts with a product rule.
```

### 20.2 Prompt penyempurnaan setelah arah dipilih

```text
Use the selected visual direction consistently across the existing CeritaJadiBuku screens. Preserve the approved palette, spacing, typography, and button hierarchy. Refine the mobile keyboard layout, one-question session controls, long-form reading, and AI proposal comparison. Keep costs, privacy choices, and real save states visible when relevant.

Extend this system to character privacy, credits/subscription, export, and the expired-subscription read/export view. Subscription: Rp79.000 per calendar month, 150 credits, 3 projects, 1GB shared storage. Top-ups: 50 credits/Rp29.000 or 150 credits/Rp59.000, each valid for 30 days from verified payment and usable with an active subscription. Read/export access lasts 15 days after the paid subscription ends. Show exact deadlines in WIB. Use Duitku payment states without treating a browser redirect as proof of success.

Include "Nama di sampul", "Tokoh saya dalam cerita", and "Samarkan semua tokoh, termasuk saya" with preview before applying. Export privacy review remains available during the 15-day read/export period. Do not add new pricing tiers, mandatory reflection, public sharing, or full-book AI review. Deliver updated screens and the changes to the shared component specification.
```

Stitch menyediakan alur desain menuju implementasi; panduan Google juga mencontohkan pengambilan konteks desain dan pemeriksaan hasil kode. Claude Design menyediakan eksplorasi, mockup, prototipe, dan ekspor HTML. Hasil yang tersedia pada akun alat masing-masing tetap perlu diperiksa. Tidak ada asumsi bahwa ekspor langsung menjadi aplikasi produksi atau bahwa integrasi otomatis dengan Codex sudah terpasang. [Google: desain ke kode](https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch), [Claude Design](https://claude.com/product/design)

## 21. Instruksi serah terima untuk Codex

Berikan dokumen ini bersama blueprint, panduan implementasi, kajian pendamping, dan gambar/berkas desain terpilih. Rujukan produk menentukan perilaku; mockup menentukan arah visual. Gambar tidak mengubah harga atau izin data.

Instruksi pembuka:

```text
Implementasikan UI CeritaJadiBuku berdasarkan blueprint.md v1.4, langkah-implementasi.md v1.3, dan ui-ux-spec.md v1.0. Periksa instruksi lingkungan dan repositori terlebih dahulu. Pertahankan perubahan pengguna. Gunakan desain terpilih sebagai rujukan visual dan gunakan kontrak produk untuk perilaku, hak akses, biaya, dan privasi.

Mulai dari tiga layar inti yang terhubung: beranda buku, sesi bercerita, dan editor/peninjauan draf. Bila desain terpilih belum tersedia, gunakan arah A dalam ui-ux-spec.md sebagai default yang dapat ditinjau. Gunakan data sintetis dan provider simulasi sesuai tahap implementasi. Jangan menganggap tombol atau transaksi simulasi sebagai integrasi produksi yang sudah selesai.

Bangun token warna, tipografi, jarak, dan komponen bersama. Pisahkan presentasi dari status pekerjaan, pembayaran, dan penyimpanan yang otoritatif di server. Hindari state UI lokal yang membuat pekerjaan AI atau tagihan terlihat berhasil sebelum server mengonfirmasi. Ikuti Next.js, TypeScript, Tiptap, dan fondasi blueprint; adaptasikan ekspor desain menjadi komponen yang sesuai proyek.

Implementasikan satu pertanyaan per giliran, Lewati, jeda, batas sesi, pratinjau usulan, status simpan lokal/cloud, dan keadaan gagal. Periksa HP dengan keyboard terbuka serta editor berisi tulisan panjang. Jalankan pemeriksaan fungsional yang relevan dan tinjauan visual melalui browser bila tersedia. Jika alat atau akses tidak tersedia, laporkan bagian yang belum terverifikasi tanpa mengklaim lulus.

Simpan komponen, catatan keputusan, tangkapan layar yang relevan, dan hasil pengujian dalam struktur proyek. Lanjutkan pekerjaan yang sudah diotorisasi sesuai panduan implementasi. Jangan membeli layanan, memublikasikan aplikasi, atau mengaktifkan pembayaran produksi tanpa otorisasi yang sesuai.
```

### 21.1 Paket serah terima desain

| Berkas/hasil | Isi yang diperlukan |
| --- | --- |
| Dokumen ini | Aturan visual, layar, interaksi, dan acceptance UI |
| Desain terpilih | Frame HP/laptop dengan nama layar dan keadaan yang jelas |
| Token/komponen | Warna, ukuran, jarak, varian, fokus/loading/error |
| Aset | Logo/ikon/ilustrasi yang benar-benar digunakan, dengan asal dan izin pemakaian |
| Ekspor kode bila tersedia | Referensi implementasi; diperiksa dependensi, struktur, dan lisensinya sebelum dipakai |
| Catatan keputusan | Alternatif terpilih, perubahan dari spesifikasi, dan hal yang masih perlu diuji |

Codex dapat menerima gambar sebagai konteks dan bekerja pada kode lokal. Penerjemahan desain tetap perlu ditinjau dari hasil browser, terutama responsif, interaksi, dan keadaan gagal. [Dokumentasi Codex](https://learn.chatgpt.com/docs/codex/cli)

### 21.2 Definisi selesai untuk tahap UI

- [ ] Satu arah visual diterapkan konsisten pada seluruh layar yang termasuk tahap ini.
- [ ] Tiga layar inti terhubung dan mendemonstrasikan perjalanan cerita menjadi bagian naskah.
- [ ] Komponen bersama mencakup fokus, loading, error, read-only, dan tidak tersedia.
- [ ] Tampilan HP, tablet, laptop, keyboard terbuka, dan teks panjang telah diperiksa sesuai alat yang tersedia.
- [ ] Kontrak sesi, biaya, privasi tokoh, masa kredit 30 hari, dan retensi 15 hari cocok dengan blueprint.
- [ ] Hasil visual dibandingkan dengan desain terpilih; perbedaan yang disengaja dicatat.
- [ ] Klaim simpan, pembayaran, pemrosesan AI, ekspor, dan penghapusan mengikuti status nyata atau berlabel simulasi.
- [ ] Pemeriksaan aksesibilitas yang dijalankan beserta batasnya tercatat; tidak ada klaim kepatuhan menyeluruh tanpa audit yang memadai.
- [ ] Bagian yang belum terhubung ke backend ditandai dalam catatan implementasi dan tidak dinyatakan siap produksi.

Rilis publik tetap memerlukan seluruh gerbang dalam blueprint dan panduan implementasi, termasuk privasi, pembayaran, pemulihan, dan pengujian mutu tulisan. Kelulusan tahap UI tidak menggantikan gerbang tersebut.
