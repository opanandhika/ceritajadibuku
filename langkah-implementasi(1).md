# Langkah Implementasi CeritaJadiBuku

Panduan kerja untuk Codex dalam membangun versi pertama aplikasi sesuai `blueprint.md` versi 1.4.

| Keterangan | Nilai |
| --- | --- |
| Nama aplikasi | CeritaJadiBuku |
| Versi panduan | 1.3 |
| Tanggal | 10 September 2026 |
| Dokumen pasangan | `blueprint.md` versi 1.4 atau revisi terbaru yang diberikan pemilik |
| Sasaran | Codex atau pengembang yang menerima tugas implementasi |
| Status awal | Panduan pelaksanaan; belum ada klaim kode, integrasi, atau pengujian selesai |

## 1 Cara menggunakan dokumen

Berikan dokumen ini bersama `blueprint.md` kepada Codex di workspace proyek. Blueprint menjelaskan perilaku produk dan batasnya; dokumen ini menentukan urutan kerja, keluaran, serta bukti yang diperlukan untuk menyatakan suatu tahap selesai.

Baca keduanya sebelum mengubah kode. Jangan menggunakan rancangan lama yang masih menyebut Midtrans, rekaman 10 menit per bulan, atau pertanyaan refleksi yang wajib muncul pada setiap subbab.

Revisi 1.2 melengkapi **Tokoh dan Privasi Buku**, termasuk nama pena dan penyamaran tokoh penulis sendiri; penyusunan potongan menjadi buku; batas serta biaya setiap pekerjaan AI; penanganan kegagalan; dan kebutuhan operasional produksi. Rujuk blueprint Bagian 7.4–7.14, 9.1, serta kajian biaya pada Bagian 20. Urutan tetap Tahap 0–12. Harga paket Rp79.000/150 kredit dan top-up 50 kredit/Rp29.000 dipertahankan. Top-up 150 kredit disesuaikan dari Rp69.000 menjadi Rp59.000 sebagai rancangan komersial baru sebelum peluncuran; operasi AI penyusunan bagian ditambahkan dengan tarif 6 kredit dan cakupan eksplisit.

Revisi 1.3 menerapkan blueprint versi 1.4: kredit tambahan berlaku 30 hari sejak pembayaran terverifikasi; masa baca dan ekspor setelah langganan berakhir adalah 15 hari sejak `paid_until`. Gunakan konfigurasi hari, jadwal pengingat, dan pengujian batas waktu terbaru.

`kajian-harga-dan-penulisan.md` versi 1.1 merupakan lampiran alasan dan sumber riset, bukan kontrak tambahan yang mengubah angka atau perilaku produk. Jika angka provider berubah, perbarui kajian dan ajukan perubahan produk secara terbuka. Sasaran operasional dan pilot di dokumen ini adalah target rekayasa untuk dibuktikan, bukan janji publik otomatis.

Periksa instruksi sistem, instruksi pengguna terbaru, dan `AGENTS.md` yang berlaku di lingkungan kerja. Dokumen ini tidak mengubah hak akses atau kebijakan persetujuan lingkungan tersebut.

### 1.1 Instruksi pembuka untuk Codex

> Bangun CeritaJadiBuku berdasarkan blueprint.md dan langkah-implementasi.md ini. Mulai dengan memeriksa repositori, instruksi yang berlaku, serta dependensi yang sudah tersedia. Kerjakan tahap implementasi secara berurutan dan lanjutkan pekerjaan yang sudah diotorisasi tanpa meminta persetujuan di setiap tahap. Gunakan provider simulasi untuk pekerjaan yang belum memiliki kredensial. Catat kemajuan, hasil pengujian, dan hambatan secara jujur. Jangan mengaktifkan pembayaran produksi, membeli layanan, atau memublikasikan aplikasi tanpa otorisasi yang sesuai. Selesaikan implementasi yang dapat dilakukan, lalu sampaikan kebutuhan akses atau keputusan yang benar-benar menghalangi langkah berikutnya.

### 1.2 Urutan rujukan produk

1. Koreksi atau keputusan terbaru dari pemilik produk.
2. Blueprint terbaru yang diberikan untuk proyek ini.
3. Dokumen langkah implementasi ini.
4. Pilihan implementasi yang dicatat dalam keputusan teknis proyek.

Jika ditemukan pertentangan yang memengaruhi perilaku pengguna, pembayaran, privasi, atau kehilangan data, jelaskan pertentangannya dan gunakan jalur yang tidak menambah risiko sambil menyelesaikan pekerjaan lain. Pilihan rutin seperti nama fungsi atau pembagian komponen dapat diputuskan pengembang tanpa menunggu pengguna.

## 2 Aturan produk yang harus dipertahankan

| Area | Aturan yang harus tampak pada implementasi |
| --- | --- |
| Nama | CeritaJadiBuku; gunakan `ceritajadibuku` untuk slug konfigurasi |
| Platform | Web responsif untuk HP, tablet, dan laptop |
| Memulai cerita | Maksimal tiga saran, Tulis topik sendiri, dan Langsung bercerita |
| Sesi biasa | Satu momen, satu pertanyaan per giliran, maksimal empat pertanyaan yang ditampilkan |
| Lewati | Selalu tersedia; dua Lewati berturut-turut menghentikan sesi biasa |
| Jeda | Menyimpan tanpa memulai pekerjaan AI baru; resume mempertahankan state dan tagihan tahap |
| Setelah draf | Tidak otomatis bertanya atau membuka sesi baru |
| Refleksi | Opsional; cerita saja, refleksi pribadi, atau pesan eksplisit sesuai pilihan penulis |
| Sesi refleksi terpisah | Satu pertanyaan; satu Lewati sudah mengakhiri penggalian |
| Rekaman | Maksimal 10 menit atau 25 MB **per berkas**, bukan per bulan |
| Audio dan jawaban | Beberapa potongan audio boleh menjadi satu jawaban; jangan otomatis mengirim jawaban ketika satu rekaman selesai |
| Paket awal | Rp79.000 per bulan, 150 kredit, tiga proyek termasuk arsip, kuota 1 GB per akun |
| Masa kredit tambahan | 30 hari sejak pembayaran terverifikasi; tetap memerlukan langganan aktif |
| Masa baca/ekspor setelah langganan | 15 hari sejak `paid_until`; tampilkan deadline dan pengingat |
| Kredit | Penggalian 1, draf 4, revisi 2, penyusunan bagian 6, tinjauan bagian terpilih 10, transkripsi 1 per menit; ikuti batas kata dan token blueprint |
| Penyimpanan | Cloud utama dengan salinan kerja lokal; jangan menyamakan simpan lokal dengan tersinkron |
| Pembayaran | Duitku POP; perpanjangan awal melalui invoice manual dan pengingat |
| Privasi | Larangan kirim ke AI berbeda dari larangan masuk buku; berlaku pula pada turunan sumber |
| Identitas buku | Mode `real`, `pseudonym`, atau `mixed`; kombinasi disarankan. Mode buku hanya default, keputusan tiap tokoh tetap eksplisit |
| Identitas tokoh | `real`, `pseudonym`, `role`, atau `pending`; nama asli opsional dan privat. `pending` memakai penanda seperti [Teman A], bukan izin menampilkan nama asli |
| Identitas penulis | Semua tokoh termasuk penulis/narator boleh disamarkan. Nama pena pada sampul, tokoh diri, dan identitas akun/tagihan terpisah; jangan autofill nama akun atau email ke buku maupun metadata |
| Menjadi buku | Pilih potongan, tentukan tujuan dan urutan, tinjau usulan gabungan serta transisi, lalu terapkan; sumber tetap terlacak |
| Teknik bercerita | Fokus, pembaca, benang merah, struktur, adegan, ringkasan, dan refleksi menjadi bantuan opsional; tidak memaksa hikmah atau penutupan konflik |
| Cakupan tinjauan | Tinjau bagian terpilih sampai 5.000 kata; jangan mengklaim seluruh buku diperiksa dari potongan yang diproses terpisah |
| Pengaturan tokoh | Dibuka pengguna setelah draf; satu pertanyaan dan Atur nanti, tanpa pertanyaan atau sesi berbayar otomatis |
| Konteks AI | Gunakan alias atau penanda khusus proyek sebelum memanggil AI; jangan kirim pemetaan privat nama asli. Penyamaran tidak membatalkan larangan AI |
| Ekspor buku | Tinjau snapshot naskah, kebijakan identitas, dan media; nama yang diketahui dilarang atau bocoran pemetaan harus diselesaikan sebelum ekspor |
| Cadangan proyek | Pemetaan privat opt-in terpisah, default tidak disertakan; sumber dan audio masih mungkin mengandung identitas asli |
| Biaya pengaturan | Pengaturan tokoh, penggantian deterministik, tinjauan dasar, dan templat pengantar tidak memotong kredit AI |
| Kendali penulis | Hasil AI adalah usulan; tidak menimpa naskah yang disetujui tanpa tindakan pengguna |

Jumlah proyek mencakup arsip serta sampah sampai dihapus permanen. Batas isi, ukuran berkas, masa kredit, dan retensi lengkap tetap mengikuti blueprint.

## 3 Cara bekerja dan melaporkan kemajuan

### 3.1 Jalankan pekerjaan dalam tahapan yang dapat ditinjau

Setiap tahap harus menghasilkan kode atau konfigurasi yang dapat diperiksa, pengujian atas risiko yang relevan, dan catatan hasil. Jika menggunakan Git, buat perubahan dalam kelompok yang jelas dan jangan menghapus perubahan pengguna yang sudah ada.

Bedakan status berikut:

- `belum_dikerjakan`: belum ada implementasi tahap tersebut.
- `sedang_dikerjakan`: ada pekerjaan aktif dengan hasil belum lengkap.
- `kode_selesai`: implementasi ada, tetapi bukti integrasi yang diperlukan belum lengkap.
- `teruji_lokal`: perilaku terkait sudah dijalankan di lingkungan lokal.
- `teruji_sandbox`: integrasi layanan telah dibuktikan di sandbox atau lingkungan uji.
- `terblokir`: langkah tertentu tidak dapat dilakukan dengan akses yang tersedia.
- `siap_rilis`: seluruh syarat rilis relevan terpenuhi; bukan berarti sudah dipublikasikan.

Jangan menyatakan suatu integrasi teruji hanya karena mock, typecheck, atau build berhasil.

### 3.2 Dokumen kerja yang dibuat di repositori

Path berikut adalah keluaran yang perlu dibuat atau dipadankan dengan struktur repositori yang sudah ada, bukan klaim bahwa file tersebut saat ini tersedia.

