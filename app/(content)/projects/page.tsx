import { getProjects } from "@/lib/actions/project";
import ProyekClient from "../proyek/proyek-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects & Portfolio | Brimas Pradika Utama - Software & AI Systems Developer",
  description: "Explore real-world web application projects, AI agent integrations, fullstack architectures, and open-source repositories built by Brimas Pradika Utama.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProyekClient initialProjects={projects} />;
}
