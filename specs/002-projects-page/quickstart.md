# Quickstart Guide

## 概述

本文件提供 Projects 功能的快速驗證指南，包含測試場景、使用範例和常見問題排除。

---

## 1. 快速驗證清單

### Phase 1: 首頁精選專案 + 專案詳細頁

- [ ] **FR-001**: 首頁顯示 3-5 個精選專案卡片
- [ ] **FR-002**: 卡片包含圖片、標題、描述
- [ ] **FR-003**: 點擊卡片進入專案詳細頁
- [ ] **FR-004**: 使用 View Transition（圖片轉場）
- [ ] **FR-005**: 詳細頁包含四個章節（問題 → 思考 → 方案 → 影響）
- [ ] **FR-006**: 專案內容使用 MDX 格式
- [ ] **FR-007**: 手動控制精選專案排序（meta.json）
- [ ] **FR-008**: 首頁卡片排版：桌面 3 欄、行動單欄
- [ ] **FR-009**: 行動端首張卡片圖上文下、其他圖左文右
- [ ] **FR-010**: 支援深色模式
- [ ] **FR-011**: 響應式設計（手機/平板/桌面）
- [ ] **FR-012**: 內容以 zh-TW 為主，逐步支援 en, ja
- [ ] **FR-013**: 無障礙設計（鍵盤導航、Screen reader）
- [ ] **FR-014**: SEO 優化（meta tags, semantic HTML）

---

## 2. 測試場景

### 2.1 首頁精選專案顯示

**前置條件**:

- 至少有 3 個 MDX 專案檔案，且 `featured: true`
- `meta.json` 已設定 pages 陣列順序

**測試步驟**:

1. 訪問首頁：`http://localhost:3000/zh-TW`
2. 確認精選專案區塊存在
3. 確認顯示 3-5 張卡片（依照 meta.json 順序）
4. 確認每張卡片包含：
   - 圖片（使用 Next.js Image 優化）
   - 標題（≤100 字元）
   - 描述（≤200 字元）

**預期結果**:

- 卡片依照 meta.json 的 pages 陣列順序顯示
- 首張卡片的圖片使用 `priority={true}`（LCP 優化）
- 桌面：3 欄網格佈局
- 行動：單欄垂直佈局

**測試資料範例**:

```yaml
# content/projects/zh-TW/portfolio-website.mdx
---
title: 個人作品集網站
description: 使用 Next.js 15、fumadocs、shadcn/ui 建構的響應式個人作品集
image: /images/projects/portfolio-hero.jpg
date: 2024-10-10
featured: true
order: 1
---
```

---

### 2.2 View Transition 轉場效果

**前置條件**:

- 瀏覽器支援 View Transitions API（Chrome 111+, Edge 111+）
- `next.config.mjs` 已啟用 `experimental.viewTransition`

**測試步驟**:

1. 訪問首頁：`http://localhost:3000/zh-TW`
2. 點擊任一精選專案卡片
3. 觀察轉場動畫

**預期結果**:

- 卡片圖片平滑轉場為詳細頁的首圖
- 轉場時間約 200-300ms
- 不支援的瀏覽器降級為直接跳轉（無錯誤）

**降級測試**:

- Firefox（不支援 View Transitions）：直接導航，無轉場
- 關閉 JavaScript：正常 `<a>` 連結導航

---

### 2.3 專案詳細頁內容顯示

**前置條件**:

- MDX 檔案包含完整的四個章節

**測試步驟**:

1. 訪問專案詳細頁：`http://localhost:3000/zh-TW/projects/portfolio-website`
2. 確認頁面包含：
   - 專案標題
   - 專案首圖
   - 內容章節（h2 標題）
3. 滾動頁面，確認排版正確

**預期結果**:

```markdown
# {專案標題}

![專案首圖]

## 要解決的問題

（內容）

## 思考過程

（內容）

## 採用方案

（內容）

## 產生的影響

（內容）
```

**錯誤處理測試**:

- 訪問不存在的 slug：應顯示 404 頁面
- 訪問不支援的語言：應重定向到預設語言（zh-TW）

---

### 2.4 行動端卡片佈局

**前置條件**:

- 至少有 3 個精選專案

**測試步驟**:

1. 使用手機或開啟 DevTools 模擬器（iPhone 14 Pro, 390x844）
2. 訪問首頁：`http://localhost:3000/zh-TW`
3. 確認卡片佈局

**預期結果**:

- **首張卡片**:
  - `flex-col`（垂直佈局）
  - 圖片在上（`aspect-video` 16:9）
  - 文字在下
  - 高度較高（例如 h-96）

- **其他卡片**:
  - `flex-row`（水平佈局）
  - 圖片在左（`aspect-square` 1:1）
  - 文字在右
  - 高度一致（例如 h-40）

**視覺稽核**:

```
┌─────────────────┐
│  首張卡片圖片    │  ← aspect-video (16:9)
│                 │
├─────────────────┤
│  標題 + 描述     │
└─────────────────┘

┌───────┬─────────┐
│ 圖片  │ 標題    │  ← aspect-square (1:1)
│       │ 描述    │
└───────┴─────────┘

┌───────┬─────────┐
│ 圖片  │ 標題    │
│       │ 描述    │
└───────┴─────────┘
```

---

### 2.5 多語言支援

**前置條件**:

- 專案有 zh-TW, en, ja 三個語言版本
- `meta.json` 在各語言目錄下皆已設定

**測試步驟**:

1. 訪問 `/zh-TW` → 確認顯示繁體中文專案
2. 訪問 `/en` → 確認顯示英文專案
3. 訪問 `/ja` → 確認顯示日文專案
4. 切換語言選單，確認正確導航

**預期結果**:

- 各語言專案獨立
- URL 正確：`/[locale]/projects/[slug]`
- meta.json 控制各語言的排序

---

### 2.6 手動排序控制

**前置條件**:

- 有 5+ 個 featured 專案
- `meta.json` 設定特定順序

**測試步驟**:

1. 編輯 `content/projects/zh-TW/meta.json`:

```json
{
  "pages": ["project-c", "project-a", "project-b"]
}
```

2. 重新啟動 dev server
3. 訪問首頁

**預期結果**:

- 專案按照 meta.json 的順序顯示
- 即使 project-a 的 `order: 1`，仍以 meta.json 為準

---

## 3. 使用範例

### 3.1 建立新專案

**步驟**:

1. 建立 MDX 檔案:

```bash
touch content/projects/zh-TW/my-new-project.mdx
```

2. 填寫 frontmatter 和內容:

```markdown
---
title: 我的新專案
description: 這是一個很酷的專案，解決了重要問題
image: /images/projects/my-new-project-hero.jpg
date: 2024-10-15
featured: true
order: 10
---

## 要解決的問題

（內容）

## 思考過程

（內容）

## 採用方案

（內容）

## 產生的影響

（內容）
```

3. 更新 `meta.json`:

```json
{
  "pages": [
    "portfolio-website",
    "my-new-project", // ← 加入新專案
    "task-manager"
  ]
}
```

4. 重新啟動 dev server，驗證顯示

---

### 3.2 調整精選專案排序

**步驟**:

1. 編輯 `content/projects/zh-TW/meta.json`:

```json
{
  "pages": [
    "project-b", // ← 原本第二
    "project-a", // ← 原本第一
    "project-c"
  ]
}
```

2. 重新啟動 dev server
3. 確認首頁專案順序已更新

---

### 3.3 加入非精選專案

**步驟**:

1. 建立 MDX 檔案，但 `featured: false`:

```yaml
---
title: 內部工具專案
description: 僅供記錄，不顯示在首頁
image: /images/projects/internal-tool.jpg
date: 2024-09-01
featured: false
---
```

2. 專案不會出現在首頁，但可直接訪問：

```
/zh-TW/projects/internal-tool
```

---

## 4. 開發環境設定

### 4.1 啟用 View Transition

編輯 `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true, // ← 啟用實驗性功能
  },
};

export default nextConfig;
```

### 4.2 設定 fumadocs-mdx

編輯 `source.config.ts`:

```typescript
import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const { docs: projects } = defineDocs({
  dir: "content/projects",
  docs: {
    schema: frontmatterSchema.extend({
      featured: z.boolean().optional(),
      order: z.number().optional(),
    }),
  },
});

export default defineConfig({
  collections: [projects],
});
```

### 4.3 建立 source loader

編輯 `src/lib/source.ts`:

```typescript
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { projects, projectsMeta } from "@/source.config";

export const projectsSource = loader({
  baseUrl: "/projects",
  source: createMDXSource(projects, projectsMeta),
  i18n: true,
});
```

---

## 5. 常見問題排除

### 5.1 精選專案沒有顯示

**可能原因**:

