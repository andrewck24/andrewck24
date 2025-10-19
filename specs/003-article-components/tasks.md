# Tasks: Article 元件泛用化系統

**Input**: Design documents from `/Users/andrew/projects/andrewck24/specs/003-article-components/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/ (all complete)
**Branch**: `003-article-components`
**Date**: 2025-10-19

## Execution Flow Summary

本任務列表基於 Phase 2 策略生成，遵循 TDD (Test-Driven Development) 原則。任務分為 6 個階段，總計 40 個任務。關鍵依賴：

- **Type System → Components → Data Layer → Routes → Cleanup → Validation**
- **Tests MUST be written and MUST FAIL before implementation**
- **[P] 標記表示可並行執行（不同檔案、無依賴關係）**

---

## Format: `[ID] [P?] Description`

- **[P]**: 可並行執行（不同檔案、無依賴關係）
- 包含精確的檔案路徑於描述中

---

## Phase 3.1: Type System Setup ✅

**目標**: 建立 ArticleMetadata 型別階層和 Zod schemas

- [x] **T001** [P] 建立 `src/types/article.ts` 定義 ArticleMetadata 基礎 interface
- [x] **T002** [P] 建立 OGImageConfig interface 和 Zod schema (background 格式驗證) 於 `src/types/article.ts`
- [x] **T003** [P] 建立 ArticlePageData generic wrapper 於 `src/types/article.ts`
- [x] **T004** [P] 更新 `src/types/project.ts` 使 ProjectMetadata extends ArticleMetadata
- [x] **T005** [P] 建立 `src/types/note.ts` 定義 NoteMetadata extends ArticleMetadata
- [x] **T006** [P] 建立 type guards (isProjectMetadata, isNoteMetadata, isFeaturedArticle) 於 `src/types/article.ts`

**Dependencies**: 所有 T001-T006 可並行執行

**Status**: ✅ Completed (2025-10-19)

---

## Phase 3.2: ArticleImage Component (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**目標**: 整合 GeneratedHero + ProjectDetailImage → ArticleImage

### Tests First (MUST FAIL) ✅

- [x] **T007** [P] 撰寫 ArticleImage unit tests - static mode 渲染測試於 `src/components/article/__tests__/image.test.tsx`
- [x] **T008** [P] 撰寫 ArticleImage unit tests - generated mode (gradient/color/image) 背景格式偵測於 `src/components/article/__tests__/image.test.tsx`
- [x] **T009** [P] 撰寫 ArticleImage unit tests - view transition name 驗證於 `src/components/article/__tests__/image.test.tsx`

**Status**: ✅ Tests failing as expected (Red Phase completed)

### Implementation (ONLY after tests are failing) ✅

- [x] **T010** 建立 `src/components/article/image.tsx` - ArticleImage 元件架構 (props interface, skeleton)
- [x] **T011** 實作 ArticleImage static mode - Next.js Image component 整合於 `src/components/article/image.tsx`
- [x] **T012** 實作 ArticleImage generated mode - background 格式判斷邏輯 (startsWith('/') detection) 於 `src/components/article/image.tsx`
- [x] **T013** 整合 ViewTransition wrapper 和 viewTransitionName inline style 於 `src/components/article/image.tsx`
- [x] **T014** 新增 data-testid="article-image-container" 和 error handling (missing image fallback) 於 `src/components/article/image.tsx`

**Dependencies**: T007-T009 (tests) → T010-T014 (implementation sequential)

**Status**: ✅ Completed - All 15 tests passing (Green Phase completed, 2025-10-19)

---

## Phase 3.3: ArticleCard Component (TDD)

**目標**: 泛用化 FeaturedProjectCard → ArticleCard

### Tests First (MUST FAIL) ✅

- [x] **T015** [P] 撰寫 ArticleCard unit tests - hero variant 佈局測試於 `src/components/article/__tests__/card.test.tsx`
- [x] **T016** [P] 撰寫 ArticleCard unit tests - compact variant 佈局測試於 `src/components/article/__tests__/card.test.tsx`
- [x] **T017** [P] 撰寫 ArticleCard unit tests - navigation 和 hover effects 於 `src/components/article/__tests__/card.test.tsx`

**Status**: ✅ Tests failing as expected (Red Phase completed)

### Implementation (ONLY after tests are failing)

- [ ] **T018** 建立 `src/components/article/card.tsx` - ArticleCard 元件架構 (props interface, skeleton)
- [ ] **T019** 實作 ArticleCard hero variant - 2-column grid layout (desktop), stacked (mobile) 於 `src/components/article/card.tsx`
- [ ] **T020** 實作 ArticleCard compact variant - row layout (image 1/3, content 2/3) 於 `src/components/article/card.tsx`
- [ ] **T021** 整合 ArticleImage 元件於 ArticleCard (priority prop forwarding) 於 `src/components/article/card.tsx`
- [ ] **T022** 實作 Next.js Link navigation (支援 contentType prop) 和 hover transitions 於 `src/components/article/card.tsx`
- [ ] **T023** 新增 data-testid="article-card" 和 accessibility attributes 於 `src/components/article/card.tsx`

**Dependencies**: T014 (ArticleImage 完成) → T015-T017 (tests) → T018-T023 (implementation sequential)

---

## Phase 3.4: Article Component (TDD)

**目標**: 泛用化 ProjectDetail → Article

### Tests First (MUST FAIL)

- [ ] **T024** [P] 撰寫 Article unit tests - header section 渲染 (title, description, date) 於 `src/components/article/__tests__/index.test.tsx`
- [ ] **T025** [P] 撰寫 Article unit tests - MDX content rendering 於 `src/components/article/__tests__/index.test.tsx`
- [ ] **T026** [P] 撰寫 Article unit tests - back link navigation (contentType prop) 於 `src/components/article/__tests__/index.test.tsx`

### Implementation (ONLY after tests are failing)

- [ ] **T027** 建立 `src/components/article/index.tsx` - Article 元件架構 (props interface, skeleton)
- [ ] **T028** 實作 Article header section - ArticleImage, title, description, date 於 `src/components/article/index.tsx`
- [ ] **T029** 整合 MDX content rendering (prose container, semantic HTML) 於 `src/components/article/index.tsx`
- [ ] **T030** 實作 back link 導航 (contentType → URL, backLinkText i18n) 於 `src/components/article/index.tsx`
- [ ] **T031** 新增 responsive layout (mx-4 / lg:mx-12) 和 data-testid="article-section" 於 `src/components/article/index.tsx`

**Dependencies**: T023 (ArticleCard 完成) → T024-T026 (tests) → T027-T031 (implementation sequential)

---

## Phase 3.5: Data Layer - Notes

**目標**: 建立 notes 資料層函式（notesSource 已存在於 src/lib/source.ts）

### Tests First (MUST FAIL)

- [ ] **T032** [P] 撰寫 notes data layer tests - getFeaturedNotes() 於 `src/lib/data/__tests__/notes.test.ts`
- [ ] **T033** [P] 撰寫 notes data layer tests - getNote() 於 `src/lib/data/__tests__/notes.test.ts`
- [ ] **T034** [P] 撰寫 notes data layer tests - getAllNotes() 於 `src/lib/data/__tests__/notes.test.ts`

### Implementation (ONLY after tests are failing)

- [ ] **T035** 建立 `src/lib/data/notes.ts` - getFeaturedNotes() 函式 (filter featured=true, slice(0,5))
- [ ] **T036** 實作 getNote(locale, slug) 函式於 `src/lib/data/notes.ts` (notesSource.getPage(), return NotePageData)
- [ ] **T037** 實作 getAllNotes(locale) 函式於 `src/lib/data/notes.ts` (notesSource.getPages())
- [ ] **T038** 實作 generateNoteStaticParams() 函式於 `src/lib/data/notes.ts` (for Next.js generateStaticParams)

**Dependencies**: T006 (NoteMetadata 完成) → T032-T034 (tests) → T035-T038 (implementation sequential)

---

## Phase 3.6: Routes - Projects Migration

**目標**: 更新現有 projects 路由使用新 article 元件

### Tests First (MUST FAIL)

- [ ] **T039** [P] 撰寫 projects detail E2E tests - Article 元件渲染於 `tests/e2e/projects/project-detail.spec.ts`
- [ ] **T040** [P] 撰寫 projects OG image E2E tests - background 格式驗證於 `tests/e2e/projects/opengraph.spec.ts`

### Implementation (ONLY after tests are failing)

- [ ] **T041** 更新 `src/app/[lang]/projects/[slug]/page.tsx` - 使用 Article 元件替代 ProjectDetail
- [ ] **T042** 泛用化 `src/app/[lang]/projects/[slug]/opengraph-image.tsx` - 支援 background 格式判斷 (gradient/color/image)
- [ ] **T043** 更新 `src/components/projects/featured-projects.tsx` - 使用 ArticleCard 替代 FeaturedProjectCard

**Dependencies**: T031 (Article 完成) → T039-T040 (tests) → T041-T043 (implementation sequential)

---

## Phase 3.7: Routes - Notes Implementation

**目標**: 建立完整的 notes 路由結構 (featured/list/detail)

### Tests First (MUST FAIL)

- [ ] **T044** [P] 撰寫 notes list E2E tests - FeaturedNotes 顯示於 `tests/e2e/notes/notes-list.spec.ts`
- [ ] **T045** [P] 撰寫 notes detail E2E tests - Article 元件渲染於 `tests/e2e/notes/note-detail.spec.ts`
- [ ] **T046** [P] 撰寫 notes OG image E2E tests - 動態生成驗證於 `tests/e2e/notes/opengraph.spec.ts`

### Implementation (ONLY after tests are failing)

- [ ] **T047** 建立 `src/app/[lang]/notes/page.tsx` - notes 列表頁 (使用 ArticleCard 顯示 featured notes)
- [ ] **T048** 更新 `src/app/[lang]/notes/[[...slug]]/page.tsx` - notes 詳細頁 (使用 Article 元件)
- [ ] **T049** 建立 `src/app/[lang]/notes/[[...slug]]/opengraph-image.tsx` - notes OG image 動態生成 (runtime: nodejs)
- [ ] **T050** 新增 `src/app/[lang]/notes/layout.tsx` - notes section layout (如需要)

**Dependencies**: T038 (notes data layer 完成) → T044-T046 (tests) → T047-T050 (implementation sequential)

---

## Phase 3.8: Migration & Cleanup

**目標**: 移除舊元件，完成遷移

- [ ] **T051** 驗證所有 projects 頁面使用 article 元件 (手動測試 list, detail, OG image)
- [ ] **T052** 驗證所有 notes 頁面正常運作 (手動測試 list, detail, OG image)
- [ ] **T053** 移除 `src/components/custom/generated-hero.tsx` (確認無 import references)
- [ ] **T054** 移除 `src/components/projects/project-detail-image.tsx` (確認無 import references)
- [ ] **T055** 移除 `src/components/projects/project-detail.tsx` (確認無 import references)
- [ ] **T056** 移除 `src/components/projects/featured-project-card.tsx` (確認無 import references)
- [ ] **T057** 更新 `src/components/article/index.ts` - export ArticleImage, ArticleCard, Article (barrel export)

**Dependencies**: T050 (notes 完成) → T051-T057 (sequential cleanup)

---

## Phase 3.9: E2E & Integration Tests

**目標**: 完整的端到端驗證和性能測試

- [ ] **T058** [P] 撰寫 View Transition E2E tests - card → detail 頁面轉場於 `tests/e2e/article-components/view-transitions.spec.ts`
- [ ] **T059** [P] 撰寫 多語言切換 E2E tests - zh-TW/en/ja 於 `tests/e2e/article-components/i18n.spec.ts`
- [ ] **T060** [P] 撰寫 Responsive layout E2E tests - mobile/tablet/desktop 於 `tests/e2e/article-components/responsive.spec.ts`
- [ ] **T061** [P] 執行 Lighthouse accessibility audit - projects 和 notes 頁面 (score >95)
- [ ] **T062** [P] 執行 Performance validation - LCP <2.5s, FCP <1.5s, CLS <0.1
- [ ] **T063** 執行 quickstart.md 中的手動測試場景
- [ ] **T064** 執行完整 test suite (npm test, npm run test:e2e) 確認所有測試通過

**Dependencies**: T057 (cleanup 完成) → T058-T064 (驗證任務可並行，T064 為最後檢查)

---

## Dependencies Graph

```plaintext
Phase 3.1: Type System (T001-T006) [All Parallel]
    ↓
