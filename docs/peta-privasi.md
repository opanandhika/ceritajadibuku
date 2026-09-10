# Peta privasi tokoh dan isi buku

> Status terkini: prototipe lokal Tahap 1 telah diimplementasikan; lihat [laporan dan bukti](laporan-tahap-1.md). Bagian awal dokumen ini dipertahankan sebagai baseline historis Tahap 0. Pernyataan “belum dibuat/belum diuji” pada baseline berlaku saat discovery; realisasi simulasi dijelaskan pada bagian pembaruan Tahap 1 di bawah. Kontrol produksi dan pilot manusia masih belum selesai.

Tanggal audit: 10 September 2026. Cakupan: discovery Tahap 0.

Dokumen ini memetakan rancangan yang wajib dibangun. **Seluruh kontrol aplikasi, API, penyimpanan, penyamaran, ekspor, dan penghapusan di bawah berstatus `belum_dikerjakan` serta belum diuji.** Pembacaan spesifikasi dan inventarisasi workspace bukan bukti bahwa perlindungan data sudah bekerja.

Rujukan aturan adalah [blueprint versi 1.4](../blueprint%283%29.md) dan [langkah implementasi versi 1.3](../langkah-implementasi%281%29.md). Nomor baris pada dokumen ini mengacu pada berkas sumber saat audit, sebelum perubahan berikutnya.

## 1. Kondisi awal dan batas audit

Inventaris awal hanya menemukan empat dokumen spesifikasi/riset. Belum ditemukan kode editor, database, migrasi, media, cache aplikasi, endpoint, generator ekspor, atau arsip data tokoh lama. Karena itu, kolom "rencana" di bawah menunjukkan lokasi tanggung jawab yang akan dibangun, bukan komponen yang sudah tersedia.

Audit membaca seluruh blueprint dan bagian privasi pada panduan implementasi. Tidak ada data cerita pribadi yang dipakai sebagai fixture, tidak ada isi yang dikirim ke provider, dan tidak ada migrasi data yang dijalankan untuk audit ini.

Kewajiban Tahap 0 yang dipenuhi pemetaan ini: editor, sumber, transkrip, foto, konteks AI, cache, ekspor, cadangan, akses pemetaan privat, dan migrasi tokoh lama (panduan Bagian 5, baris 145–160).

## 2. Aturan identitas yang berlaku lintas alur

| Area | Kontrak rancangan |
| --- | --- |
| Kepemilikan | Seluruh isi, relasi, media, dan pekerjaan terikat pemilik serta proyek. Foreign key lintas proyek/akun ditolak; job berkredensial istimewa tetap memeriksa ownership. |
| Mode buku | `mixed` sebagai awal; pilihan proyek `real`, `pseudonym`, atau `mixed` tidak menjadi izin menerbitkan setiap nama. |
| Keputusan per tokoh | `pending`, `real`, `pseudonym`, atau `role`. Tokoh baru/belum ditinjau tetap `pending` dengan penanda. `Atur nanti` tidak menjadi persetujuan nama asli. |
| Nama asli | Opsional. Seluruh buku dapat ditulis tanpa mengisi nama asli. Nilai privat dan catatan pembicaraan identitas tidak dimuat bersama kartu biasa. |
| Penulis/narator | `publication_author_name`, `narrator_character_id`, nama tampil tokoh diri, profil akun, dan tagihan dipisahkan. Nama akun, billing, email, atau operator tidak menjadi fallback sampul, biodata, ucapan terima kasih, properti Word, atau metadata. |
| Penerapan | Samarkan semua termasuk saya dan perubahan lintas bab memerlukan pratinjau serta tindakan penerapan. Periksa versi dasar; sumber asli dan revisi baru tidak ditimpa. |
| Pertanyaan dan biaya | Tinjau tokoh dibuka pengguna, satu kartu/satu pertanyaan dan perpindahan eksplisit. Klarifikasi dalam wawancara menggunakan sisa batas sesi. Pengaturan, penggantian deterministik, tinjauan dasar, dan templat pengantar tidak memakai kredit AI. |
| Makna samaran | Tidak menggabungkan orang berbeda, mengarang kejadian, atau mengubah substansi fakta. Tidak menjamin anonimitas atau persetujuan seluruh pihak. |

