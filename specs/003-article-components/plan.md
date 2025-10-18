# Implementation Plan: Article 元件泛用化系統

**Branch**: `003-article-components` | **Date**: 2025-10-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/andrew/projects/andrewck24/specs/003-article-components/spec.md`

## Execution Flow (/plan command scope)

```plaintext
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

將 4 個 projects 專用元件（GeneratedHero, FeaturedProjectCard, ProjectDetail, ProjectDetailImage）重構為泛用型 article 元件系統，支援 projects 和 notes 兩種內容類型共用。核心改進包括：(1) 建立 ArticleMetadata 統一型別架構，(2) 整合 GeneratedHero + ProjectDetailImage 為單一 ArticleImage 元件，(3) 擴充 ogImage.background 支援 CSS gradient/純色/圖片路徑三種格式，(4) 泛用化 OG Image 動態生成邏輯，(5) 為 notes 實作完整的 featured/list/detail 展示結構。

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode enabled)
**Primary Dependencies**: Next.js 15.5.3, React 19.1.1, fumadocs-mdx 12.0.1, fumadocs-ui 15.8.2, motion 12.23.22, shadcn/ui components
**Storage**: File-based (MDX files in `content/projects/` and `content/notes/`), fumadocs-mdx for content parsing
**Testing**: Jest 30.1.3 (unit/component tests), Playwright 1.55.0 (E2E tests), React Testing Library 16.3.0
**Target Platform**: Web (Static Site Generation via Next.js App Router, deployed to Vercel)
**Project Type**: Web (frontend-only, Next.js SSG with fumadocs)
**Performance Goals**: Lighthouse Performance Score >95, LCP <2.5s, FCP <1.5s, CLS <0.1
**Constraints**: Must maintain View Transitions API support, i18n (zh-TW/en/ja), TDD workflow (Outside-In), SSG-only (no server runtime除了 OG image generation)
**Scale/Scope**: 個人作品集網站 (~10-20 projects, ~30-50 notes expected), 3 languages, 5-10 article components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Type Safety & Explicit Contracts ✅

- **ArticleMetadata interface**: 定義泛用型別供 ProjectMetadata 和 NoteMetadata 繼承
- **All component props typed**: ArticleImage, ArticleCard, Article 元件皆有明確 TypeScript interface
- **Zod schema extension**: 擴充 ogImage.background 的驗證規則
- **No implicit any**: TypeScript strict mode 保持啟用

### Principle II: Component Standards & Conventions ✅

- **File naming**: article-image.tsx, article-card.tsx, article.tsx (kebab-case)
- **Component naming**: ArticleImage, ArticleCard, Article (PascalCase)
- **data-testid attributes**: 所有元件保留測試 ID（article-image-container, article-card, article-section）
- **File structure**: 新增 src/components/article/ 目錄統一管理

### Principle III: Test-Driven Development - Hybrid Strategy ✅

- **E2E tests (Playwright)**: 測試多語言切換、View Transition、OG image 渲染
- **Component tests (RTL)**: 測試 background 格式判斷（gradient/color/image）、variant 切換
- **Unit tests (Vitest/Jest)**: 測試 background 格式偵測 helper function
- **TDD workflow**: 所有測試先寫（Red）→ 實作（Green）→ 重構

### Principle IV: Internationalization First ✅

- **Fumadocs i18n**: 保持使用 defineI18n 配置
- **Locale prop**: 所有 article 元件接收 locale: Locale prop
- **Content separation**: projects 和 notes 各自的 content/{locale}/ 結構
- **Default language**: zh-TW (fallback: en)

### Principle V: Performance & Optimization ✅

- **Next.js Image**: ArticleImage 使用 Next.js Image component with priority
- **Code splitting**: React.lazy 延遲載入非首屏元件
- **View Transitions**: 保留 unstable_ViewTransition 優化頁面切換
- **Tailwind CSS**: 使用 atomic CSS 減少 bundle size
- **SSG**: 所有 article 頁面於 build time 生成

### Pre-commit Quality Gates ✅

- **Type check**: npm type-check (TypeScript compilation)
- **Lint**: npm lint (ESLint rules)
- **Tests**: npm test (Jest unit/component tests)
- **Husky hook**: lint-staged 強制執行

### Initial Assessment

**Status**: ✅ PASS
**Violations**: None
**Justification Required**: N/A

## Project Structure

### Documentation (this feature)

