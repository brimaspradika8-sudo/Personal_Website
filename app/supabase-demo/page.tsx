import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/client";
import SupabaseDemoClient from "./supabase-demo-client";

export const dynamic = "force-dynamic";

export default async function SupabaseDemoPage() {
  const { supabaseUrl, isConfigured } = getSupabaseEnv();
  
  let user = null;
  let projects = { data: [] as any[], error: null as string | null };
  let articles = { data: [] as any[], error: null as string | null };

  try {
    const supabase = await createClient();

    // 1. Fetch user session from server
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      user = { id: currentUser.id, email: currentUser.email };
    }

    // 2. Fetch projects from Supabase
    const { data: projData, error: projErr } = await supabase
      .from("Project")
      .select("*")
      .limit(5);

    if (projErr) {
      projects.error = `${projErr.message} (Code: ${projErr.code})`;
    } else if (projData) {
      projects.data = projData;
    }

    // 3. Fetch articles from Supabase
    const { data: artData, error: artErr } = await supabase
      .from("Article")
      .select("*")
      .limit(5);

    if (artErr) {
      articles.error = `${artErr.message} (Code: ${artErr.code})`;
    } else if (artData) {
      articles.data = artData;
    }
  } catch (err: any) {
    projects.error = err.message || "Failed to initialize server Supabase client";
  }

  const serverResult = {
    timestamp: new Date().toLocaleTimeString("id-ID"),
    supabaseUrl,
    isConfigured,
    user,
    projects,
    articles,
  };

  return <SupabaseDemoClient serverResult={serverResult} />;
}
