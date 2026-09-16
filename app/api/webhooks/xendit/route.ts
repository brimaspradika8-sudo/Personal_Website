import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const callbackToken = req.headers.get("x-callback-token") || req.headers.get("X-CALLBACK-TOKEN");
    const expectedToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;

    if (!expectedToken || callbackToken !== expectedToken) {
      console.warn("Xendit Webhook Unauthorized: Callback token mismatch or missing.");
      return new NextResponse("Unauthorized: Invalid callback token", { status: 401 });
    }

    const body = await req.json();
    const { id, external_id, status } = body;

    if (!id && !external_id) {
      return new NextResponse("Bad Request: Missing invoice ID or external_id", { status: 400 });
    }

    // Cari payment di database berdasarkan xendit_invoice_id atau external_id
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          ...(id ? [{ xendit_invoice_id: id }] : []),
          ...(external_id ? [{ external_id }] : []),
        ],
      },
      include: {
        user: true,
      },
    });

    if (!payment) {
      console.warn(`Xendit Webhook: Payment record not found for invoice ${id} / ${external_id}`);
      return new NextResponse("Payment record not found", { status: 200 });
    }

    // Idempotency: Jika status payment sudah PAID, jangan lakukan update ulang
    if (payment.status === "PAID" && (status === "PAID" || status === "SETTLED")) {
      return new NextResponse("Invoice already processed", { status: 200 });
    }

    if (status === "PAID" || status === "SETTLED") {
      const now = new Date();
      const periodStart = now;
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Hari (1 Bulan)

      // 1. Update Payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paid_at: now,
          period_start: periodStart,
          period_end: periodEnd,
        },
      });

      // 2. Update User Membership Tier
      // Logika pencegahan downgrade tidak sengaja:
      // Jika user sudah memiliki SAHABAT_BRIMAS, dan baru beli KAWAN_BRIMAS, tetap pertahankan SAHABAT_BRIMAS
      let targetTier = payment.tier;
      if (payment.user.tier === "SAHABAT_BRIMAS" && payment.tier === "KAWAN_BRIMAS") {
        if (payment.user.tier_expires_at && payment.user.tier_expires_at > now) {
          targetTier = "SAHABAT_BRIMAS"; // Tetap simpan tier lebih tinggi
        }
      }

      await prisma.user.update({
        where: { id: payment.user_id },
        data: {
          tier: targetTier,
          tier_expires_at: periodEnd,
        },
      });

      console.log(`Xendit Webhook Success: User ${payment.user_id} upgraded to ${targetTier} until ${periodEnd.toISOString()}`);
    } else if (status === "EXPIRED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "EXPIRED" },
      });
      console.log(`Xendit Webhook: Invoice ${payment.xendit_invoice_id} expired.`);
    } else if (status === "FAILED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      console.log(`Xendit Webhook: Invoice ${payment.xendit_invoice_id} failed.`);
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (err: unknown) {
    console.error("Xendit Webhook Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