Dasar: blueprint Bagian 7.4–7.10, baris 274–361; Bagian 17, baris 823–825; panduan Bagian 7–9, baris 197–201, 222–223, dan 245–252.

## 3. Model data dan pemisahan akses

Nama entitas mengikuti blueprint Bagian 17; skema fisik, detail enkripsi, dan kontrak serializer ditetapkan serta diuji pada Tahap 2.

| Entitas/representasi | Data atau relasi | Batas akses dan propagasi |
| --- | --- | --- |
| `projects` | Owner, `identity_mode`, `publication_author_name`, `narrator_character_id`, `privacy_revision` | Nilai publik buku merupakan pilihan eksplisit; tetap hanya dapat dibaca pemilik dalam proyek privat. |
| `characters` | ID stabil per proyek, nama tampil, mode, panggilan yang disetujui, relasi, status/versi tinjauan, sumber pendukung | DTO kartu biasa berisi field yang diizinkan. Tidak mengembalikan nama asli atau catatan privat karena join/serializer otomatis. |
| `character_private_identities` | Nama asli opsional, owner/character, catatan pribadi penggunaan identitas | Penyimpanan terpisah dengan ownership serta enkripsi yang sesuai. Hanya jalur privat pemilik dan proses internal yang memang membutuhkan; tidak menjadi konteks AI. |
| `character_mentions` | Character, sumber/section, versi isi, node/posisi, sebutan, status konfirmasi | Sebutan asli sensitif adalah data privat walaupun berada di luar tabel pemetaan. Representasi biasa mempertahankan ID dan posisi tanpa membocorkan field privat. |
| `identity_rules` | Target tokoh/tempat/detail, nilai sumber, pengganti, cakupan, versi, keputusan | Nilai sumber privat dan pasangan asli–pengganti mengikuti pembatasan pemetaan. Alias lama yang dilarang tetap dapat diperiksa internal. |
| `sources`, `source_versions`, `source_links` | Sumber asli, versi, penanda, hubungan asal–turunan | Sumber dapat memuat nama asli. Turunan mewarisi larangan yang mengungkap isi sumber; identitas tidak kehilangan jejak sumber setelah diganti alias. |
| `manuscript_sections`, `revisions`, `drafts` | Isi, versi dasar/aktif, usulan, sumber per unit | Pisahkan bahan, peta cerita, dan naskah. Mentions terikat versi; penerapan usulan tidak menimpa versi lebih baru. |
| `media_assets`, `transcription_chunks` | Objek foto/audio/dokumen, pemilik/proyek, versi/checksum, transkrip dan interval | Isi dan metadata media dapat mengungkap identitas. Storage privat, akses sementara, unggahan harus difinalisasi sebelum diproses. |
| `ai_jobs` dan konteks turunannya | Versi sumber, `privacy_revision`, operation, state/lease/generasi | Payload merupakan proyeksi sumber yang diizinkan; salinan konteks bukan pemetaan privat. Validasi sebelum pengiriman dan commit. |
| `privacy_reviews` | Snapshot naskah/media, proyeksi ekspor, versi privasi, temuan/keputusan | Temuan dapat memuat identitas privat. Data temuan tidak masuk log atau ekspor pembaca dan ikut penyaringan cadangan tanpa pemetaan. |
| `book_notices` | Teks pengantar, perubahan yang dirujuk, versi privasi, persetujuan | Hanya menyebut perubahan yang benar-benar diterapkan; tidak memuat daftar pasangan nama. Perubahan cakupan membatalkan persetujuan yang kedaluwarsa. |
| Snapshot, laporan, cache, arsip ekspor | Salinan entitas/konteks atau berkas hasil | Pembatasan mengikuti isi field, bukan nama tabel. Semua salinan pemetaan terstruktur termasuk dalam opt-in dan penghapusan. |
| `audit_events`, `ai_usage`, notifikasi | ID, aksi, hasil, token/durasi/biaya, referensi | Tidak menyimpan naskah, prompt mentah, nama asli, pemetaan, atau detail temuan privasi. |

Dasar: blueprint Bagian 7.5, 7.7, 7.11 dan 17 (baris 294–320, 375–377, 788–825); panduan baris 111, 197–200, 375–376.

## 4. Titik akses pemetaan privat

