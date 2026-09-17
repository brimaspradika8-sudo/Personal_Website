import { getProjects } from "@/lib/actions/project";
import AdminProjectsClient from "./projects-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Proyek | Admin Dashboard",
  description: "Manajemen daftar proyek portofolio website.",
};

export default async function AdminProyekPage() {
  const projects = await getProjects();
  return <AdminProjectsClient initialProjects={projects} />;
}
