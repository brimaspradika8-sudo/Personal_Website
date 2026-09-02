'use me';
import GuestbookSection from './components/GuestbookSection';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* Background Ambient Glow Effects */}
      <div className="glow-purple" />
      <div className="glow-cyan" />
      <div className="glow-emerald" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090d16]/70 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center font-bold text-lg text-purple-400">
                BP
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">
                Brimas Pradika
              </span>
              <span className="text-xs text-slate-400">Fullstack Web Developer</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Live DB Demo</a>
            <a href="#stack" className="hover:text-purple-400 transition-colors">Tech Stack</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="pulse-dot" />
              <span>Database Connected</span>
            </div>
            <a
              href="#demo"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Try Live Demo
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto text-center md:text-left">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium text-purple-300 border border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Next.js 16 + Prisma v6 + Supabase Postgres</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Building Modern <br />
              <span className="animate-shimmer">Scalable Web Apps</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Fullstack web developer crafting high-performance web applications with seamless database integrations, sleek glassmorphic UIs, and robust architectures.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <a
                href="#demo"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                ⚡ Test Prisma + Supabase Live
              </a>
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl glass-card text-slate-200 font-semibold text-sm hover:text-white hover:bg-slate-800/60 transition-all border border-slate-700/60"
              >
                View Selected Works
              </a>
            </div>

            {/* Badges / Tech Row */}
            <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">CORE TECH:</span>
              <span className="px-3 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-200">Next.js 16</span>
              <span className="px-3 py-1 rounded-md bg-purple-950/40 border border-purple-800/50 text-purple-300">Prisma ORM</span>
              <span className="px-3 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">Supabase DB</span>
              <span className="px-3 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/50 text-cyan-300">TypeScript</span>
              <span className="px-3 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-200">Tailwind CSS</span>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-purple-500/20 via-cyan-500/10 to-transparent">
              <div className="glass-card p-6 rounded-[22px] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">db-connection.ts</span>
                </div>

                <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <code className="text-purple-400">import</code> prisma <code className="text-purple-400">from</code> <code className="text-emerald-300">&apos;@/lib/prisma&apos;</code>{`\n\n`}
                  <code className="text-slate-500">// Fetch live from Supabase</code>{`\n`}
                  <code className="text-purple-400">export async function</code> <code className="text-cyan-300">getUsers</code>() &#123;{`\n`}
                  &nbsp;&nbsp;<code className="text-purple-400">return await</code> prisma.user.<code className="text-cyan-300">findMany</code>()&#123;{`\n`}
                  &nbsp;&nbsp;&nbsp;&nbsp;orderBy: &#123; createdAt: <code className="text-amber-300">&apos;desc&apos;</code> &#125;{`\n`}
                  &nbsp;&nbsp;&#125;&#125;{`\n`}
                  &#125;
                </pre>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Status Koneksi Database</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ACTIVE (Postgres)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live DB Interactive Section */}
      <section id="demo" className="py-16 px-6 max-w-6xl mx-auto">
        <GuestbookSection />
      </section>

      {/* Tech Architecture & Stack Features */}
      <section id="stack" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-white">Modern Technology Stack</h2>
          <p className="text-slate-400 text-sm">
            Arsitektur yang digunakan untuk membangun aplikasi web yang cepat, scalable, dan type-safe dari backend hingga frontend.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl font-bold">
              ▲
            </div>
            <h3 className="text-lg font-bold text-white">Next.js 16 App Router</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Memanfaatkan Server Components, Route Handlers, dan Optimasi rendering otomatis untuk performa web maksimal.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 border-purple-500/30">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl font-bold">
              ◬
            </div>
            <h3 className="text-lg font-bold text-white">Prisma ORM v6</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type-safe query builder yang memfasilitasi manipulasi database Postgres dengan autocompletion dan migrasi otomatis.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white">Supabase Cloud Postgres</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serverless PostgreSQL database dengan High Availability, Connection Pooling (PgBouncer), dan infrastruktur cloud yang handal.
            </p>
          </div>
        </div>
      </section>

      {/* Selected Projects Section */}
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Portfolio</span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">Featured Projects</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Beberapa project pilihan yang menggunakan stack modern fullstack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="h-44 rounded-xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <span className="text-4xl group-hover:scale-110 transition-transform">🌐</span>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">Next.js</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Prisma</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Supabase</span>
            </div>
            <h3 className="text-xl font-bold text-white">Personal Website & Web Playground</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Website personal modern dengan fitur guestbook interaktif yang terhubung langsung ke database Supabase via Prisma ORM.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="h-44 rounded-xl bg-gradient-to-br from-cyan-900/40 via-blue-900/30 to-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <span className="text-4xl group-hover:scale-110 transition-transform">⚡</span>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Fullstack API</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">PostgreSQL</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">Tailwind</span>
            </div>
            <h3 className="text-xl font-bold text-white">Fullstack SaaS Application Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem backend dengan autentikasi multi-tenant, query teroptimasi, dan manajemen state database terpusat.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            <span className="font-bold text-white">Brimas Pradika</span> &copy; {new Date().getFullYear()} — Built with Next.js 16, Prisma & Supabase.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Supabase</a>
            <a href="https://prisma.io" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Prisma</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
