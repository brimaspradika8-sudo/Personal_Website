# Keamanan dan Strategi Website

Dokumen ini menjelaskan cara website melindungi akun, data, dan fitur penting. Penjelasannya dibuat singkat agar mudah dipahami saat belajar atau melakukan maintenance project.

## 1. Tujuan Keamanan

Keamanan website bertujuan menjaga tiga hal:

- **Kerahasiaan:** data pengguna hanya bisa dilihat oleh pihak yang berhak.
- **Keutuhan:** data tidak boleh diubah sembarangan.
- **Ketersediaan:** website tetap dapat digunakan oleh pengguna yang sah.

Tidak ada satu fitur yang bisa melindungi semuanya. Karena itu, website memakai beberapa lapisan perlindungan. Jika satu lapisan gagal, lapisan lain masih dapat mengurangi dampaknya.

## 2. Lapisan Keamanan yang Dipakai

### A. Login dan session

Website menggunakan Supabase Auth untuk login. Server memeriksa user yang sedang login sebelum menjalankan aksi yang membutuhkan akun, seperti menulis komentar, memberi reaction, atau mengelola data.

Aturan penting:

- Jangan percaya `user_id` dari form atau browser.
- Identitas user harus diambil dari session server.
- Halaman admin harus memeriksa role atau hak akses di server.
- Token dan secret tidak boleh ditulis di kode frontend atau di-commit ke Git.

Lokasi utama pemeriksaan user adalah `lib/auth/get-user.ts` dan middleware Supabase.

### B. Perlindungan CSRF

CSRF adalah serangan ketika website lain mencoba memaksa browser user mengirim request ke website ini.

Untuk mencegahnya, request yang mengubah data harus melewati dua pemeriksaan:

1. `Origin` atau `Referer` harus berasal dari host yang sesuai.
2. Request harus membawa token CSRF yang cocok dengan cookie browser.

Perlindungan ini digunakan untuk aksi seperti komentar dan reaction. Penjelasan teknis lengkap tersedia di [csrf.md](../csrf.md).

### C. Validasi dan pembersihan input

Semua data dari pengguna harus dianggap belum aman. Sebelum disimpan atau dipakai, data diperiksa dan dibersihkan.

Contoh aturan yang dipakai:

- Email dinormalisasi menjadi huruf kecil dan dibatasi panjangnya.
- Password memiliki batas panjang minimal dan maksimal.
- UUID diperiksa agar memiliki format yang benar.
- Teks dibersihkan dari tag HTML.
- URL hanya menerima protokol `http` dan `https`.
- Nilai kosong dan input yang terlalu panjang ditolak atau dipotong sesuai aturan.

Tujuannya adalah mencegah data rusak, query tidak valid, dan serangan seperti XSS.

### D. Perlindungan XSS

XSS terjadi ketika penyerang memasukkan kode JavaScript ke halaman website. Kode itu kemudian berjalan di browser pengunjung lain.

Strategi yang dipakai:

- Teks dari pengguna dibersihkan dari HTML.
- URL seperti `javascript:` dan `data:text/html` ditolak.
- SVG upload ditolak karena dapat membawa script.
- Komentar diperiksa dari pola spam dan link berlebihan.

Jangan menampilkan input user sebagai HTML mentah kecuali memang diperlukan dan sudah melalui sanitizer yang aman.

### E. Rate limiting

Rate limiting membatasi jumlah request dalam waktu tertentu. Fungsinya seperti membatasi berapa kali seseorang boleh mencoba masuk atau mengirim data dalam satu menit.

Contoh batas yang digunakan di project:

- Login: 5 percobaan per menit.
- Registrasi: 3 percobaan per menit.
- Komentar: 10 request per menit.
- Reaction: 30 request per menit.
- Upload: 10 file per menit.

Rate limit membantu mengurangi brute force, spam, dan penyalahgunaan API. Pada environment yang memiliki Upstash Redis, pencatatan dapat dilakukan secara terdistribusi. Jika layanan itu tidak tersedia, project memakai penyimpanan lokal sebagai fallback.

### F. Keamanan upload file

Nama file atau ekstensi saja tidak cukup untuk memastikan file aman. Karena itu, file diperiksa dari beberapa sisi:

