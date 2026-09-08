import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, FileText } from "lucide-react";

export default async function PostsPage() {
  // createClient dipanggil di dalam fungsi — aman untuk build
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch data dari tabel "Article" di Supabase
  const { data: posts, error } = await supabase
    .from("Article")
    .select("id, title, slug, thumbnail, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Daftar <span className="text-[#DC2626]">Artikel</span>
          </h1>
          <p className="text-xs text-white/50 mt-1 font-mono">
            Data diambil dari tabel <code className="text-[#DC2626]">Article</code> di Supabase
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl border border-red-500/50 bg-red-950/30 text-red-300 text-sm font-mono space-y-2">
            <p className="font-bold">Error: {error.message}</p>
            <p className="text-xs text-red-400">Aktifkan RLS policy di Supabase SQL Editor:</p>
            <pre className="bg-black/40 p-2 rounded text-emerald-300 text-xs whitespace-pre-wrap">{`ALTER TABLE public."Article" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON public."Article" FOR SELECT TO anon USING (true);`}</pre>
          </div>
        )}

        {/* Kosong */}
        {!error && posts?.length === 0 && (
          <div className="p-8 rounded-xl border border-white/10 text-center space-y-2">
            <FileText className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-white/40 text-sm font-mono">Belum ada artikel.</p>
          </div>
        )}

        {/* Daftar Artikel */}
        {!error && posts && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border border-white/10 bg-[#0F172A] hover:border-[#DC2626]/40 transition-all space-y-3"
              >
                {/* Thumbnail */}
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-36 rounded-lg bg-white/5 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white/20" />
                  </div>
                )}

                {/* Title */}
                <p className="font-bold text-sm leading-snug">{post.title}</p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                  <span className="text-[#DC2626]">/{post.slug}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
