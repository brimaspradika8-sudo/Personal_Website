import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0c0a09",
            backgroundImage: "radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)",
            padding: "40px 60px",
            fontFamily: "sans-serif",
            color: "#ffffff",
            position: "relative",
          }}
        >
          {/* Decorative Border Frame */}
          <div
            style={{
              position: "absolute",
              inset: "20px",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              borderRadius: "24px",
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(251, 191, 36, 0.4)",
              color: "#fcd34d",
              fontSize: "18px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "24px",
            }}
          >
            <span>🌲 BRIMAS PERSONAL RETREAT & PORTFOLIO</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              textAlign: "center",
              margin: 0,
              background: "linear-gradient(to right, #ffffff, #fef3c7, #f59e0b)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            Brimas Pradika Utama
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "28px",
              color: "#fbbf24",
              fontWeight: 700,
              marginTop: "16px",
              marginBottom: "20px",
            }}
          >
            Full-Stack Architect & High-Scalable Web Systems
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: "20px",
              color: "#cbd5e1",
              textAlign: "center",
              maxWidth: "800px",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Membangun platform web berskala tinggi, solusi arsitektur AI modern, dan pengalaman antarmuka bergaya lanskap alam.
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Failed to generate OG image";
    return new Response(errorMsg, { status: 500 });
  }
}
