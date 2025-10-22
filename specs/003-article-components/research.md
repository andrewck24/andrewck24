# Research: Article 元件泛用化系統

**Date**: 2025-10-19
**Branch**: 003-article-components
**Status**: Complete

## Research Overview

針對 article 元件泛用化系統的技術決策進行研究，確保設計符合 TypeScript 最佳實踐、fumadocs 架構、以及 Next.js 15 的新特性。

---

## R1: ArticleMetadata 型別架構設計

### Decision

使用 **TypeScript interface inheritance** 建立型別階層，而非 generics。

### Rationale

1. **簡潔性**: Interface inheritance 比 generics 更直觀，符合 "explicit contracts" 原則
2. **型別推導**: fumadocs-mdx 回傳的資料結構已固定，不需要 generic type parameters
3. **可擴展性**: 未來新增其他 content type (如 blog, portfolio) 只需 extends ArticleMetadata
4. **Constitution 符合性**: Principle I 要求 explicit types，inheritance 比 conditional types 更明確

### Design Pattern

```typescript
// Base: 所有文章類型的共同屬性
export interface ArticleMetadata {
  title: string;
  description: string;
  imageType?: "static" | "generated";
  image?: string;
  ogImage?: {
    icon?: string;
    background?: string;  // 支援 gradient/color/image
    className?: string;
  };
  date: string;
  slug: string;
  locale: Locale;
  url: string;
}

// Specific: 專案特有屬性
export interface ProjectMetadata extends ArticleMetadata {
  featured?: boolean;
  order?: number;
}

// Specific: 筆記特有屬性
export interface NoteMetadata extends ArticleMetadata {
  tags?: string[];
  category?: string;
  featured?: boolean;
}

// Page data: 包含 MDX 內容
export interface ArticlePageData<T extends ArticleMetadata = ArticleMetadata> {
  // 使用 generic 支援 ProjectPageData, NotePageData
  ...T;
  content: React.ComponentType;
  body: string;
}
```

### Alternatives Considered

- **Option A: Union Types** (`type Article = Project | Note`)
  - ❌ 需要大量 type guards，增加複雜度
  - ❌ 新增 content type 需修改所有 union 定義

- **Option B: Generic Components** (`ArticleCard<T extends ArticleMetadata>`)
  - ❌ 元件使用時需明確指定 type parameter
  - ❌ 過度工程化，不符合專案規模

- **Option C: Interface Inheritance** (✅ Chosen)
  - ✅ 符合 OOP 繼承原則
  - ✅ 型別推導自動運作
  - ✅ 擴展性佳

---

## R2: fumadocs-mdx 泛用 Content Type 整合

### Decision

使用 **fumadocs `loader()` + `createMDXSource()`** 為 projects 和 notes 建立獨立的 source 實例。

### Rationale

1. **Separation of Concerns**: 不同 content type 有獨立的 meta.json 和排序邏輯
2. **fumadocs 設計模式**: 官方文件建議為不同內容類型建立獨立 source
3. **Type Safety**: projectsSource.getPage() 回傳 ProjectMetadata，notesSource.getPage() 回傳 NoteMetadata
4. **Flexibility**: 未來可為 notes 新增不同的 frontmatter schema
5. **i18n Support**: `loader()` 自動處理多語言路由和 page tree

### Implementation Pattern

```typescript
// src/lib/source.ts (現有檔案，已正確實作)
import { projects, projectsMeta, notes, meta } from "@/.source"; // fumadocs-mdx 自動生成
import { i18n } from "@/lib/i18n";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

// Projects source (已存在)
export const projectsSource = loader({
  baseUrl: "/projects",
  source: createMDXSource(projects, projectsMeta),
  i18n,
});

// Notes source (已存在)
export const notesSource = loader({
  baseUrl: "/notes",
  source: createMDXSource(notes, meta),
  i18n,
});
```

### Key Concepts

- **`@/.source`**: fumadocs-mdx 在 postinstall 時自動生成的 virtual module
- **`createMDXSource(content, meta)`**: 將 MDX collections 轉換為 fumadocs Source 格式
- **`loader({ baseUrl, source, i18n })`**: 生成統一的 source API（getPage, getPages, pageTree）
- **Meta files**: 可選的 meta.json 用於定義頁面順序和額外 metadata

### Data Layer Pattern

```typescript
// src/lib/data/projects.ts (現有實作)
export async function getFeaturedProjects(
  locale: Locale
): Promise<FeaturedProject[]> {
  const pages = projectsSource.getPages(locale);
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

// src/lib/data/notes.ts (新增)
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
```

### Alternatives Considered

- **Option A: Single Source with Type Field**
  - ❌ frontmatter 需新增 `type: "project" | "note"`
  - ❌ 所有文章混在同一個 content/ 目錄
  - ❌ meta.json 無法分別管理排序

- **Option B: Multiple Sources** (✅ Chosen - Already Implemented)
  - ✅ 清晰的目錄結構 (`content/projects/`, `content/notes/`)
  - ✅ 獨立的 schema validation
  - ✅ 符合 fumadocs 官方範例
  - ✅ 專案已採用此模式

