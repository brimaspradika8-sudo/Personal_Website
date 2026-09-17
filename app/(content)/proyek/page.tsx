import { getProjects } from "@/lib/actions/project";
import ProyekClient from "./proyek-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Proyek & Portofolio | Brimas Pradika Utama - Software & AI Systems Developer",
  description: "Eksplorasi galeri proyek web application, integrasi sistem kecerdasan buatan (AI Agent), arsitektur fullstack, dan repositori open-source karya Brimas Pradika Utama.",
};

export default async function ProyekPage() {
  const projects = await getProjects();
  return <ProyekClient initialProjects={projects} />;
}
