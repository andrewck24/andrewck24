# Technical Research: 作品集展示功能

**Feature**: 002-projects-1-home
**Date**: 2025-10-10
**Status**: Completed

## Overview

本文件記錄作品集展示功能的技術研究與決策過程，涵蓋 View Transition API、fumadocs-mdx 整合、UI 元件選擇、響應式布局策略以及手動排序機制。

---

## 1. View Transition API

### 1.1. Research Question

如何在 React 19.1.1 + Next.js 15.5.3 環境中實現流暢的頁面轉場效果？

### 1.2. Options Evaluated

| 選項                                       | 優點                                       | 缺點                                   | 評估        |
| ------------------------------------------ | ------------------------------------------ | -------------------------------------- | ----------- |
| **A. Next.js experimental.viewTransition** | React 整合優雅、無需升級 React、組件化 API | 實驗性功能，官方不建議 production 使用 | ✅ **採用** |
| **B. 原生 document.startViewTransition()** | 穩定、瀏覽器原生支援                       | 需手動處理 React 生命週期整合          | 備選方案    |
| **C. React Canary + ViewTransition**       | 完整 React 支援                            | 需升級到不穩定版本，風險高             | ❌ 拒絕     |
| **D. CSS transition**                      | 最穩定                                     | 功能有限，無法實現跨頁面轉場           | ❌ 拒絕     |

### 1.3. Decision: Next.js experimental.viewTransition ✅

**Rationale**:

1. **React 整合**: `<ViewTransition>` 組件提供宣告式 API，符合 React 設計哲學
2. **無需升級**: 保持 React 19.1.1 穩定版本
3. **自動降級**: React 自動處理瀏覽器相容性，無需手動偵測
4. **作品集定位**: 展示前瞻技術符合個人作品集的目標

**Implementation**:

```js
// next.config.mjs
export default {
  experimental: {
    viewTransition: true,
  },
};
```

```jsx
// src/components/projects/view-transition.tsx
import { unstable_ViewTransition as ViewTransition } from 'react';

export function ProjectLink({ children, href }: Props) {
  return (
    <ViewTransition>
      <Link href={href}>{children}</Link>
    </ViewTransition>
  );
}
```

**Trade-offs Acknowledged**:

- 實驗性功能，API 可能變更
- Next.js 官方標記為 "not recommended for production"
- 接受此風險，因作品集非關鍵業務應用

**Browser Support**:

- Chrome 111+, Edge 111+ (原生支援)
- 其他瀏覽器自動降級為直接跳轉
- 使用 `@media (prefers-reduced-motion)` 尊重使用者偏好

**References**:

- [Next.js viewTransition](https://nextjs.org/docs/app/api-reference/next-config-js/viewTransition)
- [React PR #31975](https://github.com/facebook/react/pull/31975)
- [View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

---

## 2. fumadocs-mdx Integration Pattern

### 2.1. Research Question

如何整合 projects collection 到現有的 fumadocs-mdx 架構？

### 2.2. Existing Patterns Analyzed

專案中已有兩個 fumadocs-mdx collections:

```typescript
// source.config.ts
export const { docs: notes, meta } = defineDocs({
  dir: "content/notes",
});

export const { docs: about } = defineDocs({
  dir: "content/about",
});

// src/lib/source.ts
export const notesSource = loader({
  baseUrl: "/notes",
  source: createMDXSource(notes, meta),
  i18n,
});

export const aboutSource = loader({
  baseUrl: "/about",
  source: createMDXSource(about),
  i18n,
});
```

### 2.3. Decision: 複製現有模式 ✅

**Implementation**:

```typescript
// source.config.ts
export const { docs: projects } = defineDocs({
  dir: "content/projects",
  docs: {
    schema: frontmatterSchema.extend({
      featured: z.boolean().optional(),
      order: z.number().optional(),
    }),
  },
});

// src/lib/source.ts
export const projectsSource = loader({
  baseUrl: "/projects",
  source: createMDXSource(projects),
  i18n,
});
```

**Directory Structure**:

```plaintext
content/projects/
├── zh-TW/
│   ├── meta.json            # 排序設定
│   ├── project-a.mdx
│   └── project-b.mdx
├── en/
│   └── meta.json
└── ja/
    └── meta.json
```

**Frontmatter Schema**:

```yaml
---
title: 專案標題
description: 簡短描述（最多 200 字）
image: /images/projects/hero.jpg
date: 2024-10-10
featured: true
order: 1
---
```

**Rationale**:

- 保持架構一致性
- 減少學習曲線
- 重用現有 i18n 設定
- 遵循專案既有慣例

---

## 3. UI Component Selection

### 3.1. Research Question

如何選擇合適的 UI 組件來建構作品集卡片？

### 3.2. Priority Hierarchy (User Specified)

1. **shadcn/ui** (第一優先)
2. **fumadocs components** (第二優先)
3. **自訂元件** (最後手段)

### 3.3. Selected Components

| 元件               | 來源                 | 用途                      |
| ------------------ | -------------------- | ------------------------- |
| `Card`             | shadcn/ui            | 作品集卡片容器            |
| `Button`           | shadcn/ui            | CTA 按鈕                  |
| `Badge`            | shadcn/ui            | 標籤（技術棧）            |
| `ViewTransition`   | React (experimental) | 轉場效果封裝              |
| 自訂 `ProjectCard` | custom               | 整合上述組件 + 響應式邏輯 |

### 3.4. shadcn/ui Card Anatomy

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <Image src={image} alt={title} /> {/* Next.js Image */}
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>{/* 技術標籤 */}</CardContent>
</Card>;
```

**Rationale**:

- shadcn/ui 已安裝於專案
- 提供無頭 UI，完全可自訂樣式
- 符合使用者指定的優先順序
- 與 Tailwind CSS 深度整合

---

## 4. Mobile Layout Strategy

### 4.1. Research Question

如何實現規格要求的「首張圖上文下，其餘圖左文右」排版？

### 4.2. Responsive Breakpoints

- **Mobile** (<768px): 單欄排版
  - 首張卡片: `flex-col` + `aspect-video`
  - 其餘卡片: `flex-row` + `aspect-square`
- **Tablet+** (≥768px): Grid layout
  - 統一為 2-3 欄網格

### 4.3. Implementation Pattern

```tsx
// src/components/projects/featured-projects.tsx
const FeaturedProjects = ({ projects }: Props) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          variant={index === 0 ? "hero" : "compact"}
        />
      ))}
    </div>
  );
};

