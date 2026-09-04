import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { syncUserToDatabase } from "@/lib/actions/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://ojrnfhdxilsecmqqbfrp.supabase.co";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

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

    if (!error && data.user?.email) {
      const name =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.name ??
        data.user.user_metadata?.preferred_username ??
        data.user.user_metadata?.user_name;

      try {
        await syncUserToDatabase(data.user.email, name);
      } catch (err) {
        console.warn("OAuth callback user sync failed:", err);
      }

      return response;
    }
  }

  // Kalau gagal, lempar ke halaman login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
