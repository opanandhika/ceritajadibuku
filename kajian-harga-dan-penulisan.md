# Kajian Harga dan Penulisan CeritaJadiBuku

Versi 1.1 · 10 September 2026  
Pendamping blueprint versi 1.4 dan langkah implementasi versi 1.3.

Dokumen ini menjelaskan alasan keputusan harga, batas model biaya, serta temuan praktik menulis yang diterjemahkan ke rancangan produk. Perhitungan menggunakan asumsi yang dapat diperbarui. Belum ada pengujian API produksi, pembelian layanan pembanding, atau bukti konversi pembayaran pengguna Indonesia.

## 1. Keputusan yang digunakan

**Pertahankan paket Rp79.000 per bulan dengan 150 kredit, tiga proyek, dan penyimpanan 1 GB.** Kredit tambahan ditetapkan 50 kredit/Rp29.000 dan **150 kredit/Rp59.000**, turun dari usulan awal Rp69.000 sebelum peluncuran. Harga ini merupakan hipotesis peluncuran yang harus melewati pengujian biaya dan mutu sebelum penjualan publik.

Perhitungan menunjukkan kontribusi positif ketika seluruh kredit terpakai, termasuk pada skenario biaya lebih berat. Namun, usaha tetap dapat merugi ketika jumlah pelanggan belum menutup biaya tetap. Harga yang tepat juga bergantung pada manfaat yang dirasakan penulis, bukan hanya ongkos model AI.

Semua tokoh boleh memakai samaran, **termasuk penulis ketika menjadi tokoh dalam kisahnya sendiri**. Nama pena di sampul, nama narator dalam cerita, dan identitas akun/tagihan disimpan sebagai pengaturan berbeda. Penulis tetap dapat menggunakan sudut pandang “aku” atau “saya”. Nama akun, email, atau tagihan tidak otomatis masuk ke sampul, biodata, maupun metadata ekspor. Pilihan “Samarkan semua tokoh, termasuk saya” selalu menampilkan pratinjau sebelum diterapkan. Penggantian nama tidak menjamin seseorang mustahil dikenali dari konteks.

## 2. Harga yang mudah dipahami pengguna

| Komponen | Keputusan |
|---|---|
| Langganan | Rp79.000/bulan, 150 kredit, tiga proyek, 1 GB total per akun |
| Kredit tambahan | 50 kredit/Rp29.000; 150 kredit/Rp59.000 |
| Masa kredit paket | Berakhir pada akhir periode langganan yang memberikannya |
| Masa kredit tambahan | Tepat 30 × 24 jam sejak pembayaran pertama kali terverifikasi; pemakaian memerlukan langganan aktif |
| Masa baca/ekspor setelah langganan | Tepat 15 × 24 jam sejak `paid_until`; pemberitahuan saat periode berakhir dan H-7/H-1 sebelum deadline |
| Pembayaran awal | Duitku; perpanjangan melalui invoice, tanpa janji debit otomatis |
| Pekerjaan manual | Menulis, mengatur nama, menyusun urutan, menerima suntingan, dan ekspor tidak memakai kredit AI |
| Rekaman | Maksimal 10 menit atau 25 MB per berkas, mana yang tercapai lebih dahulu; bukan jatah rekaman bulanan |

Ilustrasi alokasi 150 kredit: 30 sesi teks lengkap; atau 100 menit transkripsi ditambah 10 sesi teks lengkap; atau 20 sesi teks lengkap, lima penyusunan bagian, dan 20 menit transkripsi. Contoh terakhir memakai 100 + 30 + 20 kredit. Semua ilustrasi belum menyisihkan revisi dan tinjauan tambahan. Jangan menjanjikan jumlah halaman atau buku utuh karena kebutuhan setiap penulis berbeda.

Paket tambahan 150 kredit/Rp59.000 dipilih untuk memperbaiki keterjangkauan: pada skenario tekanan dan VA, kontribusi tambahannya masih sekitar 57,2% sebelum overhead tambahan. Alternatif Rp69.000 memberikan cadangan usaha lebih besar, tetapi perhitungan belum menunjukkan harga itu harus dipertahankan agar kredit tambahan tidak rugi secara variabel. Keputusan tetap perlu diperiksa melalui pilot tanpa mengubah saldo yang sudah dibeli.