| Jalur rancangan | Yang boleh dilakukan | Pembatasan wajib |
| --- | --- | --- |
| `GET/POST /api/projects/:id/characters`, API proyek/editor biasa | Mengambil/membuat kartu dan referensi nonprivat | Tidak mengembalikan pemetaan, catatan privat, sebutan sensitif, atau nilai asal aturan. Gunakan allowlist respons. |
| `GET/PATCH /api/characters/:id/private-identity` | Pemilik secara eksplisit membuka/memperbarui nama asli opsional dan catatan | Autentikasi, ownership, keterikatan proyek, hak, versi, perlindungan mutasi cookie; tidak dibuka melalui endpoint daftar biasa. Nilai respons privat tidak dimasukkan ke cache umum atau persistensi browser rutin. |
| `CharacterService` dan `PrivacyService` internal | Memakai pemetaan yang diperlukan untuk matcher dan proyeksi deterministik | Scope pemilik/proyek; berikan hanya kebutuhan operasi. Matcher tidak mengirim sumber mentah atau daftar nama asli ke layanan eksternal. |
| Preview/apply perubahan identitas | Meninjau dampak nama/merge orang yang sama | Versi dasar dan idempotensi; detail sensitif dalam preview tetap mengikuti akses privat. Penerapan hanya setelah tindakan pengguna. |
| Review dan proyeksi ekspor | Menunjukkan temuan kepada pemilik dan menyelesaikan aturan snapshot ekspor | Detail temuan tidak menjadi log/analitik atau isi berkas pembaca. Selama retensi 15 hari, jalur proyeksi ekspor tetap tersedia tanpa membuka editor umum atau AI. |
| Cadangan proyek dengan opt-in pemetaan | Menyertakan pemetaan bila pilihan terpisah secara eksplisit diaktifkan | Default tidak disertakan; manifest mencatat cakupan. Opt-in berlaku pada seluruh representasi terstruktur yang sensitif. Unduhan privat dan sementara. |
| Dukungan | Metadata minimum; akses isi terbatas dengan izin pemilik untuk tujuan/durasi yang jelas | Pemetaan tidak tersedia untuk dukungan rutin. Diagnosis yang membutuhkan identitas memerlukan kebutuhan dan izin khusus, bukan permintaan cadangan lengkap secara default. |
| Logging, analitik, AI provider, akses lintas akun | Tidak mempunyai kebutuhan menerima pemetaan privat | Tolak/keluarkan nilai privat; catat hanya metadata minimum. Akses lintas akun tidak membocorkan keberadaan proyek. |

Blueprint baris 296 memperbolehkan pemilik membuka data privat lewat tindakan khusus, sedangkan baris 825 melarang pembagian **cache** pemetaan ke browser/layanan yang tidak membutuhkan. Rancangan awal menerapkan respons privat khusus yang hanya dipakai pada interaksi tersebut dan tidak dimasukkan ke cache proyek, IndexedDB rutin, atau prefetch kartu. Ini pembatasan rancangan yang harus diuji, bukan klaim bahwa browser tidak pernah menampilkan nama asli yang diminta pemilik.

Dasar endpoint: blueprint Bagian 18, baris 831–868. Detail enkripsi, lokasi kunci, rotasi, masa hidup respons privat, dan cakupan izin diagnosis belum diputuskan/diterapkan; harus dituntaskan sebelum fitur privat digunakan.

## 5. Permukaan alur identitas

