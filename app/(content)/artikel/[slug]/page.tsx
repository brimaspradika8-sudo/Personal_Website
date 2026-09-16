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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://brimas.vercel.app").replace(/\/$/, "");

  if (!article) {
    return {
      metadataBase: new URL(siteUrl),
      title: "Artikel Tidak Ditemukan | Brimas Pradika Utama",
    };
  }

  const cleanDescription = article.content
    .replace(/<[^>]*>?/gm, "")
    .replace(/[#*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  let ogImageUrl = (article.thumbnail || "").trim();
  if (!ogImageUrl) {
    ogImageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  } else if (ogImageUrl.startsWith("/")) {
    ogImageUrl = `${siteUrl}${ogImageUrl}`;
  }

  const articleUrl = `${siteUrl}/artikel/${article.slug}`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${article.title} | Brimas Pradika Utama`,
    description: cleanDescription,
    openGraph: {
      title: article.title,
      description: cleanDescription,
      url: articleUrl,
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

  const supabase = await createClient();

  // Run view count increment asynchronously in background without blocking initial HTML render
  incrementArticleViews(slug).catch(() => {});

  // Parallelize data fetching to eliminate waterfall latency
  const [article, allArticles, { data: { user } }] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
    supabase.auth.getUser(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = allArticles.filter((a) => a.slug !== slug);

  return (
    <ArticleClient
      article={article}
      relatedArticles={relatedArticles}
      user={user}
    />
  );
}
