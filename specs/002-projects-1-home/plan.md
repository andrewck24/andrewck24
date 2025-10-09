# Implementation Plan: 作品集展示功能 (Projects Portfolio)

**Branch**: `002-projects-1-home` | **Date**: 2025-10-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/andrew/projects/andrewck24/specs/002-projects-1-home/spec.md`

## Execution Flow (/plan command scope)

```plaintext
1. Load feature spec from Input path
   → SUCCESS: Loaded spec.md
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type: web (Next.js frontend application)
   → Set Structure Decision: Single Next.js app with fumadocs-mdx
3. Fill Constitution Check section
   → Based on constitution.md v1.1.0
4. Evaluate Constitution Check section
   → All principles aligned
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Technical decisions documented
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → Design artifacts generated
7. Re-evaluate Constitution Check
   → Post-Design validation ✓
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Task generation approach described
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

本功能實作個人作品集展示系統，允許訪客在首頁瀏覽 3-5 個精選專案卡片，點選後可透過視覺轉場進入詳細介紹頁面。專案內容採用 MDX 格式管理，支援多語言（zh-TW 為主，逐步支援 en、ja），並以「問題→思考→方案→影響」結構呈現專案故事。

**Technical Approach**:

- 使用 fumadocs-mdx 管理專案介紹內容（與現有 notes/about 架構一致）
- 使用 Next.js 實驗性 viewTransition 支援實現圖片轉場效果（React 整合，優雅降級）
- UI 組件優先採用 shadcn/ui，次之 fumadocs components，最後才自訂元件
- 響應式設計：首頁卡片在行動裝置採單欄排版，首張為圖上文下，其餘為圖左文右

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.1.1, Next.js 15.5.3 (with experimental.viewTransition)
**Primary Dependencies**: fumadocs-mdx 12.0.1, fumadocs-ui 15.8.2, shadcn/ui components, motion 12.23.22
**Storage**: File-based (MDX files in content/projects/)
**Testing**: Jest 30.1.3 + React Testing Library 16.3.0 (component tests), Playwright 1.55.0 (E2E tests)
**Target Platform**: Web (Next.js App Router, Server Components + Client Components)
**Project Type**: web (single Next.js application with MDX content management)
**Performance Goals**:

- First Contentful Paint <1.5s
- View Transition animation <300ms
- Lighthouse score >90 across all metrics
  **Constraints**:
- 3-5 featured projects maximum on homepage
- Support browsers with and without View Transition API
- Mobile-first responsive design (≥44px touch targets)
- Accessibility: WCAG 2.1 AA compliance
  **Scale/Scope**:
- ~10-20 total projects (5 featured at a time)
- Support 3 languages (zh-TW, en, ja)
- Integration with existing fumadocs-mdx infrastructure

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. Type Safety & Explicit Contracts ✅

- **Compliance**: All project data structures will be typed in `src/types/project.ts`
- **Component Interfaces**: ProjectCard, ProjectDetail 組件將有完整 prop type definitions
- **Integration**: 遵循現有 `src/types/profile.ts` 模式

### II. Component Standards & Conventions ✅

- **File Naming**:
  - `src/components/projects/project-card.tsx`
  - `src/components/projects/project-detail.tsx`
- **Test IDs**:
  - `project-card`, `featured-projects-section`, `project-detail-page`
- **Component Structure**: 遵循現有 `src/components/home/hero/index.tsx` 模式

### III. Test-Driven Development - Hybrid Strategy ✅

**Test Plan**:

1. **E2E Tests (Playwright)**:
   - 首頁顯示 3-5 個精選作品卡片
   - 點選卡片導航至詳細頁面（含轉場）
   - 多語言切換功能

2. **Component Tests (React Testing Library)**:
   - ProjectCard 渲染測試
   - 圖片載入失敗 fallback
   - 行動裝置響應式排版

3. **Unit Tests**:
   - MDX frontmatter parsing
   - Featured projects filtering logic
   - Sort order validation

**TDD Workflow**: Red → Green → Refactor (所有測試必須先失敗)

### IV. Internationalization First ✅

- **Compliance**: 使用現有 fumadocs i18n 系統
- **Content Structure**: `content/projects/{locale}/*.mdx`
- **Dynamic Data**: `src/lib/data/projects.ts` 提供多語言 metadata
- **Locale Handling**: 遵循現有 `src/lib/i18n.ts` 和 `src/middleware.ts`

