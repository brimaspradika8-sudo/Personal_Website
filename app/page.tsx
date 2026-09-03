import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-block rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 border border-indigo-500/20">
          Personal Website & Authentication Portal
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Welcome to My Platform
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Powered by Next.js 16, Supabase Authentication, and Prisma ORM with PostgreSQL.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800 hover:border-slate-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
