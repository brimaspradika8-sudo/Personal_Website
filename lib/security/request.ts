import { NextRequest, NextResponse } from "next/server";
import { verifyCsrfToken, verifyRequestOrigin } from "./csrf";

export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function guardMutationRequest(request: NextRequest | Request) {
  const origin = await verifyRequestOrigin();
  if (!origin.valid) {
    return NextResponse.json({ error: "Permintaan ditolak." }, { status: 403 });
  }

  const csrfToken = request.headers.get("x-csrf-token");
  if (!(await verifyCsrfToken(csrfToken))) {
    return NextResponse.json({ error: "Token keamanan tidak valid." }, { status: 403 });
  }

  return null;
}

export function getContentLength(request: NextRequest | Request): number {
  const raw = request.headers.get("content-length");
  if (!raw) return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function rejectLargeRequest(request: NextRequest | Request, maxBytes: number) {
  const contentLength = getContentLength(request);
  if (contentLength > maxBytes) {
    return NextResponse.json(
      { error: "Payload terlalu besar." },
      { status: 413 }
    );
  }
  return null;
}
