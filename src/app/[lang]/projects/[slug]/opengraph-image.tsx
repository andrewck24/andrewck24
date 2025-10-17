import { getProject } from "@/lib/data/projects";
import { Locale } from "@/types/project";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 1200,
  height: 675,
};

export const contentType = "image/png";

// Use nodejs runtime because fumadocs-mdx requires fs/promises
// Edge runtime doesn't support Node.js file system APIs
export const runtime = "nodejs";

export const revalidate = 3600;

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;

  const project = await getProject(locale, slug);

  // 如果專案不存在或使用靜態圖片，返回 null（讓 Next.js 使用 metadata 中的圖片）
  if (!project || project.imageType !== "generated") {
    // 返回預設圖片
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {project?.title || "Project"}
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // 動態生成的 OG Image（imageType: "generated"）
  // 使用與 GeneratedHero 相同的邏輯
  const ogImage = project.ogImage;
  const backgroundImage = ogImage?.background;
  const text = ogImage?.text;

  // OG Image 需要絕對 URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const absoluteBackgroundUrl = backgroundImage
    ? `${baseUrl}${backgroundImage}`
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: absoluteBackgroundUrl
            ? `url(${absoluteBackgroundUrl})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          padding: 80,
        }}
      >
        {text ? (
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: "90%",
            }}
          >
            {text}
          </h1>
        ) : null}
      </div>
    ),
    {
      ...size,
    }
  );
}