- Tipe MIME harus termasuk tipe yang diizinkan.
- Isi awal file atau file signature harus cocok dengan tipe yang dikirim.
- SVG ditolak untuk mengurangi risiko XSS.
- Folder penyimpanan dibatasi ke folder yang sudah diizinkan.

File upload harus selalu diproses di server. Jangan hanya mengandalkan validasi dari form frontend karena validasi frontend bisa dilewati.

### G. Database dan data

Akses database harus dilakukan melalui server. Data dari request tidak boleh langsung dipercaya sebagai query.

Kebiasaan yang perlu dijaga:

- Gunakan Prisma untuk query database.
- Validasi data sebelum query dijalankan.
- Batasi data yang diambil dengan `select` jika tidak perlu mengambil semua kolom.
- Gunakan relasi dan constraint database untuk menjaga data tetap konsisten.
- Jangan menampilkan error database mentah kepada user.

## 3. Strategi Keamanan Saat Menambah Fitur

Gunakan alur berikut setiap kali membuat endpoint, form, atau fitur baru.

### Langkah 1: Tentukan data yang dilindungi

Tanyakan:

- Apakah fitur ini membaca data pribadi?
- Apakah fitur ini mengubah atau menghapus data?
- Apakah hanya user login yang boleh menggunakannya?
- Apakah admin memiliki aturan akses berbeda?

Semakin sensitif datanya, semakin banyak pemeriksaan yang dibutuhkan.

### Langkah 2: Validasi di server

Frontend membantu pengalaman pengguna, tetapi server adalah penjaga utama. Ulangi pemeriksaan di server untuk:

- tipe data
- panjang data
- format ID
- izin user
- batas jumlah request
- token CSRF untuk request mutasi

### Langkah 3: Minimalkan data

Simpan dan kirim hanya data yang memang diperlukan. Jangan mengirim password, token rahasia, atau seluruh objek user ke browser.

### Langkah 4: Tampilkan pesan yang aman

Pesan error sebaiknya membantu user tanpa membocorkan detail sistem. Gunakan pesan seperti `Permintaan tidak valid` daripada menampilkan query SQL, path server, atau stack trace.

### Langkah 5: Uji skenario gagal

Jangan hanya menguji kondisi normal. Coba juga:

- user belum login
- token CSRF tidak ada
- token salah
- input kosong
- input terlalu panjang
- ID tidak valid
- request terlalu banyak
- file palsu atau tipe file yang tidak diizinkan
- user biasa mencoba endpoint admin

## 4. Strategi Jika Terjadi Masalah

Jika ditemukan indikasi penyalahgunaan:

1. Catat endpoint, waktu, dan jenis request yang bermasalah.
2. Batasi akses atau aktifkan rate limit yang lebih ketat.
3. Periksa apakah ada data yang berubah atau bocor.
4. Perbaiki celah di server terlebih dahulu.
5. Ganti secret yang mungkin terekspos.
6. Uji ulang fitur dengan skenario serangan.
7. Dokumentasikan penyebab dan perbaikannya.

Jangan menghapus log atau mengubah data secara terburu-buru sebelum memahami kejadian. Log membantu menemukan pola serangan.

## 5. Checklist Singkat

Sebelum fitur dianggap siap, pastikan:

- [ ] User dan role diperiksa di server.
- [ ] Input divalidasi dan dibersihkan.
- [ ] Request yang mengubah data memakai perlindungan CSRF.
- [ ] Endpoint memiliki rate limit jika bisa dipanggil berulang.
- [ ] Upload memeriksa MIME dan file signature.
- [ ] Secret hanya berada di environment variable.
- [ ] Error kepada user tidak membocorkan detail internal.
- [ ] Kondisi gagal sudah diuji.
- [ ] Data yang dikirim ke frontend sudah dibatasi.

## Kesimpulan

Strategi keamanan website bukan sekadar memasang satu library. Cara yang lebih aman adalah membuat beberapa pemeriksaan kecil di setiap lapisan: session, izin akses, validasi input, CSRF, rate limit, upload, dan database.

Sebagai developer, kebiasaan paling penting adalah tidak mempercayai data dari browser, selalu memvalidasi di server, dan menguji kondisi yang gagal sebelum fitur dipakai pengguna.