| Permukaan | Identitas yang mungkin hadir | Rencana perlindungan | Tahap pembuktian |
| --- | --- | --- | --- |
| Editor dan naskah | Nama, panggilan, judul, kutipan, catatan kaki, bio, ucapan terima kasih, tokoh diri | Mentions dengan ID dan versi; preview/apply; tangani homonim, Budi/Budiman, dan konflik; sumber tetap utuh. | 2, 4 |
| Sumber asli dan peta cerita | Jawaban, catatan, dokumen, refleksi, linimasa, ringkasan, kandidat tokoh | Sumber/version tetap terpisah; jejak turunan; penanda no-AI/no-book ditegakkan sebelum konteks. Kandidat identitas menunggu konfirmasi. | 2, 3, 6 |
| Audio dan transkrip | Nama yang terucap, nama Jepang, panggilan, hasil koreksi | Simpan audio tidak memulai transkripsi; jelaskan pengiriman audio sebelum tindakan proses; no-AI memblokir transkripsi; transkrip asli dipisahkan dari proyeksi tersamarkan. | 7 |
| Foto dan media | Wajah, papan nama, screenshot, keterangan, nama file, metadata tertanam | Keterangan teks ikut matcher dan preview; tinjau gambar manual; pilihan mengecualikan media/proyeksi ekspor; tidak mengirim foto ke layanan tambahan otomatis. | 4, 8 |
| Konteks AI | Pertanyaan, ringkasan, draf, revisi, susunan bagian, tinjauan, indeks/turunan | Pilih sumber berizin → substitusi internal ke penanda stabil/alias berizin → periksa payload → provider; pemetaan tidak dikirim. Hasil diperiksa sebelum penerapan nama tampilan internal. | 2 dry run, 6 provider |
| Cache server, browser, antrean, pratinjau | Salinan naskah, konteks, nama lama, review/notice | Kunci scope akun/proyek/versi; invalidasi `privacy_revision` dan versi sumber; tanpa pemetaan privat pada cache umum; logout/penghapusan membersihkan salinan yang relevan. | 2, 6, 8, 10 |
| Ekspor Word | Semua teks dan media terpilih, author/properti, komentar, revisi tersembunyi, nama berkas | Review mengikat snapshot dan media yang sama dengan generator; allowlist konten; blokir nama terlarang/no-book/pemetaan; periksa paket Word mentah dan metadata; pending hanya memakai penanda yang ditinjau. | 8 |
| Cadangan proyek pengguna | Struktur, sumber/versi/media, aturan, pemetaan tersebar | Default tanpa pemetaan; saring seluruh field terstruktur privat, termasuk laporan/snapshot; manifest cakupan; sumber/audio mungkin tetap bernama asli; restore mempertahankan relasi tanpa membangun ulang pemetaan. | 8 |
| Cadangan layanan | Database dan seluruh media/versi yang diperlukan memulihkan layanan | Backup harian terkoordinasi, manifest, jurnal penghapusan terpisah; restore menerapkan penghapusan sebelum membuka akses. Pemulihan proyek pengguna tidak menggantikan uji layanan. | 8, 10 |
| Log, dukungan, analitik | Prompt mentah, nama, laporan privasi, screenshot yang mungkin tercatat | Metadata minimum; tidak ada rekaman rutin isi; audit akses dengan ID sintetis; jangan menjadikan nama atau cerita bagian pesan error/telemetri. | 2, 6, 10 |
| Retensi dan penghapusan | Semua isi serta turunan identitas, cache, hasil sementara | Hapus mencakup semua representasi; masa baca/ekspor tepat 15 hari sejak `paid_until`; produksi maksimal 7 hari dari pemicu; cadangan maksimal 30 hari setelah penghapusan produksi aktual. | 10 |

Dasar: blueprint Bagian 7.7–7.11, 10, 11, dan 15; panduan baris 158, 245–252, 288–309, 342–347, 362–379, dan 413–425. Batas penghapusan dan pemulihan adalah target produk/rekayasa yang belum dibuktikan.

## 6. Pemilihan sumber dan invalidasi versi

Urutan pada jalur AI harus dipaksakan aplikasi; prompt bukan satu-satunya perlindungan.

1. Periksa ownership, proyek, hak operasi, versi bahan, state sesi, serta `privacy_revision`.
2. Keluarkan sumber `exclude_from_ai` dan turunan yang mengungkap isinya dari seluruh pemrosesan isi eksternal. Mengganti nama tidak membuat sumber boleh dikirim.
3. Untuk `exclude_from_book`, larang materi masuk draf/ekspor. Penggunaan hanya sebagai konteks membutuhkan `allow_ai_context` terpisah; bila pemisahan tidak dapat dibuktikan, keluarkan sumber dari generasi. `exclude_from_ai` tetap menang.
4. Susun salinan konteks dari sumber yang lolos. Terapkan matcher internal terhadap nama/sebutan dan aturan yang diketahui; gunakan penanda khusus proyek atau alias yang memang diizinkan untuk AI.
5. Periksa payload akhir sebelum provider. Jangan memakai provider eksternal untuk mencari lalu menghapus nama pada bahan mentah sebagai mode dasar.
6. Periksa hasil dan versi terkini sebelum commit. Mapping dan identitas yang dilarang tidak boleh muncul kembali. Terapkan nama tampil untuk naskah secara internal sesuai pilihan eksplisit pengguna.
7. Bila versi berubah saat antre, batalkan konteks lama. Bila provider telah berjalan, hasil tidak otomatis diterbitkan/capture; hasil yang tidak lagi layak tidak ditagih. Data yang sudah diterima provider tidak dapat ditarik kembali melalui pergantian penanda.