### V. Performance & Optimization ✅

- **Image Optimization**: Next.js `<Image>` with explicit dimensions
- **Code Splitting**: Dynamic import for View Transition polyfill
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Progressive Enhancement**: Graceful degradation for non-supporting browsers

### Pre-commit Quality Gates ✅

- TypeScript: `npm type-check`
- Linting: `npm lint`
- Tests: `npm test`
- Husky pre-commit hook enforced

### Build & Deployment Pipeline ✅

- Feature branch → Vercel Preview
- PR must pass CI (build + test + type-check)
- Merge to main → Vercel Production

**Gate Status**: ✅ **PASS** - 所有憲法原則符合，無需違規豁免

## Project Structure

### Documentation (this feature)

```plaintext
specs/002-projects-1-home/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── project-schema.ts
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```plaintext
src/
├── app/
│   └── [lang]/
│       ├── (home)/
│       │   └── page.tsx              # 更新：加入 FeaturedProjects 組件
│       └── projects/
│           ├── [[...slug]]/
│           │   └── page.tsx          # 新增：專案詳細頁面
│           └── layout.tsx            # 新增：專案頁面布局
│
├── components/
│   └── projects/
│       ├── __tests__/
│       │   ├── project-card.test.tsx
│       │   ├── project-detail.test.tsx
│       │   └── featured-projects.test.tsx
│       ├── project-card.tsx          # 新增：作品集卡片組件
│       ├── project-detail.tsx        # 新增：作品集詳情組件
│       ├── featured-projects.tsx     # 新增：首頁精選作品區塊
│       └── view-transition.tsx       # 新增：View Transition 封裝
│
├── lib/
│   ├── data/
│   │   └── projects.ts               # 新增：專案 metadata（手動排序）
│   └── source.ts                     # 更新：加入 projectsSource
│
├── types/
│   └── project.ts                    # 新增：專案資料型別定義
│
└── hooks/
    └── use-view-transition.ts        # 新增：View Transition hook

content/
└── projects/
    ├── zh-TW/
    │   ├── meta.json                 # 專案列表與排序
    │   ├── project-1.mdx
    │   └── project-2.mdx
    ├── en/
    │   ├── meta.json
    │   └── [逐步加入英文版本]
    └── ja/
        ├── meta.json
        └── [逐步加入日文版本]

tests/
└── e2e/
    └── projects.spec.ts              # 新增：E2E 測試

