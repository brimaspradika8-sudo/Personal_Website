import { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowLeft, ShieldCheck, FileText, Crown, Lock, RefreshCw, AlertTriangle, Cpu, UserX, Award, Gavel, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan Keanggotaan | Brimas Pradika Utama",
  description: "Syarat dan Ketentuan Layanan Keanggotaan (Membership) Brimas Pradika Utama — Platform Artikel & Publikasi.",
};

export default function TermsPage() {
  const lastUpdated = "17 September 2026";

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-[#0A0D14] text-slate-950 dark:text-white py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#EAB308] selection:text-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-mono font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#166534] dark:text-[#EAB308]" />
            <span>KEMBALI KE BERANDA</span>
          </Link>

          <div className="p-6 sm:p-8 rounded-none border-4 border-black dark:border-white bg-[#166534] text-white space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] font-mono">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#EAB308] text-black font-mono font-black text-xs border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Scale className="w-4 h-4 text-black" />
              <span>DOKUMEN LEGAL RESMI</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
              SYARAT DAN KETENTUAN LAYANAN KEANGGOTAAN (MEMBERSHIP)
            </h1>
            <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wide">
              BRIMAS PRADIKA UTAMA — PLATFORM ARTIKEL &amp; PUBLIKASI · TERAKHIR DIPERBARUI: {lastUpdated}
            </p>
          </div>

          <div className="p-5 rounded-none border-3 border-black dark:border-white bg-[#FFFF00] text-black font-mono text-xs font-bold leading-relaxed uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            DOKUMEN INI MENJELASKAN SYARAT DAN KETENTUAN PENGGUNAAN LAYANAN KEANGGOTAAN BERBAYAR (&quot;MEMBERSHIP&quot;) PADA PLATFORM BRIMAS PRADIKA UTAMA (&quot;PLATFORM&quot;, &quot;KAMI&quot;). DENGAN MENDAFTAR, MEMBAYAR, ATAU MENGGUNAKAN SALAH SATU TINGKAT KEANGGOTAAN DI BAWAH INI, ANDA (&quot;PENGGUNA&quot;, &quot;ANDA&quot;) DIANGGAP TELAH MEMBACA, MEMAHAMI, DAN MENYETUJUI SELURUH ISI DOKUMEN INI.
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 font-mono text-xs sm:text-sm leading-relaxed">
          
          {/* PASAL 1: DEFINISI */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">1</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 1 — DEFINISI
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>1.1. Platform</strong> adalah situs web dan seluruh layanan yang disediakan oleh Brimas Pradika Utama, termasuk namun tidak terbatas pada fitur baca artikel, komentar, narasi suara AI, rangkuman AI, dan studio penulisan artikel member.</p>
              <p><strong>1.2. Membership</strong> adalah status keanggotaan berbayar yang memberikan akses ke fitur-fitur tertentu sebagaimana dijelaskan dalam Pasal 2.</p>
              <p><strong>1.3. Kawan Brimas</strong> adalah tingkat keanggotaan berbayar dengan biaya Rp 5.000/bulan.</p>
              <p><strong>1.4. Sahabat Brimas VIP</strong> adalah tingkat keanggotaan berbayar tertinggi dengan biaya Rp 20.000/bulan.</p>
              <p><strong>1.5. Konten Member</strong> adalah artikel, komentar, atau materi lain yang diunggah atau dipublikasikan oleh Pengguna melalui Studio Artikel Member.</p>
              <p><strong>1.6. Penyedia Pembayaran</strong> adalah pihak ketiga (Xendit) yang memproses seluruh transaksi pembayaran pada Platform.</p>
            </div>
          </section>

          {/* PASAL 2: TINGKAT KEANGGOTAAN DAN FITUR */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">2</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#EAB308]" />
                PASAL 2 — TINGKAT KEANGGOTAAN DAN FITUR
              </h2>
            </div>
            <div className="space-y-4 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              
              <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white space-y-2">
                <h3 className="font-black text-black dark:text-white">2.1. Gratis (Free User)</h3>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                  <li>Akses baca dan komentar artikel tanpa batas.</li>
                  <li>Tidak memiliki akses ke Narasi Suara AI, Rangkuman AI, dan Studio Artikel Member.</li>
                  <li>Tidak memiliki badge atau elemen visual eksklusif.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#166534]/10 dark:bg-[#166534]/20 border-2 border-[#166534] space-y-2">
                <h3 className="font-black text-[#166534] dark:text-[#00FF66] flex items-center gap-1.5">
                  🟢 2.2. Kawan Brimas — Rp 5.000/bulan
                </h3>
                <p className="font-bold">Seluruh fitur Gratis, ditambah:</p>
                <ul className="list-disc list-inside space-y-1 text-neutral-800 dark:text-neutral-200">
                  <li>Akses 1 (satu) suara Narasi AI Neural (&quot;Ardi — Pria&quot;).</li>
                  <li>Rangkuman AI Standar (3–4 poin ringkasan per artikel).</li>
                  <li>Akses penuh Studio Artikel Member dengan batas publikasi maksimal 3 (tiga) artikel per 7 (tujuh) hari berjalan (rolling 7 hari sejak artikel pertama dipublikasikan, bukan per minggu kalender).</li>
                  <li>Badge Mahkota Hijau pada profil.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#EAB308]/10 dark:bg-[#EAB308]/20 border-2 border-[#EAB308] space-y-2">
                <h3 className="font-black text-amber-600 dark:text-[#EAB308] flex items-center gap-1.5">
                  👑 2.3. Sahabat Brimas VIP — Rp 20.000/bulan
                </h3>
                <p className="font-bold">Seluruh fitur Kawan Brimas, ditambah:</p>
                <ul className="list-disc list-inside space-y-1 text-neutral-800 dark:text-neutral-200">
                  <li>Akses 2 (dua) pilihan suara Narasi AI (&quot;Ardi — Pria&quot; dan &quot;Gadis — Wanita&quot;).</li>
                  <li>Rangkuman AI Eksekutif Mendalam (ringkasan lebih lengkap disertai Key Takeaways).</li>
                  <li>Publikasi artikel tanpa batas kuota (unlimited) di Studio Artikel Member.</li>
                  <li>Badge Mahkota Emas VIP pada profil.</li>
                  <li>Bingkai avatar profil &quot;Golden Aura&quot;.</li>
                  <li>Komentar otomatis ditampilkan pada posisi paling atas kolom komentar (pinned), ditandai warna emas. Apabila terdapat lebih dari satu komentar dari pengguna Sahabat Brimas VIP pada artikel yang sama, urutan tampil ditentukan berdasarkan waktu komentar terbaru.</li>
                  <li>Artikel yang dipublikasikan mendapat label &quot;VIP Featured&quot; dan diprioritaskan tampil di posisi atas feed utama.</li>
                  <li>Bebas mengunggah foto sampul (cover banner) profil sendiri.</li>
                </ul>
              </div>

              <p><strong>2.4. Perubahan Fitur:</strong> Kami berhak menambah, mengubah, atau menghapus fitur pada setiap tingkat keanggotaan sewaktu-waktu. Perubahan signifikan yang mengurangi manfaat akan diinformasikan melalui email atau notifikasi Platform minimal 7 (tujuh) hari sebelum diberlakukan.</p>
            </div>
          </section>

          {/* PASAL 3: PEMBAYARAN DAN PERPANJANGAN */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">3</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 3 — PEMBAYARAN DAN PERPANJANGAN
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>3.1.</strong> Seluruh transaksi pembayaran diproses melalui Penyedia Pembayaran (Xendit) secara instan. Kami tidak menyimpan data kartu pembayaran atau rekening Anda.</p>
              <p><strong>3.2.</strong> Biaya keanggotaan ditagihkan per bulan terhitung sejak tanggal aktivasi pertama.</p>
              <p><strong>3.3.</strong> Keanggotaan tidak diperpanjang secara otomatis (non-auto-renewal) kecuali dinyatakan lain saat proses pembayaran. Pengguna wajib melakukan pembayaran ulang secara manual untuk memperpanjang masa aktif keanggotaan sebelum atau setelah masa aktif berakhir.</p>
              <p><strong>3.4.</strong> Apabila metode pembayaran berlangganan otomatis diaktifkan di kemudian hari, Kami akan mengirimkan notifikasi minimal 3 (tiga) hari sebelum penagihan berikutnya dilakukan, dan Pengguna dapat membatalkan kapan saja sebelum tanggal penagihan.</p>
              <p><strong>3.5.</strong> Harga keanggotaan dapat berubah sewaktu-waktu. Perubahan harga tidak berlaku surut terhadap masa keanggotaan yang sudah dibayar dan aktif berjalan.</p>
              <p><strong>3.6.</strong> Kegagalan pembayaran mengakibatkan status keanggotaan tidak diaktifkan/diperpanjang, dan akun otomatis kembali ke status Gratis setelah masa aktif berakhir.</p>
            </div>
          </section>

          {/* PASAL 4: KEBIJAKAN PEMBATALAN DAN REFUND */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">4</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 4 — KEBIJAKAN PEMBATALAN DAN PENGEMBALIAN DANA (REFUND)
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>4.1.</strong> Pengguna dapat berhenti berlangganan kapan saja. Penghentian tidak menghapus akses terhadap fitur berbayar hingga masa aktif keanggotaan yang sudah dibayar berakhir.</p>
              <p><strong>4.2.</strong> Pada prinsipnya, biaya keanggotaan yang sudah dibayarkan tidak dapat dikembalikan (non-refundable), kecuali dalam kondisi berikut:</p>
              <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white space-y-1.5 ml-4">
                <p>• Terjadi kesalahan teknis pada sistem pembayaran yang mengakibatkan penagihan ganda (double charge) untuk periode yang sama.</p>
                <p>• Fitur utama yang menjadi alasan Pengguna berlangganan tidak dapat diakses sama sekali akibat kesalahan/kegagalan sistem Platform selama lebih dari 3 (tiga) hari berturut-turut dalam satu periode berlangganan, dan Platform tidak dapat memperbaikinya dalam jangka waktu wajar.</p>
              </div>
              <p><strong>4.3.</strong> Permohonan pengembalian dana harus diajukan melalui kanal dukungan resmi Platform paling lambat 14 (empat belas) hari sejak tanggal transaksi, disertai bukti pendukung. Permohonan yang disetujui akan diproses maksimal 14 hari kerja setelah verifikasi.</p>
            </div>
          </section>

          {/* PASAL 5: BATASAN KUOTA PUBLIKASI ARTIKEL */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">5</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 5 — BATASAN KUOTA PUBLIKASI ARTIKEL
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>5.1.</strong> Batas &quot;3 artikel per 7 hari&quot; pada tingkat Kawan Brimas dihitung secara rolling (bergulir), bukan berdasarkan minggu kalender. Contoh: jika artikel pertama dipublikasikan hari Senin, maka kuota akan kembali tersedia pada Senin minggu berikutnya di jam yang sama.</p>
              <p><strong>5.2.</strong> Artikel yang dihapus oleh Pengguna sendiri tetap dihitung dalam kuota periode berjalan dan tidak mengembalikan slot kuota yang sudah terpakai.</p>
              <p><strong>5.3.</strong> Kami berhak menghapus atau menangguhkan Konten Member yang melanggar ketentuan pada Pasal 6 tanpa mengembalikan kuota publikasi yang telah terpakai.</p>
            </div>
          </section>

          {/* PASAL 6: KETENTUAN KONTEN DAN PUBLIKASI */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">6</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                PASAL 6 — KETENTUAN KONTEN DAN PUBLIKASI
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>6.1.</strong> Pengguna bertanggung jawab penuh atas seluruh Konten Member yang dipublikasikan, termasuk keaslian, keakuratan, dan legalitasnya.</p>
              <p><strong>6.2.</strong> Konten Member dilarang memuat: ujaran kebencian (SARA), pornografi, kekerasan eksplisit, informasi yang menyesatkan (hoaks), pelanggaran hak cipta pihak lain, spam, atau konten yang melanggar hukum yang berlaku di Republik Indonesia.</p>
              <p><strong>6.3.</strong> Kami berhak, tanpa pemberitahuan sebelumnya, untuk meninjau, menyembunyikan, mengedit label, atau menghapus Konten Member yang melanggar ketentuan di atas, serta menangguhkan atau menghentikan akun Pengguna yang bersangkutan.</p>
              <p><strong>6.4.</strong> Dengan mempublikasikan Konten Member, Pengguna memberikan izin non-eksklusif kepada Platform untuk menampilkan, mendistribusikan, dan mempromosikan konten tersebut di dalam Platform, tanpa menghilangkan status kepemilikan hak cipta Pengguna atas karyanya sendiri.</p>
              <p><strong>6.5.</strong> Foto sampul (cover banner) yang diunggah pengguna Sahabat Brimas VIP wajib merupakan gambar yang sah secara hukum untuk digunakan (milik sendiri, berlisensi bebas, atau memiliki izin penggunaan).</p>
            </div>
          </section>

          {/* PASAL 7: KETENTUAN PENGGUNAAN FITUR AI */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">7</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 7 — KETENTUAN PENGGUNAAN FITUR AI (NARASI SUARA &amp; RANGKUMAN)
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>7.1.</strong> Fitur Narasi Suara AI dan Rangkuman AI disediakan untuk penggunaan wajar pribadi dalam membaca/mendengarkan artikel di Platform.</p>
              <p><strong>7.2.</strong> Pengguna dilarang menggunakan fitur AI untuk tujuan komersial di luar Platform, termasuk mendownload, memperbanyak, atau mendistribusikan ulang hasil audio/rangkuman AI ke pihak ketiga tanpa izin tertulis dari Kami.</p>
              <p><strong>7.3.</strong> Kualitas dan ketersediaan suara AI bergantung pada penyedia teknologi pihak ketiga. Kami berupaya menjaga stabilitas layanan namun tidak menjamin ketersediaan 100% tanpa gangguan.</p>
              <p><strong>7.4.</strong> Kami berhak menerapkan batas wajar (fair use limit) terhadap jumlah penggunaan fitur AI per akun per hari apabila ditemukan indikasi penyalahgunaan sistem, termasuk pada tingkat Sahabat Brimas VIP.</p>
            </div>
          </section>

          {/* PASAL 8: PENANGGUHAN DAN PENGHENTIAN AKUN */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-[#FFFBEB] dark:bg-neutral-900 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#DC2626] text-white border-2 border-black font-black text-sm">8</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <UserX className="w-5 h-5 text-[#DC2626]" />
                PASAL 8 — PENANGGUHAN DAN PENGHENTIAN AKUN
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-black dark:text-white uppercase">
              <p><strong>8.1.</strong> Kami berhak menangguhkan atau menghentikan akses keanggotaan Pengguna tanpa pengembalian dana apabila ditemukan:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-800 dark:text-neutral-200 ml-4">
                <li>Pelanggaran terhadap Pasal 6 (Ketentuan Konten) atau Pasal 7 (Ketentuan Fitur AI);</li>
                <li>Upaya manipulasi sistem pembayaran, kuota, atau fitur Platform;</li>
                <li>Aktivitas yang membahayakan keamanan atau kestabilan sistem Platform;</li>
                <li>Penggunaan akun palsu atau penyalahgunaan identitas pengguna lain.</li>
              </ul>
              <p><strong>8.2.</strong> Pengguna yang keberatan atas penangguhan/penghentian akun dapat mengajukan banding melalui kanal dukungan resmi Platform dalam waktu 14 hari sejak notifikasi diterima.</p>
            </div>
          </section>

          {/* PASAL 9: BATASAN TANGGUNG JAWAB */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">9</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 9 — BATASAN TANGGUNG JAWAB
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>9.1.</strong> Platform disediakan atas dasar &quot;sebagaimana adanya&quot; (as is). Kami tidak menjamin bahwa layanan akan selalu bebas dari kesalahan, gangguan, atau downtime.</p>
              <p><strong>9.2.</strong> Kami tidak bertanggung jawab atas kerugian tidak langsung, kehilangan data, atau kerugian usaha yang timbul akibat gangguan layanan, kecuali diwajibkan lain oleh hukum yang berlaku.</p>
              <p><strong>9.3.</strong> Tanggung jawab Kami atas segala klaim terkait layanan berbayar, jika ada, dibatasi maksimal sebesar nilai biaya keanggotaan yang telah dibayarkan Pengguna pada periode berjalan saat klaim diajukan.</p>
            </div>
          </section>

          {/* PASAL 10: PERUBAHAN SYARAT DAN KETENTUAN */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">10</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 10 — PERUBAHAN SYARAT DAN KETENTUAN
              </h2>
            </div>
            <div className="space-y-2.5 font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              <p><strong>10.1.</strong> Kami berhak mengubah dokumen Syarat dan Ketentuan ini sewaktu-waktu untuk menyesuaikan dengan perkembangan layanan atau ketentuan hukum yang berlaku.</p>
              <p><strong>10.2.</strong> Perubahan material akan diinformasikan melalui email terdaftar dan/atau notifikasi pada Platform minimal 7 hari sebelum berlaku efektif. Penggunaan layanan secara berkelanjutan setelah perubahan berlaku dianggap sebagai persetujuan atas ketentuan yang telah diperbarui.</p>
            </div>
          </section>

          {/* PASAL 11: HUKUM YANG BERLAKU */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 pb-3 border-b-3 border-black dark:border-white">
              <div className="p-2 bg-[#FFFF00] text-black border-2 border-black font-black text-sm">11</div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#166534] dark:text-[#EAB308]" />
                PASAL 11 — HUKUM YANG BERLAKU
              </h2>
            </div>
            <p className="font-medium text-neutral-800 dark:text-neutral-200 uppercase">
              Dokumen ini tunduk pada dan ditafsirkan sesuai dengan hukum Negara Republik Indonesia. Segala perselisihan yang timbul akan diselesaikan secara musyawarah terlebih dahulu, dan apabila tidak tercapai kesepakatan, akan diselesaikan melalui jalur hukum yang berlaku di wilayah hukum Indonesia.
            </p>
          </section>

          {/* PASAL 12: KONTAK */}
          <section className="p-6 rounded-none border-4 border-black dark:border-white bg-[#FFFF00] text-black space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono uppercase font-black">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-black">
              <div className="p-2 bg-black text-white font-black text-sm">12</div>
              <h2 className="text-base sm:text-lg font-black uppercase flex items-center gap-2">
                <Mail className="w-5 h-5 text-black" />
                PASAL 12 — KONTAK &amp; BANTUAN
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              APABILA MEMILIKI PERTANYAAN MENGENAI SYARAT DAN KETENTUAN INI ATAU LAYANAN KEANGGOTAAN, PENGGUNA DAPAT MENGHUBUNGI KAMI MELALUI KANAL DUKUNGAN RESMI YANG TERSEDIA PADA PLATFORM.
            </p>
            <p className="text-[11px] font-bold text-neutral-800 pt-2 border-t border-black">
              DOKUMEN INI ADALAH BAGIAN YANG TIDAK TERPISAHKAN DARI KETENTUAN LAYANAN (TERMS OF SERVICE) DAN KEBIJAKAN PRIVASI PLATFORM BRIMAS PRADIKA UTAMA SECARA KESELURUHAN.
            </p>
            <div className="pt-3">
              <Link
                href="/artikel"
                className="inline-block px-5 py-2.5 bg-black text-white border-2 border-black text-xs font-mono font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#166534] transition-all"
              >
                JELAJAHI ARTIKEL
              </Link>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