| Dokumen | Isi |
| --- | --- |
| `docs/discovery.md` | Kondisi repositori, instruksi, stack, lingkungan, serta komponen yang dapat dipakai |
| `docs/keputusan-teknis.md` | Pilihan implementasi, alasan, konsekuensi, dan keputusan yang belum final |
| `docs/progres-implementasi.md` | Status setiap tahap, bukti, hambatan, serta langkah berikutnya |
| `docs/hasil-verifikasi.md` | Skenario, lingkungan, perintah yang dijalankan, hasil nyata, dan keterbatasan |
| `docs/panduan-operasional.md` | Konfigurasi, email, job, transaksi, cadangan layanan, RPO/RTO yang teruji, pemulihan, dan penghapusan |
| `README.md` | Menjalankan aplikasi, mode simulasi, dependensi, dan tautan dokumentasi |

Jangan menulis rahasia atau naskah pribadi dalam dokumen kerja, log, fixture publik, atau commit.

Catat model data tokoh, jalur akses pemetaan privat, versi kebijakan identitas, titik penyamaran konteks, dan cakupan tinjauan ekspor dalam keputusan teknis. Progres dan hasil verifikasi harus menyebut status fitur privasi ini secara terpisah agar keberhasilan mengganti satu nama tidak dianggap bukti perlindungan seluruh alur.

### 3.3 Jika kredensial belum tersedia

Sediakan adapter simulasi dan data sintetis. Selesaikan antarmuka, kontrak, validasi, migrasi, serta pengujian lokal yang independen. Tulis integrasi mana yang belum dibuktikan dan konfigurasi apa yang diperlukan.

Mock pembayaran dan pemberian saldo tester harus terbatas pada lingkungan pengembangan. Pengguna tidak boleh mengaktifkannya melalui parameter permintaan, URL, atau tombol yang dapat diakses pada produksi.

Terapkan secret melalui fasilitas environment atau pengelolaan rahasia yang tersedia. Jangan meminta pengguna menempelkan kunci API ke dokumen atau repositori.

## 4 Peta tahap dan dependensi

| Tahap | Fokus | Prasyarat | Hasil utama |
| --- | --- | --- | --- |
| 0 | Discovery | Blueprint dan akses workspace | Rencana penerapan pada repositori nyata |
| 1 | Fondasi aplikasi dan prototipe | Tahap 0 | Alur utama dan pilot kenyamanan kecil dengan provider simulasi |
| 2 | Identitas, data, dan privasi | Tahap 1 | Proyek privat, sumber berversi, tokoh, dan pemetaan privat |
| 3 | Sesi persisten dan refleksi | Tahap 2 | Wawancara konsisten dan pengaturan tokoh atas tindakan pengguna |
| 4 | Editor dan struktur buku | Tahap 2 dan 3 | Penyusunan potongan menjadi bagian, konsistensi tokoh, dan usulan perubahan |
| 5 | Hak langganan dan ledger | Tahap 2 | Reservasi dan penagihan kredit yang teruji |
| 6 | Antrean dan AI teks | Tahap 3, 4, dan 5 | Pekerjaan AI yang tahan gangguan dan terukur |
| 7 | Rekaman dan transkripsi | Tahap 5 dan 6 | Audio per berkas dengan durasi serta biaya benar |
| 8 | Sinkronisasi, ekspor, dan cadangan | Tahap 4, 6, dan 7 | Tinjauan privasi ekspor, alur lintas perangkat, dan pemulihan nyata |
| 9 | Pembayaran Duitku | Tahap 5 dan mekanisme job Tahap 6 | Invoice serta callback tanpa grant ganda |
| 10 | Retensi dan operasi | Tahap 8 dan 9 | Penghapusan, pengingat, dan dukungan yang dapat dijalankan |
| 11 | Uji terpadu dan pengguna | Tahap 6 sampai 10 | Bukti perilaku dan biaya versi pertama |
| 12 | Penyiapan rilis | Tahap 11 | Paket rilis yang konkret dan dapat ditinjau |

Fondasi ledger dimajukan sebelum AI nyata. Bagian monetisasi yang dikerjakan belakangan adalah penerimaan pembayaran komersial. Prototipe lebih awal menggunakan simulasi sehingga tidak mengirim cerita pribadi atau menimbulkan tagihan provider tanpa kendali.

Pekerjaan independen boleh berjalan berdampingan. Jangan menggabungkan cabang atau mengaktifkan tahap dependen sebelum kontrak yang diperlukan siap.

Uji kenyamanan kecil dimulai pada prototipe Tahap 1. Setelah fondasi privasi, ledger, dan AI nyata terbukti pada Tahap 6–8, lakukan uji mutu tulisan beberapa sesi sebelum seluruh pembayaran selesai dibangun. Gunakan peserta serta kuota pilot yang dibatasi dan diotorisasi; jangan membuka percobaan AI publik tanpa batas. Uji terpadu Tahap 11 tetap wajib.

## 5 Tahap 0 Memeriksa kondisi proyek

**Tujuan:** mengetahui apa yang benar-benar tersedia sebelum menentukan struktur implementasi.

Kerjakan:

1. Baca seluruh `blueprint.md`, dokumen ini, dan instruksi repositori yang berlaku.
2. Periksa status Git serta perubahan pengguna. Jika repo belum ada, siapkan struktur proyek sesuai lokasi kerja yang diberikan; jangan mengarang remote atau menimpa repo lain.
3. Identifikasi framework, bahasa, package manager, lockfile, skrip, test runner, migration, serta konfigurasi hosting.
4. Jika ada `.openai/hosting.json`, ikuti alur Sites yang berlaku di lingkungan tersebut. Jangan mengubah jalur hosting yang sudah ada tanpa memahami konsekuensinya.
5. Inventarisasi keberadaan konfigurasi Supabase, AI, Duitku, dan email tanpa mencetak nilai rahasia.
6. Pisahkan lingkungan development, sandbox atau staging, dan production. Jangan menjalankan migrasi destruktif pada data produksi untuk menyiapkan prototipe.
7. Tulis discovery, keputusan teknis awal, dan daftar tahap dalam dokumen progres.
8. Petakan penyebutan tokoh dalam editor, sumber, transkrip, foto, konteks AI, cache, ekspor, dan cadangan. Identifikasi titik akses pemetaan privat dan migrasi data tokoh lama; jangan menganggap nama lama sudah memperoleh persetujuan untuk diterbitkan.

**Selesai ketika:** repositori, perintah menjalankan aplikasi, lingkungan data, serta hambatan akses diketahui. Keputusan nama fungsi atau pemilihan komponen rutin tidak perlu dibawa sebagai pertanyaan kepada pemilik.

## 6 Tahap 1 Fondasi aplikasi dan prototipe sesi

**Tujuan:** membuktikan pengalaman utama dengan provider simulasi dan data contoh.

Kerjakan:

1. Siapkan Next.js dan TypeScript atau sesuaikan fondasi yang sudah kompatibel. Gunakan versi yang tersedia dan dokumentasi resmi; kunci dependensi pada lockfile.
2. Bangun kerangka halaman Buku saya, Ruang proyek, Sesi cerita, Editor, Tokoh dan Privasi Buku, serta Kredit dan langganan.
3. Terapkan nama CeritaJadiBuku, palet merek, tipografi, fokus keyboard, dan tampilan responsif.
4. Buat adapter simulasi dengan skenario cerita cukup, cerita singkat, pertanyaan bertumpuk, respons gagal, dan hasil terlambat.
5. Implementasikan tiga saran cerita, topik sendiri, dan cerita bebas. Saran tidak mengasumsikan kejadian spesifik yang belum diberikan pengguna.
6. Buat state machine sebagai logika yang dapat diuji di luar komponen tampilan. Mesin ini nantinya dipakai di server, bukan digandakan dengan perilaku berbeda.
7. Tampilkan satu pertanyaan beserta Kirim jawaban, Lewati, Buat draf sekarang, dan Simpan dan jeda.
8. Tambahkan prototipe pilihan identitas buku, kartu tokoh, tombol Tinjau tokoh setelah draf, serta Tinjau Privasi Buku sebelum ekspor. Gunakan tokoh sintetis; pengaturan ini tidak memulai wawancara atau pemotongan kredit.
9. Tambahkan pilihan Samarkan semua tokoh termasuk saya, pratinjau nama pena di sampul, dan tokoh narator dengan identitas terpisah. Penerapan massal tetap ditinjau sebelum disimpan; jangan mengubah pilihan tokoh secara diam-diam.
10. Lakukan pilot kenyamanan kecil: apakah pengguna memahami satu pertanyaan, Lewati, jeda, biaya contoh, dan perbedaan nama akun dengan nama dalam buku. Catat bagian yang membingungkan sebelum meneruskan tampilan; hasil mock tidak menjadi bukti mutu tulisan AI.

**Verifikasi:** satu cerita yang cukup dapat langsung menjadi draf; pertanyaan keempat menunggu jawaban; dua Lewati menghentikan sesi biasa; setelah draf tidak ada pertanyaan otomatis.

**Selesai ketika:** alur satu momen dapat dicoba pada tampilan HP dan laptop. Semua hasil simulasi dilabeli sebagai data contoh di lingkungan pengembangan. Belum ada klaim bahwa penyimpanan atau AI nyata sudah terhubung.

## 7 Tahap 2 Identitas data dan privasi

**Tujuan:** membuat sumber cerita tersimpan dengan kepemilikan dan batas penggunaan yang benar.

Kerjakan:

1. Siapkan autentikasi dan migrasi awal untuk profil, proyek, sumber, versi sumber, relasi turunan, bagian naskah, serta metadata media.
2. Terapkan foreign key dan validasi pemilik serta proyek. Jangan mempercayai `owner_id` yang dikirim browser.
3. Aktifkan dan uji Row Level Security. Job server dengan kredensial istimewa tetap harus memeriksa ownership.
4. Gunakan bucket media privat dan URL berumur pendek; jangan menyediakan public URL permanen.
5. Implementasikan `exclude_from_ai`, `exclude_from_book`, serta izin konteks terpisah sesuai blueprint.
6. Buat context builder dalam mode dry run untuk melihat ID sumber yang layak dikirim, tanpa memanggil AI nyata.
7. Propagasikan larangan AI ke turunan sumber. Perubahan penanda harus membatalkan konteks yang sudah disiapkan.
8. Terapkan perlindungan autentikasi-cookie, Origin dan CSRF, serta sanitasi isi yang akan dirender.
9. Simpan mode identitas buku terpisah dari pilihan tiap tokoh dan nama penulis sampul. Beri tokoh ID stabil dalam proyek, alias atau panggilan, pilihan nama tampil, relasi ke penyebutan pada versi naskah, dan `privacy_revision` untuk kebijakan yang berlaku.
10. Pisahkan pemetaan nama asli opsional dari data tokoh yang biasa dimuat editor. Terapkan akses pemilik yang eksplisit pada operasi privat; pemetaan tidak ikut dalam API umum proyek, log, analitik, konteks AI, atau tampilan dukungan. Jangan mewajibkan pengguna mengisi nama asli.
11. Bangun pencocokan dasar tanpa provider AI memakai pemetaan yang diketahui dan matcher lokal atau server internal. Terapkan penggantian ke alias atau penanda khusus proyek sebelum serialisasi konteks AI. Catat batas deteksi; jangan mengirim teks mentah ke AI eksternal dengan alasan akan disamarkan oleh model tersebut.
12. Versikan perubahan identitas dan detail yang boleh dibagikan. Perubahan `privacy_revision` membatalkan konteks antrean, cache turunan terkait, tinjauan ekspor, dan persetujuan catatan pengantar yang sudah kedaluwarsa.
13. Simpan `publication_author_name` dan `narrator_character_id` secara terpisah dari profil autentikasi serta identitas tagihan. Tokoh diri mendukung pilihan samaran/penanda yang sama dengan tokoh lain; nama asli tetap opsional dan narasi aku/saya tetap boleh digunakan. Jangan menggunakan nama akun, nama tagihan, atau email sebagai fallback nama sampul maupun properti author dokumen.
14. Siapkan layanan email produksi untuk autentikasi dengan domain pengirim serta konfigurasi SPF/DKIM/DMARC yang sesuai provider. Uji verifikasi, reset kata sandi, kedaluwarsa tautan, serta pencegahan penyalahgunaan ke alamat di luar tim pengembang. Ketiadaan SMTP tidak boleh diatasi dengan menonaktifkan verifikasi untuk pengguna publik. Jika akses belum ada, selesaikan adapter/config dan catat pengujian produksi sebagai terblokir.

**Verifikasi wajib:** akun A tidak dapat mengakses proyek atau media akun B; sumber no-AI beserta turunannya tidak masuk payload walaupun sudah diganti alias; materi no-book tidak lolos ekspor naskah; konten aktif tidak mengeksekusi kode. Periksa juga payload, log, dan API umum memakai pemetaan nama sintetis: pemetaan privat tidak boleh ikut terbawa. Tokoh tanpa nama asli tetap berfungsi, dan `pending` menghasilkan penanda aman. Uji tokoh diri memakai samaran, nama pena berbeda dari nama akun, dan tidak ada fallback identitas ke API buku. Email akun publik harus dibuktikan dengan layanan pengirim yang akan digunakan sebelum rilis berbayar.

**Selesai ketika:** proyek privat, sumber berversi, serta pembatasan data terbukti bekerja. Jangan menghubungkan AI nyata sebelum pengujian ini lolos.

## 8 Tahap 3 Sesi persisten dan refleksi opsional

**Tujuan:** mempertahankan aturan wawancara setelah refresh, jeda, retry, dan pindah perangkat.

Kerjakan:

1. Simpan session state, versi state, fokus, pertanyaan, jawaban, hitungan, dan status Lewati pada server.
2. Buat setiap transisi atomik, menggunakan idempotency key serta pemeriksaan versi.
3. Commit setiap pertanyaan untuk ditampilkan hanya sekali. Membuka ulang pertanyaan yang sama tidak menambah hitungan.
4. Simpan jawaban yang diketik secara terpisah dari perintah Kirim jawaban. Autosave tidak memulai pertanyaan baru.
5. Implementasikan jeda, resume, bahan belum cukup, dan state blocked tanpa membuang cerita pengguna.
6. Sediakan preferensi Cerita saja, Refleksi pribadi, dan Pesan lebih eksplisit tanpa mewajibkan hikmah.
7. Tambahkan tindakan Tambahkan refleksi setelah draf sebagai pilihan eksplisit, bukan pertanyaan otomatis.
8. Sesi refleksi terpisah memakai `question_limit=1`; sesi biasa memakai `question_limit=4`. Refleksi dalam sesi yang masih aktif tetap memakai sisa batas sesi itu.
9. Setelah draf, tampilkan tombol Tinjau tokoh tanpa otomatis membuka dialog. Di dalam pengaturan, tampilkan satu tokoh dengan satu pertanyaan dan Atur nanti; perpindahan ke tokoh berikutnya memerlukan tindakan pengguna. Pengaturan manual bukan sesi penggalian AI baru.
10. Lewat atau Atur nanti mempertahankan `pending` dan penanda, bukan persetujuan nama asli. Jika pertanyaan identitas sengaja diajukan dalam wawancara aktif, hitung dalam batas empat pertanyaan termasuk ketika dilewati; jangan membuka jalur pertanyaan tambahan di luar batas.
11. Setelah bahan memadai atau atas klik pengguna, sediakan bantuan menentukan fokus cerita, pembaca yang dituju, benang merah, serta struktur kronologis/tematik. Jangan menumpuk pertanyaan baru pada onboarding; satu fokus per prompt dan boleh dilewati. Jika berlangsung dalam wawancara, tetap gunakan sisa empat pertanyaan.
12. Nilai kecukupan terhadap fokus momen yang dipilih pengguna. Satu paragraf dapat cukup untuk momen kecil, tetapi jangan memotong pembahasan fokus yang belum tercapai semata-mata agar draf cepat selesai. Pengguna tetap boleh memilih Buat draf sekarang; sebutkan kekosongan bahan tanpa mengarang isinya.
13. Catat ingatan yang tidak pasti dan bedakan perspektif saat kejadian dengan refleksi masa kini. Jangan mendorong konflik buatan, memaksakan penutup bahagia, mengarang dialog verbatim, atau membuat klaim psikologis tentang tokoh.

**Verifikasi wajib:** dua perangkat tidak menerima pertanyaan berbeda dari transisi yang sama; hasil terlambat tidak bertanya sesudah jeda; sesi refleksi berhenti setelah satu Lewati; Belum menemukan maknanya tidak menghasilkan hikmah buatan. Meninjau tokoh tidak memicu pertanyaan lanjutan atau potongan kredit otomatis; Atur nanti mempertahankan penanda aman.

**Selesai ketika:** pengguna dapat menjeda lalu melanjutkan tanpa perubahan hitungan atau pengulangan pertanyaan. Refleksi tidak mengubah fakta, perspektif waktu, atau naskah yang sudah disetujui.

## 9 Tahap 4 Editor struktur buku dan revisi

**Tujuan:** pengguna sudah dapat menulis dan menyusun buku tanpa AI nyata.

Kerjakan:

1. Pasang editor Tiptap dengan skema konten yang dibutuhkan. Jangan mengasumsikan ekstensi berbayar tersedia.
2. Buat bagian naskah, urutan bab, fungsi subbab, tokoh, serta linimasa yang dapat dikoreksi.
3. Simpan bahan asli, peta cerita, dan naskah sebagai lapisan berbeda.
4. Tambahkan usulan draf dan revisi memakai provider simulasi, dengan sumber asal yang dapat ditelusuri.
5. Implementasikan terima, tolak, edit, dan pemulihan revisi. Gunakan `base_revision_id` agar usulan lama tidak menimpa tulisan baru.
6. Tandai turunan yang perlu ditinjau ketika sumber diperbaiki. Jangan otomatis merevisi bab yang sudah disetujui.
7. Pastikan editor manual, pengaturan bab, dan penerimaan revisi tidak memicu pemotongan kredit.
8. Hubungkan penyebutan nama dan panggilan kepada ID tokoh pada versi naskah yang tepat. Usulan bahwa dua sebutan merujuk orang yang sama harus dikonfirmasi pengguna; penggabungan hanya untuk catatan orang yang sama, bukan menggabungkan orang berbeda menjadi tokoh komposit.
9. Perubahan nama tampil menghasilkan pratinjau bagian terdampak lintas bab dan keterangan foto. Terapkan setelah penulis menyetujui dengan pemeriksaan versi; pertahankan bahan asli dan jangan menimpa revisi naskah yang lebih baru. Alias lama yang dilarang tetap masuk daftar pemeriksaan kebocoran, bukan hilang karena diganti.
10. Sediakan usulan menggeneralisasi tempat, waktu, atau detail pengenal. Semua memerlukan persetujuan penulis; jangan memindahkan tindakan kepada tokoh lain, mengarang peristiwa, atau mengubah substansi kejadian secara otomatis. Foto yang memuat wajah atau tulisan identitas tetap membutuhkan pemeriksaan visual pengguna.
11. Buat catatan pengantar dari templat sesuai perubahan yang benar-benar diterapkan dan disetujui. Nama saja tidak boleh menghasilkan klaim tempat dan kejadian ikut disamarkan. Jangan menyatakan semua pihak setuju atau anonimitas terjamin; persetujuan catatan harus ditinjau ulang jika kebijakan identitas berubah.
12. Bangun alur penyusunan bagian: pilih dua atau lebih potongan, tentukan subbab/bab tujuan dan fungsi bagian, tinjau urutan, penggabungan, pengurangan pengulangan, serta transisi. Simpan hubungan ke versi sumber, keputusan yang diterima, dan `base_revision_id`. Pengaturan urutan serta penggabungan manual gratis; mode AI baru diaktifkan setelah Tahap 5–6.
13. Gunakan adegan untuk momen penting, ringkasan untuk menghubungkan waktu, dan refleksi untuk makna yang memang diberikan penulis. Jangan memaksa setiap paragraf menjadi adegan atau menambahkan detail indrawi yang tidak diketahui. Sediakan penanda fakta/ingatan yang perlu diperiksa; mempertahankan ketidakpastian lebih baik daripada mengubahnya menjadi kepastian buatan.
14. Labeli fitur tinjauan AI Tinjau bagian terpilih dan tampilkan ID/versi serta jumlah kata yang dicakup. Pengguna boleh memilih bagian dari beberapa bab dengan total paling banyak 5.000 kata. Tinjauan seluruh buku secara otomatis ditunda; hasil pemeriksaan terpisah tidak boleh diberi label audit seluruh buku.
15. Pastikan nama pena pada sampul, tokoh diri dalam teks, bio, ucapan terima kasih, keterangan foto, serta properti author ekspor termasuk pratinjau privasi. Tindakan Samarkan semua tokoh termasuk saya tidak otomatis mengganti identitas tagihan atau menganggap naskah tidak mungkin dikenali.

**Verifikasi:** konflik versi mempertahankan kedua perubahan; naskah tetap ada ketika usulan ditolak; urutan bab tersimpan; konten berbahaya dari impor atau model tidak dirender sebagai kode. Uji dua tokoh bernama sama, beberapa panggilan untuk satu tokoh, perubahan samaran lintas bab, merge yang dibatalkan, usulan kedaluwarsa, sumber asli yang tetap utuh, dan catatan pengantar yang berubah sesuai cakupan penyamaran.