```plaintext
specs/003-article-components/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── article-image.contract.md
│   ├── article-card.contract.md
│   └── article.contract.md
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── article/                      # 新增：泛用 article 元件目錄
│   │   ├── image.tsx                 # 整合 GeneratedHero + ProjectDetailImage
│   │   ├── card.tsx                  # 泛用化 FeaturedProjectCard
│   │   ├── index.tsx                 # 泛用化 ProjectDetail
│   │   └── __tests__/
│   │       ├── article-image.test.tsx
│   │       ├── article-card.test.tsx
│   │       └── article.test.tsx
│   ├── projects/                     # 保留：專案專用元件（project-detail 更名為 poject，使用 article 元件）
│   │   ├── featured-projects.tsx
│   │   └── __tests__/
│   └── custom/                       # 可能移除：GeneratedHero 將被 ArticleImage 取代
│
├── types/
│   ├── article.ts                    # 新增：ArticleMetadata 等泛用型別
│   ├── project.ts                    # 修改：extends ArticleMetadata
│   └── note.ts                       # 新增：NoteMetadata extends ArticleMetadata
│
├── lib/
│   ├── data/
│   │   ├── projects.ts               # 修改：使用 ArticleMetadata
│   │   └── notes.ts                  # 新增：notes 資料層函式
│   └── source.ts                     # 修改：新增 notesSource
│
├── app/[lang]/
│   ├── projects/
│   │   ├── [slug]/
│   │   │   ├── page.tsx              # 修改：使用 Article 元件
│   │   │   └── opengraph-image.tsx   # 修改：泛用化 OG image 生成
│   │   └── page.tsx
│   └── notes/                        # 新增：notes 路由結構
│       ├── [[...slug]]/
│       │   ├── page.tsx              # 修改：使用 Article 元件
│       |   └── opengraph-image.tsx   # 修改：泛用化 OG image 生成
│       └── layout.tsx
│
└── content/
    ├── projects/                     # 現有：專案 MDX 檔案
    │   └── {locale}/
    │       └── *.mdx
    └── notes/                        # 現有：筆記 MDX 檔案
        └── {locale}/
            └── *.mdx

tests/e2e/
├── article-components/               # 新增：article 元件 E2E 測試
│   ├── article-image.spec.ts
│   ├── article-card.spec.ts
│   └── view-transitions.spec.ts
└── projects/                         # 現有：專案頁面測試（更新使用 article 元件）
    └── project.spec.ts
```

**Structure Decision**: Next.js App Router 單體應用（Web SSG）。核心變更包括：