Perubahan identitas menaikkan `privacy_revision` dan membatalkan konteks antrean, cache terkait, pratinjau perubahan, review ekspor, serta persetujuan pengantar yang kedaluwarsa. Perubahan naskah atau media juga membatalkan review snapshot yang terdampak. Alias lama yang dilarang tetap ada dalam pemeriksaan kebocoran internal. Persetujuan lama tidak berarti naskah telah mengikuti aturan baru.

Pemilik tetap dapat membaca, mengedit manual, dan mengekspor tulisan no-AI sesuai haknya selama materi tersebut tidak dilarang masuk buku. Cadangan pribadi mengikuti cakupan terpisah dari ekspor pembaca.

Dasar: blueprint baris 314–320, 337–349, 529–540; panduan baris 193–200, 246, 295, dan 305–309.

## 7. Migrasi tokoh lama dan impor

**Kondisi sekarang:** tidak ditemukan database, migration, data tokoh, atau cadangan aplikasi lama. Jumlah tokoh lama yang diidentifikasi untuk dimigrasikan: nihil. Belum ada migrasi/skrip impor yang dibuat atau dijalankan. Tidak perlu mengarang data lama agar Tahap 0 tampak memiliki migrasi.

Kebijakan rancangan bila data lama ditemukan pada tahap berikutnya:

1. Inventarisasi skema, asal, pemilik/proyek, dan bukti keputusan identitas sebelum mutasi. Buat rencana berversi yang menjaga bahan sumber dan memungkinkan pemulihan.
2. Nama lama, kolom profil, atau nama yang sudah berada pada naskah tidak membuktikan izin penerbitan. Tokoh tanpa keputusan identitas yang dapat diverifikasi dipetakan ke ID proyek stabil, mode `pending`, dan penanda aman.
3. Nama asli tidak diwajibkan dan tidak disalin otomatis dari akun/tagihan. Nilai lama yang perlu dipertahankan sebagai bahan privat mengikuti jalur penyimpanan dan akses privat, bukan kartu publik buku.
4. Pisahkan penyebutan orang berbeda yang kebetulan bernama sama. Beberapa panggilan hanya dihubungkan ke satu ID setelah konfirmasi; jangan menggabungkan pengalaman atau membuat tokoh komposit.
5. Mentions yang tidak dapat ditambatkan ke versi/node secara pasti ditandai perlu ditinjau. Naskah asli tetap tersedia bagi pemilik; perubahan publikasi menggunakan pratinjau/proyeksi, bukan penggantian tanpa persetujuan.
6. Impor memvalidasi format, checksum, ukuran, path, kuota, dan hak; pemilik berasal dari sesi autentikasi, bukan berkas. ID lokal/remap harus konsisten, tanpa mengimpor owner atau saldo kredit dari arsip.
7. Cadangan yang menyimpan keputusan per tokoh dan versi secara valid dapat memulihkan pilihan tersebut. Nama lama tanpa bukti tetap `pending`. **Semua hasil impor memerlukan review ekspor baru**, walaupun pilihan tokoh yang sah berhasil dipulihkan.
8. Untuk cadangan tanpa pemetaan, pertahankan ID, nama tampil yang sah, penanda, dan relasi nonprivat. Saring nama asli, pasangan aturan asli–pengganti, mentions sensitif, catatan, snapshot, dan laporan. Aturan tanpa nilai asal ditandai perlu ditinjau; jangan membangun ulang pemetaan dengan menambang sumber/audio.
9. Naikkan/tetapkan versi kebijakan untuk keadaan impor dan tandai konteks/review/notice lama tidak berlaku. Jangan mengaktifkan job AI yang terbawa arsip. Pemulihan layanan juga harus memutar ulang jurnal penghapusan sebelum akses.

