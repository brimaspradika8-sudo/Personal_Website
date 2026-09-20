const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export function sanitizeStorageFolder(folder: string, allowedFolders: string[]) {
  const clean = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
  return allowedFolders.includes(clean) ? clean : allowedFolders[0];
}

export function sanitizeFileExtension(ext: string) {
  return ext.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isAllowedUploadMime(type: string, allowVideo = false) {
  return IMAGE_MIME_TYPES.has(type) || (allowVideo && VIDEO_MIME_TYPES.has(type));
}

export function isSvgMime(type: string) {
  return type === "image/svg+xml";
}

export function detectFileMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) return "image/png";
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) return "image/webp";
  if (buffer.toString("ascii", 0, 3) === "GIF") return "image/gif";
  if (buffer.toString("ascii", 4, 8) === "ftyp") return "video/mp4";
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) return "video/webm";

  return null;
}

export function validateUploadBuffer(buffer: Buffer, declaredType: string, allowVideo = false) {
  if (isSvgMime(declaredType)) {
    return { valid: false, error: "SVG tidak diizinkan untuk upload demi mencegah XSS." };
  }

  if (!isAllowedUploadMime(declaredType, allowVideo)) {
    return { valid: false, error: "Tipe file tidak diizinkan." };
  }

  const detectedType = detectFileMime(buffer);
  if (!detectedType) {
    return { valid: false, error: "Signature file tidak valid atau tidak dikenali." };
  }

  if (declaredType === "video/quicktime") {
    return detectedType === "video/mp4"
      ? { valid: true, mime: declaredType }
      : { valid: false, error: "Isi file tidak cocok dengan tipe video." };
  }

  if (detectedType !== declaredType) {
    return { valid: false, error: "Isi file tidak cocok dengan tipe file yang dikirim." };
  }

  return { valid: true, mime: detectedType };
}
