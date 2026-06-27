import { ImageResponse } from "next/og";

export const alt =
  "EnsightLabs — AI that answers, converts & grows your business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social share card. Applies to every route by default.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #38bdf8 135%)",
          padding: "80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            E
          </div>
          <div style={{ fontSize: 42, fontWeight: 600 }}>EnsightLabs</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div
            style={{
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            AI that answers, converts &amp; grows your business.
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
            Chat &amp; voice agents · leads · meetings · content · financing
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
