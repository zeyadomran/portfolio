import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/seo";

export const alt = site.socialImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/SpaceMono-Regular.ttf")),
    readFile(join(process.cwd(), "public/assets/SpaceMono-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px 72px",
        background: "#000000",
        color: "#f5f7fa",
        fontFamily: "Space Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <svg width="100" height="70" viewBox="24 48 152 80">
          <rect x="32" y="56" width="104" height="16" fill="#b8b8b8" />
          <rect x="64" y="104" width="80" height="16" fill="#b8b8b8" />
          <rect x="152" y="104" width="16" height="16" fill="#4c70f0" />
        </svg>
        <div style={{ display: "flex", fontSize: 24, color: "#b7c2cc" }}>
          Software developer at IBM
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            lineHeight: 1.12,
            fontWeight: 700,
          }}
        >
          ZEYAD
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 96,
            lineHeight: 1.12,
            fontWeight: 700,
          }}
        >
          OMRAN
          <span
            style={{
              display: "flex",
              width: 22,
              height: 22,
              marginLeft: 20,
              background: "#4c70f0",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          borderTop: "1px solid #b8b8b8",
          paddingTop: 24,
        }}
      >
        Intuitive interfaces. Practical AI tools.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Space Mono",
          data: regular.buffer.slice(
            regular.byteOffset,
            regular.byteOffset + regular.byteLength,
          ),
          weight: 400,
          style: "normal",
        },
        {
          name: "Space Mono",
          data: bold.buffer.slice(
            bold.byteOffset,
            bold.byteOffset + bold.byteLength,
          ),
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
