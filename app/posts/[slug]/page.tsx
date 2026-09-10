import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/actions/article";
import { createClient } from "@/lib/supabase/server";
import ArticleClient from "./article-client";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

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
