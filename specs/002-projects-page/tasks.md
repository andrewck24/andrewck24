# Tasks: 作品集展示功能 (Projects Portfolio)

**Feature**: 002-projects-page | **Branch**: `002-projects-page` | **Date**: 2025-10-10
**Input**: Design documents from `/Users/andrew/projects/andrewck24/specs/002-projects-page/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## Execution Flow (main)

```plaintext
1. Load plan.md from feature directory
   → SUCCESS: Loaded implementation plan
   → Tech stack: TypeScript 5.9, React 19.1.1, Next.js 15.5.3 (experimental.viewTransition)
   → Dependencies: fumadocs-mdx 12.0.1, shadcn/ui, motion 12.23.22
2. Load design documents:
   → data-model.md: Entities: Project, FeaturedProject
   → contracts/project-schema.ts: TypeScript interfaces & Zod schemas
   → contracts/api-contracts.md: Page components & data fetching functions
   → quickstart.md: 6 test scenarios extracted
3. Generate tasks by category:
   → Setup: Next.js config, fumadocs-mdx, content structure
   → Tests: E2E (3), Component (4), Unit (2) - MUST FAIL FIRST
   → Core: Types, data layer, components
   → Integration: Homepage, routes, navigation
   → Polish: Accessibility, performance, docs
4. Apply task rules:
   → [P] = Different files, independent
   → Sequential = Same file or dependency
   → Tests before implementation (TDD)
5. Total tasks: 29 numbered tasks (T001-T029)
6. Validation: All contracts tested ✓, All entities modeled ✓, TDD enforced ✓
7. Result: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: 可並行執行（不同檔案、無依賴關係）
- 所有任務包含確切的檔案路徑

---

## Phase 3.1: Setup & Configuration

### 環境設定與專案結構

- [x] **T001** [P] 啟用 Next.js experimental.viewTransition
      **檔案**: `next.config.mjs`
      **內容**: 新增 `experimental: { viewTransition: true }` 設定
      **驗證**: ✅ Build 成功，viewTransition 實驗性功能已啟用

- [x] **T002** [P] 配置 fumadocs-mdx projects collection
      **檔案**: `source.config.ts`
      **內容**: 定義 `projects` collection，設定 schema 包含 `featured` 和 `order` 欄位
      **依賴**: contracts/project-schema.ts 的 Zod schema
      **驗證**: ✅ `npm run build` 成功編譯

- [x] **T003** [P] 建立 projects content 目錄結構
      **檔案**: `content/projects/zh-TW/`, `content/projects/en/`, `content/projects/ja/`
      **內容**: 建立目錄，加入 `meta.json` placeholder
      **驗證**: ✅ 目錄存在且包含 meta.json

- [x] **T004** [P] 建立 projects images 目錄
      **檔案**: `public/images/projects/`
      **內容**: 建立目錄結構，準備存放專案圖片
      **驗證**: ✅ 目錄存在

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL**: 這些測試必須先寫且必須失敗，才能開始實作

### E2E Tests (Playwright)

- [x] **T005** [P] E2E 測試：作品集頁面顯示精選專案
      **檔案**: `tests/e2e/projects/featured-projects.spec.ts`
      **測試內容**:
  - 訪問 `/zh-TW/projects` 顯示 3-5 張精選專案卡片
  - 卡片包含圖片、標題、描述
  - 桌面顯示 3 欄網格，行動顯示單欄
  - 首張卡片使用 `priority` 載入圖片
    **必須失敗**: 組件尚未實作
    **參考**: quickstart.md 測試場景 2.1

- [x] **T006** [P] E2E 測試：View Transition 轉場效果
      **檔案**: `tests/e2e/projects/view-transition.spec.ts`
      **測試內容**:
  - 點擊卡片導航至詳細頁面
  - 檢查 View Transition 動畫（Chrome 111+）
  - 不支援瀏覽器降級測試（Firefox）
    **必須失敗**: 路由和轉場尚未實作
    **參考**: quickstart.md 測試場景 2.2

