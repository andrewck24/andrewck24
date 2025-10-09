# Tasks: About Me Page

**Input**: Design documents from `/Users/andrew/projects/andrewck24/specs/001-about-page/`
**Prerequisites**: plan.md, content-structure.md, quickstart.md, research.md

## Execution Flow (main)

```plaintext
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5+, Next.js 15+, React 19+, Fumadocs 15+
   → Structure: Next.js App Router with Fumadocs MDX integration
2. Load design documents:
   → content-structure.md: 3 MDX files (zh-TW, en, ja), 4 content sections
   → quickstart.md: 10 E2E test scenarios
   → research.md: PDF export with Puppeteer, Fumadocs i18n
3. Generate tasks by category:
   → Setup: Fumadocs configuration, directory structure
   → Tests: E2E tests for all scenarios (TDD)
   → Content: MDX files for each locale [P]
   → Routes: Page components and layouts
   → Navigation: Update shared layout
   → Polish: Performance validation, accessibility
4. Apply task rules:
   → MDX files = mark [P] (different files, independent)
   → Configuration files = sequential (dependencies)
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T020)
6. Validate: All test scenarios covered, all locales have content
7. Return: SUCCESS (20 tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- Repository root: `/Users/andrew/projects/andrewck24`
- Content: `content/about/{locale}/index.mdx`
- App routes: `src/app/[lang]/about/`
- Tests: `__tests__/e2e/`
- Scripts: `scripts/`

---

## Phase 3.1: Setup & Configuration

- [x] **T001** Update Fumadocs configuration in `source.config.ts` to add `about` collection
  - Import `defineDocs` from `fumadocs-mdx/config`
  - Add `export const about = defineDocs({ dir: 'content/about' })`
  - Configure frontmatter schema if needed
  - **Files**: `source.config.ts`
  - **Dependencies**: None

- [x] **T002** Create About source loader in `src/lib/source.ts`
  - Import `about` from `@/.source`
  - Add `aboutSource` loader with `baseUrl: '/about'`
  - Use `about.toFumadocsSource()` and existing i18n config
  - **Files**: `src/lib/source.ts`
  - **Dependencies**: T001 (requires about collection defined)

- [x] **T003** Create directory structure for About page content
  - Create `content/about/zh-TW/` directory
  - Create `content/about/en/` directory
  - Create `content/about/ja/` directory
  - **Files**: Directory creation only
  - **Dependencies**: None

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL**: These tests MUST be written and MUST FAIL before ANY implementation

- [x] **T004** E2E test for basic page access and content rendering in `tests/e2e/about-page.spec.ts`
  - Test Scenario 1 from quickstart.md
  - Navigate to `/zh-TW/about`
  - Verify page title, sections (Introduction, Skills, Education, Certifications)
  - Verify Education section (NTU 2017-2023, major, minor)
  - Verify Certifications (GCP, TOEIC, USCPA, JLPT N1)
  - Use data-testid attributes: `about-page`, `about-section-*`
  - **Files**: `tests/e2e/about-page.spec.ts`
  - **Dependencies**: None (test will fail until T007-T012 complete)
  - **Expected**: ❌ Test FAILS (page not found)

- [x] **T005** E2E test for multi-language content in `tests/e2e/about-page.spec.ts`
  - Verify Chinese page (`/zh-TW/about`): title, content (國立台灣大學, 文學士, 日本語文學)
  - Verify English page (`/en/about`): title, content (National Taiwan University, Bachelor of Arts)
  - Verify Japanese page (`/ja/about`): title, content (国立台湾大学, 文学士, 日本語文学)
  - Verify content parity: same number of sections across all languages
  - **Files**: `tests/e2e/about-page.spec.ts`
  - **Dependencies**: None (test will fail until T007-T012 complete)
  - **Expected**: ❌ Test FAILS (page not found)

- [x] **T006** E2E test for responsive design in `tests/e2e/about-page.spec.ts`
  - Set viewport to mobile (375x667), tablet (768x1024), desktop (1920x1080)
  - Verify no horizontal scroll, font-size >= 14px
  - Verify proper spacing and readability
  - **Files**: `tests/e2e/about-page.spec.ts`
  - **Dependencies**: None (test will fail until T007-T012 complete)
  - **Expected**: ❌ Test FAILS (page not found)
  - **Note**: Performance tests (load time, FCP, CLS) should be handled separately via Lighthouse CI, not in E2E tests

---

## Phase 3.3: Content Creation (ONLY after tests are failing)

- [x] **T007 [P]** Create Chinese (zh-TW) About page content in `content/about/zh-TW/index.mdx`
  - Add frontmatter: `title: 關於`, `description: Andrew Tseng - Software Engineer`
  - Section 1: Introduction (professional summary)
  - Section 2: Skills & Technologies (Languages, Frontend, Backend, Tools)
  - Section 3: Education (NTU 2017-2023, 日本語文學主修, 經濟學輔修)
  - Section 4: Certifications (GCP 2025, TOEIC 965/990 2024, USCPA 2023, JLPT N1 2019)
  - Use content structure from content-structure.md
  - **Files**: `content/about/zh-TW/index.mdx`
  - **Dependencies**: T003 (directory structure)

- [x] **T008 [P]** Create English (en) About page content in `content/about/en/index.mdx`
  - Add frontmatter: `title: About`, `description: Andrew Tseng - Software Engineer`
  - Section 1: Introduction (professional summary)
  - Section 2: Skills & Technologies (Languages, Frontend, Backend, Tools)
  - Section 3: Education (National Taiwan University 2017-2023, Major: Japanese Language and Literature, Minor: Economics)
  - Section 4: Certifications (GCP 2025, TOEIC 965/990 May 2024, USCPA May 2023, JLPT N1 July 2019)
  - Use content structure from content-structure.md
  - **Files**: `content/about/en/index.mdx`
  - **Dependencies**: T003 (directory structure)

- [x] **T009 [P]** Create Japanese (ja) About page content in `content/about/ja/index.mdx`
  - Add frontmatter: `title: 私について`, `description: Andrew Tseng - Software Engineer`
  - Section 1: Introduction (professional summary)
  - Section 2: Skills & Technologies (Languages, Frontend, Backend, Tools)
  - Section 3: Education (国立台湾大学 2017-2023, 日本語文学専攻, 経済学副専攻)
  - Section 4: Certifications (GCP 2025, TOEIC 965/990 2024年5月, USCPA 2023年5月, JLPT N1 2019年7月)
  - Use content structure from content-structure.md
  - **Files**: `content/about/ja/index.mdx`
  - **Dependencies**: T003 (directory structure)

---

## Phase 3.4: Route Implementation

- [x] **T010** Create About page layout in `src/app/[lang]/about/layout.tsx`
  - Import `DocsLayout` from `fumadocs-ui/layouts/docs`
  - Import `aboutSource` from `@/lib/source`
  - Import `baseOptions` from `@/lib/layout.shared`
  - Extract `lang` from params
  - Render `<DocsLayout tree={aboutSource.pageTree[lang]} {...baseOptions(lang)}>`
  - Add TypeScript interface for props with `params: Promise<{ lang: string }>`
  - **Files**: `src/app/[lang]/about/layout.tsx`
  - **Dependencies**: T002 (aboutSource), T007-T009 (content exists)

- [x] **T011** Create About page component in `src/app/[lang]/about/[[...slug]]/page.tsx`
  - Import `aboutSource` from `@/lib/source`
  - Import `DocsPage, DocsBody, DocsTitle, DocsDescription` from `fumadocs-ui/page`
  - Import `getMDXComponents` from `@/mdx-components`
  - Extract `lang` and `slug` from params
  - Get page: `const page = aboutSource.getPage(slug, lang)`
  - Handle not found: `if (!page) notFound()`
  - Render MDX content with `<page.data.body components={getMDXComponents()} />`
  - Add data-testid="about-page" to main container
  - **Files**: `src/app/[lang]/about/[[...slug]]/page.tsx`
  - **Dependencies**: T002 (aboutSource), T007-T009 (content exists)

- [x] **T012** Add generateStaticParams and generateMetadata to About page
  - Add `generateStaticParams`: `return aboutSource.generateParams()`
  - Add `generateMetadata`: extract page, return `{ title, description }`
  - Ensure proper TypeScript typing for params
  - **Files**: `src/app/[lang]/about/[[...slug]]/page.tsx`
  - **Dependencies**: T011 (page component exists)

---

## Phase 3.5: Navigation Integration

- [x] **T013** Update navigation links in `src/lib/layout.shared.tsx`
  - Add `getAboutText()` function with locale switch (zh-TW: 關於我, ja: について, default: About)
  - Add new link object to `links` array: `{ type: 'main', text: getAboutText(), url: \`/\${locale}/about\` }`
  - Add data-testid="nav-about-link" if possible
  - **Files**: `src/lib/layout.shared.tsx`
  - **Dependencies**: None (independent of About page implementation)

---

## Phase 3.6: Polish & Validation

- [x] **T014** Verify all E2E tests pass
  - Run Playwright tests: `npx playwright test about-page`
  - Verify T004-T006 all pass (previously failing tests now pass)
  - Fix any remaining issues
  - **Files**: N/A (validation task)
  - **Dependencies**: T004-T006 (tests exist), T007-T013 (implementation complete)

---

## Dependencies

**Setup Phase (T001-T003)**:

- T001 → T002 (source.ts requires about collection)
- T003 → T007-T009 (content requires directories)

**Tests (T004-T006) → Implementation (T007-T013)**:

- Tests MUST be written first (TDD)
- Tests will fail initially
- Implementation makes tests pass

**Content (T007-T009) → Routes (T010-T012)**:

- Pages require content to exist
- T007-T009 can run in parallel [P]

**Routes (T010-T012) sequential**:

- T010 → T011 → T012 (layout before page before metadata)

**Navigation (T013) independent**:

- Can run anytime, independent of About page implementation

**Validation (T014)**:

- Requires ALL previous tasks complete

---

## Parallel Execution Example

```bash
# After T003 completes, run content creation in parallel:
Task: "Create Chinese (zh-TW) About page content in content/about/zh-TW/index.mdx"
Task: "Create English (en) About page content in content/about/en/index.mdx"
Task: "Create Japanese (ja) About page content in content/about/ja/index.mdx"
```

These tasks are independent (different files, no shared state) and can run simultaneously.

---

## Notes

- **[P] tasks** = different files, no dependencies, safe for parallel execution
- **TDD**: Verify T004-T006 FAIL before starting T007
- **Build**: Run `npm run build` after T012 to regenerate `.source` directory
- **Test Locally**: Use `npm run dev` to test pages at `http://localhost:3000/{locale}/about`
- **Commit Strategy**: Commit after each phase completion (Setup, Tests, Content, Routes, Navigation, Validation)

---

## Validation Checklist

[GATE: Checked before marking tasks complete]

- [x] All E2E test scenarios covered by tasks (T004-T006: content, multi-language, responsive)
- [x] All three locales (zh-TW, en, ja) have content creation tasks (T007-T009)
- [x] All tests (T004-T006) come before implementation (T007-T013)
- [x] Parallel tasks [P] (T007-T009) truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Navigation integration included (T013)
- [x] Responsive design covered in E2E tests (T006); Performance metrics handled via Lighthouse CI separately

---

**Total Tasks**: 14
**Estimated Duration**: 4-6 hours
**Parallel Opportunities**: T007-T009 (3 tasks can run simultaneously)
