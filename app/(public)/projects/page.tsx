import { getProjects } from "@/lib/actions/project";
import ProjectsClient from "./projects-list-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects & Portfolio | Brimas Pradika Utama - Software & AI Systems Developer",
  description: "Explore a gallery of web applications, AI system integrations, full-stack architecture work, and open-source projects by Brimas Pradika Utama.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}