**Selesai ketika:** pengguna dapat menyusun beberapa momen menjadi sedikitnya dua subbab runtut, memperbaiki pengulangan kejadian, melacak asal potongan, dan memulihkan versi tanpa bantuan AI berbayar. Mode simulasi membuktikan alur persetujuan; mutu penggabungan AI dibuktikan pada Tahap 6 dan pilot.

## 10 Tahap 5 Hak langganan kuota dan ledger kredit

**Tujuan:** semua pekerjaan berbayar nanti memiliki pemeriksaan hak, saldo, dan ruang hasil sebelum dieksekusi.

Kerjakan:

1. Buat katalog harga berversi dari nilai awal blueprint, periode langganan, invoice internal, lot kredit, ledger, reservasi, dan penyesuaian.
2. Definisikan satu bulan sebagai bulan kalender, dengan jangkar tagihan dan perilaku akhir bulan yang eksplisit.
3. Terapkan kredit bulanan berakhir pada periode asal; top-up berlaku tepat 30 × 24 jam sejak grant pembayaran pertama kali terverifikasi; gunakan lot yang kedaluwarsa lebih dulu. Simpan `expires_at` per lot dan `topup_expiry_days: 30` sebagai kebijakan grant. Callback/retry tidak menggeser tanggal awal; top-up baru atau perpanjangan tidak memperpanjang lot lama. Tampilkan masa berlaku sebelum checkout serta tanggal dan jam kedaluwarsa pada saldo. Periode langganan tetap satu bulan kalender.
4. Gunakan integer: satu kredit setara 60.000 unit internal. Jangan menghitung saldo memakai floating point.
5. Implementasikan reserve, capture, release, expiry, serta adjustment melalui transaksi atomik dan constraint unik.
6. Terapkan penggalian satu kredit hanya sekali per sesi, draf empat kredit saat hasil tersedia, serta tarif lain sesuai blueprint.
7. Buat reservasi kuota untuk unggahan dan hasil AI. Kuota penuh tidak boleh menyebabkan draf tertagih tetapi gagal tersimpan.
8. Buat mekanisme saldo tester yang hanya tersedia di lingkungan pengembangan. Belum perlu menerima pembayaran nyata.
9. Tandai pengaturan identitas, matcher dasar, penggantian deterministik, tinjauan privasi ekspor, dan templat pengantar sebagai operasi tanpa kredit AI. Jangan mengenakan tarif tinjauan 10 kredit secara otomatis karena nama fitur mengandung kata Tinjau. Jika pengguna meminta penulisan ulang dengan AI untuk penyamaran narasi, tampilkan cakupan serta estimasi tarif revisi yang sudah ada, yaitu 2 kredit untuk masukan sampai 1.000 kata sesuai blueprint, sebelum tindakan eksplisit pengguna.
10. Pertahankan akses tinjauan privasi dan proyeksi penyamaran untuk ekspor selama masa baca/ekspor 15 hari, tanpa mewajibkan langganan ulang. Proyeksi tersebut tidak mengaktifkan AI, membuka editor umum, atau menulis ulang naskah utama; pemakaian AI tetap mengikuti hak langganan.
11. Bedakan unit available, reserved, dan expired. Kredit pada lot yang kemudian kedaluwarsa boleh di-capture oleh reservasi sah yang sudah dibuat sebelum kedaluwarsa, sampai tenggat reservasi; tidak boleh dipakai membuat reservasi baru. Release sesudah masa lot berakhir tetap menghasilkan kredit kedaluwarsa. Jangan memperpanjang masa kredit lewat retry atau perpindahan lot.
12. Implementasikan katalog operasi pada Bagian 11.3 dokumen ini dari satu sumber konfigurasi berversi. Tampilkan cakupan dan total kredit sebelum pekerjaan; bahan melebihi batas harus dipilih ulang atau dipecah dengan biaya setiap bagian disetujui. Jangan menjalankan rangkaian pekerjaan berbayar tersembunyi.
13. Pertahankan katalog awal Rp79.000/bulan dengan 150 kredit, top-up 50/Rp29.000 dan 150/Rp59.000. Dashboard menjelaskan contoh alokasi 30 sesi teks lengkap atau 10 siklus rekaman 10 menit plus sesi teks lengkap; revisi/tinjauan tambahan memakai saldo yang sama. Tidak menjanjikan satu buku selesai dari satu paket.

**Verifikasi wajib:** saldo tidak negatif saat dua permintaan bersamaan; satu job hanya satu capture; reserve pukul 23.59 dan capture pukul 00.01 pada lot yang habis pukul 00.00 tetap sah sebelum tenggat reservasi; release tidak menghidupkan kredit kedaluwarsa; perpanjangan awal tidak memberi jatah bulan berikutnya terlalu cepat; resume tidak menagih ulang penggalian. Pengaturan dan tinjauan privasi dasar tidak membuat reservasi atau capture AI; akun dalam masa retensi dapat menyelesaikan penghalang privasi ekspor melalui proyeksi tanpa membuka AI berbayar.

**Selesai ketika:** kontrak hak, tarif, saldo, dan kuota dapat diuji menggunakan transaksi lokal. Integrasi provider nyata menunggu tahap ini selesai.

## 11 Tahap 6 Antrean pekerjaan dan AI teks

**Tujuan:** menghubungkan AI melalui proses yang dapat dipulihkan tanpa membocorkan data atau menagih ganda.

### 11.1 Dahulukan antrean dengan provider simulasi

1. Simpan job sebelum panggilan provider, beserta lease, tenggat, versi sumber, state sesi, `privacy_revision`, tarif, dan reservasi.
2. Terapkan batas satu pekerjaan AI aktif per akun, retry terbatas, serta status unknown untuk hasil yang belum pasti.
3. Jangan membuat duplikat otomatis hanya karena request browser timeout. Rekonsiliasi job lama terlebih dahulu.
4. Periksa kembali hak, state, dan penanda privasi saat job akan dikirim. Sesuai blueprint Bagian 13.4, pekerjaan yang diotorisasi ketika langganan aktif boleh selesai setelah periode berakhir selama reservasinya masih sah dan belum melewati tenggat. Pekerjaan baru tetap memerlukan langganan aktif; pengecualian ini tidak membatalkan perubahan privasi atau pencabutan akses lain.
5. Commit hasil yang dapat diakses, status job, capture ledger, serta penanda biaya sesi dalam satu transaksi. Staging berkas tidak berarti hasil sudah tersedia.
6. Jeda membatalkan antrean. Hasil dari proses yang sudah berjalan tidak boleh memulai pekerjaan lanjutan atau menimpa state terbaru.
7. Pastikan worker atau fungsi terlindungi benar-benar dapat melanjutkan pekerjaan. Jangan mengandalkan background task yang hilang saat request selesai.
8. Jika kebijakan identitas berubah, konteks antrean harus dibangun ulang dan hasil lama diperiksa terhadap versi terkini sebelum commit. Hasil terlambat yang tidak lagi boleh digunakan jangan dipublikasikan atau menghasilkan capture baru; lepaskan reservasi sesuai aturan ledger. Jangan otomatis menjalankan ulang job atau membebankan kegagalan provider kepada pengguna.
9. Reservasi pekerjaan memiliki tenggat maksimal 15 menit. Pemulihan `unknown` dibatasi tenggat tersebut; jika hasil tidak dapat ditemukan, tutup sebagai gagal, lepaskan reservasi, dan bebaskan slot akun. Simpan generation/fencing token dan kondisi commit atomik agar worker lama tidak dapat capture atau menimpa hasil setelah tenggat, kegagalan terminal, pembatalan, atau percobaan baru. Retry pengguna membuat pekerjaan baru atas tindakan eksplisit, bukan mengulang pertanyaan lama.
10. Batasi setiap tahap pada paling banyak dua percobaan tambahan. Total token input tambahan dan total token output tambahan masing-masing paling banyak satu kali anggaran jenis token yang sama pada tahap asal; anggaran input tidak dapat dialihkan menjadi output. Retry transkripsi maksimal tambahan durasi asal. Seluruh biaya kegagalan ditanggung aplikasi. Tetapkan anggaran kegagalan per akun dan global, pemutus otomatis, serta alarm; jika infrastruktur bermasalah, tampilkan alasan dan hentikan penerimaan pekerjaan baru sebelum reservasi/tagihan. Jangan mengubahnya menjadi kuota penggunaan berbayar tersembunyi, menghanguskan saldo, atau memaksa top-up untuk memulihkan layanan.

### 11.2 Hubungkan provider nyata sesudah kontrak lolos

Verifikasi model yang disebut blueprint pada akun API dan dokumentasi resmi. Perlakukan nama model sebagai kandidat sampai ketersediaan, kemampuan, dan harga diperiksa. Simpan model serta prompt version di server.

Gunakan payload minimum, pengaturan penyimpanan yang sesuai, dan validasi keluaran terstruktur. Tolak pertanyaan bertumpuk sebelum ditampilkan. Cadangkan anggaran token untuk draf; batas token sesi berlaku kumulatif, bukan per giliran.

Bangun payload dari sumber yang diizinkan dengan alias atau penanda proyek. Pemetaan privat nama asli tidak pernah dibutuhkan provider penulisan; substitusi identitas untuk naskah tampilan dilakukan internal setelah hasil diperiksa. Penyamaran bukan pengganti penyaringan no-AI atau no-book. Jangan memperkenalkan panggilan AI eksternal untuk "mencari lalu menghapus nama" pada teks mentah tanpa dasar izin pemrosesan yang berbeda; versi pertama harus memiliki tinjauan dasar tanpa panggilan tersebut.

Jika kredensial tidak tersedia, selesaikan adapter, pengujian kontrak, serta daftar konfigurasi. Jangan mengklaim provider nyata telah diuji. Bahan pribadi percontohan hanya digunakan dengan izin penulis; fixture pengembangan tetap sintetis.

**Verifikasi wajib:** crash sebelum dan sesudah respons, retry ganda, browser ditutup, saldo berubah, kuota penuh, jeda saat job berjalan, dan perubahan no-AI ketika job antre. Periksa permintaan keluar memakai canary identitas sintetis; uji perubahan samaran ketika job antre dan ketika provider sudah berjalan. Konteks/cache lama batal, hasil yang tidak lagi layak tidak dipublikasikan atau ditagih. Biaya provider untuk proses gagal tidak menjadi alasan menagih pengguna tanpa hasil.

**Selesai ketika:** cerita dapat diproses dan beberapa potongan dapat disusun menjadi usulan bagian tersimpan dengan tagihan yang benar. Proses `unknown` mencapai hasil terminal tanpa menggantung akun. Jika provider nyata belum tersedia, tandai jelas integrasi itu terblokir sambil meneruskan bagian independen.