1. MDX frontmatter 未設定 `featured: true`
2. meta.json 未包含該專案
3. 圖片路徑錯誤

**解決方式**:

1. 檢查 frontmatter:

```yaml
featured: true # ← 確認存在
```

2. 檢查 meta.json:

```json
{
  "pages": ["project-slug"] // ← 確認包含
}
```

3. 檢查圖片路徑:

```bash
ls public/images/projects/project-hero.jpg  # ← 確認檔案存在
```

---

### 5.2 View Transition 沒有作用

**可能原因**:

1. 瀏覽器不支援（Safari, Firefox）
2. `next.config.mjs` 未啟用 `experimental.viewTransition`
3. React 版本過舊

**解決方式**:

1. 使用 Chrome 111+ 或 Edge 111+ 測試
2. 確認 `next.config.mjs`:

```js
experimental: {
  viewTransition: true;
}
```

3. 確認 package.json:

```json
"react": "^19.1.1"
```

**降級確認**:

- Firefox 應直接導航（無錯誤）
- 檢查 Console 是否有錯誤訊息

---

### 5.3 行動端卡片佈局錯誤

**可能原因**:

- Tailwind CSS 斷點錯誤
- `variant` prop 未正確傳遞

**解決方式**:

確認 `FeaturedProjectCard` 的使用:

```tsx
{
  /* 首張卡片 */
}
<FeaturedProjectCard
  project={projects[0]}
  variant="hero" // ← 圖上文下
  priority
/>;

{
  /* 其他卡片 */
}
{
  projects.slice(1).map((project) => (
    <FeaturedProjectCard
      key={project.slug}
      project={project}
      variant="compact" // ← 圖左文右
    />
  ));
}
```

---

### 5.4 專案詳細頁顯示 404

**可能原因**:

1. slug 錯誤（檔名不一致）
2. `generateStaticParams` 未包含該專案
3. 專案檔案不存在

**解決方式**:

1. 確認 slug 與檔名一致:

```
content/projects/zh-TW/portfolio-website.mdx  ← 檔名
/zh-TW/projects/portfolio-website             ← URL
```

2. 檢查 `generateStaticParams` 的回傳:

```typescript
console.log(await generateProjectStaticParams());
// 應包含 { locale: "zh-TW", slug: "portfolio-website" }
```

3. 確認檔案存在:

```bash
ls content/projects/zh-TW/portfolio-website.mdx
```

---

### 5.5 圖片無法顯示

**可能原因**:

1. 圖片路徑錯誤
2. 圖片檔案不存在
3. Next.js Image 配置錯誤

**解決方式**:

1. 確認路徑格式:

```yaml
image: /images/projects/hero.jpg  # ← 正確（絕對路徑）
image: images/projects/hero.jpg   # ← 錯誤（相對路徑）
```

2. 確認檔案存在:

```bash
ls public/images/projects/hero.jpg
```

3. 確認 Next.js Image domains（如果使用外部圖片）:

```js
// next.config.mjs
images: {
  domains: ["example.com"],
}
```

---

## 6. 性能檢查清單

- [ ] 首張精選專案圖片使用 `priority={true}`
- [ ] 其他圖片使用 lazy loading（預設）
- [ ] 圖片尺寸已指定（避免 CLS）
- [ ] 使用 Next.js Image 優化
- [ ] 圖片格式：AVIF > WebP > JPEG
- [ ] 所有專案頁面使用 SSG（Static Site Generation）
- [ ] Lighthouse Performance 分數 > 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

---

## 7. 無障礙檢查清單

- [ ] 卡片可使用鍵盤導航（Tab, Enter）
- [ ] 圖片有 `alt` 屬性
- [ ] 色彩對比符合 WCAG 2.1 AA（4.5:1）
- [ ] Screen reader 可正確朗讀
- [ ] 支援 `prefers-reduced-motion`（轉場動畫可關閉）
- [ ] Focus 可見（`:focus-visible` 樣式）
- [ ] 語意化 HTML（`<article>`, `<h1>`, `<section>`）

---

## 8. 下一步

完成 Phase 1 驗證後，可執行 `/tasks` 指令產生詳細的實作任務清單。

**預期工作流程**:

1. ✅ `/specify` - 建立 spec.md
2. ✅ `/clarify` - 澄清需求
3. ✅ `/plan` - 建立 plan.md（目前階段）
4. ⏭️ `/tasks` - 產生 tasks.md
5. ⏭️ `/implement` - 執行實作