source.config.ts                      # 更新：加入 projects collection
```

**Structure Decision**: 採用現有 Next.js App Router + fumadocs-mdx 架構，與 notes、about 頁面保持一致的內容管理模式。專案內容存放於 `content/projects/{locale}/`，透過 `fumadocs-mdx` 處理 MDX 解析與 i18n。

## Phase 0: Outline & Research

**Status**: ✅ Completed

### Research Tasks Completed

1. **View Transition API**:
   - **Primary Decision**: 使用 Next.js 實驗性 `viewTransition` 支援
   - **Rationale**:
     - React 整合更優雅（`<ViewTransition>` 組件，JSX 語法）
     - 無需升級到不穩定的 React Canary 版本（保持 React 19.1.1）
     - 符合作品集展示前瞻技術的定位
     - React 自動處理瀏覽器相容性，無需手動判斷
   - **Trade-off**: 實驗性功能，Next.js 官方標記為 "not recommended for production"
   - **Fallback**: 瀏覽器不支援時 React 自動降級為直接跳轉（符合規格要求）
   - **Implementation**:

     ```js
     // next.config.mjs
     export default {
       experimental: { viewTransition: true },
     };
     ```

     ```jsx
     import { unstable_ViewTransition as ViewTransition } from "react";
     <ViewTransition>{children}</ViewTransition>;
     ```

   - **Alternative (備選方案)**: 使用原生瀏覽器 `document.startViewTransition()` API
     - 更穩定，但需手動處理 React 整合
     - 適用於需要更高穩定性的場景
   - **Reference**:
     - [Next.js viewTransition](https://nextjs.org/docs/app/api-reference/next-config-js/viewTransition)
     - [React PR #31975](https://github.com/facebook/react/pull/31975)
     - [View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

2. **fumadocs-mdx Integration Pattern**:
   - Decision: 複製 `content/notes/` 與 `content/about/` 的結構模式
   - Rationale: 保持專案一致性，減少學習曲線
   - Implementation:
     - `source.config.ts`: 新增 `projects` collection
     - `src/lib/source.ts`: 匯出 `projectsSource`
     - MDX frontmatter: title, description, image, date

3. **UI Component Selection**:
   - Primary: shadcn/ui Card component
   - Secondary: fumadocs-ui 現有元件（如有適用）
   - Custom: ProjectCard wrapper（整合 View Transition）
   - Rationale: 遵循使用者指定的優先順序

4. **Mobile Layout Strategy**:
   - First card: `flex-col` (圖上文下) + `aspect-video` for hero image
   - Other cards: `flex-row` (圖左文右) + `aspect-square` for thumbnail
   - Breakpoint: `md:` 以上統一為 grid layout
   - Touch target: ≥44px (遵循 CLAUDE.md 設計原則)

5. **手動排序機制**:
   - Decision: 使用 `meta.json` 的 `pages` 陣列順序
   - Rationale: fumadocs-mdx 原生支援，無需額外邏輯
   - Example:

     ```json
     {
       "pages": ["project-a", "project-b", "project-c"]
     }
     ```

### Key Findings Documented in research.md

- View Transition 瀏覽器支援度（Chrome 111+, Edge 111+）
- Progressive enhancement 策略
- fumadocs-mdx collection 設定範例
- 專案 frontmatter schema 設計
- 響應式卡片布局 Tailwind 模式

**Output**: [research.md](./research.md)

## Phase 1: Design & Contracts

**Status**: ✅ Completed

(Prerequisites: research.md complete)

### 1. Data Model (`data-model.md`)

**Entities Extracted from Spec**:

- **Project** (專案):
  - id: string (從檔名衍生)
  - slug: string
  - locale: 'zh-TW' | 'en' | 'ja'
  - title: string
  - description: string
  - image: string (路徑)
  - date: Date
  - featured: boolean
  - order: number (手動排序權重)
  - content: MDXContent (四段落結構)

- **FeaturedProject** (精選專案):
  - Extends Project
  - featured: true
  - order: 1-5
  - 從 Project 過濾而來，非獨立實體

**Validation Rules**:

- title: required, max 100 chars
- description: required, max 200 chars
- image: required, valid file path
- featured projects: max 5 per locale
- order: unique per locale

**State Transitions**: N/A (靜態內容)

### 2. API Contracts (`contracts/`)

**Contract Files Generated**:

```typescript
// contracts/project-schema.ts
export interface ProjectFrontmatter {
  title: string;
  description: string;
  image: string;
  date: string; // ISO 8601
  featured?: boolean;
  order?: number;
}

export interface ProjectMetadata extends ProjectFrontmatter {
  slug: string;
  locale: "zh-TW" | "en" | "ja";
  url: string;
}

export interface ProjectContent {
  frontmatter: ProjectFrontmatter;
  body: MDXContent;
  sections: {
    problem: string;
    thinking: string;
    solution: string;
    impact: string;
  };
}
```

**Endpoints** (Page Components):

- `GET /[lang]/projects` → Featured projects grid
- `GET /[lang]/projects/[slug]` → Project detail page

### 3. Contract Tests (Failing Tests Generated)

```typescript
// src/components/projects/__tests__/project-card.test.tsx
describe("ProjectCard", () => {
  it("should render project title, description, and image", () => {
    // MUST FAIL - component not implemented
  });

  it("should apply image-top layout on first card (mobile)", () => {
    // MUST FAIL
  });

  it("should apply image-left layout on other cards (mobile)", () => {
    // MUST FAIL
  });
});

// tests/e2e/projects.spec.ts
test("featured projects section displays 3-5 cards", async ({ page }) => {
  // MUST FAIL - page not built
});

test("clicking project card navigates with view transition", async ({
  page,
}) => {
  // MUST FAIL
});
```

### 4. Test Scenarios from User Stories

**Quickstart Test Scenarios**:

```markdown
# Quickstart: Featured Projects Display

## Prerequisites

- Node.js 20+, npm installed
- Repository cloned, dependencies installed

## Test Steps