1. **新增 `src/components/article/`**: 統一管理泛用 article 元件
2. **新增 `src/types/article.ts`**: 定義共用型別架構
3. **修改 `src/types/project.ts`**: ProjectMetadata 繼承 ArticleMetadata
4. **新增 `src/types/note.ts`**: NoteMetadata 定義
5. **新增 `src/lib/data/notes.ts`**: notes 資料層
6. **移除 `src/components/custom/generated-hero.tsx`**: 功能整合至 ArticleImage
7. **Notes 路由實作**: 新增 featured notes、list、detail 頁面

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```plaintext
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

### Task Generation Strategy

基於 Phase 1 產出的設計文件（contracts, data-model.md, quickstart.md），/tasks 命令將生成以下類別的任務：

#### 1. Type System Tasks (src/types/)

- **T001**: 建立 ArticleMetadata base interface (src/types/article.ts)
- **T002**: 建立 OGImageConfig interface 和 Zod schema
- **T003**: 更新 ProjectMetadata extends ArticleMetadata
- **T004**: 建立 NoteMetadata interface
- **T005**: 建立 ArticlePageData generic wrapper
- **T006**: 建立 type guards (isProjectMetadata, isNoteMetadata)

#### 2. Component Tasks (src/components/article/)

**ArticleImage** (from contracts/article-image.contract.md):

- **T007**: [TEST] 撰寫 ArticleImage unit tests (background format detection)
- **T008**: [IMPL] 建立 ArticleImage component (static mode)
- **T009**: [IMPL] 實作 generated mode (gradient/color/image detection)
- **T010**: [IMPL] 整合 View Transition wrapper

**ArticleCard** (from contracts/article-card.contract.md):

- **T011**: [TEST] 撰寫 ArticleCard unit tests (hero/compact variants)
- **T012**: [IMPL] 建立 ArticleCard component (hero variant)
- **T013**: [IMPL] 實作 compact variant
- **T014**: [IMPL] 整合 ArticleImage

**Article** (from contracts/article.contract.md):

- **T015**: [TEST] 撰寫 Article unit tests (rendering, navigation)
- **T016**: [IMPL] 建立 Article component (header section)
- **T017**: [IMPL] 整合 ArticleImage 和 MDX content rendering
- **T018**: [IMPL] 實作 back link with i18n

#### 3. Data Layer Tasks (src/lib/data/)

- **T019**: [TEST] 撰寫 notes.ts data layer tests
- **T020**: [IMPL] 建立 getFeaturedNotes()
- **T021**: [IMPL] 建立 getNote()
- **T022**: [IMPL] 建立 getAllNotes()
- **T023**: [IMPL] 建立 generateNoteStaticParams()

#### 4. Route Tasks (src/app/[lang]/)

**Projects Migration**:

- **T024**: [TEST] 更新 projects detail E2E tests
- **T025**: [IMPL] 更新 projects/[slug]/page.tsx 使用 Article
- **T026**: [IMPL] 泛用化 projects/[slug]/opengraph-image.tsx

**Notes Implementation**:

- **T027**: [TEST] 撰寫 notes list page tests
- **T028**: [IMPL] 建立 notes/page.tsx (list view)
- **T029**: [TEST] 撰寫 notes detail E2E tests
- **T030**: [IMPL] 更新 notes/[[...slug]]/page.tsx 使用 Article
- **T031**: [IMPL] 建立 notes/[[...slug]]/opengraph-image.tsx

#### 5. Migration & Cleanup Tasks

- **T032**: [IMPL] 更新 FeaturedProjects component 使用 ArticleCard
- **T033**: [IMPL] 移除 src/components/custom/generated-hero.tsx
- **T034**: [IMPL] 移除 src/components/projects/project-detail-image.tsx
- **T035**: [IMPL] 移除 src/components/projects/project-detail.tsx
- **T036**: [IMPL] 移除 src/components/projects/featured-project-card.tsx

#### 6. E2E & Integration Tests

- **T037**: [TEST] View Transition E2E tests (card → detail)
- **T038**: [TEST] OG Image generation tests (all background formats)
- **T039**: [TEST] Accessibility audit (Lighthouse)
- **T040**: [TEST] Responsive layout tests (mobile/tablet/desktop)

### Ordering Strategy

1. **Phase A: Type System (T001-T006)** [P]
   - All type tasks can run in parallel
   - Foundation for components

2. **Phase B: Components (T007-T018)**
   - TDD order: Tests before implementation
   - Sequential within each component (ArticleImage → ArticleCard → Article)
   - Dependencies: ArticleCard depends on ArticleImage

3. **Phase C: Data Layer (T019-T023)**
   - Tests before implementation
   - Can run parallel with Phase B

4. **Phase D: Routes (T024-T031)**
   - Depends on Phase B & C completion
   - Projects migration first (T024-T026)
   - Notes implementation second (T027-T031)

5. **Phase E: Cleanup (T032-T036)**
   - Depends on Phase D completion
   - Update existing components first (T032)
   - Remove old components last (T033-T036)

6. **Phase F: Validation (T037-T040)**
   - Final E2E and integration tests
   - Runs after all implementation complete

### Dependency Graph

```plaintext
T001-T006 (Types)
    ↓
T007-T010 (ArticleImage) ← [Parallel] → T019-T023 (Data Layer)
    ↓
T011-T014 (ArticleCard)
    ↓
T015-T018 (Article)
    ↓
T024-T031 (Routes)
    ↓
T032-T036 (Cleanup)
    ↓
T037-T040 (Validation)
```

### Estimated Output

**Total Tasks**: ~40 tasks
**Parallel Tasks**: 15-20 (marked with [P])
**Sequential Tasks**: 20-25
**Estimated Time**: 15-20 hours (with parallel execution)

### Testing Strategy

- **TDD Red-Green-Refactor**: All [TEST] tasks before [IMPL] tasks
- **Contract-Driven**: Tests verify contracts (from contracts/ directory)
- **Outside-In**: E2E tests first, then component tests, then unit tests
- **Hybrid Approach**: Per constitution Principle III

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command - 64 tasks in 9 phases)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS (no new violations)
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

**Artifacts Generated**:

- [x] research.md (Phase 0)
- [x] data-model.md (Phase 1)
- [x] contracts/article-image.contract.md (Phase 1)
- [x] contracts/article-card.contract.md (Phase 1)
- [x] contracts/article.contract.md (Phase 1)
- [x] quickstart.md (Phase 1)
- [x] CLAUDE.md updated (Phase 1)
- [x] tasks.md (Phase 3 - 64 tasks generated)

**Next Command**: `/implement` - 開始執行 tasks.md，或手動執行個別任務

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
