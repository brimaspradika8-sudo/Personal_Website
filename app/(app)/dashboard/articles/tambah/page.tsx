import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import TambahArtikelClient from "@/app/(app)/admin/articles/tambah/tambah-client";

export default async function UserTambahArtikelPage() {
  const user = await getAuthenticatedUser();

  if (!user || !user.email) {
    redirect("/login?redirectedFrom=/dashboard/articles/tambah");
  }

  return <TambahArtikelClient />;
}
