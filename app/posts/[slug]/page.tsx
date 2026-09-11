import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles, incrementArticleViews } from "@/lib/actions/article";
import { createClient } from "@/lib/supabase/server";
import ArticleClient from "./article-client";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | Brimas Pradika Utama",
    };
  }

  const cleanDescription = article.content
    .slice(0, 160)
    .replace(/[#*`_]/g, "")
    .trim();

  const ogImageUrl = article.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${article.title} | Brimas Pradika Utama`,
    description: cleanDescription,
    openGraph: {
      title: article.title,
      description: cleanDescription,
      url: `https://brimaspradika.com/posts/${article.slug}`,
      siteName: "Brimas Pradika Utama Portfolio",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: "id_ID",
      type: "article",
      publishedTime: article.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: cleanDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Track pembaca (Increment view count)
  try {
    await incrementArticleViews(slug);
  } catch {}

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles.filter((a) => a.slug !== slug);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <ArticleClient
      article={article}
      relatedArticles={relatedArticles}
      user={user}
    />
  );
}
