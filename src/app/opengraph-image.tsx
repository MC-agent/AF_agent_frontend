import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top left, rgba(99,102,241,0.38), transparent 34%), radial-gradient(circle at top right, rgba(34,197,94,0.22), transparent 30%), linear-gradient(180deg, #0b1220 0%, #060913 100%)",
          color: "#f5f7ff",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "36px",
            padding: "48px",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 4,
              color: "rgba(233,239,255,0.7)",
            }}
          >
            AF AGENT FRONTEND
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                fontSize: 78,
                fontWeight: 800,
                lineHeight: 1.05,
                maxWidth: "80%",
              }}
            >
              Login, chat, and agent workflow in one place.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "rgba(233,239,255,0.76)",
                maxWidth: "70%",
              }}
            >
              Secure entry, branded chat UI, and route-safe Next.js experience.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