// src/components/projects/project-card.tsx
const ProjectCard = ({ project, variant }: Props) => {
  const isHero = variant === "hero";

  return (
    <Card
      className={cn(
        "flex",
        isHero
          ? "flex-col md:flex-row" // 首張：mobile 圖上文下，desktop 圖左文右
          : "flex-row md:flex-col" // 其餘：mobile 圖左文右，desktop 圖上文下
      )}
    >
      <Image
        src={project.image}
        className={cn(isHero ? "aspect-video" : "aspect-square w-24 md:w-full")}
      />
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
```

### 4.4. Touch Target Compliance

- 所有可點擊區域 ≥44px (遵循 CLAUDE.md Web Interface Guidelines)
- 使用 `touch-action: manipulation` 防止雙擊縮放

**Rationale**:

- 首張卡片給予視覺優先級（hero 圖片）
- 其餘卡片緊湊排版，節省垂直空間
- 響應式設計符合 Mobile-first 原則
- 遵循現有設計系統慣例

---

## 5. 手動排序機制

### 5.1. Research Question

如何實現手動控制精選作品的顯示順序？

### 5.2. Options Evaluated

| 選項                          | 優點                        | 缺點            | 評估        |
| ----------------------------- | --------------------------- | --------------- | ----------- |
| **A. meta.json pages 陣列**   | fumadocs 原生支援、零程式碼 | 需手動編輯 JSON | ✅ **採用** |
| **B. frontmatter order 欄位** | 更直觀                      | 需額外排序邏輯  | 備選        |
| **C. 檔名前綴數字**           | 簡單明瞭                    | 破壞 URL 語意   | ❌ 拒絕     |

### 5.3. Decision: meta.json pages 陣列 ✅

**Implementation**:

```json
// content/projects/zh-TW/meta.json
{
  "title": "專案作品集",
  "pages": [
    "andrewck24-portfolio",
    "ai-chatbot-platform",
    "e-commerce-optimization",
    "terminal-animation-lib",
    "devops-automation"
  ]
}
```

**fumadocs-mdx Behavior**:

- `pages` 陣列定義顯示順序
- `projectsSource.getPages()` 自動按此順序返回
- 無需額外排序邏輯

**Filtering Featured Projects**:

```typescript
// src/lib/data/projects.ts
export async function getFeaturedProjects(locale: Locale) {
  const allProjects = projectsSource.getPages();

  return allProjects
    .filter((p) => p.locale === locale)
    .filter((p) => p.data.featured === true)
    .slice(0, 5); // 最多 5 個
}
```

**Rationale**:

- 利用 fumadocs-mdx 既有功能
- 無需自訂排序邏輯
- meta.json 集中管理，易於調整
- 與 notes/about 排序機制一致

---

## 6. Additional Findings

### 6.1. Performance Considerations

**Image Optimization**:

- 使用 Next.js `<Image>` component
- 設定明確 width/height 防止 CLS
- `loading="lazy"` for below-the-fold images
- `priority` for hero image (首張卡片)

```tsx
<Image
  src={project.image}
  alt={project.title}
  width={800}
  height={450}
  priority={index === 0}
  loading={index === 0 ? undefined : "lazy"}
  className="aspect-video object-cover"
/>
```

**Code Splitting**:

- ViewTransition 組件可動態載入（若未來需要）
- 目前因檔案小且為首頁關鍵功能，建議直接引入

### 6.2. Accessibility

**ARIA Labels**:

```tsx
<Card aria-label={`專案：${project.title}`}>
  <Link href={project.url} aria-label={`查看 ${project.title} 詳細內容`}>
    {/* ... */}
  </Link>
</Card>
```

**Keyboard Navigation**:

- 所有卡片可用 Tab 鍵聚焦
- Enter/Space 觸發導航
- `focus-visible` 提供明顯焦點環

**Reduced Motion**:

```css
@media (prefers-reduced-motion: reduce) {
  .view-transition {
    transition: none !important;
  }
}
```

### 6.3. Testing Strategy

**E2E Tests** (Playwright):

- 首頁顯示最多 5 張卡片
- 卡片點擊導航正確
- 支援/不支援瀏覽器的降級測試

**Component Tests** (React Testing Library):

- ProjectCard 渲染測試
- Hero vs Compact variant 測試
- 圖片載入失敗 fallback

**Visual Regression**:

- 使用 Playwright screenshots
- 驗證響應式布局在不同視窗尺寸

---

## Summary

| 決策領域        | 最終方案                            | 關鍵理由                      |
| --------------- | ----------------------------------- | ----------------------------- |
| View Transition | Next.js experimental.viewTransition | React 整合優雅、無需升級版本  |
| MDX 整合        | 複製 notes/about 模式               | 保持架構一致性                |
| UI 組件         | shadcn/ui Card + 自訂 wrapper       | 符合優先順序、高度可自訂      |
| 行動排版        | 首張 flex-col、其餘 flex-row        | 視覺優先級 + 空間最佳化       |
| 排序機制        | meta.json pages 陣列                | fumadocs 原生支援、零額外邏輯 |

**Risk Mitigation**:

- 實驗性 API 風險：保留原生 API 備選方案
- 瀏覽器相容性：自動降級機制
- 效能風險：Image 最佳化 + lazy loading

**Next Steps**:

- Phase 1: 定義詳細資料模型（data-model.md）
- Phase 1: 建立 TypeScript contracts（contracts/）
- Phase 1: 撰寫 Quickstart 驗證指南（quickstart.md）

---

**Research Completed**: 2025-10-10
**Reviewed By**: Claude Code
**Status**: ✅ Ready for Phase 1
