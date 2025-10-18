# Quickstart: Article 元件系統

**Date**: 2025-10-19
**Branch**: 003-article-components
**Prerequisites**: 完成 Phase 1 實作（types, components, contracts）

## 目標

提供快速入門指南，讓開發者能在 15 分鐘內了解如何使用新的 article 元件系統，並將現有 projects 頁面遷移到新架構。

---

## Step 1: 了解型別架構 (2 分鐘)

### 型別階層

```typescript
// 基礎型別 (src/types/article.ts)
interface ArticleMetadata {
  title;
  description;
  imageType;
  image;
  ogImage;
  date;
  slug;
  locale;
  url;
}

// 專案型別 (src/types/project.ts)
interface ProjectMetadata extends ArticleMetadata {
  featured?;
  order?;
}

// 筆記型別 (src/types/note.ts)
interface NoteMetadata extends ArticleMetadata {
  tags?;
  category?;
  featured?;
}
```

### 關鍵概念

1. **ArticleMetadata**: 所有文章的共同屬性
2. **ProjectMetadata / NoteMetadata**: 特定 content type 的額外屬性
3. **ArticlePageData<T>**: 包含 MDX 內容的完整資料

---

## Step 2: 使用 ArticleCard (3 分鐘)

### 基本用法

```typescript
import { ArticleCard } from "@/components/article/card";

// Projects
<ArticleCard
  article={project}
  variant="hero"       // or "compact"
  priority={true}      // for first card
  contentType="projects"
/>

// Notes
<ArticleCard
  article={note}
  variant="compact"
  contentType="notes"
/>
```

### Variants 差異

| Variant   | Desktop Layout              | Mobile Layout | Use Case               |
| --------- | --------------------------- | ------------- | ---------------------- |
| `hero`    | Image (50%) + Content (50%) | Stacked       | First featured article |
| `compact` | Image (33%) + Content (67%) | Stacked       | List items             |

---

## Step 3: 使用 ArticleImage (3 分鐘)

### Static Image Mode

```typescript
<ArticleImage
  slug="my-project"
  title="專案標題"
  imageType="static"
  image="/images/projects/hero/zh-TW/my-project.jpg"
  priority={true}
/>
```

### Generated Mode (Gradient)

```typescript
<ArticleImage
  slug="my-project"
  title="專案標題"
  imageType="generated"
  ogImage={{
    text: "專案標題",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }}
/>
```

### Generated Mode (Solid Color)

```typescript
<ArticleImage
  slug="my-note"
  title="筆記標題"
  imageType="generated"
  ogImage={{
    text: "筆記",
    background: "#667eea"
  }}
/>
```

### Generated Mode (Background Image)

```typescript
<ArticleImage
  slug="my-article"
  title="文章"
  imageType="generated"
  ogImage={{
    text: "主題",
    background: "/images/projects/og-backgrounds/common/bg.jpg"
  }}
/>
```

---

## Step 4: 使用 Article (詳細頁) (2 分鐘)

### Projects Detail Page

```typescript
// src/app/[lang]/projects/[slug]/page.tsx
import { Article } from "@/components/article";
import { getProject } from "@/lib/data/projects";

export default async function ProjectDetailPage({ params }) {
  const { lang, slug } = await params;
  const project = await getProject(lang, slug);

  if (!project) notFound();

  return (
    <Article
      article={project}
      contentType="projects"
      backLinkText="返回專案列表"
    />
  );
}
```

### Notes Detail Page

```typescript
// src/app/[lang]/notes/[[...slug]]/page.tsx
import { Article } from "@/components/article";
import { getNote } from "@/lib/data/notes";

export default async function NoteDetailPage({ params }) {
  const { lang, slug } = await params;
  const note = await getNote(lang, slug?.[0] || "");

  if (!note) notFound();

  return (
    <Article
      article={note}
      contentType="notes"
      backLinkText="返回筆記列表"
    />
  );
}
```

---

## Step 5: 建立 Data Layer (3 分鐘)

### Notes Data Layer

```typescript
// src/lib/data/notes.ts
import { notesSource } from "@/lib/source";
import type { Locale, NoteMetadata, NotePageData } from "@/types/note";

export async function getFeaturedNotes(
  locale: Locale
): Promise<NoteMetadata[]> {
  const pages = notesSource.getPages(locale);

  return pages
    .filter((page) => page.data.featured === true)
    .slice(0, 5)
    .map((page) => ({
      ...page.data,
      slug: page.slugs[0] || "",
      locale,
      url: page.url,
    }));
}

export async function getNote(
  locale: Locale,
  slug: string
): Promise<NotePageData | null> {
  const page = notesSource.getPage([slug], locale);
  if (!page) return null;

  return {
    ...page.data,
    slug: page.slugs[0] || slug,
    locale,
    url: page.url,
    content: page.data.body,
    body: "",
  };
}
```

