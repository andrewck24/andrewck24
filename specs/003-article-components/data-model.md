# Data Model: Article 元件泛用化系統

**Date**: 2025-10-19
**Branch**: 003-article-components
**Status**: Complete

## Overview

定義 article 元件系統的完整資料模型，包含型別階層、Zod schemas、以及資料流設計。

---

## Entity Hierarchy

```
ArticleMetadata (base interface)
├── ProjectMetadata (extends ArticleMetadata)
└── NoteMetadata (extends ArticleMetadata)

ArticlePageData<T> (generic wrapper)
├── ProjectPageData = ArticlePageData<ProjectMetadata>
└── NotePageData = ArticlePageData<NoteMetadata>
```

---

## E1: ArticleMetadata (Base Entity)

### Purpose

定義所有文章類型的共同屬性，作為 ProjectMetadata 和 NoteMetadata 的基礎型別。

### Fields

| Field         | Type                      | Required | Description   | Validation                                   |
| ------------- | ------------------------- | -------- | ------------- | -------------------------------------------- |
| `title`       | `string`                  | ✅       | 文章標題      | 1-100 字元                                   |
| `description` | `string`                  | ✅       | 文章簡述      | 1-200 字元                                   |
| `imageType`   | `"static" \| "generated"` | ❌       | 主視覺類型    | 預設: `"static"`                             |
| `image`       | `string`                  | ❌       | 靜態圖片路徑  | 當 `imageType="static"` 時必填，符合路徑格式 |
| `ogImage`     | `OGImageConfig`           | ❌       | 動態生成設定  | 當 `imageType="generated"` 時選填            |
| `date`        | `string`                  | ✅       | 發布日期      | ISO 8601: YYYY-MM-DD                         |
| `slug`        | `string`                  | ✅       | URL slug      | 自動產生自檔名                               |
| `locale`      | `Locale`                  | ✅       | 語言代碼      | `"zh-TW" \| "en" \| "ja"`                    |
| `url`         | `string`                  | ✅       | 完整 URL 路徑 | 自動產生: `/{locale}/{contentType}/{slug}`   |

### TypeScript Interface

```typescript
export interface ArticleMetadata {
  title: string;
  description: string;
  imageType?: "static" | "generated";
  image?: string;
  ogImage?: OGImageConfig;
  date: string;
  slug: string;
  locale: Locale;
  url: string;
}
```

### Zod Schema

```typescript
export const articleMetadataSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200),
  imageType: z.enum(["static", "generated"]).default("static"),
  image: z
    .string()
    .regex(
      /^\/images\/(projects|notes)\/hero\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i
    )
    .optional(),
  ogImage: ogImageConfigSchema.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slug: z.string().min(1),
  locale: z.enum(["zh-TW", "en", "ja"]),
  url: z.string().url(),
});
```

### Relationships

- **Extends**: None (base entity)
- **Extended by**: ProjectMetadata, NoteMetadata
- **Used in**: ArticlePageData<T>

---

## E2: OGImageConfig (Nested Entity)

### Purpose

定義動態生成 OG Image 的配置，支援 CSS gradient / 純色 / 背景圖三種格式。

### Fields

| Field        | Type     | Required | Description    | Examples                        |
| ------------ | -------- | -------- | -------------- | ------------------------------- |
| `icon`       | `string` | ❌       | 圖示圖片路徑   | `"/image/notes/note-title.png"` |
| `background` | `string` | ❌       | 背景樣式       | 見下方 Format Support           |
| `className`  | `string` | ❌       | 自訂 CSS class | `"custom-og-style"`             |

### Background Format Support

| Format           | Example                                             | Detection Logic              |
| ---------------- | --------------------------------------------------- | ---------------------------- |
| **圖片路徑**     | `/images/projects/og-backgrounds/common/bg.jpg`     | `background.startsWith('/')` |
| **CSS Gradient** | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | 包含 `"gradient"`            |
| **Hex Color**    | `#667eea`, `#f3f4f6`                                | 符合 `#[0-9a-f]{3,8}`        |
| **RGB/RGBA**     | `rgb(102, 126, 234)`, `rgba(102, 126, 234, 0.8)`    | 以 `"rgb"` 開頭              |
| **HSL/HSLA**     | `hsl(235, 72%, 61%)`, `hsla(235, 72%, 61%, 0.8)`    | 以 `"hsl"` 開頭              |
| **Fallback**     | `undefined`                                         | 使用預設漸層                 |

### TypeScript Interface

```typescript
export interface OGImageConfig {
  icon?: string;
  background?: string;
  className?: string;
}
```

### Zod Schema