Dasar: panduan Tahap 0 baris 158; blueprint baris 290, 300, 375–377, 592, 598; panduan baris 368, 375–376, dan 379. Pemulihan keputusan valid dibedakan dari asumsi bahwa setiap nama historis telah disetujui.

## 8. Matriks verifikasi tahap berikutnya

Seluruh skenario berikut berstatus **belum dijalankan**. Fixture harus sintetis; bukti memakai ID/canary sintetis tanpa nama asli pengguna. Hasil mengganti satu nama tidak cukup untuk menyatakan seluruh alur privasi lulus.

| ID | Tahap | Skenario yang wajib diuji | Bukti yang diharapkan |
| --- | --- | --- | --- |
| PRIV-01 | 1, 3 | Tinjau tokoh hanya melalui tombol; Atur nanti; batas sesi biasa/refleksi; tidak ada tagihan manual | Alur HP/laptop serta state/ledger tidak membuat pertanyaan atau charge otomatis; pending tetap penanda. |
| PRIV-02 | 2 | Akun A meminta proyek, kartu, private identity, mentions, media, atau job akun B | API/RLS/job menolak tanpa kebocoran field/keberadaan; foreign key lintas scope ditolak. |
| PRIV-03 | 2 | Pemetaan canary tersebar pada tabel privat, mentions, identity_rules, reviews, error dan log | API umum, log, analitik, dan dukungan biasa bebas canary; jalur pemilik privat bekerja sesuai kontrak. |
| PRIV-04 | 2, 4, 8 | Nama asli kosong; narator samaran; nama pena berbeda dari akun/tagihan/email | Kartu, editor, sampul, bio, ucapan terima kasih, keterangan, dan author Word tidak melakukan fallback identitas. |
| PRIV-05 | 2, 6 | No-AI, no-book, allow_ai_context serta seluruh turunan setelah alias diterapkan | Inspeksi payload keluar nyata; no-AI tetap tidak terkirim dan no-book tidak masuk hasil/ekspor. |
| PRIV-06 | 4 | Budi/Budiman, dua orang bernama sama, banyak panggilan, merge dibatalkan | ID/relasi akurat; tidak ada penggantian substring atau orang yang salah; sumber tidak berubah. |
| PRIV-07 | 4 | Samaran lintas bab diubah; revisi baru muncul setelah preview; alias lama dilarang | Konflik menjaga kedua perubahan; penerapan versi lama ditolak; judul/kutipan/catatan/keterangan dan alias lama tercakup. |
| PRIV-08 | 6 | Kebijakan identitas/no-AI berubah saat job antre dan saat provider berjalan | Konteks/cache lama batal; validasi sebelum kirim dan commit; hasil tidak layak tanpa capture; retry tidak otomatis membebankan pengguna. |
| PRIV-09 | 7 | Audio bernama asli, no-AI, simpan tanpa proses, koreksi transkrip | Pengguna melihat pemberitahuan sebelum proses; audio no-AI tidak keluar; transkrip asli dan proyeksi terpisah; tidak ada klaim penyamaran retroaktif. |
| PRIV-10 | 8 | Wajah/papan nama/screenshot, keterangan dan metadata media | Tinjauan manual serta opsi penghilangan media tersedia; identitas di gambar tidak dinyatakan aman oleh matcher teks. |
| PRIV-11 | 8 | Nama terlarang/no-book/pemetaan dalam isi, komentar, perubahan tersembunyi, author, nama berkas Word | Blokir sampai selesai; inspeksi paket akhir dan properti; generator memakai snapshot/media/proyeksi yang ditinjau. |
| PRIV-12 | 8 | Review disetujui lalu naskah, privacy_revision, proyeksi atau media berubah; pending ditinjau | Review kedaluwarsa; pending tidak berubah diam-diam ke nama asli; pengantar hanya mengklaim cakupan aktual. |
| PRIV-13 | 8 | Cadangan dengan/tanpa pemetaan; field privat disalin ke aturan/mentions/snapshot/reports | Manifest benar; opt-out menyaring semua representasi; restore relasi utuh tanpa rekonstruksi pemetaan; review ekspor lama tidak berlaku. |
| PRIV-14 | 8 | Data lama tanpa persetujuan dan cadangan valid; homonim serta aturan tidak lengkap | Data tanpa bukti menjadi pending; keputusan valid dapat dipulihkan; aturan tak lengkap memerlukan review; owner/saldo arsip tidak dipercaya. |
| PRIV-15 | 8, 10 | Logout akun A lalu B; perangkat offline; penghapusan sumber/proyek | Cache akun terpisah dan dibersihkan sesuai lifecycle; salinan kembali daring ditangani; turunan identitas ikut dihapus. |
| PRIV-16 | 5, 8, 10 | Masa baca/ekspor 15 hari; nama terlarang menghalangi file | Proyeksi privasi tanpa AI tetap dapat diselesaikan dalam hak retensi; editor umum/AI baru tetap dibatasi; deadline ditegakkan. |
| PRIV-17 | 8, 10 | Restore layanan database+media setelah data identitas dihapus | Jurnal penghapusan diterapkan sebelum akses; tidak ada pemetaan/job lama yang hidup kembali; bukti target RPO/RTO dan expiry cadangan. |

