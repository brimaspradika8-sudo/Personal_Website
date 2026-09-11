"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface GuestbookEntry {
  id: string;
  message: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    email?: string;
  };
}

// Data sampel awal jika database belum berisikan entri
const SAMPLE_GUESTBOOK: GuestbookEntry[] = [
  {
    id: "sample-g1",
    message: "Keren sekali arsitektur website dan AI Agent portfolio-nya! Sukses selalu mas Brimas 🚀",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    user: {
      id: "u-sample-1",
      name: "Alex Dev",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "sample-g2",
    message: "Tampilan minimalist & magazine stylenya sangat elegan. Suka banget animasi teddy dan Rive loader-nya!",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    user: {
      id: "u-sample-2",
      name: "Sarah Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  },
];

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    // @ts-ignore
    const entries = await prisma.guestbook.findMany({
      orderBy: { created_at: "desc" },
      take: 50,
      include: {
        user: { select: { id: true, name: true, avatar: true, email: true } },
      },
    });

    if (!entries || entries.length === 0) {
      return SAMPLE_GUESTBOOK;
    }

    return entries.map((e: any) => ({
      id: e.id,
      message: e.message,
      created_at: e.created_at.toISOString(),
      user: {
        id: e.user.id,
        name: e.user.name,
        avatar: e.user.avatar,
        email: e.user.email,
      },
    }));
  } catch (err) {
    console.warn("Guestbook database fetch failed, returning sample fallback:", err);
    return SAMPLE_GUESTBOOK;
  }
}

export async function createGuestbookEntry(message: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu untuk menulis di Buku Tamu." };
  }

  if (!message || message.trim().length === 0) {
    return { error: "Pesan tidak boleh kosong." };
  }

  if (message.trim().length > 300) {
    return { error: "Pesan maksimal 300 karakter." };
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
      return { error: "Profil pengguna tidak ditemukan." };
    }

    // @ts-ignore
    const newEntry = await prisma.guestbook.create({
      data: {
        user_id: dbUser.id,
        message: message.trim(),
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/guestbook");

    return {
      success: true,
      entry: {
        id: newEntry.id,
        message: newEntry.message,
        created_at: newEntry.created_at.toISOString(),
        user: {
          id: newEntry.user.id,
          name: newEntry.user.name,
          avatar: newEntry.user.avatar,
        },
      },
    };
  } catch (err: any) {
    console.error("Error creating guestbook entry:", err);
    return { error: err?.message || "Gagal menyimpan pesan di Buku Tamu." };
  }
}

export async function deleteGuestbookEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Harus login terlebih dahulu." };
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) {
      return { error: "User tidak ditemukan." };
    }

    // @ts-ignore
    const entry = await prisma.guestbook.findUnique({ where: { id } });
    if (!entry) {
      return { error: "Entri pesan tidak ditemukan." };
    }

    const isAdmin = user.email?.toLowerCase().trim() === "brimaspradika8@gmail.com";
    if (entry.user_id !== dbUser.id && !isAdmin) {
      return { error: "Anda tidak memiliki akses untuk menghapus pesan ini." };
    }

    // @ts-ignore
    await prisma.guestbook.delete({ where: { id } });

    revalidatePath("/dashboard");
    revalidatePath("/guestbook");

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Gagal menghapus pesan." };
  }
}