```typescript
export const ogImageConfigSchema = z.object({
  icon: z.string().optional(),
  background: z
    .string()
    .refine(
      (val) => {
        // 允許圖片路徑、CSS gradient、或純色
        if (val.startsWith("/")) return true; // 圖片路徑
        if (val.includes("gradient")) return true; // CSS gradient
        if (/^#[0-9a-f]{3,8}$/i.test(val)) return true; // Hex color
        if (val.startsWith("rgb")) return true; // RGB/RGBA
        if (val.startsWith("hsl")) return true; // HSL/HSLA
        return false;
      },
      { message: "background 必須為圖片路徑、CSS gradient、或有效的 CSS color" }
    )
    .optional(),
  className: z.string().optional(),
});
```

### Usage in OG Image Generation

```typescript
// opengraph-image.tsx
const background = article.ogImage?.background;
const isImagePath = background?.startsWith("/");
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const backgroundStyle = isImagePath
  ? `url(${baseUrl}${background})`
  : background || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
```

---

## E3: ProjectMetadata (Specific Entity)

### Purpose

專案特有的 metadata，繼承 ArticleMetadata 並新增 featured 和 order 欄位。

### Additional Fields

| Field      | Type      | Required | Description    | Validation                        |
| ---------- | --------- | -------- | -------------- | --------------------------------- |
| `featured` | `boolean` | ❌       | 是否為精選專案 | 預設: `false`                     |
| `order`    | `number`  | ❌       | 精選順序       | 1-99，僅當 `featured=true` 時使用 |

### TypeScript Interface

```typescript
export interface ProjectMetadata extends ArticleMetadata {
  featured?: boolean;
  order?: number;
}
```

### Zod Schema

```typescript
export const projectMetadataSchema = articleMetadataSchema.extend({
  featured: z.boolean().default(false),
  order: z.number().int().min(1).max(99).optional(),
});
```

### Constraints

- `order` 只在 `featured=true` 時有意義
- `order` 決定在 featured projects 區塊的顯示順序
- 最多顯示 5 個 featured projects (定義於 `MAX_FEATURED_PROJECTS`)

---

## E4: NoteMetadata (Specific Entity)

### Purpose

技術筆記特有的 metadata，繼承 ArticleMetadata 並新增 tags、category、featured 欄位。

### Additional Fields

| Field      | Type       | Required | Description    | Validation                                    |
| ---------- | ---------- | -------- | -------------- | --------------------------------------------- |
| `tags`     | `string[]` | ❌       | 標籤列表       | 每個標籤 1-20 字元                            |
| `category` | `string`   | ❌       | 分類           | 預定義分類（frontend, backend, devops, etc.） |
| `featured` | `boolean`  | ❌       | 是否為精選筆記 | 預設: `false`                                 |

### TypeScript Interface

```typescript
export interface NoteMetadata extends ArticleMetadata {
  tags?: string[];
  category?: string;
  featured?: boolean;
}
```

### Zod Schema

```typescript
export const noteMetadataSchema = articleMetadataSchema.extend({
  tags: z.array(z.string().min(1).max(20)).optional(),
  category: z
    .enum(["frontend", "backend", "devops", "testing", "design", "other"])
    .optional(),
  featured: z.boolean().default(false),
});
```

### Example Frontmatter

```yaml
---
title: "深入理解 TypeScript 泛型"
description: "從基礎到進階，掌握 TypeScript 泛型的核心概念"
imageType: generated
ogImage:
  icon: "/images/notes/typescript-generic.png"
  background: "linear-gradient(135deg, #007acc 0%, #0098ff 100%)"
date: 2025-10-19
featured: true
tags: ["typescript", "generics", "advanced"]
category: "frontend"
---
```

---

## E5: ArticlePageData (Generic Wrapper)

### Purpose

包裝 ArticleMetadata 並新增 MDX 內容，用於詳細頁面渲染。

### Fields

| Field     | Type                        | Description            |
| --------- | --------------------------- | ---------------------- |
| `...T`    | `T extends ArticleMetadata` | 繼承所有 metadata 欄位 |
| `content` | `React.ComponentType`       | 已編譯的 MDX 元件      |
| `body`    | `string`                    | 原始 MDX 內容（可選）  |

### TypeScript Interface

```typescript
export interface ArticlePageData<T extends ArticleMetadata = ArticleMetadata>
  extends T {
  content: React.ComponentType;
  body: string;
}

// Specific types
export type ProjectPageData = ArticlePageData<ProjectMetadata>;
export type NotePageData = ArticlePageData<NoteMetadata>;
```

### Usage Example

