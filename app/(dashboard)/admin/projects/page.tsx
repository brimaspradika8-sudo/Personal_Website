import { getProjects } from "@/lib/actions/project";
import AdminProjectsClient from "../proyek/projects-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Projects | Admin Dashboard",
  description: "Portfolio projects management page for admin.",
};

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <AdminProjectsClient initialProjects={projects} />;
}