### 11.3 Katalog pekerjaan AI dan batas hasil

Tabel ini menerapkan blueprint Bagian 9.1. Batas token adalah total semua panggilan berhasil pada satu tahap termasuk ringkasan konteks, peta cerita yang diperlukan, validasi berbasis model, dan token reasoning bila ditagihkan. Batas kata dan token berlaku bersama; bahan sumber asli tidak dipotong atau ditimpa. Jangan menambahkan tool AI eksternal, fallback model lebih mahal, atau panggilan pendukung tanpa anggaran.

| Operasi | Kredit | Cakupan bahan/hasil | Anggaran input/output token |
| --- | --- | --- | --- |
| `interview` | 1 per sesi | Satu momen; maksimal empat pertanyaan tampil; bahan dipilih dalam anggaran | 10.000 / 500 kumulatif seluruh penggalian |
| `draft` | 4 | Draf satu momen; hasil maksimal 800 kata | 10.000 / 3.500 |
| `revise_selection` | 2 | Masukan maksimal 1.000 kata; hasil maksimal 1.200 kata | 8.000 / 2.500 |
| `assemble_section` | 6 | Dua atau lebih potongan; masukan total maksimal 2.000 kata; hasil maksimal 1.200 kata | 12.000 / 3.500 |
| `review_selection` | 10 | Masukan terpilih total maksimal 5.000 kata; laporan maksimal 1.200 kata | 20.000 / 3.000 |
| `transcribe` | 1 per menit valid | Durasi interval berhasil yang unik; ketentuan parsial pada Tahap 7 | Anggaran audio serta retry mengikuti durasi |

Sesi teks penggalian + draf maksimal 5 kredit dan 20.000/4.000 token berhasil. Draf langsung memakai 4 kredit. Batas keluaran adalah maksimum, bukan target panjang yang memaksa AI mengisi bahan kosong. Kegiatan manual dan pemeliharaan metadata deterministik gratis. Ringkasan yang diperlukan untuk sesi masuk anggaran operasi asal; penggabungan naskah baru tidak disamarkan sebagai ringkasan gratis tanpa batas.

Sebelum capture, validasi hasil sesuai operasi: pertanyaan tunggal yang relevan; draf/revisi/gabungan dapat disimpan serta ditinjau, mempertahankan fakta dan pilihan identitas; tinjauan hanya mengklaim cakupan yang dipilih. AI tidak dianggap berhasil hanya karena provider mengembalikan teks. Hasil yang terbukti menambah fakta tanpa sumber, salah tokoh, atau melanggar fokus/instruksi wajib diperlakukan sebagai kegagalan kualitas, dengan koreksi terbatas dalam anggaran atau adjustment kredit tahap gagal secara idempotent. Gaya yang kurang disukai dan tambahan bahan baru dari pengguna dibedakan dari pelanggaran tersebut; jangan menjanjikan penulisan ulang gratis tanpa batas. Sediakan pelaporan hasil bermasalah dan alasan keputusan yang dapat ditinjau.

Uji `assemble_section` pada potongan dengan kejadian berulang, urutan waktu tidak linear, ingatan tidak pasti, dan tokoh berganti samaran. Pastikan transisi tidak mengarang jembatan kejadian. Hasil `review_selection` menampilkan bagian yang diperiksa dan keterbatasannya. Setelah provider siap, lakukan pilot mutu tulisan awal pada Tahap 6–8 menggunakan kuota tester yang dibatasi; jangan menunggu integrasi pembayaran selesai untuk menemukan masalah mutu inti.

## 12 Tahap 7 Rekaman dan transkripsi

**Tujuan:** merekam dengan nyaman, menghitung durasi secara benar, dan menjaga alur satu jawaban.

Kerjakan:

1. Buat izin mikrofon, indikator merekam, timer, berhenti, dengarkan ulang, hapus, dan tambah potongan.
2. Tampilkan batas **10 menit per berkas**. Batas ukuran adalah 25 MB; gunakan batas yang tercapai lebih dahulu.
3. Saat batas tercapai, hentikan berkas secara aman dan beri pilihan melanjutkan dalam berkas baru. Jangan otomatis mengirim jawaban atau membuka pertanyaan baru.
4. Gunakan reservasi kapasitas dan validasi durasi serta format di server. Jangan mempercayai timer browser saja.
5. Tampilkan estimasi kredit transkripsi dan minta tindakan proses yang jelas. Jelaskan bahwa penyedia transkripsi menerima audio yang diproses, termasuk nama asli yang mungkin disebut; mengganti nama dalam transkrip tidak menyamarkan audio secara retroaktif. Menyimpan audio atau menjeda tidak otomatis menyalakan transkripsi.
6. Hubungkan transkripsi melalui antrean dan ledger yang sudah dibuat.
7. Capture hanya durasi yang berhasil menghasilkan transkrip yang dapat digunakan; deduplikasi potongan retry dan lepaskan reservasi sisanya.
8. Gabungkan beberapa potongan untuk satu jawaban; biarkan pengguna mengoreksi transkrip sebelum menekan Kirim jawaban.
9. Izinkan menghapus rekaman sambil mempertahankan transkrip, dengan penjelasan bahwa biaya transkripsi yang berhasil tidak dikembalikan karena penghapusan audio.
10. Hubungkan tokoh dan panggilan dalam transkrip setelah penulis mengonfirmasi. Simpan transkrip sumber terpisah dari proyeksi tersamarkan untuk AI penulisan atau naskah; larangan AI pada audio beserta turunannya tetap berlaku.
11. Unggah browser langsung ke bucket privat melalui intent terotorisasi yang terikat akun, proyek, ukuran, dan objek. Server melakukan finalisasi setelah memeriksa objek aktual, checksum, tipe, ukuran, dan durasi. Status unggah selesai dari browser saja tidak mengizinkan transkripsi. Gunakan unggahan yang dapat dilanjutkan; bersihkan objek yatim serta lepaskan kuotanya secara idempotent. Jangan melewatkan isi audio 25 MB melalui payload Vercel Function biasa.
12. Catat setiap potongan pemrosesan dengan ID sumber/checksum, interval awal-akhir, status, dan hasil yang dapat digunakan. Tagih gabungan interval berhasil yang unik berdasarkan durasi, bukan panjang teks; overlap dan retry tidak menggandakan interval. Jeda wajar dalam potongan berisi ujaran tetap termasuk durasi; potongan seluruhnya senyap, hasil kosong/tidak dapat digunakan, dan potongan gagal tidak ditagih. Validasi keheningan/hasil tidak sah di server; jangan mempercayai durasi atau teks browser.
13. Tampilkan hasil parsial dan biaya yang sudah berhasil secara jelas. Untuk 10 menit dengan interval 0–5 menit berhasil dan 5–10 menit gagal, capture 5 kredit; retry interval akhir hanya dapat menambah 5 kredit jika berhasil. Reservasi sisa dilepas sesuai aturan masa berlaku. Jika provider tidak memberi bukti interval yang andal, potong audio menjadi unit pemrosesan yang intervalnya diketahui sebelum dikirim.

**Verifikasi wajib:** rekaman pendek tidak dibulatkan masing-masing menjadi satu menit; audio lebih dari batas ditolak atau dipecah dengan aman; mikrofon ditolak; format perangkat berbeda; nama Jepang; transkripsi parsial 5 dari 10 menit, potongan senyap, overlap, dan retry tanpa tagihan ganda; rekaman no-AI tidak dikirim. Uji unggahan mendekati 25 MB langsung ke storage pada staging, koneksi terputus/dilanjutkan, finalisasi palsu, serta pembersihan objek yatim.

**Selesai ketika:** pengguna memahami bahwa durasi bulanan mengikuti saldo kredit, bukan dibatasi sepuluh menit untuk satu bulan langganan. Jalur rekam, koreksi, kirim, dan draf berjalan pada perangkat yang diuji.

## 13 Tahap 8 Sinkronisasi ekspor dan pemulihan

**Tujuan:** tulisan dapat dilanjutkan di perangkat lain dan dipulihkan dari cadangan yang nyata.

Kerjakan:

1. Implementasikan IndexedDB dengan pemisahan akun, antrean perubahan, dan versi dasar.
2. Tampilkan Tersimpan di perangkat hanya untuk penyimpanan lokal; Tersinkron memerlukan pengakuan server.
3. Tangani konflik dengan mempertahankan perubahan, bukan silent overwrite.
4. Bersihkan cache akun saat logout dengan penanganan perubahan yang belum tersinkron.
5. Buat ekspor Word untuk naskah yang boleh masuk buku, melalui Tinjau Privasi Buku atas snapshot naskah, `privacy_revision`, media, dan proyeksi ekspor yang sama dengan file akhirnya. Perubahan setelah tinjauan membuat hasil pemeriksaan kedaluwarsa.
6. Buat format cadangan proyek berversi yang mencakup struktur, bahan, serta media. Pemetaan privat nama asli memakai pilihan terpisah dengan default tidak disertakan. Jelaskan bahwa meski pemetaan tidak disertakan, sumber, transkrip, dan audio masih dapat berisi nama asli; jangan menyebutnya cadangan anonim.
7. Buat impor dengan validasi skema, checksum, ukuran total, dan path berkas. Jangan mempercayai owner ID atau saldo dari arsip.
8. Rancang cadangan layanan yang mencakup database dan media, terpisah dari file cadangan pengguna; gunakan manifest terkoordinasi serta referensi objek berversi. Backup database saja tidak mencakup media. Tetapkan backup harian dengan target awal RPO maksimal 24 jam dan RTO maksimal 24 jam, lalu buktikan pada latihan sebelum publik berbayar. Ini target rekayasa; tidak menjanjikan nol kehilangan data atau transaksi.
9. Lakukan dua latihan yang berbeda: impor cadangan pengguna untuk satu proyek lengkap, dan pemulihan layanan dari backup database beserta media. Latihan kedua mencakup akun, hak, ledger, pembayaran, job, referensi versi, serta penanda penghapusan. Ukur usia titik pemulihan dan waktu pemulihan aktual; buktikan keduanya dalam target.
10. Tinjauan dasar memakai pencocokan nama yang diketahui dan aturan deterministik, tanpa mengirim isi mentah ke AI. Nama asli yang diketahui dilarang dalam buku, alias lama yang dilarang, atau pemetaan privat yang bocor menghalangi ekspor sampai diselesaikan. Temuan kontekstual menjadi tugas tinjauan penulis, bukan skor aman atau jaminan semua identitas terdeteksi. Tokoh `pending` boleh memakai penanda bila penulis secara sadar menyetujuinya untuk snapshot ekspor tersebut.
11. Tampilkan tinjauan keterangan foto, wajah, tulisan dalam gambar, tempat, waktu, dan hubungan pengenal. Sediakan tindakan menghapus media dari buku atau menggeneralisasi detail dalam proyeksi ekspor tanpa memodifikasi sumber asli. Pemeriksaan manual gambar tetap diperlukan; matcher teks tidak membuktikan gambar sudah tersamarkan.
12. Bangun ekspor bersih yang tidak membawa pemetaan privat, catatan internal, komentar privat, riwayat revisi, atau metadata identitas yang tidak disetujui. Periksa isi paket Word serta properti dokumennya, bukan hanya teks yang terlihat. Templat pengantar harus mencerminkan perubahan yang benar-benar diterapkan pada versi yang diekspor dan memperoleh persetujuan yang masih berlaku.
13. Dalam masa baca/ekspor 15 hari, izinkan memperbaiki proyeksi privasi ekspor dan meninjau ulang tanpa mengaktifkan penyuntingan naskah utama atau AI. Hak ini diperlukan agar ekspor yang terhalang nama terlarang dapat diselesaikan tanpa langganan ulang.
14. Uji pemulihan cadangan dengan dan tanpa pemetaan privat: ID tokoh, alias, relasi penyebutan, struktur naskah, dan penanda tetap konsisten tanpa mewajibkan nama asli diisi kembali. Persetujuan tinjauan ekspor tidak boleh dianggap berlaku otomatis setelah impor; batasi penyimpanan pemetaan privat ke jalur yang memang dipilih pengguna.
15. Terapkan pilihan tanpa pemetaan pada semua field pemetaan terstruktur, termasuk nilai asli-pengganti dalam aturan, sebutan asli sensitif, catatan privat, snapshot, dan laporan; jangan hanya mengecualikan satu tabel. Pertahankan ID, nama tampil, aturan tanpa nilai asal privat, dan referensi yang diperlukan untuk pemulihan. Aturan yang tidak lengkap ditandai perlu ditinjau. Sumber dan audio tetap mengikuti cakupan yang diumumkan; impor tidak membangun ulang pemetaan dari bahan itu secara otomatis.
16. Ekspor atau cadangan besar dibuat worker, disimpan privat, lalu diunduh melalui tautan sementara. Impor besar memakai jalur unggah langsung terotorisasi dengan finalisasi; jangan membawa payload besar melalui API Vercel biasa. Uji cadangan melebihi 4,5 MB pada staging dan ukuran yang mewakili penggunaan nyata.
17. Pertahankan nama pena yang disetujui pada sampul dan properti author; bila belum diisi, kosongkan atau gunakan penanda yang disetujui. Jangan mengambil identitas akun/tagihan sebagai fallback. Uji paket Word mentah, bio, ucapan terima kasih, dan keterangan media ketika seluruh tokoh termasuk penulis disamarkan.
18. Prosedur restore layanan harus menjalankan jurnal penghapusan yang bertahan di luar rollback database sebelum membuka akses pengguna. Rekonsiliasi pembayaran terhadap provider, ledger, dan grant yang mungkin hilang; tandai job AI meragukan untuk pemulihan terbatas, bukan menjalankannya ulang secara membabi buta. Jangan bergantung pada unduhan backup pengguna sebagai perlindungan utama layanan.

**Verifikasi wajib:** HP ke laptop, dua revisi bersamaan, tab ditutup sebelum sync, local storage gagal, logout lalu akun lain, ekspor no-book, serta impor tanpa cukup kuota. Uji kebocoran nama terlarang, metadata Word, keterangan foto, penanda pending yang disetujui, perubahan kebijakan setelah review, ekspor masa retensi, dan pemulihan cadangan tanpa pemetaan privat.

**Selesai ketika:** hasil ekspor dapat dibuka; cadangan pengguna benar-benar memulihkan proyek serta media; latihan pemulihan layanan mempunyai bukti RPO/RTO, rekonsiliasi, dan penerapan penghapusan sebelum akses dibuka. Keberhasilan membuat file backup atau mengimpor satu proyek saja belum memenuhi pemulihan layanan.

## 14 Tahap 9 Pembayaran Duitku

**Tujuan:** pembayaran sah memberi satu hak atau satu saldo, termasuk ketika browser pengguna sudah ditutup.

Kerjakan:

1. Verifikasi dokumentasi Duitku POP, API status, format signature, dan kanal merchant yang berlaku saat implementasi.
2. Implementasikan adapter Duitku dengan pemisahan environment sandbox dan production. Jangan menebak host, secret, atau rumus signature dari contoh lama.
3. Buat invoice di server dari katalog harga, user, produk, serta nominal yang tersimpan.
4. Buka `paymentUrl` dari hasil yang sah. Return URL dan callback JavaScript hanya memperbarui tampilan status.
5. Buat callback server yang memverifikasi autentisitas, order, merchant, nominal, serta status sebelum grant.
6. Simpan event unik dan gunakan transaksi atomik untuk hak atau saldo. Callback yang datang berulang tidak menambah kredit lagi.
7. Perpanjang hak dari akhir periode aktif atau dari pembayaran baru jika sudah nonaktif, sesuai blueprint.
8. Siapkan rekonsiliasi terbatas yang dipicu kejadian atau admin. Jangan melakukan polling cron agresif terhadap API Duitku.
9. Siapkan pencatatan refund atau reversal tanpa menghapus riwayat transaksi. Jangan mengasumsikan refund tersedia sebagai API otomatis.
10. Verifikasi biaya merchant aktual per kanal dan siapa yang membayarnya; masukkan ke model kontribusi pada blueprint dan kajian harga. Jangan menambahkan biaya checkout tersembunyi. Uji nominal final invoice sama dengan yang dilihat pengguna serta tetap sesuai signature.
11. Hubungkan pengingat pembayaran ke antrean email aplikasi dengan kunci deduplikasi, retry terbatas, pembatalan setelah lunas/kedaluwarsa, serta status pengiriman minimum tanpa isi cerita. Pisahkan kegagalan email dari status pembayaran yang sebenarnya.

**Verifikasi sandbox:** callback palsu, signature salah, nominal salah, order asing, callback ganda, urutan status berubah, pembayaran terlambat, invoice kedaluwarsa, serta browser ditutup sebelum callback.

**Selesai ketika:** bukti sandbox menunjukkan satu pembayaran menghasilkan tepat satu grant. Jika merchant produksi belum aktif, tandai produksi belum teruji; jangan mengubah hasil sandbox menjadi klaim pembayaran publik sudah siap.

## 15 Tahap 10 Retensi penghapusan dan operasi

**Tujuan:** kebijakan penyimpanan benar-benar dijalankan oleh sistem.

Kerjakan:

1. Hitung `retention_ends_at = paid_until + 15 × 24 jam` dalam UTC; tampilkan tanggal dan jam akhir menurut Asia/Jakarta. Pada atau setelah tenggat, akses isi lama berakhir dan purge dipicu. Hitungan tidak dimulai dari klik batal perpanjangan.
2. Tambahkan pengingat menjelang akhir retensi dengan deduplikasi serta penghentian ketika tidak lagi relevan.
3. Aktivasi kembali sebelum deadline membatalkan jadwal penghapusan. Pembayaran tepat pada atau sesudah deadline tidak membatalkan purge proyek lama; jelaskan sebelum checkout.
4. Implementasikan sampah proyek, hapus permanen, dan hapus akun dengan jalur serta batas waktu pada blueprint. Masa sampah tidak memperpanjang retensi setelah langganan; gunakan tenggat penghapusan yang lebih awal bila keduanya berlaku.
5. Cakup naskah, turunan, media, indeks, versi, konteks job, ekspor sementara, pemetaan privat, alias, relasi penyebutan, dan proyeksi ekspor. Jangan meninggalkan identitas dalam cache atau indeks setelah sumber dihapus.
6. Pertahankan saldo top-up dan metadata akun minimum secara terpisah saat hanya isi proyek yang melewati retensi.
7. Simpan jurnal penghapusan minimum yang tetap tersedia ketika database dipulihkan ke versi lama. Putar ulang penanda itu sebelum membuka akses layanan agar restore tidak menghidupkan kembali data yang sudah dihapus; batasi jurnal pada ID, cakupan, waktu, dan bukti proses tanpa isi cerita.
8. Buktikan penghapusan produksi selesai maksimal tujuh hari dari pemicu yang sesuai dan kedaluwarsa cadangan maksimal 30 hari sesudah penghapusan produksi aktual.
9. Buat antarmuka dukungan dengan metadata minimum serta audit akses isi berdasarkan izin pemilik. Pemetaan privat tidak tampil melalui akses dukungan biasa; prosedur diagnosis tidak boleh meminta cadangan lengkap dengan identitas tanpa kebutuhan serta izin khusus yang jelas.
10. Siapkan alarm job macet, callback gagal, saldo tidak konsisten, sync gagal, dan penghapusan terlambat tanpa memasukkan isi cerita ke log.
11. Targetkan purge permanen normal selesai maksimal 15 menit; tujuh hari tetap batas maksimum penanganan gangguan. Tampilkan progres, antrean, kegagalan, serta eskalasi jika lambat. Slot dan kuota baru dilepas setelah penghapusan fisik primer terkonfirmasi, bukan saat klik hapus.
12. Jalankan pemberitahuan retensi saat `paid_until`, lalu email H-7/H-1 sebelum `retention_ends_at` melalui antrean aplikasi dengan deduplikasi, retry terbatas, penghentian setelah tidak relevan, dan pencatatan status minimum. Uji pengiriman ke pengguna umum dengan domain produksi; email yang gagal tidak boleh diam-diam dianggap terkirim.
13. Aktifkan cadangan layanan harian yang terkoordinasi beserta alarm kegagalan dan panduan restore dari Tahap 8. Ulangi latihan hanya jika ada perubahan yang mengubah cakupan/risiko atau gerbang rilis; jangan menganggap metadata database membuktikan objek media sudah disalin.

**Verifikasi:** gunakan jam uji untuk akhir bulan pendek/panjang, kredit tambahan tepat 30 hari, retensi tepat 15 hari, dan pembayaran sesaat sebelum/tepat/sesudah deadline; uji pembatalan purge sebelum deadline, pembayaran setelah deadline, penghapusan yang diulang, serta pemulihan backup dengan penanda penghapusan. Buktikan pemetaan privat dan artefak turunannya ikut dihapus, serta tinjauan/proyeksi privasi ekspor tetap bekerja selama masa baca/ekspor yang sah.

**Selesai ketika:** retensi dapat dijalankan dan dibuktikan pada lingkungan uji. Kebijakan refund atau saldo saat hapus akun serta masa arsip keuangan yang belum diputuskan dicatat sebagai gerbang rilis fitur terkait, tanpa menghentikan pembangunan bagian lain.