```typescript
// src/app/[lang]/projects/[slug]/page.tsx
const project: ProjectPageData = await getProject(locale, slug);

return <Article article={project} />;
```

---

## Data Flow

### Content → Data Layer → Components

```
MDX Files (content/projects/, content/notes/)
    ↓ (fumadocs-mdx postinstall)
@/.source (auto-generated collections)
    ↓ (createMDXSource + loader)
projectsSource, notesSource (fumadocs source API)
    ↓ (data layer functions)
ProjectMetadata[], NoteMetadata[]
    ↓ (components)
ArticleCard, Article (display)
```

### Data Layer Functions

```typescript
// src/lib/data/projects.ts
export async function getFeaturedProjects(
  locale: Locale
): Promise<ProjectMetadata[]>;
export async function getProject(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null>;
export async function getAllProjects(
  locale: Locale
): Promise<ProjectMetadata[]>;

// src/lib/data/notes.ts (新增)
export async function getFeaturedNotes(locale: Locale): Promise<NoteMetadata[]>;
export async function getNote(
  locale: Locale,
  slug: string
): Promise<NotePageData | null>;
export async function getAllNotes(locale: Locale): Promise<NoteMetadata[]>;
```

---

## Type Guards

### Purpose

提供執行時期的型別檢查，確保資料符合預期格式。

### Implementation

```typescript
// src/types/article.ts

export function isProjectMetadata(
  article: ArticleMetadata
): article is ProjectMetadata {
  return "featured" in article && "order" in article;
}

export function isNoteMetadata(
  article: ArticleMetadata
): article is NoteMetadata {
  return "tags" in article || "category" in article;
}

export function isFeaturedArticle(article: ArticleMetadata): boolean {
  return "featured" in article && article.featured === true;
}
```

### Usage Example

```typescript
function renderArticleCard(article: ArticleMetadata) {
  if (isProjectMetadata(article)) {
    // TypeScript 知道 article.order 存在
    console.log(article.order);
  }

  if (isNoteMetadata(article)) {
    // TypeScript 知道 article.tags 存在
    console.log(article.tags);
  }
}
```

---

## Migration Notes

### Existing Types → New Types

| Old Type               | New Type                     | Migration Action                        |
| ---------------------- | ---------------------------- | --------------------------------------- |
| `ProjectFrontmatter`   | `ProjectMetadata` (部分欄位) | 保留，用於 frontmatter 定義             |
| `ProjectMetadata` (舊) | `ProjectMetadata` (新)       | 新增 extends ArticleMetadata            |
| `ProjectPageData` (舊) | `ProjectPageData` (新)       | 改用 `ArticlePageData<ProjectMetadata>` |
| N/A                    | `NoteMetadata`               | 新增                                    |
| N/A                    | `ArticleMetadata`            | 新增基礎型別                            |

### Backward Compatibility

- 現有的 `ProjectMetadata` 欄位保持不變
- 只新增 base interface (`ArticleMetadata`)
- 所有現有程式碼仍可編譯通過

---

## Validation Strategy

### Build-time Validation

1. **TypeScript Compiler**: 檢查型別正確性
2. **Zod Schema**: fumadocs-mdx 在 postinstall 時驗證所有 MDX frontmatter
3. **ESLint**: 強制 explicit types (no implicit any)

### Runtime Validation

1. **Data Layer**: 使用 Zod parse() 驗證從 fumadocs 取得的資料
2. **Component Props**: 使用 TypeScript interface 確保 props 正確
3. **Type Guards**: 執行時期檢查物件型別

### Error Handling

```typescript
// src/lib/data/projects.ts
export async function getProject(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null> {
  const page = projectsSource.getPage([slug], locale);

  if (!page) {
    return null; // 404 handling
  }

  try {
    const validated = projectMetadataSchema.parse(page.data);
    return {
      ...validated,
      slug: page.slugs[0] || slug,
      locale,
      url: page.url,
      content: page.data.body,
      body: "",
    };
  } catch (error) {
    console.error(`Invalid project metadata for ${slug}:`, error);
    return null;
  }
}
```

---

## Summary

資料模型設計完成，包含：

- ✅ **型別階層**: ArticleMetadata → ProjectMetadata / NoteMetadata
- ✅ **Zod schemas**: 完整的 validation rules
- ✅ **OG Image 支援**: background 格式彈性化 (gradient/color/image)
- ✅ **Type guards**: 執行時期型別檢查
- ✅ **資料流**: MDX → fumadocs → data layer → components
- ✅ **向後相容**: 現有 ProjectMetadata 保持不變

**Next**: 定義元件契約 (contracts/)
