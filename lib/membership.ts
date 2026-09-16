import { prisma } from "@/lib/prisma";
import { MembershipTier } from "@prisma/client";

export interface MembershipPlanConfig {
  key: MembershipTier;
  title: string;
  badge: string;
  priceIdr: number;
  priceUsd: number;
  weeklyArticleLimit: number | null; // 3 for Kawan, null for unlimited
  adminAccess: boolean;
  description: string;
  features: string[];
}

/**
 * Single source of truth untuk konfigurasi harga & batasan tier membership.
 * Ubah harga nominal di sini saja.
 */
export const MEMBERSHIP_PLANS: Record<"KAWAN_BRIMAS" | "SAHABAT_BRIMAS", MembershipPlanConfig> = {
  KAWAN_BRIMAS: {
    key: "KAWAN_BRIMAS",
    title: "Kawan Brimas",
    badge: "KAWAN",
    priceIdr: 50000, // Rp 50.000 / bulan (Placeholder)
    priceUsd: 3.5,
    weeklyArticleLimit: 3, // Maksimal 3 artikel per 7 hari (rolling window)
    adminAccess: false,
    description: "Tingkat membership dasar untuk kreator & penulis aktif.",
    features: [
      "Bisa publikasi artikel hingga 3 artikel / 7 hari",
      "Akses penuh fitur komentar & reaksi komunitas",
      "Sertifikat keanggotaan digital Kawan Brimas",
      "Badge eksklusif di profil pengguna",
      "Dukungan prioritas & garansi garansi platform",
    ],
  },
  SAHABAT_BRIMAS: {
    key: "SAHABAT_BRIMAS",
    title: "Sahabat Brimas",
    badge: "SAHABAT VIP",
    priceIdr: 150000, // Rp 150.000 / bulan (Placeholder)
    priceUsd: 10,
    weeklyArticleLimit: null, // Unlimited
    adminAccess: true, // Full Admin Dashboard Access
    description: "Tingkat membership VIP dengan akses admin penuh & tanpa batas artikel.",
    features: [
      "Bisa publikasi artikel TANPA BATAS (Unlimited)",
      "AKSES ADMIN PENUH (Kelola semua artikel, komentar, project & user)",
      "Prioritas teratas pada daftar anggota & portofolio",
      "Badge VIP Emas eksklusif di seluruh sistem",
      "Dukungan langsung via grup / jalur khusus 24/7",
    ],
  },
};

/**
 * Mengecek dan mengembalikan tier pengguna yang valid.
 * Jika `tier_expires_at` sudah lewat dari waktu sekarang, otomatis diturunkan ke FREE di database.
 */
export async function getEffectiveUserTier(userId: string): Promise<MembershipTier> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true, tier_expires_at: true },
    });

    if (!user) return "FREE";

    if (user.tier !== "FREE" && user.tier_expires_at) {
      const now = new Date();
      if (user.tier_expires_at < now) {
        // Otomatis turunkan ke FREE karena masa berlaku habis
        await prisma.user.update({
          where: { id: userId },
          data: {
            tier: "FREE",
            tier_expires_at: null,
          },
        });
        return "FREE";
      }
    }

    return user.tier;
  } catch (err) {
    console.error("Error checking effective user tier:", err);
    return "FREE";
  }
}

/**
 * Memeriksa apakah pengguna diizinkan membuat artikel baru.
 * - Admin asli -> Selalu diizinkan
 * - FREE -> Tidak diizinkan (harus upgrade)
 * - SAHABAT_BRIMAS -> Selalu diizinkan (Unlimited)
 * - KAWAN_BRIMAS -> Diizinkan jika pembuatan artikel dalam 7 hari terakhir < 3
 */
export async function canUserCreateArticle(
  userId: string,
  isAdmin: boolean
): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  if (isAdmin) {
    return { allowed: true };
  }

  const effectiveTier = await getEffectiveUserTier(userId);

  if (effectiveTier === "FREE") {
    return {
      allowed: false,
      reason: "User tanpa membership (FREE) tidak dapat membuat artikel. Silakan upgrade ke Kawan Brimas atau Sahabat Brimas.",
    };
  }

  if (effectiveTier === "SAHABAT_BRIMAS") {
    return { allowed: true };
  }

  if (effectiveTier === "KAWAN_BRIMAS") {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentArticlesCount = await prisma.article.count({
      where: {
        author_id: userId,
        created_at: {
          gte: sevenDaysAgo,
        },
      },
    });

    const limit = MEMBERSHIP_PLANS.KAWAN_BRIMAS.weeklyArticleLimit ?? 3;
    if (recentArticlesCount >= limit) {
      return {
        allowed: false,
        reason: `Batas kuota Anda (${limit} artikel dalam 7 hari terakhir) telah tercapai. Upgrade ke Sahabat Brimas untuk publikasi tanpa batas!`,
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining: limit - recentArticlesCount,
    };
  }

  return { allowed: false, reason: "Akses tidak diizinkan." };
}

/**
 * Memeriksa apakah pengguna memiliki hak akses ke Dashboard Admin.
 * Diizinkan jika merupakan Admin Asli ATAU berlangganan tier SAHABAT_BRIMAS.
 */
export async function hasAdminDashboardAccess(
  userId: string | null | undefined,
  isAdmin: boolean
): Promise<boolean> {
  if (isAdmin) return true;
  if (!userId) return false;

  const effectiveTier = await getEffectiveUserTier(userId);
  return effectiveTier === "SAHABAT_BRIMAS";
}