1. Start dev server: `npm dev`
2. Navigate to `http://localhost:3000/zh-TW`
3. **VERIFY**: See 3-5 project cards in "Featured Projects" section
4. **VERIFY**: First card has large hero image above text (mobile)
5. **VERIFY**: Other cards have thumbnail left, text right (mobile)
6. Click on any project card
7. **VERIFY**: Image transitions smoothly (or direct jump if unsupported)
8. **VERIFY**: Detail page shows 4 sections: 問題, 思考, 方案, 影響

## Expected Results

- All cards render with correct data
- Layout matches mobile-first design
- Navigation works with graceful degradation
```

### 5. Agent Context Update

**執行**: `.specify/scripts/bash/update-agent-context.sh claude`

**新增技術上下文**:

- React 19 View Transition API
- fumadocs-mdx projects collection
- shadcn/ui Card component
- Mobile-first responsive layout patterns

**保留**:

- 現有 Hero section, About page 相關上下文
- 保持檔案在 150 行以內

**Output**:

- ✅ data-model.md
- ✅ contracts/project-schema.ts
- ✅ contracts/api-contracts.md
- ✅ Failing tests in `__tests__/` and `tests/e2e/`
- ✅ quickstart.md
- ✅ CLAUDE.md updated

## Phase 2: Task Planning Approach

(This section describes what the /tasks command will do - DO NOT execute during /plan)

**Task Generation Strategy**:

1. **從 Phase 1 設計文件生成任務**:
   - Load `.specify/templates/tasks-template.md` as base
   - Parse contracts/project-schema.ts → type definition tasks
   - Parse data-model.md → MDX content structure tasks
   - Parse quickstart.md → user flow implementation tasks

2. **TDD 任務順序**:
   - **Contract Tests** (先寫測試):
     - Task: Write E2E test for featured projects display [P]
     - Task: Write component test for ProjectCard [P]
     - Task: Write component test for FeaturedProjects [P]

   - **Data Layer** (實作 models):
     - Task: Define ProjectFrontmatter type in src/types/project.ts
     - Task: Configure projects collection in source.config.ts
     - Task: Create projectsSource in src/lib/source.ts
     - Task: Add sample MDX files in content/projects/zh-TW/

   - **Component Implementation** (讓測試通過):
     - Task: Implement ProjectCard component (shadcn/ui Card)
     - Task: Implement FeaturedProjects section component
     - Task: Implement View Transition hook
     - Task: Implement ProjectDetail page component

   - **Integration** (整合至現有頁面):
     - Task: Add FeaturedProjects to homepage
     - Task: Create /projects/[[...slug]] route
     - Task: Update navigation to include Projects link

   - **Refinement**:
     - Task: Add image lazy loading & optimization
     - Task: Implement responsive layout (first card vs others)
     - Task: Add View Transition fallback for unsupported browsers
     - Task: Verify accessibility (WCAG AA)

3. **依賴關係排序**:
   - Types → Data Layer → Component Tests → Components → Pages
   - 標記 [P] 表示可並行執行（獨立檔案）

4. **估計產出**:
   - 25-30 個編號任務
   - 每個任務可獨立驗證（對應一個測試通過）
   - 遵循 TDD Red-Green-Refactor cycle

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

(These phases are beyond the scope of the /plan command)

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

(Documenting deviations from standard practices)

| Violation                                            | Why Needed                                       | Simpler Alternative Rejected Because                                                        |
| ---------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 使用實驗性功能 (Next.js experimental.viewTransition) | 展示技術前瞻性，符合作品集定位；React 整合更優雅 | 原生 `document.startViewTransition()` 可用但需手動處理 React 生命週期整合，且失去組件化優勢 |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) - 2025-10-10
- [x] Phase 1: Design complete (/plan command) - 2025-10-10
  - [x] data-model.md created
  - [x] contracts/project-schema.ts created
  - [x] contracts/api-contracts.md created
  - [x] quickstart.md created
  - [x] CLAUDE.md updated with tech stack
- [x] Phase 2: Task planning complete (/plan command - describe approach only) - 2025-10-10
- [x] Phase 3: Tasks generated (/tasks command) - 2025-10-10
  - Generated 29 tasks (T001-T029)
  - 16 tasks marked [P] for parallel execution
  - TDD enforced: 9 test tasks before implementation
  - Estimated time: 8-11 hours
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (from spec.md)
- [x] Complexity deviations documented (1 deviation - experimental.viewTransition)

---

_Based on Constitution v1.1.0 - See `/.specify/memory/constitution.md`_