- [x] **T007** [P] E2E 測試：專案詳細頁面內容
      **檔案**: `tests/e2e/projects/project-detail.spec.ts`
      **測試內容**:
  - 訪問 `/zh-TW/projects/[slug]` 顯示專案詳情
  - 包含首圖、標題、四個內容章節（h2）
  - 404 處理（不存在的 slug）
    **必須失敗**: 詳細頁面尚未實作
    **參考**: quickstart.md 測試場景 2.3

### Component Tests (React Testing Library)

- [x] **T008** [P] 元件測試：FeaturedProjectCard (hero variant)
      **檔案**: `src/components/projects/__tests__/featured-project-card-hero.test.tsx`
      **測試內容**:
  - 渲染標題、描述、圖片
  - Mobile: `flex-col`, 圖上文下, `aspect-video`
  - Desktop: 保持 hero 樣式
  - 圖片使用 `priority={true}`
    **必須失敗**: FeaturedProjectCard 組件未建立
    **參考**: contracts/api-contracts.md Section 3.3

- [x] **T009** [P] 元件測試：FeaturedProjectCard (compact variant)
      **檔案**: `src/components/projects/__tests__/featured-project-card-compact.test.tsx`
      **測試內容**:
  - Mobile: `flex-row`, 圖左文右, `aspect-square`
  - Desktop: grid layout
  - 圖片 lazy loading
    **必須失敗**: FeaturedProjectCard 組件未建立
    **參考**: quickstart.md 測試場景 2.4

- [x] **T010** [P] 元件測試：FeaturedProjects section
      **檔案**: `src/components/projects/__tests__/featured-projects.test.tsx`
      **測試內容**:
  - 顯示 3-5 個專案卡片
  - 按照 meta.json 順序排列
  - 無專案時顯示空狀態
    **必須失敗**: FeaturedProjects 組件未建立

- [x] **T011** [P] 元件測試：ProjectDetail component
      **檔案**: `src/components/projects/__tests__/project-detail.test.tsx`
      **測試內容**:
  - 渲染專案標題、首圖
  - 渲染四個章節（問題、思考、方案、影響）
  - MDX 內容正確編譯
    **必須失敗**: ProjectDetail 組件未建立

### Unit Tests

- [x] **T012** [P] 單元測試：projectFrontmatterSchema validation
      **檔案**: `src/types/__tests__/project-schema.test.ts`
      **測試內容**:
  - 驗證合法 frontmatter 通過
  - title 長度限制（≤100）
  - description 長度限制（≤200）
  - image 路徑格式驗證
  - date 格式驗證（YYYY-MM-DD）
  - order 範圍驗證（1-99）
    **必須失敗**: Schema 型別未定義

- [x] **T013** [P] 單元測試：getFeaturedProjects filtering logic
      **檔案**: `src/lib/data/__tests__/projects.test.ts`
      **測試內容**:
  - 過濾 `featured: true` 專案
  - 限制最多 5 個
  - 依照 meta.json 順序
  - 空結果處理
    **必須失敗**: getFeaturedProjects 函式未實作

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Type Definitions

- [x] **T014** 定義 Project type interfaces
      **檔案**: `src/types/project.ts`
      **內容**: 從 contracts/project-schema.ts 複製並調整為專案型別定義
  - `ProjectFrontmatter`
  - `ProjectMetadata`
  - `FeaturedProject`
  - `ProjectPageData`
  - `Locale` type
  - Type guards: `isFeaturedProject`, `validateProjectFrontmatter`
    **驗證**: TypeScript 編譯無錯誤，T012 測試通過

### Data Layer

