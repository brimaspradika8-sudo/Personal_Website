"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export interface GuestbookEntry {
  id: string;
  message: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email?: string;
    avatar: string | null;
  };
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const entries = await prisma.guestbook.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return entries.map((e) => ({
      id: e.id,
      message: e.message,
      created_at: e.created_at.toISOString(),
      user: {
        id: e.user.id,
        name: e.user.name,
        email: e.user.email,
        avatar: e.user.avatar,
      },
    }));
  } catch (err) {
    console.warn("getGuestbookEntries error:", err);
    return [];
  }
}

export async function createGuestbookEntry(message: string) {
  if (!message || message.trim().length === 0) {
    return { error: "Pesan tidak boleh kosong." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk menulis di Buku Tamu." };
  }

  try {
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser && user.email) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
          avatar: user.user_metadata?.avatar_url || null,
        },
      });
    }

    if (!dbUser) {
      return { error: "Akun pengguna tidak ditemukan." };
    }

    const entry = await prisma.guestbook.create({
      data: {
        user_id: dbUser.id,
        message: message.trim(),
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return {
      success: true,
      entry: {
        id: entry.id,
        message: entry.message,
        created_at: entry.created_at.toISOString(),
        user: {
          id: entry.user.id,
          name: entry.user.name,
          email: entry.user.email,
          avatar: entry.user.avatar,
        },
      },
    };
  } catch (err: unknown) {
    console.error("createGuestbookEntry error:", err);
    return { error: (err as Error)?.message || "Gagal membuat pesan buku tamu." };
  }
}

export async function deleteGuestbookEntry(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login untuk menghapus pesan." };
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    const existing = await prisma.guestbook.findUnique({ where: { id } });

    if (!existing) {
      return { error: "Pesan tidak ditemukan." };
    }

    const isAdmin = user.email?.toLowerCase().trim() === "brimaspradika8@gmail.com";
    if (existing.user_id !== dbUser?.id && !isAdmin) {
      return { error: "Anda tidak memiliki izin menghapus pesan ini." };
    }

    await prisma.guestbook.delete({ where: { id } });
    return { success: true };
  } catch (err: unknown) {
    console.error("deleteGuestbookEntry error:", err);
    return { error: (err as Error)?.message || "Gagal menghapus pesan buku tamu." };
  }
}
