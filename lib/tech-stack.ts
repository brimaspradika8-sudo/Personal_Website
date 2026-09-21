export type TechCategory = "frontend" | "backend" | "ai" | "tools";

export interface TechStackItem {
  name: string;
  category: TechCategory;
  level: "Expert" | "Advanced" | "Intermediate";
  desc: string;
}

export const TECH_STACK_ITEMS: TechStackItem[] = [
  { name: "HTML", category: "frontend", level: "Advanced", desc: "Semantic Markup, Accessibility, Document Structure" },
  { name: "CSS", category: "frontend", level: "Advanced", desc: "Responsive Layouts, Components, Visual Systems" },
  { name: "JavaScript", category: "frontend", level: "Advanced", desc: "Browser APIs, Async Workflows, Interactive UI" },
  { name: "Next.js", category: "frontend", level: "Advanced", desc: "App Router, Server Actions, SSR" },
  { name: "React", category: "frontend", level: "Advanced", desc: "Components, Hooks, Client State" },
  { name: "TypeScript", category: "frontend", level: "Advanced", desc: "Strict Types, Interfaces, Generics" },
  { name: "Laravel", category: "backend", level: "Intermediate", desc: "MVC Applications, Routing, Authentication" },
  { name: "PHP", category: "backend", level: "Intermediate", desc: "Server-side Applications, APIs, Database Integration" },
  { name: "Supabase", category: "backend", level: "Advanced", desc: "PostgreSQL, Auth, Storage, RLS Policies" },
  { name: "PostgreSQL", category: "backend", level: "Intermediate", desc: "Relational Data Modeling, Queries, Migrations" },
  { name: "MySQL", category: "backend", level: "Intermediate", desc: "Relational Databases, Queries, Data Integrity" },
  { name: "Docker", category: "tools", level: "Intermediate", desc: "Containerized Development and Deployment Workflows" },
];