- [x] **T015** 建立 projectsSource loader
      **檔案**: `src/lib/source.ts`
      **內容**: 新增 `projectsSource` 使用 fumadocs-mdx loader

  ```typescript
  export const projectsSource = loader({
    baseUrl: "/projects",
    source: createMDXSource(projects, meta),
    i18n,
  });
  ```

  **依賴**: T002 (source.config.ts)
  **驗證**: Import 無錯誤

- [x] **T016** [P] 實作 getFeaturedProjects()
      **檔案**: `src/lib/data/projects.ts`
      **內容**:
  - 取得所有專案: `projectsSource.getPages()`
  - 過濾 `featured: true` 且符合 locale
  - 依照 meta.json 順序
  - Slice 前 5 個
  - 型別: `Promise<FeaturedProject[]>`
    **依賴**: T015
    **驗證**: T013 單元測試通過

- [x] **T017** [P] 實作 getProjectBySlug()
      **檔案**: `src/lib/data/projects.ts`
      **內容**:
  - 取得單一專案: `projectsSource.getPage([slug], locale)`
  - 回傳 `ProjectPageData | null`
  - 包含 MDX content component
    **驗證**: TypeScript 型別檢查通過

- [x] **T018** [P] 實作 generateProjectStaticParams()
      **檔案**: `src/lib/data/projects.ts`
      **內容**:
  - 產生所有專案的 `{ locale, slug }` 組合
  - 用於 Next.js `generateStaticParams()`
    **驗證**: 回傳正確格式陣列

### Sample Content

- [x] **T019** [P] 建立 3 個範例專案 MDX (zh-TW)
      **檔案**:
  - `content/projects/zh-TW/andrewck24-portfolio.mdx`
  - `content/projects/zh-TW/example-project-2.mdx`
  - `content/projects/zh-TW/example-project-3.mdx`
    **內容**:
  - 完整 frontmatter（title, description, image, date, featured: true, order: 1-3）
  - 四個章節（問題、思考、方案、影響）
    **驗證**: fumadocs-mdx 正確解析

- [x] **T020** [P] 更新 zh-TW meta.json
      **檔案**: `content/projects/zh-TW/meta.json`
      **內容**:

  ```json
  {
    "title": "專案作品集",
    "pages": ["andrewck24-portfolio", "example-project-2", "example-project-3"]
  }
  ```

  **驗證**: 專案順序正確

- [x] **T021** [P] 準備 placeholder 圖片
      **檔案**: `public/images/projects/*.jpg`
      **內容**:
  - andrewck24-portfolio-hero.jpg (1200x675)
  - example-project-2-hero.jpg (1200x675)
  - example-project-3-hero.jpg (1200x675)
    **驗證**: 圖片路徑符合 frontmatter

### Components

- [x] **T022** 實作 FeaturedProjectCard 元件
      **檔案**: `src/components/projects/featured-project-card.tsx`
      **內容**:
  - Props: `{ project: FeaturedProject, variant: 'hero' | 'compact', priority?: boolean }`
  - 使用 shadcn/ui Card 元件
  - Hero variant: `flex-col`, `aspect-video`, 圖上文下
  - Compact variant: `flex-row`, `aspect-square`, 圖左文右
  - Next.js Image 優化, 支援 priority
  - Link to `/[locale]/projects/[slug]`
    **依賴**: T014 (types)
    **驗證**: T008, T009 元件測試通過

- [x] **T023** 實作 FeaturedProjects section 元件
      **檔案**: `src/components/projects/featured-projects.tsx`
      **內容**:
  - Props: `{ projects: FeaturedProject[], locale: string }`
  - Section 標題: "精選專案"（支援 i18n）
  - Grid layout: Desktop 3 欄, Mobile 單欄
  - 首張卡片 variant="hero", 其餘 variant="compact"
  - 空狀態處理
    **依賴**: T022
    **驗證**: T010 元件測試通過