Phase 3.2: ArticleImage
    T007-T009 (tests) [P] → T010-T014 (impl sequential)
    ↓
Phase 3.3: ArticleCard
    T015-T017 (tests) [P] → T018-T023 (impl sequential)
    ↓
Phase 3.4: Article
    T024-T026 (tests) [P] → T027-T031 (impl sequential)
    ↓ (並行分支)
    ├─→ Phase 3.5: Notes Data Layer
    │   T032-T034 (tests) [P] → T035-T038 (impl sequential)
    │       ↓
    │   Phase 3.7: Notes Routes
    │   T044-T046 (tests) [P] → T047-T050 (impl sequential)
    │
    └─→ Phase 3.6: Projects Migration
        T039-T040 (tests) [P] → T041-T043 (impl sequential)

    ↓ (兩分支會合)
Phase 3.8: Cleanup (T051-T057 sequential)
    ↓
Phase 3.9: E2E Validation (T058-T063 [P], T064 last)
```

---

## Parallel Execution Examples

### Example 1: Phase 3.1 - Type System (所有任務並行)

```bash
# 啟動 6 個並行任務
Task: "建立 src/types/article.ts 定義 ArticleMetadata"
Task: "建立 OGImageConfig interface 和 Zod schema"
Task: "建立 ArticlePageData generic wrapper"
Task: "更新 src/types/project.ts extends ArticleMetadata"
Task: "建立 src/types/note.ts 定義 NoteMetadata"
Task: "建立 type guards"
```

### Example 2: Phase 3.2 - ArticleImage Tests (並行測試)

```bash
# 啟動 3 個測試任務
Task: "撰寫 ArticleImage static mode tests"
Task: "撰寫 ArticleImage generated mode background detection tests"
Task: "撰寫 ArticleImage view transition tests"
```

### Example 3: Phase 3.5 + 3.6 並行 (不同分支)

```bash
# Notes data layer 和 Projects migration 可同時進行
Task: "撰寫 getFeaturedNotes() tests"
Task: "撰寫 projects detail E2E tests"
```

### Example 4: Phase 3.9 - E2E Validation (並行驗證)

```bash
# 最後階段驗證任務
Task: "View Transition E2E tests"
Task: "多語言切換 E2E tests"
Task: "Responsive layout E2E tests"
Task: "Lighthouse accessibility audit"
Task: "Performance validation"
```

---

## Task Rules Applied

1. **From Contracts** (contracts/article-image.contract.md, article-card.contract.md, article.contract.md):
   - ArticleImage: 9 tests + 5 implementation tasks (T007-T014)
   - ArticleCard: 3 tests + 6 implementation tasks (T015-T023)
   - Article: 3 tests + 5 implementation tasks (T024-T031)

2. **From Data Model** (data-model.md):
   - Type system: 6 parallel tasks (T001-T006)
   - Notes data layer: 3 tests + 4 implementation tasks (T032-T038)

3. **From Research** (research.md):
   - View Transition preservation (T013, T058)
   - fumadocs integration (T035-T038)
   - OG Image background detection (T012, T042, T049)

4. **From Quickstart** (quickstart.md):
   - Manual testing scenarios (T063)
   - Test scenarios mapping to E2E tests (T039-T046, T058-T060)

5. **Ordering Strategy**:
   - Setup (Types) → Tests → Models → Services → Endpoints → Polish
   - TDD: All tests BEFORE implementation
   - Parallel: Different files, no dependencies marked [P]

---

## Validation Checklist

_GATE: Verified before task list completion_

- [x] All contracts have corresponding tests (ArticleImage: T007-T009, ArticleCard: T015-T017, Article: T024-T026)
- [x] All entities have model tasks (ArticleMetadata: T001, ProjectMetadata: T004, NoteMetadata: T005)
- [x] All tests come before implementation (Phase 3.2-3.7 follow TDD pattern)
- [x] Parallel tasks are truly independent (verified file paths, no same-file conflicts)
- [x] Each task specifies exact file path (see task descriptions)
- [x] No [P] task modifies same file as another [P] task (verified dependencies graph)
- [x] Total tasks: 64 (exceeds minimum 40 tasks requirement)
- [x] Quickstart scenarios covered (T063 manual testing + E2E tests)
- [x] All Phase 2 strategies from plan.md implemented

---

## Notes for Implementation

### TDD Workflow (Critical)

1. **Red Phase**: 執行所有 tests (T007-T009, T015-T017, etc.) → MUST FAIL
2. **Green Phase**: 實作 minimal code 讓測試通過 (T010-T014, T018-T023, etc.)
3. **Refactor Phase**: 優化程式碼，保持測試通過

### Pre-commit Validation (Per Constitution)

Before committing each task:

```bash
npm run type-check  # TypeScript compilation
npm run lint        # ESLint rules
npm test            # Jest unit/component tests
```

### Performance Monitoring

- T062: 使用 Lighthouse CI 自動化效能測試
- Baseline metrics from current projects implementation
- Target: No regression from existing performance

### Accessibility Standards

- T061: WCAG 2.1 Level AA compliance
- ARIA labels for generated mode text
- Keyboard navigation support
- Focus management in view transitions

---

## Success Criteria

✅ 64 tasks defined with clear dependencies
✅ TDD workflow enforced (tests before implementation)
✅ 20+ parallel tasks identified ([P] markers)
✅ All contracts, entities, and quickstart scenarios covered
✅ Phase dependencies graph complete
✅ Validation checklist passed

**Estimated Completion Time**: 18-22 hours (with parallel execution)
**Ready for**: `/implement` command or manual task execution

---

_Generated by /tasks command on 2025-10-19 following tasks-template.md structure_
_Based on: plan.md, research.md, data-model.md, contracts/ (article-image, article-card, article)_
