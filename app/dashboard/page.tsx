import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import DashboardClient from "./dashboard-client";

// Paksa Next.js untuk TIDAK PERNAH men-cache halaman ini secara statis.
// Tanpa ini, Next.js bisa menyimpan HTML hasil render user pertama (admin)
// lalu menyajikannya ke semua user berikutnya — inilah bug Route Cache.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // noStore() sebagai lapisan keamanan tambahan: memastikan Data Cache
  // juga tidak men-cache hasil fetch di dalam komponen ini.
  noStore();

  const supabase = await createClient();

  // 1. Verifikasi sesi aktif dari Supabase Auth server (bukan JWT lokal).
  //    getUser() memvalidasi token ke server → tidak bisa ditipu cookie stale.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // [DIAGNOSTIK] Log untuk memverifikasi identitas user yang dibaca server.
  // Hapus atau komentari baris ini setelah bug terkonfirmasi teratasi.
  console.log("[DashboardPage] getUser() result:", {
    userId: user?.id ?? "null",
    email: user?.email ?? "null",
    authError: authError?.message ?? "none",
  });

  // 2. Jika tidak ada sesi aktif, redirect ke login.
  //    (Middleware sudah menangani ini, tapi ini sebagai double-guard di Server Component.)
  if (!user) {
    redirect("/login");
  }

  // 3. Ambil data user dari database Prisma berdasarkan user.id dari sesi AKTIF.
  //    Selalu query by user.id (bukan email dari props/state), agar benar-benar
  //    data milik akun yang sedang login sekarang.
  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
  } catch {
    // Ignore database connection timeouts — dashboard tetap render dengan data Supabase
  }

  // 4. Validasi Role Admin di SERVER COMPONENT (tidak bisa di-bypass dari client).
  //    Hanya user dengan role "ADMIN" di DATABASE yang boleh melihat full dashboard.
  //    Jika bukan admin, mereka tetap dapat masuk dashboard tapi dengan akses terbatas
  //    (DashboardClient sudah handle ini via props isAdmin).
  const isAdmin = dbUser?.role === "ADMIN";

  // [DIAGNOSTIK] Konfirmasi role yang diputuskan server untuk user ini.
  console.log("[DashboardPage] Role check:", {
    dbUserId: dbUser?.id ?? "not found in DB",
    dbUserEmail: dbUser?.email ?? "null",
    role: dbUser?.role ?? "null",
    isAdmin,
  });

  // 5. Fetch Projects — hanya setelah identitas & role tervalidasi.
  let supabaseProjects: any[] = [];
  try {
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      supabaseProjects = data;
    }
  } catch (err) {
    console.warn("Supabase Project fetch failed, fallback to Prisma:", err);
  }

  let dbProjects: any[] = [];
  try {
    dbProjects = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch {
    dbProjects = [];
  }

  // Prefer data langsung dari Supabase jika tersedia
  const finalProjects = supabaseProjects.length > 0 ? supabaseProjects : dbProjects;

  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      dbProjects={finalProjects}
      isAdmin={isAdmin}
    />
  );
}
