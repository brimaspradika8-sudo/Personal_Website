import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { syncUserToDatabase } from "@/lib/actions/auth";
import { getSupabaseEnv } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      const msg = encodeURIComponent(
        "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) tidak valid atau belum di-set di Dashboard Vercel."
      );
      return NextResponse.redirect(`${origin}/login?error=${msg}`);
    }

    // Create the redirect response upfront so cookies are attached to it
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore if called in context where cookieStore cannot set
            }
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[OAuth Callback Error] exchangeCodeForSession failed:", error.message, error);
      let errMsg = error.message;
      if (errMsg.toLowerCase().includes("invalid api key")) {
        errMsg = "API Key Supabase (NEXT_PUBLIC_SUPABASE_ANON_KEY) tidak valid atau belum di-set di Dashboard Vercel.";
      }
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errMsg)}`);
    }

    if (data.user?.email) {
      const name =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.name ??
        data.user.user_metadata?.preferred_username ??
        data.user.user_metadata?.user_name;

      const avatar =
        data.user.user_metadata?.avatar_url ??
        data.user.user_metadata?.picture;

      try {
        await syncUserToDatabase(data.user.email, name, avatar);
      } catch (err) {
        console.warn("OAuth callback user sync failed:", err);
      }

      return response;
    }
  }

  // Kalau gagal, lempar ke halaman login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