---

## R3: View Transition API 保留策略

### Decision

保留現有的 **React `unstable_ViewTransition` wrapper** 和 `viewTransitionName` inline style。

### Rationale

1. **Next.js 15 支援度**: experimental.viewTransition flag 已啟用於 next.config
2. **向後相容**: React 19 仍將 View Transitions API 標記為 unstable
3. **元件重構影響**: ArticleImage 整合 ProjectDetailImage 時需保留相同的 transition name
4. **測試覆蓋**: 現有 E2E 測試已驗證 view transition 運作

### Implementation Pattern

```typescript
// src/components/article/image.tsx
import { unstable_ViewTransition as ViewTransition } from "react";

export function ArticleImage({ slug, ... }: ArticleImageProps) {
  return (
    <ViewTransition name={`article-image-${slug}`}>
      <div
        style={{ viewTransitionName: `article-image-${slug}` }}
        className="..."
      >
        {/* Image content */}
      </div>
    </ViewTransition>
  );
}
```

### Migration Notes

- **舊元件**: `project-image-${slug}` (ProjectDetailImage)
- **新元件**: `article-image-${slug}` (ArticleImage)
- **相容性**: 需同步更新 FeaturedProjectCard 使用相同的 transition name

### Alternatives Considered

- **Option A: Remove View Transitions**
  - ❌ 降低使用者體驗（無流暢轉場）
  - ❌ 違反 FR-006 保持既有功能需求

- **Option B: CSS-only View Transitions**
  - ❌ 無法控制 transition timing
  - ❌ 需複雜的 CSS `@view-transition` rules

- **Option C: Keep React Wrapper** (✅ Chosen)
  - ✅ 與 Next.js 15 整合良好
  - ✅ React 19 forward compatibility

---

## R4: OG Image 動態生成與 background 格式判斷

### Decision

在 `opengraph-image.tsx` 中使用 **字串前綴判斷** 來區分 background 格式。

### Rationale

1. **簡潔性**: 不需要複雜的正則表達式
2. **可靠性**: 圖片路徑必定以 `/` 開頭（絕對路徑）
3. **效能**: 字串前綴檢查比 regex 更快
4. **可維護性**: 邏輯清晰易懂

### Implementation Logic

```typescript
// src/app/[lang]/projects/[slug]/opengraph-image.tsx (現有實作參考)
export default async function Image({ params }: { params: Promise<{...}> }) {
  const article = await getProject(...);  // 或 getNote(...)
  const background = article.ogImage?.background;

  // 判斷邏輯
  const isImagePath = background?.startsWith('/');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const backgroundStyle = isImagePath
    ? `url(${baseUrl}${background})`  // 絕對 URL for ImageResponse
    : background || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";  // CSS value 或預設

  return new ImageResponse(
    <div style={{ background: backgroundStyle, ... }}>
      {article.ogImage?.icon}
    </div>,
    { width: 1200, height: 675 }
  );
}
```

### Format Support

| Input Format           | Detection         | Output                                   |
| ---------------------- | ----------------- | ---------------------------------------- |
| `/images/bg.jpg`       | `startsWith('/')` | `url(https://example.com/images/bg.jpg)` |
| `linear-gradient(...)` | 其他              | `linear-gradient(...)` (直接使用)        |
| `#667eea`              | 其他              | `#667eea` (直接使用)                     |
| `rgb(102, 126, 234)`   | 其他              | `rgb(102, 126, 234)` (直接使用)          |
| `undefined`            | fallback          | 預設漸層                                 |

### Validation in Zod Schema

```typescript
// src/types/article.ts
const articleImageSchema = z.object({
  icon: z.string().optional(),
  background: z
    .string()
    .refine((val) => {
      // 允許圖片路徑、CSS gradient、或純色
      return (
        val.startsWith("/") || // 圖片路徑
        val.includes("gradient") || // CSS gradient
        val.match(/^#[0-9a-f]{3,8}$/i) || // Hex color
        val.startsWith("rgb") || // RGB/RGBA
        val.startsWith("hsl")
      ); // HSL/HSLA
    }, "background 必須為圖片路徑、CSS gradient、或有效的 CSS color")
    .optional(),
  className: z.string().optional(),
});
```

### Alternatives Considered

- **Option A: Regex Detection**
  - ❌ 複雜度高 (`/^\/|gradient|#[0-9a-f]{3,8}$/i`)
  - ❌ 難以維護

- **Option B: Separate Fields** (`backgroundColor`, `backgroundGradient`, `backgroundImage`)
  - ❌ frontmatter 複雜化
  - ❌ 需要 exclusive validation (只能設定一個)

- **Option C: String Prefix Detection** (✅ Chosen)
  - ✅ 簡潔直觀
  - ✅ 符合 CSS background 語法
  - ✅ 易於測試

---

## R5: Notes 功能架構設計

### Decision