- [x] **T024** 實作 ProjectDetail 元件
      **檔案**: `src/components/projects/project-detail.tsx`
      **內容**:
  - Props: `{ project: ProjectPageData }`
  - Hero section: 標題 + 首圖（Next.js Image, priority）
  - MDX 內容渲染: `<project.content />`
  - 四個章節（h2 styling）
  - 返回連結
    **依賴**: T014 (types)
    **驗證**: T011 元件測試通過

- [x] **T025** [P] 實作 useViewTransition hook
      **檔案**: `src/hooks/use-view-transition.ts`
      **內容**:
  - 檢查瀏覽器支援 View Transitions API
  - 回傳 `{ isSupported: boolean }`
  - 用於條件渲染 ViewTransition 元件
    **驗證**: TypeScript 型別正確

---

## Phase 3.4: Integration

### Page Components

- [x] **T026** 建立專案詳細頁面
      **檔案**: `src/app/[lang]/projects/[[...slug]]/page.tsx`
      **內容**:
  - Server Component
  - Props: `{ params: Promise<{ lang: string, slug: string[] }> }`
  - 使用 `getProjectBySlug()` 取得資料
  - 404 處理: `notFound()` if project null
  - 渲染 `<ProjectDetail project={project} />`
  - Export `generateStaticParams` 使用 T018
    **依賴**: T017, T024
    **驗證**: T007 E2E 測試通過

- [x] **T027** 建立作品集頁面 (Projects Page)
      **檔案**: `src/app/[lang]/projects/page.tsx`
      **內容**:
  - Server Component
  - Props: `{ params: Promise<{ lang: string }> }`
  - 新增 `getFeaturedProjects(locale)` 呼叫
  - 頁面標題與描述（支援 i18n）
  - 渲染 `<FeaturedProjects>` 元件
  - generateMetadata 產生 SEO metadata
    **依賴**: T016, T023
    **驗證**: T005 E2E 測試通過

- [ ] **T028** [P] (Optional) 更新導航連結
      **檔案**: 根據現有導航結構（可能在 `src/components/layout/nav.tsx`）
      **內容**:
  - 新增 "Projects" 連結至導航選單
  - 連結至 `/[locale]/projects`（未來專案列表頁）
  - 目前導向首頁的 Featured Projects section
    **驗證**: 點擊連結正確導航

---

## Phase 3.5: Polish & Validation

### Accessibility & Performance

- [ ] **T029** [P] 無障礙與效能驗證
      **任務**:
  - [ ] 執行 `npm run lint` 修正所有警告
  - [ ] 執行 `npm run type-check` 確保型別正確
  - [ ] 執行 Lighthouse audit (Performance, Accessibility, SEO > 90)
  - [ ] 驗證鍵盤導航（Tab, Enter）
  - [ ] 驗證 screen reader (macOS VoiceOver)
  - [ ] 驗證 `prefers-reduced-motion` 支援
  - [ ] 驗證 WCAG 2.1 AA 色彩對比
  - [ ] 驗證圖片 alt 屬性
  - [ ] 執行 quickstart.md 所有測試場景
        **檔案**: 多個檔案（跨元件）
        **驗證**: 所有檢查項目通過

---

## Dependencies

```plaintext
Setup (T001-T004) → 必須最先完成

Tests (T005-T013) → 在實作前完成（TDD）
  ├─ T005-T007 (E2E) [P]
  ├─ T008-T011 (Component) [P]
  └─ T012-T013 (Unit) [P]

Types (T014) → 阻擋所有組件任務

Data Layer:
  T002 → T015 → T016, T017, T018 [P]

Content (T019-T021) [P] → 可與 Data Layer 並行

Components:
  T014 → T022 → T023
  T014 → T024
  T025 [P]

Integration:
  T017 + T024 → T026
  T016 + T023 → T027
  T028 [P]

Polish:
  T029 (requires all previous tasks complete)
```

---

## Parallel Execution Examples

### Phase 1: 並行執行 Setup 任務

