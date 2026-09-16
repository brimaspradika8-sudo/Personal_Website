"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { MEMBERSHIP_PLANS, getEffectiveUserTier } from "@/lib/membership";
import { createXenditInvoice } from "@/lib/xendit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { MembershipTier } from "@prisma/client";

async function getAppBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    let url = process.env.NEXT_PUBLIC_APP_URL.trim();
    url = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    url = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    if (origin && !origin.includes("localhost")) {
      return origin.endsWith("/") ? origin.slice(0, -1) : origin;
    }

    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") || "https";
    if (host && !host.includes("localhost")) {
      const fullUrl = `${proto}://${host}`;
      return fullUrl.endsWith("/") ? fullUrl.slice(0, -1) : fullUrl;
    }
  } catch (e) {}

  if (process.env.VERCEL_URL) {
    let url = process.env.VERCEL_URL.trim();
    url = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }

  return "http://localhost:3000";
}

/**
 * Membuat Invoice Xendit untuk upgrade membership dan menyimpan catatan transaksi di database
 */
export async function createMembershipInvoice(
  planKey: "KAWAN_BRIMAS" | "SAHABAT_BRIMAS"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { error: "Silakan masuk (login) terlebih dahulu untuk memilih paket membership." };
    }

    // Ambil / buat user di Prisma
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
          avatar: user.user_metadata?.avatar_url || null,
        },
      });
    }

    const plan = MEMBERSHIP_PLANS[planKey];
    if (!plan) {
      return { error: "Paket membership tidak valid." };
    }

    const appBaseUrl = await getAppBaseUrl();
    const externalId = `membership-${planKey.toLowerCase()}-${dbUser.id}-${Date.now()}`;
    const successRedirectUrl = `${appBaseUrl}/upgrade?status=success&plan=${planKey}`;
    const failureRedirectUrl = `${appBaseUrl}/upgrade?status=failed&plan=${planKey}`;
    const description = `Pembayaran Membership ${plan.title} - Brimas Pradika Utama (${dbUser.email})`;

    // 1. Panggil Xendit Invoice API
    const invoice = await createXenditInvoice({
      externalId,
      amount: plan.priceIdr,
      payerEmail: dbUser.email,
      description,
      successRedirectUrl,
      failureRedirectUrl,
    });

    if (!invoice || !invoice.invoice_url) {
      return { error: "Gagal mendapatkan URL Invoice dari Xendit." };
    }

    // 2. Simpan record Payment di database
    await prisma.payment.create({
      data: {
        user_id: dbUser.id,
        tier: planKey as MembershipTier,
        amount: plan.priceIdr,
        status: "PENDING",
        xendit_invoice_id: invoice.id,
        external_id: externalId,
        invoice_url: invoice.invoice_url,
      },
    });

    return { invoiceUrl: invoice.invoice_url };
  } catch (err: unknown) {
    console.error("Error creating membership invoice:", err);
    return { error: (err as Error)?.message || "Gagal memproses pembuatan invoice Xendit." };
  }
}

export interface UserMembershipStatus {
  tier: MembershipTier;
  tierExpiresAt: string | null;
  weeklyArticleCount: number;
  weeklyArticleLimit: number | null;
  hasAdminAccess: boolean;
  userEmail: string;
}

/**
 * Mengambil status membership aktif pengguna saat ini
 */
export async function getMyMembershipStatus(): Promise<UserMembershipStatus | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) return null;

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return null;

    const effectiveTier = await getEffectiveUserTier(dbUser.id);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentArticlesCount = await prisma.article.count({
      where: {
        author_id: dbUser.id,
        created_at: {
          gte: sevenDaysAgo,
        },
      },
    });

    let limit: number | null = null;
    let hasAdminAccess = dbUser.role === "ADMIN";

    if (effectiveTier === "KAWAN_BRIMAS") {
      limit = MEMBERSHIP_PLANS.KAWAN_BRIMAS.weeklyArticleLimit;
    } else if (effectiveTier === "SAHABAT_BRIMAS") {
      limit = null;
      hasAdminAccess = true;
    }

    return {
      tier: effectiveTier,
      tierExpiresAt: dbUser.tier_expires_at ? dbUser.tier_expires_at.toISOString() : null,
      weeklyArticleCount: recentArticlesCount,
      weeklyArticleLimit: limit,
      hasAdminAccess,
      userEmail: dbUser.email,
    };
  } catch (err) {
    console.error("Error fetching my membership status:", err);
    return null;
  }
}