完全複製 projects 的架構模式，包含 featured notes、list view、detail view。

### Rationale

1. **一致性**: 使用者體驗一致（projects 和 notes 行為相同）
2. **程式碼重用**: 使用相同的 article 元件
3. **可維護性**: 相同的架構模式降低學習曲線
4. **未來擴展**: 為其他 content type (如 blog) 建立標準範本
5. **Source Already Exists**: `notesSource` 已在 src/lib/source.ts 中定義

### Route Structure

```plaintext
/[lang]/notes
├── page.tsx                 # Notes 列表頁
│   └── FeaturedNotes component (使用 ArticleCard)
└── [[...slug]]/
    ├── page.tsx             # Note 詳細頁 (使用 Article 元件)
    └── opengraph-image.tsx  # OG image 生成
```

### Data Layer Functions

```typescript
// src/lib/data/notes.ts (新增)
export async function getFeaturedNotes(locale: Locale): Promise<NoteMetadata[]>;
export async function getNote(
  locale: Locale,
  slug: string
): Promise<NotePageData | null>;
export async function getAllNotes(locale: Locale): Promise<NoteMetadata[]>;
export async function generateNoteStaticParams(): Promise<
  { locale: string; slug: string }[]
>;
```

### Frontmatter Schema

```yaml
---
title: "我的第一篇技術筆記"
description: "學習 TypeScript 泛型的心得"
imageType: generated
ogImage:
  icon: "/images/icons/typescript.png"
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
date: 2025-10-19
featured: true
tags: ["typescript", "generics"]
category: "frontend"
---
```

### Alternatives Considered

- **Option A: Minimal Notes (只有 detail view)**
  - ❌ 不符合 FR-007 要求（需要 featured/list/detail）
  - ❌ 使用者體驗不一致

- **Option B: Full-featured Notes** (✅ Chosen)
  - ✅ 符合規格需求
  - ✅ 最大化 article 元件重用
  - ✅ 為未來 content type 建立範本
  - ✅ `notesSource` 已存在，只需實作 data layer

---

## Implementation Checklist

基於以上研究，實作時需確認：

### Type System

- [ ] 建立 `src/types/article.ts` 定義 ArticleMetadata
- [ ] 更新 `src/types/project.ts` 使用 extends
- [ ] 建立 `src/types/note.ts` 定義 NoteMetadata
- [ ] 擴充 Zod schema 支援 background validation

### Components

- [ ] 建立 `src/components/article/image.tsx` (整合 GeneratedHero + ProjectDetailImage)
- [ ] 建立 `src/components/article/card.tsx` (泛用化 FeaturedProjectCard)
- [ ] 建立 `src/components/article/index.tsx` (泛用化 ProjectDetail)
- [ ] 保留 view-transition 功能

### Data Layer

- [ ] 建立 `src/lib/data/notes.ts`
- [ ] ✅ `src/lib/source.ts` 已有 notesSource (無需修改)

### Routes

- [ ] 更新 `src/app/[lang]/projects/[slug]/page.tsx` 使用 Article 元件
- [ ] 泛用化 `src/app/[lang]/projects/[slug]/opengraph-image.tsx`
- [ ] 建立 `src/app/[lang]/notes/page.tsx`
- [ ] 更新 `src/app/[lang]/notes/[[...slug]]/page.tsx` 使用 Article 元件
- [ ] 建立 `src/app/[lang]/notes/[[...slug]]/opengraph-image.tsx`

### Testing

- [ ] E2E tests for view transitions
- [ ] Component tests for background format detection
- [ ] Unit tests for ArticleImage, ArticleCard, Article

---

## Technical Risks & Mitigation

### Risk 1: View Transition API Instability

- **Risk**: React 19 的 `unstable_ViewTransition` 可能在未來版本改變 API
- **Mitigation**:
  - 將 ViewTransition wrapper 封裝為 custom hook
  - 監控 React 19 changelog
  - E2E 測試覆蓋 view transition 行為

### Risk 2: fumadocs-mdx Breaking Changes

- **Risk**: fumadocs-mdx 更新可能改變 source.getPage() 回傳結構
- **Mitigation**:
  - 使用 Zod schema validation 確保資料結構正確
  - 鎖定 fumadocs-mdx 版本於 package.json
  - 新增 contract tests 驗證 source API

### Risk 3: OG Image Generation Performance

- **Risk**: 動態生成 OG image 可能影響 build time
- **Mitigation**:
  - 使用 `revalidate: 3600` 快取生成結果
  - 監控 build time metrics
  - 考慮為常用圖片使用靜態 fallback

---

## Conclusion

所有技術決策已完成研究並確認可行性。型別架構使用 interface inheritance，fumadocs 使用 `loader()` + `createMDXSource()` 建立多個 source 實例（專案已正確實作），view transitions 保留 React wrapper，OG image 使用字串前綴判斷 background 格式，notes 功能複製 projects 架構模式。

**Next Steps**: 進入 Phase 1 - Design & Contracts，定義詳細的資料模型和元件契約。
