export const metadata = {
  title: "Syarat & Ketentuan | Brimas Pradika Utama",
  description: "Ketentuan penggunaan situs web dan layanan digital Brimas Pradika Utama.",
};

export default function SyaratKetentuanPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-800">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          Informasi Legal
        </p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Syarat &amp; Ketentuan
        </h1>

        <div className="space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
          <p>
            Dengan mengakses dan menggunakan situs ini, Anda setuju untuk tunduk pada
            syarat dan ketentuan yang berlaku. Situs ini disediakan untuk tujuan informasi,
            presentasi portofolio, dan layanan digital yang terkait dengan Brimas Pradika
            Utama.
          </p>

          <p>
            Konten yang tersedia di situs ini dapat berubah sewaktu-waktu tanpa pemberitahuan
            sebelumnya. Kami berupaya menjaga akurasi informasi, namun tidak menjamin
            seluruh isi selalu sepenuhnya mutakhir, lengkap, atau bebas dari kesalahan.
          </p>

          <p>
            Penggunaan situs ini harus dilakukan secara bertanggung jawab. Dilarang
            menggunakan website ini untuk aktivitas yang melanggar hukum, merugikan pihak
            lain, atau mengganggu keamanan dan kinerja layanan.
          </p>

          <p>
            Jika Anda memiliki pertanyaan mengenai penggunaan situs, konten, atau layanan,
            silakan hubungi pengelola melalui kanal komunikasi yang tersedia di halaman
            kontak.
          </p>
        </div>
      </div>
    </main>
  );
}
