# API Contracts

## 概述

本文件定義 Projects 功能的「API」契約。由於使用 Next.js App Router 的 Server Components，這裡的「API」指的是：

1. **頁面組件的 Props 介面**（等同於傳統 API 的 Response）
2. **資料獲取函式的簽名**（等同於傳統 API 的 Endpoint）
3. **URL 路由結構**（等同於傳統 API 的 Routes）

---

## 1. URL Routes

### 1.1 首頁（Featured Projects）

```
GET /[locale]
```

**描述**：首頁顯示 3-5 個精選專案

**URL Parameters**:

- `locale`: `zh-TW` | `en` | `ja`

**範例**:

```
/zh-TW
/en
/ja
```

---

### 1.2 專案列表頁

```
GET /[locale]/projects
```

**描述**：顯示所有專案列表（未來功能，Phase 1 不實作）

**URL Parameters**:

- `locale`: `zh-TW` | `en` | `ja`

**範例**:

```
/zh-TW/projects
/en/projects
/ja/projects
```

---

### 1.3 專案詳細頁

```
GET /[locale]/projects/[slug]
```

**描述**：顯示單一專案的詳細內容

**URL Parameters**:

- `locale`: `zh-TW` | `en` | `ja`
- `slug`: 專案 slug（檔名不含副檔名）

**範例**:

```
/zh-TW/projects/portfolio-website
/en/projects/portfolio-website
/ja/projects/portfolio-website
```

---

## 2. Data Fetching Functions

### 2.1 `getFeaturedProjects()`

**簽名**:

```typescript
async function getFeaturedProjects(locale: Locale): Promise<FeaturedProject[]>;
```

**描述**：取得指定語言的精選專案（featured: true），依照 meta.json 的 pages 陣列順序，最多回傳 5 個

**參數**:

- `locale`: 語言代碼

**回傳值**:

- `FeaturedProject[]`: 精選專案陣列（已排序，最多 5 個）

**範例**:

```typescript
const projects = await getFeaturedProjects("zh-TW");
// => [
//   { slug: "portfolio-website", title: "個人作品集網站", featured: true, order: 1, ... },
//   { slug: "task-manager", title: "任務管理系統", featured: true, order: 2, ... },
// ]
```

**錯誤處理**:

- 若該語言無精選專案，回傳空陣列 `[]`
- 若 meta.json 不存在，使用預設排序（按 date 降序）

---

### 2.2 `getAllProjects()`

**簽名**:

```typescript
async function getAllProjects(locale: Locale): Promise<ProjectMetadata[]>;
```

**描述**：取得指定語言的所有專案

**參數**:

- `locale`: 語言代碼

**回傳值**:

- `ProjectMetadata[]`: 專案陣列（按 date 降序）

**範例**:

```typescript
const projects = await getAllProjects("zh-TW");
// => [
//   { slug: "portfolio-website", title: "個人作品集網站", ... },
//   { slug: "task-manager", title: "任務管理系統", ... },
// ]
```

**錯誤處理**:

- 若該語言無專案，回傳空陣列 `[]`

---

### 2.3 `getProjectBySlug()`

**簽名**:

```typescript
async function getProjectBySlug(
  locale: Locale,
  slug: string
): Promise<ProjectPageData | null>;
```

**描述**：取得指定 slug 的專案詳細資料（包含 MDX 內容）

**參數**:

- `locale`: 語言代碼
- `slug`: 專案 slug

**回傳值**:

- `ProjectPageData`: 專案詳細資料（含 content 和 body）
- `null`: 專案不存在

**範例**:

```typescript
const project = await getProjectBySlug("zh-TW", "portfolio-website");
// => {
//   slug: "portfolio-website",
//   title: "個人作品集網站",
//   content: [Function: MDXContent],
//   body: "## 要解決的問題\n\n...",
//   ...
// }
```

**錯誤處理**:

- 若專案不存在，回傳 `null`
- 呼叫端應處理 `null` 情況並顯示 404 頁面

---

### 2.4 `generateProjectStaticParams()`

**簽名**:

```typescript
async function generateProjectStaticParams(): Promise<
  { locale: string; slug: string }[]
>;
```

**描述**：產生所有專案的靜態路徑參數（用於 Next.js `generateStaticParams`）

**回傳值**:

- 包含所有專案的 `{ locale, slug }` 組合的陣列

**範例**:

