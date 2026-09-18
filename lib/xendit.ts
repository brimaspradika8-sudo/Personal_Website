export interface CreateInvoiceInput {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
}

export interface XenditInvoiceResponse {
  id: string;
  external_id: string;
  user_id?: string;
  status: "PENDING" | "PAID" | "SETTLED" | "EXPIRED";
  merchant_name?: string;
  merchant_profile_picture_url?: string;
  amount: number;
  payer_email?: string;
  description?: string;
  expiry_date?: string;
  invoice_url: string;
  created?: string;
  updated?: string;
  currency?: string;
}

function getXenditSecretKey(): string {
  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "XENDIT_SECRET_KEY tidak ditemukan di environment variables. Silakan tambahkan XENDIT_SECRET_KEY di .env atau dashboard Vercel."
    );
  }
  return secretKey;
}

function getAuthHeader(): string {
  const secretKey = getXenditSecretKey();
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

export async function createXenditInvoice(
  input: CreateInvoiceInput
): Promise<XenditInvoiceResponse> {
  const authHeader = getAuthHeader();

  const response = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: input.externalId,
      amount: input.amount,
      payer_email: input.payerEmail,
      description: input.description,
      success_redirect_url: input.successRedirectUrl,
      failure_redirect_url: input.failureRedirectUrl,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const rawMsg = responseData.message || responseData.error_code || "";
    let errorMsg = rawMsg || `Xendit API Error (${response.status})`;

    if (response.status === 403 || rawMsg.toLowerCase().includes("forbidden") || rawMsg.toLowerCase().includes("permission")) {
      errorMsg = "API Key Xendit belum memiliki izin Write untuk produk Invoice. Buka Dashboard Xendit -> Settings -> API Keys, lalu beri izin Write pada opsi 'Invoices' (Money In).";
    }

    console.error("Xendit createInvoice failed:", responseData);
    throw new Error(`Gagal membuat invoice Xendit: ${errorMsg}`);
  }

  return responseData as XenditInvoiceResponse;
}

export async function getXenditInvoice(
  invoiceId: string
): Promise<XenditInvoiceResponse> {
  const authHeader = getAuthHeader();

  const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(4000),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMsg =
      responseData.message ||
      responseData.error_code ||
      `Xendit API Error (${response.status})`;
    console.error("Xendit getInvoice failed:", responseData);
    throw new Error(`Gagal mengambil data invoice Xendit: ${errorMsg}`);
  }

  return responseData as XenditInvoiceResponse;
}
