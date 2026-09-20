import { getArticleById } from "@/lib/actions/article";
import EditArtikelClient from "./edit-client";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArtikelPage({ params }: EditPageProps) {
  const resolvedParams = await params;
  const article = await getArticleById(resolvedParams.id);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0E1015] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-xs text-slate-500">
            Artikel dengan ID tersebut tidak ditemukan di database.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D32F2F] text-white text-xs font-medium hover:bg-[#B91C1C] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <EditArtikelClient article={article} />;
}