```typescript
const params = await generateProjectStaticParams();
// => [
//   { locale: "zh-TW", slug: "portfolio-website" },
//   { locale: "zh-TW", slug: "task-manager" },
//   { locale: "en", slug: "portfolio-website" },
//   { locale: "en", slug: "task-manager" },
// ]
```

---

## 3. Component Props Interfaces

### 3.1 HomePage Props

**路徑**: `app/[locale]/page.tsx`

```typescript
interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}
```

**資料獲取**:

```typescript
const { locale } = await params;
const featuredProjects = await getFeaturedProjects(locale as Locale);
```

---

### 3.2 ProjectPage Props

**路徑**: `app/[locale]/projects/[slug]/page.tsx`

```typescript
interface ProjectPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}
```

**資料獲取**:

```typescript
const { locale, slug } = await params;
const project = await getProjectBySlug(locale as Locale, slug);

if (!project) {
  notFound();
}
```

---

### 3.3 FeaturedProjectCard Props

**元件**: `components/projects/featured-project-card.tsx`

```typescript
interface FeaturedProjectCardProps {
  project: FeaturedProject;
  priority?: boolean; // Next/Image priority flag
  variant?: "hero" | "compact"; // 首張為 hero，其他為 compact
}
```

**使用範例**:

```tsx
<FeaturedProjectCard
  project={projects[0]}
  priority={true}
  variant="hero"
/>

<FeaturedProjectCard
  project={projects[1]}
  variant="compact"
/>
```

---

### 3.4 ProjectCard Props

**元件**: `components/projects/project-card.tsx`（未來功能）

```typescript
interface ProjectCardProps {
  project: ProjectMetadata;
  priority?: boolean;
}
```

---

### 3.5 ProjectContent Props

**元件**: `components/projects/project-content.tsx`

```typescript
interface ProjectContentProps {
  project: ProjectPageData;
}
```

**使用範例**:

```tsx
<ProjectContent project={project} />
```

內部會渲染：

```tsx
<project.content />
```

---

## 4. Error Handling

### 4.1 專案不存在（404）

**情境**：訪問 `/[locale]/projects/[slug]`，但 slug 不存在

**處理方式**:

```typescript
const project = await getProjectBySlug(locale, slug);

if (!project) {
  notFound(); // Next.js 內建函式，顯示 404 頁面
}
```

---

### 4.2 語言不存在（404）

**情境**：訪問 `/xx/projects/foo`，但 `xx` 不是支援的語言

**處理方式**：Next.js middleware 應在路由層級處理，重定向到預設語言

---

### 4.3 Frontmatter 驗證錯誤

**情境**：MDX 檔案的 frontmatter 格式錯誤

**處理方式**：

1. 開發環境：拋出錯誤，顯示詳細驗證訊息
2. 生產環境：記錄錯誤，跳過該檔案，繼續處理其他專案

```typescript
try {
  projectFrontmatterSchema.parse(frontmatter);
} catch (error) {
  console.error(`Invalid frontmatter in ${filePath}:`, error);
  if (process.env.NODE_ENV === "development") {
    throw error;
  }
  // 生產環境跳過該檔案
  return null;
}
```

---

### 4.4 圖片不存在

**情境**：frontmatter 中的 `image` 路徑指向不存在的檔案

**處理方式**：

1. 開發環境：顯示警告訊息
2. 使用 Next.js Image 的 fallback 機制或顯示 placeholder

```typescript
<Image
  src={project.image}
  alt={project.title}
  onError={(e) => {
    e.currentTarget.src = "/images/placeholder-project.jpg";
  }}
/>
```

---

## 5. Performance Considerations

### 5.1 Static Generation

所有專案頁面皆使用 Static Site Generation (SSG)：

```typescript
// app/[locale]/projects/[slug]/page.tsx
export const generateStaticParams = generateProjectStaticParams;
```

### 5.2 Image Optimization

首張精選專案卡片的圖片使用 `priority={true}`：

```tsx
<FeaturedProjectCard
  project={featuredProjects[0]}
  priority={true} // LCP 優化
/>
```

### 5.3 Incremental Static Regeneration (ISR)

Phase 1 不使用 ISR，所有內容在 build time 產生。未來可加入：

```typescript
export const revalidate = 3600; // 每小時重新驗證
```

---

## 6. Type Safety

所有 API 函式皆使用 TypeScript strict mode：

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

確保：

- 無 `any` 型別
- 所有 nullable 值皆明確處理
- Zod schema 驗證所有外部資料（MDX frontmatter）
