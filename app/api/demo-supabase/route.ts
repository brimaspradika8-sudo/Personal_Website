import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check Supabase connection and auth state
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 2. Try fetching from Supabase table 'Project'
    const { data: projects, error: projectsError } = await supabase
      .from("Project")
      .select("*")
      .limit(5);

    // 3. Try fetching from Supabase table 'Article'
    const { data: articles, error: articlesError } = await supabase
      .from("Article")
      .select("*")
      .limit(5);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError ? authError.message : null,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tables: {
        projects: {
          data: projects || [],
          error: projectsError ? { code: projectsError.code, message: projectsError.message } : null,
        },
        articles: {
          data: articles || [],
          error: articlesError ? { code: articlesError.code, message: articlesError.message } : null,
        },
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
