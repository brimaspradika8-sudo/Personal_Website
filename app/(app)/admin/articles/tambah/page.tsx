import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import TambahArtikelClient from "./tambah-client";

export default async function TambahArtikelPage() {
  const user = await getAuthenticatedUser();

  if (!user || !user.email) {
    redirect("/login?redirectedFrom=/admin/artikel/tambah");
  }

  return <TambahArtikelClient />;
}