Revisi ini menggunakan masa kredit tambahan 30 hari dan retensi isi 15 hari. Angka kontribusi serta titik impas tetap dihitung dengan seluruh kredit terpakai dan anggaran biaya yang sama; belum ada pengukuran yang membenarkan penurunan biaya storage atau dukungan. Penghematan akibat masa simpan lebih pendek baru dimasukkan setelah terukur. Saldo yang masih sah tidak memperpanjang retensi proyek; pemakaian kredit tetap memerlukan langganan aktif.

## 3. Dasar biaya dan asumsi

Input model AI adalah US$0,20 per satu juta token masukan, US$1,20 per satu juta token keluaran, serta US$0,0045 per menit transkripsi. Angka mengikuti kandidat provider dalam blueprint dan harus diperiksa kembali terhadap model serta akun yang benar-benar tersedia sebelum produksi. Tarif murah tidak membuktikan mutu bahasa Indonesia memadai. [Harga OpenAI API](https://developers.openai.com/api/docs/pricing)

| Asumsi | Skenario dasar | Skenario tekanan |
|---|---:|---:|
| Kurs anggaran, bukan kurs pasar | Rp17.000/US$ | Rp20.000/US$ |
| Cadangan biaya provider | 20% | 50% |
| Biaya AI untuk pemakaian penuh 150 kredit | Rp13.770 | Rp20.250 |
| Variabel lain per akun aktif/bulan | Rp5.000 | Rp8.000 |
| Anggaran biaya tetap/bulan | Rp1.200.000 | Rp1.800.000 |

Cadangan provider menampung ketidakpastian invoice, konversi pembayaran, dan sebagian kegagalan pemrosesan. **Angka 20% dan 50% bukan tarif pajak dan bukan jaminan semua kegagalan tercakup.** Kurs sudah diterapkan sekali. Skenario biaya AI menggunakan jenis pekerjaan dengan biaya berhasil tertinggi per kredit, yaitu transkripsi, dan menganggap semua kredit habis.

Tambahkan skenario **gangguan berat**: kurs Rp20.000, faktor provider 2,4 kali yang berasal dari dua kali biaya pemrosesan akibat pemakaian penuh anggaran ulang, dikalikan cadangan lain 1,2 kali. AI untuk 150 kredit menjadi Rp32.400; variabel lain Rp8.000 dan biaya tetap Rp1,8 juta. Ini ilustrasi retry terkendali, bukan batas kerugian apabila rangkaian kegagalan dibiarkan tanpa pembatasan.

Variabel lain adalah anggaran awal penyimpanan, transfer data, dukungan, dan retensi. Nilainya belum terukur. Biaya tetap mencakup anggaran infrastruktur dan operasi dasar. Model belum memasukkan gaji pendiri, ongkos pengembangan, pemasaran, atau pajak atas laba. Saat invoice aktual tersedia, pisahkan kembali komponen tetap dan variabel agar tidak dihitung dua kali.

Vercel Pro memiliki biaya dasar US$20/bulan dan Supabase Pro mulai US$25/bulan. Keduanya tetap dapat menagih penggunaan tambahan. Resend Pro US$20/bulan menjadi tambahan jika kapasitas email gratis tidak memadai. Kombinasi US$65 setara Rp1.105.000 pada kurs anggaran dasar, sebelum komponen lain; karena itu anggaran tetap Rp1,2 juta tergolong ketat. [Vercel Pro](https://vercel.com/docs/plans/pro-plan), [Supabase Pricing](https://supabase.com/pricing), [Resend Pricing](https://resend.com/pricing)

Supabase Pro mencantumkan 100 GB penyimpanan berkas bersama dengan biaya penggunaan di atas kapasitas paket. Cadangan database tidak mencakup isi objek media. Salinan media, transfer, worker, staging, pemulihan, domain, serta pemantauan tetap perlu masuk anggaran aktual. Kuota 1 GB pengguna tidak berarti seluruhnya tersedia gratis pada skala berapa pun. [Supabase Pricing](https://supabase.com/pricing), [Dokumentasi Cadangan Supabase](https://supabase.com/docs/guides/platform/backups)

## 4. Perbandingan Rp59.000, Rp79.000, dan Rp99.000

Rumus yang digunakan: **kontribusi per pelanggan = harga − biaya AI − biaya pembayaran − variabel lain**. Jumlah pelanggan untuk menutup biaya tetap dihitung dengan membagi biaya tetap dengan kontribusi, lalu dibulatkan ke atas. Ini titik impas operasional model, belum laba usaha penuh.

Duitku mencantumkan QRIS 0,7% dan VA BCA Rp5.000 per transaksi; tarif publik disebut sudah termasuk PPN. Tabel memakai dua skenario terpisah: seluruh transaksi melalui QRIS atau melalui VA berbiaya Rp5.000. Keduanya tidak dijumlahkan. Kanal aktif, klasifikasi layanan digital, pencairan, dan perlakuan refund perlu dikonfirmasi saat onboarding merchant. [Harga Duitku](https://www.duitku.com/harga/)

| Harga dengan 150 kredit | Kontribusi dasar QRIS / VA | Pelanggan impas dasar QRIS / VA | Kontribusi tekanan QRIS / VA | Pelanggan impas tekanan QRIS / VA |
|---|---:|---:|---:|---:|
| Rp59.000 | Rp39.817 / Rp35.230 | 31 / 35 | Rp30.337 / Rp25.750 | 60 / 70 |
| **Rp79.000** | **Rp59.677 / Rp55.230** | **21 / 22** | **Rp50.197 / Rp45.750** | **36 / 40** |
| Rp99.000 | Rp79.537 / Rp75.230 | 16 / 16 | Rp70.057 / Rp65.750 | 26 / 28 |

Rp59.000 memungkinkan harga masuk lebih rendah, tetapi membutuhkan pelanggan lebih banyak untuk menutup operasi. Rp99.000 menyediakan cadangan lebih besar, tetapi belum terbukti lebih mudah menghasilkan pendapatan total karena konversinya dapat berbeda. Rp79.000 dipilih sebagai titik uji awal yang memberi ruang biaya sambil mempertahankan harga yang sudah dirancang.

Contoh konkret: 30 pelanggan Rp79.000 dengan VA menyisakan Rp456.900 setelah biaya model dasar, tetapi masih defisit Rp427.500 pada skenario tekanan. Dengan 10 pelanggan, kedua skenario masih rugi. Menambah biaya gaji atau pemasaran menaikkan titik impas lagi. Jangan membaca margin kontribusi sekitar 58–76% pada paket terpilih sebagai margin laba bersih.

Pada skenario gangguan berat dengan VA, paket Rp79.000 menyisakan kontribusi Rp33.600 dan memerlukan 54 pelanggan untuk menutup biaya tetap model. Usaha perlu menyediakan anggaran awal ketika pelanggan belum mencapai titik impas, sekaligus menghentikan sumber pemborosan saat insiden terdeteksi.

QRIS dan VA bukan seluruh kemungkinan biaya pembayaran. Misalnya, kartu kredit pada tarif 2,9% + Rp2.500 berbiaya Rp5.371 untuk transaksi Rp99.000, melebihi VA dalam tabel. Perhitungan produksi harus memakai campuran kanal aktual; harga pelanggan diasumsikan sudah menanggung biaya pembayaran usaha. [Harga Duitku](https://www.duitku.com/harga/)

## 5. Ekonomi kredit tambahan

| Kredit / harga terpilih | Kontribusi tambahan dasar QRIS / VA | Kontribusi tambahan tekanan QRIS / VA |
|---|---:|---:|
| 50 / Rp29.000 | Rp24.207 / Rp19.410 | Rp22.047 / Rp17.250 |
| 150 / Rp59.000 | Rp44.817 / Rp40.230 | Rp38.337 / Rp33.750 |

Kontribusi tambahan di atas hanya mengurangi AI dan biaya pembayaran. Tabel belum mengalokasikan dukungan tambahan, biaya tetap, akuisisi, atau refund. Penjualan saldo juga menimbulkan kewajiban melayani kredit yang masih berlaku selama 30 hari. Uang yang diterima hari ini tidak seluruhnya bebas dibelanjakan.

Pada skenario gangguan berat dengan VA, 150 kredit/Rp59.000 menyisakan Rp21.600 sebelum overhead tambahan. Alternatif Rp69.000 memberi Rp43.750 pada skenario tekanan dengan VA, dibanding Rp33.750 pada harga terpilih. Selisih cadangan Rp10.000 dikorbankan untuk harga pembelian ulang lebih terjangkau; jangan menambah diskon lagi sebelum biaya nyata jelas. Biaya VA Rp5.000 juga mencapai sekitar 17,2% dari top-up Rp29.000 sehingga pembayaran kecil perlu dipantau.

## 6. Batas pekerjaan yang membuat harga dapat dipertanggungjawabkan

| Pekerjaan | Kredit | Batas bahan/hasil yang dilihat pengguna | Batas token masukan/keluaran per tahap berhasil |
|---|---:|---|---:|
| Penggalian satu momen | 1 | Maksimal empat pertanyaan ditampilkan, satu per giliran | 10.000 / 500 |
| Draf | 4 | Hasil maksimal 800 kata | 10.000 / 3.500 |
| Revisi | 2 | Bagian terpilih maksimal 1.000 kata; hasil maksimal 1.200 kata | 8.000 / 2.500 |
| Tinjau bagian terpilih | 10 | Masukan maksimal 5.000 kata; hasil maksimal 1.200 kata | 20.000 / 3.000 |
| Susun potongan menjadi bagian | 6 | Dua atau lebih potongan, total maksimal 2.000 kata; hasil maksimal 1.200 kata | 12.000 / 3.500 |
| Transkripsi | 1/menit | Durasi sah yang berhasil, tanpa pembulatan menit per berkas | Berdasarkan durasi audio |

Batas token merupakan akumulasi seluruh panggilan pada tahap, termasuk ringkasan pendukung dan reasoning yang ditagih. Bukan jatah setiap panggilan. Batas kata dan token sama-sama berlaku. Sesi penggalian beserta draf memakai maksimal 20.000 token masukan dan 4.000 keluaran, dengan tarif pengguna total lima kredit. Bahan asli tidak dipotong atau dihapus hanya karena konteks AI perlu dibatasi.

Penyusunan berbantuan AI menampilkan urutan, gabungan, transisi, dan sumber untuk ditinjau sebelum diterapkan. Masukan yang lebih panjang memerlukan pembagian cakupan serta biaya yang diketahui pengguna. Tinjauan 5.000 kata boleh mencakup pilihan dari beberapa bab, tetapi tidak diberi label seolah memeriksa seluruh buku 150.000 kata. Penyusunan manual tetap gratis.

Setiap tahap maksimal memiliki dua percobaan tambahan. Total token input tambahan dan total token output tambahan masing-masing tidak melebihi satu kali anggaran jenis token yang sama pada tahap asal; anggaran input tidak dapat dialihkan menjadi output. Audio tambahan tidak melebihi durasi awal. Namun, pembatasan per pekerjaan saja belum membatasi rangkaian pekerjaan gagal. Catat seluruh biaya provider, termasuk hasil terlambat dan gagal, terpisah dari kredit pengguna. Terapkan anggaran kegagalan per akun dan global yang menghentikan pemrosesan saat batas tercapai, dengan pemberitahuan gangguan dan pemulihan yang jelas. Tidak ada model lebih mahal, alat AI berbayar, atau panggilan pendukung tanpa anggaran.

Pertanyaan pembuka dan pengaturan tokoh dapat memakai template atau metadata tanpa panggilan AI. Pemrosesan gagal tidak menjadi tagihan tersembunyi. Respons yang tidak dapat dipulihkan harus memiliki tenggat, melepaskan reservasi yang semestinya dilepas, dan membuka kembali akses pengguna; respons lama tidak boleh menagih ulang.

## 7. Pos yang paling mudah membuat model meleset

Perhatikan jumlah pengguna yang berhenti berlangganan tetapi datanya masih disimpan selama retensi 15 hari sejak `paid_until`. Jendela baca/ekspor ini berbeda dari proses penghapusan primer dan kedaluwarsa cadangan yang dijelaskan blueprint; tidak berarti seluruh salinan langsung lenyap pada hari ke-15. Biaya mereka tidak hilang ketika pemasukan berhenti. Ukur penyimpanan, media, backup, dan akses ekspor menurut kelompok bulan berlangganan/berhenti; jangan hanya membagi total biaya dengan pelanggan yang masih aktif. Besarnya beban ini belum diketahui dan dapat melampaui anggaran variabel.

Pemakaian melebihi kapasitas provider, dukungan intensif, refund, kegagalan berulang, dan kenaikan compute dapat mengubah biaya secara bertahap maupun mendadak. Buffer 20% tidak menutup keadaan ketika setiap pekerjaan membutuhkan biaya ulang 100%. Operator harus melihat pemakaian dan memiliki batas belanja nyata. Paket yang tampak untung hanya karena kredit hangus atau karena biaya kerja pemilik dianggap nol belum terbukti sehat.

## 8. Pembanding pasar: memberi konteks, bukan menentukan harga

| Produk | Penawaran resmi yang diperiksa | Mengapa tidak langsung sebanding |
|---|---|---|
| Remento | US$99 tahun pertama, termasuk satu buku hardcover; perpanjangan US$99/tahun atau US$12/bulan | Menggabungkan layanan cerita dan buku fisik; daftar pengiriman resmi tidak mencantumkan Indonesia. [Produk](https://www.remento.co/), [Pengiriman](https://help.remento.co/en/articles/8365901-where-does-remento-ship-books-internationally) |
| Sudowrite Hobby & Student | US$19 bila dibayar bulanan atau ekuivalen US$10/bulan dengan pembayaran tahunan; 225.000 kredit internal | Berorientasi penulisan kreatif; satuan kredit dan batas faktual berbeda. [Paket resmi](https://docs.sudowrite.com/plans--account/wBnmhtSyMcWtk2BLzifGkz/what-plans-are-available/mwfVvj2rGcKYs1BQy4Pdcb) |
| Novlr Starter | Ekuivalen US$8/bulan, ditagih tahunan; 10 proyek | Ruang kerja penulisan; halaman harga tidak memberikan jatah AI setara paket ini. [Harga resmi](https://www.novlr.org/pricing) |

Harga asing tidak membuktikan kesediaan membayar di Indonesia. Penelusuran terbatas juga tidak cukup untuk menyatakan pesaing lokal tidak ada. Pembanding ini mengingatkan bahwa pengguna membeli kemajuan menuju buku dan kenyamanan menulis. Halaman penjualan CeritaJadiBuku sebaiknya memperlihatkan contoh perjalanan beberapa momen menjadi subbab, estimasi kredit, dan peran penulis dalam penyuntingan.

## 9. Enam temuan praktik menulis dan penerapannya

Sumber berikut berupa tulisan atau wawancara langsung penulis, editor, dan pelatih menulis. Ini nasihat keterampilan serta pengalaman profesional, **bukan bukti eksperimen bahwa fitur tertentu efektif**. Penerapan ke aplikasi merupakan inferensi desain yang perlu diuji.

| Temuan dari sumber | Perubahan minimum pada aplikasi |
|---|---|
| Esther Harder menyarankan fokus yang membantu memilih cerita dan boleh berkembang ketika pemahaman penulis berubah. [Menemukan fokus memoar](https://janefriedman.com/stop-counting-toothbrushes-find-your-memoirs-real-story/) | Catatan satu kalimat tentang fokus dan pembaca tersedia secara opsional setelah beberapa momen. Pengguna tetap bisa langsung bercerita. |
| Lisa Cooper Ellison membahas fungsi adegan konkret serta ringkasan yang menghubungkan momen. [Menulis adegan](https://janefriedman.com/how-scene-writing-helps-you-lose-control-and-find-your-memoirs-story/) | AI memilih satu detail yang paling membantu; tidak menuntut daftar detail indrawi atau mengarang cuaca, pakaian, dan dialog. |
| Ellison membedakan perspektif ketika kejadian berlangsung dengan pemahaman penulis saat melihat kembali. [Refleksi dalam memoar](https://janefriedman.com/dont-ruin-the-mystery-how-to-reflect-in-memoir-without-giving-it-all-away/) | Pertahankan cerita saja, refleksi halus, atau hikmah eksplisit. Tidak ada kewajiban menemukan pelajaran positif atau penutupan emosional. |
| Beth Kephart menunjukkan hubungan potongan memoar dapat dibangun melalui tema dan penjajaran, tidak selalu kronologi yang mulus. [Memoar dalam potongan](https://creativenonfiction.org/writing/the-memoir-in-pieces/) | Satu alat susun mendukung urutan kronologis atau kelompok momen bertema; pisahkan waktu kejadian dan urutan penyajian. |
| Ellison menyarankan kejujuran tentang bagian yang tidak diingat dan pemeriksaan bahan pendukung. [Celah ingatan](https://janefriedman.com/how-to-handle-memory-gaps-in-your-memoir/) | Simpan waktu perkiraan dan “seingat saya”; tandai versi yang bertentangan. Gunakan tuturan tidak langsung bila kalimat persis tidak tersedia. |
| Hester Kaplan membahas struktur, ketelitian bahasa, membaca keras-keras, dan pembaca tepercaya dalam wawancara dengan Marion Roach Smith. [Transkrip QWERTY](https://marionroach.com/2026/09/how-to-write-structure-and-edit-a-memoir-with-writer-hester-kaplan/) | Gunakan contoh tulisan yang disetujui untuk menjaga suara penulis. Sediakan ekspor untuk tinjauan pribadi tanpa menambah kolaborasi publik atau layanan suara baru. |

Untuk proyek pengalaman sekolah di Jepang, fokus dapat berupa perjalanan menuju mimpi, sementara persahabatan, perjuangan, dan cinta memperkaya perjalanan itu. Ini contoh kerangka, bukan kesimpulan tentang pengalaman sebenarnya. Cerita yang belum menemukan makna tetap boleh masuk jika relevan bagi buku.

Materi YouTube yang relevan ditemukan, tetapi isi video/transkripnya tidak berhasil diverifikasi; kajian ini tidak mengaku telah menontonnya. Insight wawancara di atas bersandar pada transkrip resmi yang dapat dibaca. Tidak ada klaim bahwa menulis menyembuhkan trauma atau AI dapat memulihkan ingatan.

## 10. Pengujian yang menentukan keputusan berikutnya

Mulai dengan uji kenyamanan prototipe, lalu pilot AI setelah privasi, kredit, dan pemulihan kegagalan siap. Usulan praktisnya adalah 6–10 momen menjadi 2–3 bab dalam beberapa hari berbeda. Angka ini rancangan pilot, bukan ukuran sampel ilmiah.

Periksa kemampuan melanjutkan setelah jeda, ketepatan fakta, konsistensi samaran termasuk diri penulis, hubungan antarbagian, suara tulisan, beban pertanyaan, dan banyaknya koreksi. Sasaran awal dapat berupa median penilaian suara tulisan minimal 4/5, tidak ada fakta tanpa sumber pada naskah pilot yang diterima, dan peserta mampu melanjutkan sendiri. Hasil itu tidak menjamin nol kesalahan dalam produksi.

Sebelum penjualan publik, hitung ulang model dengan biaya aktual p50/p95/p99, pemakaian saldo penuh, retry, kanal pembayaran, refund, dukungan, retensi akun berhenti, dan kapasitas infrastruktur yang diperlukan. Uji konversi serta perpanjangan pada harga terpilih; jumlah pendaftar saja tidak membuktikan nilai paket.

Setiap perubahan model AI, anggaran token, tarif provider, masa retensi, kuota, retry, atau diskon harus memicu perhitungan ulang. Jika realisasi melampaui model, perbaiki biaya atau usulan harga untuk pembelian berikutnya secara terbuka; jangan mengurangi saldo sah atau mutu diam-diam. Blueprint dan panduan implementasi menjadi acuan pelaksanaan, sedangkan kajian ini menyimpan alasan serta batas keputusan tersebut.
