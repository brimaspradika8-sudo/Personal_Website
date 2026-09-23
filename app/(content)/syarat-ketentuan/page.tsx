import Link from "next/link";

export default function SyaratKetentuanPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border-2 border-slate-900 bg-[#EAB308] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            Kembali ke beranda
          </Link>
        </div>

        <article className="space-y-8 rounded-3xl border-2 border-slate-900 bg-[#F8FAFC] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:p-8">
          <header className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#166534]">Legal</p>
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Syarat &amp; Ketentuan
            </h1>
          </header>

          <div className="space-y-5 text-sm leading-7 text-slate-700 dark:text-slate-200">
            <p>
              Dengan mengakses atau menggunakan website ini, Anda setuju untuk mematuhi
              syarat dan ketentuan yang berlaku. Website ini disediakan untuk tujuan
              informasi, portofolio, dan interaksi publik yang relevan dengan kegiatan
              pengembangan dan konten pribadi.
            </p>

            <p>
              Konten yang dipublikasikan di website ini dapat berisi materi yang dibuat
              secara manual maupun disusun dari proses pengembangan pribadi. Kami berupaya
              untuk menjaga akurasi, kualitas, dan keamanan informasi namun tidak dapat
              menjamin bahwa semua konten selalu sepenuhnya bebas dari kesalahan atau
              perubahan yang terjadi sewaktu-waktu.
            </p>

            <p>
              Penggunaan website ini harus dilakukan dengan bijak dan tidak untuk kegiatan
              yang bersifat merugikan, melanggar hukum, atau mengganggu layanan serta
              pengalaman pengunjung lain. Semua hak cipta, materi visual, content, dan
              kode yang muncul di website ini tetap menjadi milik pemilik website kecuali
              dinyatakan lain.
            </p>

            <p>
              Website ini dapat berubah, diperbarui, atau dihentikan sewaktu-waktu tanpa
              pemberitahuan sebelumnya. Kami juga dapat memperbarui syarat dan ketentuan
              ini sesuai kebutuhan operasional atau peraturan yang berlaku.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
