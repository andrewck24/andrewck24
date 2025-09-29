import fs from "fs";
import { ImageResponse } from "next/og";
import path from "path";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/svg+xml";

const style = {
  fontSize: 18,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "black",
  backgroundColor: "white",
  borderRadius: "20%",
  fontWeight: "bold",
  fontFamily: "Ubuntu Mono",
};

export default function Icon() {
  const fontPath = path.join(
    process.cwd(),
    "src/assets/fonts/ubuntu-mono-regular.ttf"
  );
  const fontData = fs.readFileSync(fontPath);

  return new ImageResponse(<div style={style}>at_</div>, {
    ...size,
    fonts: [
      {
        name: "Ubuntu Mono",
        data: fontData,
        style: "normal",
      },
    ],
  });
}

export function DynamicIcon() {
  return (
    <div className="text-foreground m-1 flex size-6 items-center justify-center font-semibold select-none">
      at
      <span className="animate-blink">_</span>
    </div>
  );
}