```bash
# 同時執行 T001-T004（獨立檔案）
Task: "T001 啟用 Next.js experimental.viewTransition in next.config.mjs"
Task: "T002 配置 fumadocs-mdx projects collection in source.config.ts"
Task: "T003 建立 projects content 目錄結構"
Task: "T004 建立 projects images 目錄"
```

### Phase 2: 並行寫測試（TDD）

```bash
# E2E tests (T005-T007)
Task: "T005 E2E 測試：首頁顯示精選專案 in tests/e2e/projects/featured-projects.spec.ts"
Task: "T006 E2E 測試：View Transition 轉場效果 in tests/e2e/projects/view-transition.spec.ts"
Task: "T007 E2E 測試：專案詳細頁面內容 in tests/e2e/projects/project-detail.spec.ts"

# Component tests (T008-T011)
Task: "T008 元件測試：FeaturedProjectCard (hero) in __tests__/featured-project-card-hero.test.tsx"
Task: "T009 元件測試：FeaturedProjectCard (compact) in __tests__/featured-project-card-compact.test.tsx"
Task: "T010 元件測試：FeaturedProjects section in __tests__/featured-projects.test.tsx"
Task: "T011 元件測試：ProjectDetail in __tests__/project-detail.test.tsx"

# Unit tests (T012-T013)
Task: "T012 單元測試：projectFrontmatterSchema validation in __tests__/project-schema.test.ts"
Task: "T013 單元測試：getFeaturedProjects filtering in __tests__/projects.test.ts"
```

### Phase 3: 並行實作獨立模組

```bash
# Data layer functions (after T015)
Task: "T016 實作 getFeaturedProjects() in src/lib/data/projects.ts"
Task: "T017 實作 getProjectBySlug() in src/lib/data/projects.ts"
Task: "T018 實作 generateProjectStaticParams() in src/lib/data/projects.ts"

# Sample content (independent)
Task: "T019 建立 3 個範例專案 MDX (zh-TW)"
Task: "T020 更新 zh-TW meta.json"
Task: "T021 準備 placeholder 圖片"
```

---

## Validation Checklist

(GATE: 確認所有任務符合規範)

- [x] 所有 contracts 都有對應測試（T005-T013）
- [x] 所有 entities 都有 model 任務（T014: Project, FeaturedProject）
- [x] 所有測試都在實作之前（T005-T013 before T014-T028）
- [x] [P] 任務真正獨立（不同檔案、無依賴）
- [x] 每個任務指定確切檔案路徑
- [x] 無任務同時修改相同檔案（除 src/lib/data/projects.ts 為 T016-T018 順序執行）

---

## Notes

- **[P] 任務**: 不同檔案、無依賴關係，可並行執行
- **TDD 嚴格執行**: T005-T013 必須先完成且失敗，才能開始 T014-T028
- **每個任務完成後**: 執行對應測試驗證
- **Commit 策略**: 每完成一個 Phase 後 commit（例如完成 T001-T004 → commit "Setup projects feature"）
- **避免**: 模糊任務、同檔案衝突、跳過測試

---

## Task Execution Summary

| Phase           | 任務範圍  | 任務數 | 可並行     |
| --------------- | --------- | ------ | ---------- |
| 3.1 Setup       | T001-T004 | 4      | ✅ 全部    |
| 3.2 Tests       | T005-T013 | 9      | ✅ 全部    |
| 3.3 Core        | T014-T025 | 12     | 部分       |
| 3.4 Integration | T026-T028 | 3      | 部分       |
| 3.5 Polish      | T029      | 1      | ❌         |
| **Total**       |           | **29** | **16 [P]** |

**預估時間**:

- Setup: 30 分鐘
- Tests: 2-3 小時
- Core: 4-5 小時
- Integration: 1-2 小時
- Polish: 1 小時
- **Total: 8-11 小時**

---

_Based on Constitution v1.1.0 - See `/.specify/memory/constitution.md`_
_Generated: 2025-10-10 from design documents in specs/002-projects-page/_
