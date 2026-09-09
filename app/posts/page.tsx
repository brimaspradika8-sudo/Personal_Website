import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PostsPage() {
    const supabase = await createClient();
    const { data: posts, error } = await supabase
        .from("Article")
        .select("id, title, slug, thumbnail, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
                        Daftar Artikel
                    </h1>
                    <p className="text-lg text-zinc-600 max-w-2xl">
                        Kumpulan tulisan, insight, dan pemikiran terbaru yang kami bagikan.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {posts?.map((post) => (
                        <Link 
                            href={`/posts/${post.slug}`} 
                            key={post.id} 
                            className="group flex flex-col"
                        >
                            {post.thumbnail ? (
                                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 mb-5 border border-zinc-200/80">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full rounded-2xl bg-zinc-50 mb-5 border border-zinc-200/80 flex items-center justify-center transition-colors group-hover:bg-zinc-100">
                                    <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            
                            <div className="flex flex-col flex-grow">
                                <h2 className="text-xl font-semibold text-zinc-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                                <time className="text-sm font-medium text-zinc-500 mt-auto pt-4 flex items-center">
                                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                        </Link>
                    ))}

                    {(!posts || posts.length === 0) && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-2xl">
                            <p className="text-zinc-500">Belum ada artikel yang dipublikasikan.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
