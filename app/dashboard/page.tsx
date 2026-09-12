import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { checkIsAdmin } from "@/lib/actions/auth";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  noStore();

  const supabase = await createClient();

  // 1. Ambil sesi aktif (jika ada). Halaman ini PUBLIK, visitor tidak dipaksa login.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch dbUser jika user login
  let dbUser = null;
  const userEmail = (user?.email ?? "").toLowerCase().trim();
  if (userEmail) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    } catch {
      // Ignore DB timeout
    }
  }

  // 3. Cek role admin untuk menentukan apakah tombol Admin Panel ditampilkan
  const isAdmin = await checkIsAdmin(userEmail);

  // 4. Fetch daftar proyek publik untuk tampilan portfolio
  let supabaseProjects: any[] = [];
  try {
    const { data } = await supabase
      .from("Project")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      supabaseProjects = data;
    }
  } catch (err) {
    console.warn("Supabase Project fetch error:", err);
  }

  // 5. Render Halaman Publik User / Portfolio
  return (
    <DashboardClient
      user={user}
      dbUser={dbUser}
      dbProjects={supabaseProjects}
      isAdmin={isAdmin}
    />
  );
}
