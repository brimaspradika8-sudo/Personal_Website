"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkIsAdmin } from "./auth";
import { uploadFileToSupabaseStorage } from "@/lib/supabase/storage";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  demo_url: string | null;
  repository_url: string | null;
  created_at: string;
  updated_at?: string;
}

const isValidUuid = (str: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

// 1. Ambil daftar proyek (Public)
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      thumbnail: p.thumbnail,
      demo_url: p.demo_url,
      repository_url: p.repository_url,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
    }));
  } catch (err) {
    console.warn("getProjects fetch warning:", err);
    return [];
  }
}

// 2. Ambil detail proyek berdasarkan Slug atau ID
export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    let p = await prisma.project.findUnique({ where: { slug } });
    if (!p && isValidUuid(slug)) {
      p = await prisma.project.findUnique({ where: { id: slug } });
    }

    if (p) {
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        thumbnail: p.thumbnail,
        demo_url: p.demo_url,
        repository_url: p.repository_url,
        created_at: p.created_at.toISOString(),
        updated_at: p.updated_at.toISOString(),
      };
    }
  } catch (err) {
    console.warn("getProjectBySlug error:", err);
  }
  return null;
}

// 3. Upload Media (Gambar / Video) Proyek (Admin Only)
export async function uploadProjectImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya pemilik/admin yang dapat mengunggah media proyek." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "File media tidak ditemukan." };
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  if (!isImage && !isVideo) {
    return { error: "File harus berupa format gambar (JPG, PNG, WEBP, SVG) atau video (MP4, WEBM, MOV)." };
  }

  const maxBytes = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { error: isVideo ? "Ukuran file video maksimal 50MB." : "Ukuran file gambar maksimal 10MB." };
  }

  try {
    const res = await uploadFileToSupabaseStorage({ file, folder: "project-media" });
    return res;
  } catch (err: unknown) {
    return { error: (err as Error)?.message || "Gagal mengunggah file media proyek." };
  }
}

// 4. Buat Proyek Baru (Admin Only)
export async function createProject(data: {
  title: string;
  slug?: string;
  description: string;
  thumbnail?: string;
  demo_url?: string;
  repository_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat menambahkan proyek baru." };
  }

  if (!data.title?.trim() || !data.description?.trim()) {
    return { error: "Judul dan deskripsi proyek wajib diisi." };
  }

  try {
    const rawSlug = data.slug && data.slug.trim() ? data.slug : data.title;
    let slugFormatted = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!slugFormatted) {
      slugFormatted = `proyek-${Date.now()}`;
    }

    const existingSlug = await prisma.project.findUnique({
      where: { slug: slugFormatted },
    });
    if (existingSlug) {
      slugFormatted = `${slugFormatted}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const newProject = await prisma.project.create({
      data: {
        title: data.title.trim(),
        slug: slugFormatted,
        description: data.description.trim(),
        thumbnail: data.thumbnail?.trim() || null,
        demo_url: data.demo_url?.trim() || null,
        repository_url: data.repository_url?.trim() || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/projects");
    return { success: true, project: newProject };
  } catch (err: unknown) {
    console.error("createProject error:", err);
    return { error: (err as Error)?.message || "Gagal membuat proyek baru." };
  }
}

// 5. Perbarui / Edit Proyek (Admin Only)
export async function updateProject(
  projectId: string,
  data: {
    title: string;
    slug?: string;
    description: string;
    thumbnail?: string;
    demo_url?: string;
    repository_url?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat memperbarui proyek." };
  }

  try {
    const rawSlug = data.slug && data.slug.trim() ? data.slug : data.title;
    let slugFormatted = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!slugFormatted) {
      slugFormatted = `proyek-${Date.now()}`;
    }

    let existingProject = null;
    if (isValidUuid(projectId)) {
      existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    }

    if (!existingProject) {
      existingProject = await prisma.project.findUnique({ where: { slug: slugFormatted } });
    }

    let updated;
    if (!existingProject) {
      updated = await prisma.project.create({
        data: {
          title: data.title.trim(),
          slug: slugFormatted,
          description: data.description.trim(),
          thumbnail: data.thumbnail?.trim() || null,
          demo_url: data.demo_url?.trim() || null,
          repository_url: data.repository_url?.trim() || null,
        },
      });
    } else {
      updated = await prisma.project.update({
        where: { id: existingProject.id },
        data: {
          title: data.title.trim(),
          slug: slugFormatted,
          description: data.description.trim(),
          thumbnail: data.thumbnail?.trim() || null,
          demo_url: data.demo_url?.trim() || null,
          repository_url: data.repository_url?.trim() || null,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/projects");
    return { success: true, project: updated };
  } catch (err: unknown) {
    console.error("updateProject error:", err);
    return { error: (err as Error)?.message || "Gagal memperbarui proyek." };
  }
}

// 6. Hapus Proyek (Admin Only)
export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await checkIsAdmin(user.email))) {
    return { error: "Akses ditolak. Hanya Admin yang dapat menghapus proyek." };
  }

  try {
    if (isValidUuid(projectId)) {
      const existing = await prisma.project.findUnique({ where: { id: projectId } });
      if (existing) {
        await prisma.project.delete({ where: { id: projectId } });
      }
    }
    revalidatePath("/dashboard");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (err: unknown) {
    console.error("deleteProject error:", err);
    return { error: (err as Error)?.message || "Gagal menghapus proyek." };
  }
}
