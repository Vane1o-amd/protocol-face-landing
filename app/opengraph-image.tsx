import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#EDEEE9",
          color: "#1B1E1C",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 28, color: "#C1401C", marginBottom: 24 }}>
          PROTOCOL FACE
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Персональная диагностика и сопровождение
        </div>
        <div style={{ fontSize: 30, color: "#4B4F49", marginTop: 32 }}>
          Измени лицо за 60 дней — первые изменения через неделю
        </div>
      </div>
    ),
    { ...size }
  );
}