Bukti disimpan pada `docs/hasil-verifikasi.md` ketika benar-benar dijalankan, dengan lingkungan, perintah, hasil, versi kebijakan/snapshot, cakupan matcher, serta batas pemeriksaan manual media. Pengujian mock, integrasi lokal, provider, dan latihan restore harus dilaporkan terpisah.

## 9. Konsistensi spesifikasi dan keputusan yang belum final

Tidak ditemukan pertentangan perilaku privasi antara blueprint 1.4 dan panduan 1.3 pada audit ini. Tiga hal yang perlu dijaga agar tidak salah implementasi:

| Temuan | Rujukan | Keputusan Tahap 0 |
| --- | --- | --- |
| Dokumen merujuk `blueprint.md` dan `langkah-implementasi.md`, tetapi nama berkas nyata memiliki sufiks | Blueprint baris 60–64 dan 1163; panduan baris 3, 10, 16, 151 | Gunakan berkas nyata dan versi metadata; tautan dokumen kerja mengarah ke berkas tersebut. Ini ketidaksesuaian nama rujukan, bukan perubahan kontrak. |
| Akses eksplisit pemilik pada pemetaan dan larangan membagi cache ke browser bisa disamakan secara keliru | Blueprint baris 296, 825, 838 | Pisahkan respons privat interaktif dari cache umum/persisten seperti pada Bagian 4; tidak dianggap benturan aturan. |
| Cadangan tanpa pemetaan masih dapat memuat nama asli dalam sumber/audio; ekspor pembaca mempunyai larangan yang berbeda | Blueprint baris 367–377, 536, 590; panduan baris 367, 373, 376 | Manifest dan penjelasan cakupan wajib; jangan menyebut cadangan anonim atau menerapkan aturan cadangan sebagai izin ekspor naskah. |

Pilihan fisik enkripsi/kunci, serializer allowlist, format cadangan, algoritme matcher dan batas Unicode/bahasa, kebijakan cache privat terperinci, serta pelaksanaan retensi provider belum dibuktikan. Tahap 2, 6, 8, dan 10 harus menetapkan implementasinya lalu mengumpulkan bukti; kekosongan ini tidak menghalangi penyelesaian discovery Tahap 0.

## Realisasi simulasi Tahap 1

Kontrol lokal yang dibuat: pemisahan nama pena/tokoh diri/akun contoh; kartu pending; no-AI/no-book; penanda sebelum provider deterministik; pemeriksaan hasil sebelum biaya; revisi kebijakan/sumber; nama lama dan nama ambigu; pratinjau penyamaran massal termasuk diri; review judul dan teks sebelum ekspor contoh. Pengujian dan batasnya dicatat pada [laporan Tahap 1](laporan-tahap-1.md).

Snapshot browser tetap memuat pemetaan sintetis. Belum ada tabel privat, autentikasi, RLS, enkripsi pemetaan, log akses atau sinkronisasi server. Matcher hanya mengenali sebutan terdaftar dan tidak menilai identifikasi dari konteks/foto/metadata. Review harus diulang setelah data berubah. Proyeksi ekspor hanya teks contoh dan tidak mengubah naskah utama.
