import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserToDatabase } from "@/lib/actions/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // Upsert ke tabel User berdasarkan email
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

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Kalau gagal, lempar ke halaman login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
