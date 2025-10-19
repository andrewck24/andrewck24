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
  // 支援三種背景格式：CSS gradient、solid color、image path
  const ogImage = project.ogImage;
  const background = ogImage?.background;
  const text = ogImage?.text;

  // 背景格式偵測（與 ArticleImage 相同邏輯）
  const isImagePath = background?.startsWith("/");

  // 處理背景樣式
  let backgroundStyle: string;
  if (isImagePath && background) {
    // Image path: 需要轉換為絕對 URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    backgroundStyle = `url(${baseUrl}${background})`;
  } else if (background) {
    // CSS gradient 或 solid color: 直接使用
    backgroundStyle = background;
  } else {
    // 預設 gradient
    backgroundStyle = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: isImagePath ? undefined : backgroundStyle,
          backgroundImage: isImagePath ? backgroundStyle : undefined,
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