## 16 Tahap 11 Uji terpadu dan proyek percontohan

**Tujuan:** membuktikan bahwa seluruh alur dapat digunakan dan biaya nyata sesuai rancangan.

### 16.1 Skenario utama

1. Pengguna masuk, membuat buku, lalu memilih cerita atau langsung bercerita.
2. Pengguna menjawab melalui teks atau beberapa potongan rekaman.
3. Wawancara berhenti sesuai bahan atau batas sesi, lalu menghasilkan draf.
4. Pengguna meninjau dan menerima tulisan, lalu memilih menyelesaikan sesi.
5. Pengguna melanjutkan di perangkat lain dan menyunting bagian yang sama.
6. Pengguna memilih refleksi atau membiarkan cerita tanpa pesan eksplisit.
7. Saldo berkurang sesuai pekerjaan yang berhasil, tanpa duplikasi.
8. Pengguna membuka Tinjau tokoh, mencoba kombinasi dan Samarkan semua tokoh termasuk saya, menunda satu tokoh, memilih nama pena berbeda dari akun, dan mengganti samaran lintas bab melalui pratinjau yang disetujui.
9. Pengguna menyetujui catatan pengantar yang sesuai, menyelesaikan tinjauan privasi, lalu mengekspor Word tanpa pemetaan privat.
10. Pengguna mengunduh cadangan dengan pemetaan privat tidak disertakan, memahami sumber/audio tetap mungkin memuat identitas, dan memulihkan proyek dengan relasi tokoh utuh.
11. Pembayaran sandbox memperpanjang hak atau menambah kredit tepat satu kali.
12. Pengguna kembali pada hari lain, menambah momen, menyusun dua atau lebih potongan menjadi bagian, meninjau pengulangan, serta menerapkan transisi yang memiliki sumber.
13. Pengguna memilih bagian dari dua bab untuk tinjauan dengan total sampai 5.000 kata; laporan menyebut cakupan itu dan tidak mengklaim memeriksa seluruh buku.

### 16.2 Matriks kegagalan penting

| Kelompok | Kejadian yang perlu dibuktikan |
| --- | --- |
| Sesi | Empat pertanyaan, dua Lewati, refleksi satu pertanyaan, jeda saat job berjalan |
| Data | Akun berbeda, larangan AI pada turunan, konten berbahaya, sumber diubah ketika job antre |
| Tokoh | Nama asli kosong, pending, dua orang bernama sama, panggilan ganda, merge orang yang sama, samaran diganti pada versi baru |
| Konteks identitas | Pemetaan tidak bocor, alias tidak melewati no-AI, matcher tanpa provider, kebijakan berubah ketika job antre/berjalan, cache lama dibatalkan |
| Tinjauan dan biaya | Pengaturan bukan sesi otomatis; pertanyaan identitas dalam sesi tetap dihitung; tinjauan dasar gratis; bantuan revisi AI hanya atas tindakan eksplisit |
| Kredit | Dua pekerjaan bersamaan, capture lot asal setelah expiry dalam tenggat reservasi, release tetap expired, unknown terminal, late worker diblokir, hasil tersimpan tetapi browser terputus |
| Audio | Batas per berkas, direct upload 25 MB, finalisasi palsu, potongan pendek/senyap/overlap, parsial 5 dari 10 menit, retry tanpa duplikasi, penjelasan nama sebelum transkripsi |
| Ekspor privat | Nama terlarang menghalangi, pending disetujui, kebijakan berubah setelah review, gambar dan metadata, pengantar sesuai cakupan, proyeksi masa retensi |
| Pembayaran | Callback palsu atau ganda, return URL sukses palsu, invoice terlambat |
| Pemulihan | Konflik dua perangkat, backup/impor lebih dari 4,5 MB, impor tanpa pemetaan privat, restore layanan database+media, RPO/RTO, rekonsiliasi pembayaran, erasure replay sebelum akses |
| Buku utuh | Potongan menjadi 2–3 bab, kejadian berulang lintas bab, transisi tanpa fakta buatan, cakupan tinjauan terbatas, perspektif dan ingatan tidak pasti |
| Akun dan email | Verifikasi/reset ke alamat di luar tim, retry pengingat tanpa duplikasi, tidak menonaktifkan verifikasi karena SMTP belum siap |
| Nilai dan mutu | Tarif per operasi, biaya pendukung/retry terkendali, kegagalan fakta dibedakan dari preferensi gaya, penghentian infrastruktur dijelaskan sebelum tagihan |

### 16.3 Pengujian penulis

Lakukan proyek percontohan beberapa hari dengan usulan 6–10 momen yang disusun menjadi 2–3 bab. Kisah Jepang boleh digunakan dengan izin penulis; jangan mengarang pengalaman istri atau mengubah bahan menjadi demo publik tanpa izin terpisah. Angka ini rancangan pilot praktis, bukan standar ilmiah. Libatkan satu atau beberapa penulis awal sesuai akses yang diotorisasi.

Periksa apakah pengguna dapat melanjutkan sendiri setelah jeda beberapa hari, mempertahankan suara tulisan, mengoreksi fakta/nama lintas bagian, mengurangi kejadian berulang, dan memahami biaya. Nilai kenyamanan pertanyaan serta waktu koreksi, bukan hanya kecepatan keluarnya draf. Usulan gerbang pilot: median penilaian kesesuaian suara minimal 4 dari 5, tidak ada fakta tanpa sumber pada bagian pilot yang akhirnya diterima setelah ditinjau, dan peserta dapat melanjutkan tanpa dibimbing. Temuan gagal harus diperbaiki atau dicatat dengan keputusan; lolos pilot bukan janji AI tidak akan pernah salah.

Uji apakah penulis memahami perbedaan nama sampul, nama tokoh dalam buku, identitas dalam bahan sumber, dan data yang diterima penyedia transkripsi. Pastikan pilihan kombinasi tidak membuat aplikasi mengklasifikasikan orang sebagai suportif atau pemicu konflik. Penulis harus dapat menunda keputusan tokoh dan melanjutkan menulis tanpa menyerahkan nama asli.

Ukur token serta biaya provider seluruh tahap termasuk pendukung dan kegagalan, durasi audio valid, biaya per hasil yang diterima, waktu koreksi pengguna, pemakaian kredit, dan titik pengguna berhenti. Bandingkan skenario pemakaian campuran dengan penggunaan berat satu jenis operasi, kurs, biaya pembayaran, cadangan biaya provider, penyimpanan, dan biaya layanan tetap pada blueprint Bagian 20 serta lampiran kajian.

Harga Rp79.000/150 kredit, top-up 50/Rp29.000, dan top-up 150/Rp59.000 menjadi rancangan peluncuran; kunci harga publik setelah invoice biaya layanan aktual dan pilot mendukung asumsi biaya. Penggunaan nyata tetap harus dipantau; hasil perhitungan kontribusi tidak sama dengan laba bersih. Laporkan terpisah biaya pengembangan pemilik, marketing, dan pajak penghasilan yang belum dicakup model. Jangan menghemat diam-diam dengan model yang tidak sesuai mutu atau memotong jatah yang dibeli. Jika margin atau mutu gagal, ajukan perubahan terbuka sebelum menjual paket baru. Perbandingan model hanya menggunakan bahan yang diizinkan dan kandidat yang terverifikasi.

**Selesai ketika:** pemeriksaan penting pada blueprint memiliki bukti, kegagalan yang tersisa dijelaskan, dan hasil uji terbatas dapat ditinjau pemilik. Jangan mengklaim pengujian iPhone jika hanya melakukan emulasi viewport pada laptop.

## 17 Tahap 12 Menyiapkan rilis yang dapat ditinjau

**Tujuan:** menghasilkan paket yang siap dinilai sebelum tindakan publik atau komersial berikutnya.

Kerjakan:

1. Pastikan build, typecheck, dan pemeriksaan yang relevan lulus pada kode terbaru.
2. Siapkan `.env.example` tanpa rahasia dan dokumentasikan fungsi setiap konfigurasi yang benar-benar dipakai.
3. Dokumentasikan migrasi, data yang berubah, backup sebelum perubahan, serta langkah pemulihan bila migrasi gagal. Jangan mengandalkan rollback yang belum diuji untuk perubahan destruktif.
4. Pastikan mode simulasi, saldo tester, log isi, serta tombol administrasi pengembangan tidak dapat diakses pada produksi.
5. Catat status domain, provider, merchant, tarif akhir, kebijakan saldo, retensi, dan dukungan. Keputusan belum final tidak boleh tampil sebagai janji publik.
6. Siapkan panduan uji singkat untuk pemilik serta daftar skenario yang sudah dibuktikan.
7. Jika staging diotorisasi, jalankan deploy dan uji pada lingkungan tersebut; jika belum, siapkan konfigurasi dan instruksi deploy tanpa mengklaim URL sudah aktif.
8. Sampaikan hasil yang konkret sebelum meminta akses atau otorisasi untuk langkah eksternal yang memang belum diberikan.
9. Sertakan bukti Tokoh dan Privasi Buku pada paket rilis: seluruh tokoh termasuk diri penulis dapat disamarkan, nama pena/akun terpisah, pemetaan privat terisolasi, konteks tersamarkan sebelum provider, invalidasi versi privasi, tinjauan snapshot ekspor, pengantar yang sesuai, serta pemulihan cadangan tanpa pemetaan privat. Siapkan teks penjelasan audio, batas deteksi identitas, dan pilihan cadangan yang tidak menjanjikan anonimitas.
10. Wajibkan bukti email akun publik, unggahan media langsung dan finalisasi, ekspor/backup besar, batas pemulihan job, serta latihan restore layanan sebelum rilis berbayar. SMTP bawaan untuk pengembangan atau sukses mengimpor satu proyek tidak memenuhi gerbang ini.
11. Sertakan hasil pilot beberapa hari hingga 2–3 bab, contoh cakupan tinjauan, tabel operasi/biaya berversi, serta model harga dengan pengukuran riil. Target RPO/RTO dan purge normal baru boleh menjadi janji layanan apabila secara terpisah ditetapkan dan kapasitas operasionalnya terbukti.

**Selesai ketika:** kode, instruksi menjalankan, konfigurasi, bukti verifikasi, dan sisa kebutuhan akses tersedia. Status siap rilis tidak sama dengan aplikasi sudah dipublikasikan atau pembayaran produksi sudah aktif.

## 18 Pemeriksaan teknis dan dokumentasi hasil

Gunakan package manager serta skrip repositori yang ditemukan pada Tahap 0. Nama skrip berikut adalah target yang dapat dipadankan dengan skrip yang sudah ada:

| Pemeriksaan | Fokus |
| --- | --- |
| `lint` | Masalah statis yang relevan pada kode berubah |
| `typecheck` | Kontrak TypeScript serta ketidaksesuaian tipe |
| `test:unit` | State machine, tarif, masa berlaku, hitungan kredit, matcher nama, dan kesesuaian templat pengantar |
| `test:integration` | Database, RLS, ledger, job, callback, pembatasan pemetaan privat, serta invalidasi versi privasi |
| `test:e2e` | Jalur pengguna, penggantian tokoh lintas bab, tinjauan ekspor, cadangan, dan kegagalan lintas komponen |
| `build` | Aplikasi dapat dibangun dengan konfigurasi yang dimaksud |

Jangan membuat pengujian yang hanya menyalin implementasi atau mengunci setiap detail tata letak. Dahulukan risiko kehilangan tulisan, kebocoran data, pertanyaan tanpa akhir, tagihan ganda, dan kegagalan pemulihan.

Untuk tiap hasil verifikasi, catat:

- Kode atau commit yang diperiksa.
- Lingkungan dan mode provider, misalnya mock, sandbox, atau nyata.
- Perintah dan skenario yang benar-benar dijalankan.
- Hasil serta kegagalan yang masih ada.
- Hal yang belum dapat diuji dan alasan konkretnya.
- Untuk privasi tokoh: snapshot naskah dan versi kebijakan yang diuji, cakupan matcher, jalur pemetaan privat, dan pemeriksaan manual media yang masih diperlukan. Gunakan ID sintetis; jangan merekam identitas asli dalam bukti uji.

Data sintetis yang dipakai untuk tes tidak boleh dianggap sebagai sesi pengguna nyata atau bukti mutu bahasa penulis.

## 19 Pelaporan setelah setiap tahap

Perbarui dokumen progres dan berikan laporan singkat. Jangan berhenti hanya untuk bertanya apakah boleh melanjutkan tahap yang sudah termasuk tugas.

Gunakan format berikut sebagai contoh isi laporan:

```text
Tahap
Status

Hasil yang berubah
Perilaku pengguna yang sekarang dapat dicoba

Verifikasi yang dijalankan
Lingkungan dan hasilnya

Keterbatasan atau hambatan
Pekerjaan berikutnya yang dapat dilanjutkan
```

Jika membutuhkan masukan, batasi pada informasi yang benar-benar menghalangi langkah tertentu. Contoh: merchant Duitku belum menyediakan kredensial sandbox; sementara itu adapter, pengujian signature dengan fixture, dan alur invoice lokal dapat tetap diselesaikan.

## 20 Catatan keputusan dan batas perubahan

Codex dapat memutuskan struktur komponen, nama fungsi, dan teknik implementasi rutin selama kontrak produk tetap terpenuhi. Catat alasan bila mengganti komponen teknis awal karena lingkungan yang tersedia atau hasil pengujian.

Jangan mengubah diam-diam:

- Nama aplikasi, platform pembayaran, harga, jatah kredit, atau masa berlakunya.
- Batas empat pertanyaan, satu pertanyaan refleksi, dan perilaku Lewati atau jeda.
- Pemisahan transkripsi dari kredit teks dan batas rekaman per berkas.
- Larangan penggunaan bahan pribadi, ownership, atau persetujuan penulis atas revisi.
- Nama asli yang opsional termasuk diri penulis, pemisahan nama pena/narator/akun, pemetaan privat, penanda pending, dan keputusan eksplisit tiap tokoh.
- Pengaturan tokoh tanpa biaya AI, penyamaran sebelum provider, serta batas ekspor dan cadangan yang berbeda.
- Retensi, nasib saldo, atau cakupan penghapusan data.
- Tarif dan cakupan `assemble_section`, batas tinjauan terpilih, serta larangan klaim otomatis seluruh buku sudah diperiksa.
- Batas token kumulatif, anggaran retry, tenggat reservasi, penagihan hasil sah, serta pengungkapan gangguan sebelum pekerjaan baru.

Perubahan perilaku tersebut harus dicatat sebagai usulan kepada pemilik. Sebelum itu, lanjutkan implementasi yang konsisten dengan keputusan yang sudah diberikan.

Jangan mengarang kebijakan refund, ketersediaan model, status merchant, hasil test, URL deploy, atau janji penghapusan cadangan yang belum dibuktikan.

## 21 Rujukan saat integrasi

Gunakan dokumentasi resmi sesuai komponen dan versi yang benar-benar dipasang. Tautan berikut menjadi titik awal verifikasi ketika tahap terkait dikerjakan; nilai tarif dalam blueprint adalah snapshot, bukan jaminan tidak berubah.

- [Duitku POP](https://docs.duitku.com/pop/id/) untuk invoice, redirect, dan callback.
- [Cek transaksi Duitku](https://docs.duitku.com/api/id/#cek-transaksi) untuk verifikasi status yang mengikuti batas provider.
- [Harga Duitku](https://www.duitku.com/harga/) untuk kanal serta biaya merchant.
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing) untuk model dan tarif.
- [Kontrol data OpenAI](https://developers.openai.com/api/docs/guides/your-data) untuk kebijakan pemrosesan.
- [Transkripsi OpenAI](https://developers.openai.com/api/docs/guides/speech-to-text) untuk dukungan rekaman.
- [Dokumentasi Tiptap](https://tiptap.dev/docs/editor/getting-started/overview) untuk editor dan batas fitur.
- [Cadangan Supabase](https://supabase.com/docs/guides/platform/backups) untuk cakupan backup database dan kebutuhan media terpisah.
- [SMTP Supabase](https://supabase.com/docs/guides/auth/auth-smtp) untuk autentikasi email pengguna umum.
- [Unggahan resumable Supabase](https://supabase.com/docs/guides/storage/uploads/resumable-uploads) untuk koneksi terputus dan jalur berkas besar.
- [Batas Vercel Functions](https://vercel.com/docs/functions/limitations#request-body-size) untuk payload unggah/unduh.
- Lampiran `kajian-harga-dan-penulisan.md` untuk sumber teknik memoar, perbandingan penawaran, asumsi biaya, dan batas kesimpulan riset.
- [Vercel Pricing](https://vercel.com/pricing) dan [Supabase Pricing](https://supabase.com/pricing) untuk biaya lingkungan yang dipilih.

## 22 Checklist penyerahan akhir

- [ ] Nama CeritaJadiBuku konsisten pada aplikasi dan dokumentasi.
- [ ] Pembayaran mengikuti rancangan Duitku.
- [ ] Sesi biasa, sesi refleksi, Lewati, jeda, dan resume sesuai blueprint.
- [ ] Audio 10 menit dijelaskan dan diterapkan per berkas.
- [ ] Sumber asli, draf, dan naskah yang disetujui dapat dibedakan.
- [ ] Pemeriksaan ownership serta privasi berlaku pada API dan job.
- [ ] Semua tokoh termasuk diri penulis boleh disamarkan; nama pena, tokoh narator, dan identitas akun/tagihan terpisah tanpa fallback identitas ke ekspor.
- [ ] Tinjau tokoh hanya dibuka pengguna, satu pertanyaan, Atur nanti, dan tanpa sesi atau tagihan otomatis.
- [ ] ID tokoh serta panggilan konsisten; perubahan lintas bab ditinjau tanpa menimpa sumber atau revisi baru.
- [ ] Pemetaan privat tidak muncul pada API umum, konteks AI, log, atau dukungan biasa.
- [ ] Penyamaran terjadi sebelum provider dan tidak melewati no-AI; perubahan versi membatalkan konteks, cache, serta review lama.
- [ ] Pengguna memahami bahwa nama dalam audio diterima penyedia transkripsi dan penyamaran teks tidak berlaku surut.
- [ ] Harga, kredit, reservasi, dan callback tidak menimbulkan duplikasi.
- [ ] Konflik sinkronisasi tidak menghilangkan tulisan.
- [ ] Ekspor serta cadangan naskah dan media terbukti dapat digunakan.
- [ ] Tinjauan privasi memeriksa snapshot ekspor; nama terlarang diblokir sampai terselesaikan dan pengantar sesuai perubahan yang disetujui.
- [ ] Ekspor bersih tidak memuat pemetaan, komentar, revisi internal, atau metadata privat; gambar ditinjau pengguna.
- [ ] Cadangan tanpa pemetaan privat tetap dapat dipulihkan; sumber/audio tidak diklaim anonim.
- [ ] Proyeksi privasi ekspor tersedia tanpa AI selama masa baca/ekspor 15 hari, tanpa membuka editor umum.
- [ ] Expiry top-up 30 hari per lot dan notifikasi retensi saat `paid_until` serta H-7/H-1 teruji; callback atau perpanjangan tidak mereset expiry lot.
- [ ] Retensi serta penghapusan memiliki implementasi dan bukti yang sesuai.
- [ ] Beberapa momen dapat menjadi 2–3 bab, sumber tetap terlacak, dan transisi tidak mengarang kejadian.
- [ ] `assemble_section` 6 kredit dan tinjauan bagian terpilih 10 kredit mempunyai scope, batas kata/token, serta persetujuan biaya.
- [ ] Lot kedaluwarsa, tenggat reservasi, unknown terminal, fencing hasil terlambat, dan adjustment hasil gagal teruji.
- [ ] Transkripsi parsial memakai interval durasi yang terbukti; potongan senyap/gagal/overlap/retry tidak ditagih ganda.
- [ ] Email autentikasi/pengingat ke pengguna umum, direct upload/finalisasi, serta ekspor/backup besar terbukti pada staging.
- [ ] Pemulihan layanan database dan media memenuhi target RPO/RTO yang diuji; jurnal penghapusan diterapkan sebelum akses dan transaksi direkonsiliasi.
- [ ] Target purge normal 15 menit, batas maksimum tujuh hari, dan pelepasan slot setelah purge primer konsisten.
- [ ] Pilot beberapa hari serta model biaya aktual mendukung mutu dan harga; hasil mock tidak dijadikan bukti pengguna nyata.
- [ ] Lingkungan simulasi, sandbox, dan produksi dilaporkan secara terpisah.
- [ ] README, konfigurasi contoh, progres, hasil verifikasi, dan panduan operasi tersedia.
- [ ] Kebutuhan akses atau keputusan yang belum selesai dijelaskan tanpa mengklaim hasil palsu.

Mulai pelaksanaan dari Tahap 0, lalu bangun satu alur cerita pendek yang dapat dicoba sebelum memperluasnya ke seluruh pengelolaan buku. Selesaikan fondasi privasi, kredit, serta pekerjaan yang tahan gangguan sebelum mengaktifkan AI dan pembayaran nyata.
