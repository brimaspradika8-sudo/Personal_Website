import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles, incrementArticleViews } from "@/lib/actions/article";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import ArticleDetailClient from "./article-detail-client";

export const revalidate = 60;

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
      title: "Article Not Found | Brimas Pradika Utama",
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

  const articleUrl = `${siteUrl}/articles/${article.slug}`;

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
      locale: "en_US",
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

  // Run view count increment asynchronously in background without blocking initial HTML render
  incrementArticleViews(slug).catch(() => {});

  const user = await getAuthenticatedUser();
  const userEmail = user?.email ? user.email.toLowerCase().trim() : "";

  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = allArticles.filter((a) => a.slug !== slug);

  return (
    <ArticleDetailClient
      article={article}
      relatedArticles={relatedArticles}
      user={user}
    />
  );
}
