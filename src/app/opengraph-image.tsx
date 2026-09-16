import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/seo";
import { BrandMark } from "@/components/editorial/brand-mark";

export const alt = site.socialImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(
    join(process.cwd(), "src/app/fonts/PPNeueMontreal-Regular.otf"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "54px 64px",
        background: "#f1f3ef",
        color: "#183d2b",
        fontFamily: "Neue Montreal",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 23,
        }}
      >
        <span>Zeyad Omran</span>
        <span>Software developer at IBM</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 110,
          lineHeight: 1,
          letterSpacing: "-6px",
        }}
      >
        <span>Complexity,</span>
        <span>made human.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #cbd2c9",
          paddingTop: 23,
          fontSize: 22,
        }}
      >
        <span>zeyadomran.com</span>
        <BrandMark size={40} color="#183d2b" />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Neue Montreal",
          data: font.buffer.slice(
            font.byteOffset,
            font.byteOffset + font.byteLength,
          ),
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
