import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "linear-gradient(135deg, #09090b 0%, #27272a 100%)",
          color: "#ffffff",
          position: "relative",
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
        }}
      >
        <div
          style={{
            fontSize: 30,
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          RP
        </div>
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#22c55e",
            boxShadow: "0 0 0 2px rgba(255,255,255,0.2)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
