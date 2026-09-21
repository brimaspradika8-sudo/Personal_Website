export type TechCategory = "frontend" | "backend" | "ai" | "tools";

export interface TechStackItem {
  name: string;
  category: TechCategory;
  level: "Expert" | "Advanced" | "Intermediate";
  desc: string;
}

export const TECH_STACK_ITEMS: TechStackItem[] = [
  { name: "Next.js 15", category: "frontend", level: "Expert", desc: "App Router, Server Actions, SSR & Streaming" },
  { name: "React 19", category: "frontend", level: "Advanced", desc: "Hooks, Server Components, Custom State" },
  { name: "TypeScript", category: "frontend", level: "Advanced", desc: "Strict Type Safety, Interfaces & Generics" },
  { name: "TailwindCSS", category: "frontend", level: "Expert", desc: "Custom Utilities, Neo-Brutalist Layouts" },
  { name: "Framer Motion", category: "frontend", level: "Advanced", desc: "Layout Animations, Micro-interactions" },
  { name: "Node.js", category: "backend", level: "Advanced", desc: "RESTful APIs, Async Workflows, Runtime" },
  { name: "Supabase", category: "backend", level: "Advanced", desc: "PostgreSQL, Auth, Storage, RLS Policies" },
  { name: "Prisma ORM", category: "backend", level: "Intermediate", desc: "Schema Design, Migrations, Query Engine" },
  { name: "AI Agents & LLM", category: "ai", level: "Advanced", desc: "OpenAI & Gemini API, Prompt Engineering" },
  { name: "Git & GitHub", category: "tools", level: "Advanced", desc: "Version Control, CI/CD, Branching Strategy" },
  { name: "Vercel & Cloud", category: "tools", level: "Advanced", desc: "Automated Deployments, Edge Functions" },
  { name: "Postman", category: "tools", level: "Intermediate", desc: "API Testing, Mocking & Documentation" },
];