---

## Step 6: 設定 OG Image 生成 (2 分鐘)

### opengraph-image.tsx Pattern

```typescript
// src/app/[lang]/projects/[slug]/opengraph-image.tsx
import { getProject } from "@/lib/data/projects";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";  // fumadocs-mdx requires fs
export const size = { width: 1200, height: 675 };

export default async function Image({ params }) {
  const { lang, slug } = await params;
  const article = await getProject(lang, slug);

  if (!article) return null;

  // Background format detection
  const background = article.ogImage?.background;
  const isImagePath = background?.startsWith('/');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const backgroundStyle = isImagePath
    ? `url(${baseUrl}${background})`
    : background || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: backgroundStyle,
        backgroundSize: "cover",
        padding: 80,
      }}
    >
      {article.ogImage?.text && (
        <h1 style={{ fontSize: "4rem", fontWeight: "bold", color: "#fff" }}>
          {article.ogImage.text}
        </h1>
      )}
    </div>,
    { ...size }
  );
}
```

---

## 完整範例：建立 Notes 功能

### 1. 定義 NoteMetadata (已完成)

```typescript
// src/types/note.ts
export interface NoteMetadata extends ArticleMetadata {
  tags?: string[];
  category?: string;
  featured?: boolean;
}
```

### 2. 建立 Data Layer

```typescript
// src/lib/data/notes.ts
// (見 Step 5)
```

### 3. 建立 Notes List Page

```typescript
// src/app/[lang]/notes/page.tsx
import { ArticleCard } from "@/components/article/card";
import { getFeaturedNotes } from "@/lib/data/notes";

export default async function NotesPage({ params }) {
  const { lang } = await params;
  const featuredNotes = await getFeaturedNotes(lang);

  return (
    <div className="container mx-auto px-4">
      <h1>技術筆記</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredNotes.map((note, index) => (
          <ArticleCard
            key={note.slug}
            article={note}
            variant="compact"
            priority={index === 0}
            contentType="notes"
          />
        ))}
      </div>
    </div>
  );
}
```

### 4. 建立 Note Detail Page

```typescript
// src/app/[lang]/notes/[[...slug]]/page.tsx
// (見 Step 4)
```

### 5. 建立 OG Image

```typescript
// src/app/[lang]/notes/[[...slug]]/opengraph-image.tsx
// (見 Step 6，將 getProject 改為 getNote)
```

---

## 測試驗證

### 手動測試步驟

1. **啟動開發伺服器**:

   ```bash
   npm run dev
   ```

2. **測試 Projects**:
   - 訪問 `/zh-TW/projects`
   - 點擊 project card
   - 驗證 view transition 動畫
   - 檢查 OG image 顯示

3. **測試 Notes**:
   - 訪問 `/zh-TW/notes`
   - 點擊 note card
   - 驗證內容正確渲染
   - 測試 back link 導航

4. **測試響應式**:
   - 調整視窗大小
   - 驗證 hero/compact variants
   - 測試 mobile layout

### 自動化測試

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type check
npm run type-check
```

---

## 常見問題

### Q1: 如何自訂 ArticleCard 樣式？

**A**: 使用 `className` prop:

```typescript
<ArticleCard
  article={article}
  className="custom-shadow hover:scale-105"
/>
```

### Q2: 如何在 MDX 中使用 generated mode？

**A**: 在 frontmatter 設定:

```yaml
---
title: "我的筆記"
imageType: generated
ogImage:
  text: "主題"
  background: "linear-gradient(...)"
---
```

### Q3: background 支援哪些格式？

**A**:

- CSS Gradient: `linear-gradient(...)`, `radial-gradient(...)`
- Solid Color: `#667eea`, `rgb(102, 126, 234)`, `hsl(...)`
- Image Path: `/images/projects/og-backgrounds/common/bg.jpg`

### Q4: 如何禁用 View Transitions？

**A**: 暫不支援禁用（憲法要求保留此功能）。如需調整，修改 `next.config.js` 中的 `experimental.viewTransition`。

---

## 下一步

1. **閱讀完整契約**: 參考 `contracts/` 目錄了解詳細 API
2. **執行 /tasks**: 生成實作任務列表
3. **開始 TDD**: 先寫測試，再實作元件
4. **遷移現有程式碼**: 逐步將 projects 遷移到 article 系統

---

## 相關文件

- [研究文件](./research.md): 技術決策和最佳實踐
- [資料模型](./data-model.md): 完整的型別定義
- [ArticleImage Contract](./contracts/article-image.contract.md)
- [ArticleCard Contract](./contracts/article-card.contract.md)
- [Article Contract](./contracts/article.contract.md)

---

**預估完成時間**: 15 分鐘閱讀 + 30 分鐘實作第一個範例
