# Implementation Plan: MDX Frontmatter Schema Unification & Article Layout Enhancement

**Branch**: `004-mdx-frontmatter-1` | **Date**: 2025-10-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-mdx-frontmatter-1/spec.md`

## Execution Flow (/plan command scope)

```
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

Unify the MDX frontmatter schema across Projects and Notes collections while maintaining type-specific differences (GitHub/Demo links for Projects only). Enhance Article component with a responsive "Article Info" section displaying metadata (tags, date, language toggle, project links). Integrate Fumadocs Orama for tag-based search filtering. Use existing components (LanguageToggle, Badge, Button, Fumadocs GitHub info) following the priority: fumadocs components > shadcn/ui > custom components.

**Technical Approach**:

- Extract and unify base schema in `source.config.ts` using `frontmatterSchema.extend()`
- Use Zod schema inference (`z.infer`) for TypeScript types
- Implement Article Info as internal component within Article element
- Integrate Fumadocs Orama tag filtering during build process

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode) + Node.js 20+
**Primary Dependencies**: Next.js 16.0.0, React 19.2.0, fumadocs-mdx 13.0.0, fumadocs-ui 16.0.1, fumadocs-core 16.0.1, Zod 3.x, lucide-react 0.546.0
**Storage**: MDX files in `content/projects/` and `content/notes/`, static image files in `/public/images/{projects|notes}/{locale}/`
**Testing**: Jest (unit/component), Playwright (E2E), React Testing Library
**Target Platform**: Web (Next.js SSG), Browser support: modern evergreen browsers
**Project Type**: Single web application (Next.js App Router)
**Performance Goals**: Lighthouse score >90, LCP <2.5s, CLS <0.1
**Constraints**: Static site generation (SSG) required, build-time Orama indexing, responsive design (lg breakpoint at 1024px)
**Scale/Scope**: ~20-50 articles (projects + notes), 3 languages (zh-TW, en, ja), estimated 10-15 UI components affected

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Type Safety & Explicit Contracts

- ✅ **PASS**: All schemas use Zod with explicit typing
- ✅ **PASS**: TypeScript types derived via `z.infer<typeof schema>` (no manual type duplication)
- ✅ **PASS**: Component props will have typed interfaces (ArticleProps<T extends BaseArticle>)
- ✅ **PASS**: Strict mode enabled, no implicit any

### Principle II: Component Standards & Conventions

- ✅ **PASS**: File naming follows kebab-case (e.g., `article/index.tsx`)
- ✅ **PASS**: Component naming follows PascalCase (Article, ArticleInfo)
- ✅ **PASS**: Will add data-testid attributes for E2E testing
- ✅ **PASS**: Follows established file structure in `src/components/`

### Principle III: Test-Driven Development (Hybrid Strategy) - NON-NEGOTIABLE

- ✅ **PASS**: Plan includes TDD workflow (Red → Green → Refactor)
- ✅ **PASS**: Test pyramid strategy defined:
  - E2E (Playwright): Article page language switching, tag filtering navigation
  - Component (RTL): Article Info display logic, LanguageToggle integration, conditional rendering (project links)
  - Unit (Jest): Schema validation, tag processing utilities
- ✅ **PASS**: All tests will fail before implementation

### Principle IV: Internationalization First

- ✅ **PASS**: Reuses existing LanguageToggle with Fumadocs i18n
- ✅ **PASS**: Supports 3 locales (zh-TW, en, ja) in schema
- ✅ **PASS**: Date formatting locale-aware via `toLocaleDateString(locale)`
- ✅ **PASS**: Image paths include `{locale}` parameter

### Principle V: Performance & Optimization

- ✅ **PASS**: Responsive design using Tailwind breakpoints (lg: 1024px)
- ✅ **PASS**: Static generation (SSG) with fumadocs-mdx
- ✅ **PASS**: Build-time Orama indexing (no runtime overhead)
- ✅ **PASS**: Reusing existing components (no unnecessary bundle increase)

**Result**: Initial Constitution Check PASSED - No violations, proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
src/
├── app/                      # Next.js App Router pages
│   └── [lang]/
│       ├── projects/         # Projects listing and detail pages
│       └── notes/            # Notes listing and detail pages
├── components/
│   ├── article/              # ⚠️ PRIMARY CHANGE AREA
│   │   ├── index.tsx         # Article component (will add Article Info)
│   │   ├── card.tsx          # Article card
│   │   └── image.tsx         # Article image
│   ├── language-toggle.tsx   # ✅ REUSE (existing)
│   └── ui/                   # ✅ REUSE (shadcn/ui)
│       ├── badge.tsx         # For tags display
│       └── button.tsx        # For demo links
├── types/
│   ├── article.ts            # ⚠️ UPDATE (add tags, links, inferred types)
│   ├── project.ts            # May need updates
│   └── note.ts               # May need creation
└── lib/
    └── source.ts             # Fumadocs source utility

content/
├── projects/                 # ⚠️ SCHEMA CHANGE
│   ├── zh-TW/                # MDX files with new frontmatter
│   ├── en/
│   └── ja/
└── notes/                    # ⚠️ SCHEMA CHANGE
    ├── zh-TW/                # MDX files with new frontmatter
    ├── en/
    └── ja/

public/
└── images/
    ├── projects/             # ⚠️ PATH SIMPLIFIED (removed /hero/)
    │   ├── zh-TW/
    │   ├── en/
    │   └── ja/
    └── notes/                # ⚠️ PATH SIMPLIFIED (removed /hero/)
        ├── zh-TW/
        ├── en/
        └── ja/

source.config.ts              # ⚠️ CRITICAL UPDATE (unified schema)

tests/
├── e2e/                      # Playwright E2E tests
│   └── article-page.spec.ts  # NEW: Article Info interactions
├── components/               # React Testing Library
│   └── article/              # NEW: Article component tests
│       └── article-info.test.tsx
└── unit/                     # Jest unit tests
    └── schemas/              # NEW: Schema validation tests
        └── article-schema.test.ts
```

**Structure Decision**: Single Next.js web application with App Router. This is a frontend-only project with MDX content managed via fumadocs-mdx. Primary changes affect:

1. `source.config.ts` - unified schema definition
2. `src/components/article/` - Article component + internal Article Info
3. `src/types/article.ts` - type definitions from Zod inference
4. Content frontmatter in `content/projects/` and `content/notes/`

## Phase 0: Outline & Research

**Status**: ✅ COMPLETED

**Research Areas Investigated** (7 total):

1. **Schema Extension Strategy**: Evaluated fumadocs-mdx schema extension patterns
   - **Decision**: Use `frontmatterSchema.extend()` for base schema, collection-specific extends for Projects/Notes
   - **Rationale**: Native fumadocs support, type inference via Zod, avoids duplication
   - **Alternatives**: Separate schemas (rejected: duplication), manual validation (rejected: type safety)

2. **Type System Architecture**: How to derive TypeScript types from Zod schemas
   - **Decision**: Use `z.infer<typeof schema>` for all type definitions
   - **Rationale**: Single source of truth, automatic sync, no manual type maintenance
   - **Alternatives**: Manual type definitions (rejected: drift risk), `as const` (rejected: no runtime validation)

3. **Fumadocs Orama Integration**: Tag filtering implementation patterns
   - **Decision**: Custom `buildIndex()` with tag extraction, store primary tag + comma-separated tags field
   - **Rationale**: Supports both simple (single tag) and advanced (multi-tag) filtering
   - **Alternatives**: Separate tag indices (rejected: complexity), client-side filtering only (rejected: performance)

4. **Component Reuse Strategy**: Which existing components to leverage
   - **Decision**: LanguageToggle (existing), Badge/Button (shadcn/ui), Fumadocs GitHub info (if available)
   - **Rationale**: Follows constitution's DRY principle, maintains consistency, reduces bundle size
   - **Alternatives**: Custom implementations (rejected: reinventing wheel)

5. **Image Path Structure**: Optimal directory organization
   - **Decision**: Simplified `/images/{projects|notes}/{locale}/*.{ext}` (remove `/hero/` nesting)
   - **Rationale**: Simpler path, easier to maintain, matches content structure
   - **Alternatives**: Keep `/hero/` subdirectory (rejected: unnecessary nesting)

6. **Locale Type Location**: Where to define SUPPORTED_LOCALES
   - **Decision**: Keep in existing `src/types/article.ts` (L17-18), import in contracts
   - **Rationale**: Already defined, avoid duplication, single source of truth
   - **Alternatives**: Duplicate in contracts (rejected: DRY violation), new shared file (rejected: over-engineering)

7. **Article Info Component Pattern**: Export strategy for metadata display component
   - **Decision**: Internal component within Article element (not exported)
   - **Rationale**: Single-use component, tight coupling to Article, cleaner API surface
   - **Alternatives**: Exported component (rejected: unnecessary public API), inline JSX (rejected: readability)

**Output**: [research.md](./research.md) with all technical decisions documented

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETED

Prerequisites: research.md complete ✅

### 1. Data Model Design

**Entities Defined** (4 core + 1 wrapper):

- **BaseArticle**: Shared frontmatter schema with 10 fields
  - Core: title, description, slug, locale, date
  - Media: imageType, image, ogImage
  - Search: tags array
  - Validation: Regex patterns for image paths, date format

- **ProjectArticle**: Extends BaseArticle with project-specific fields
  - Links: githubUrl, demoUrl (both optional)
  - Display: featured flag, order number (1-99)

- **NoteArticle**: Identical to BaseArticle (no extensions)

- **Tag System**: Hybrid taxonomy (suggested + custom tags)
  - SUGGESTED_TAGS: 30+ predefined tags
  - Custom tags: Allowed for flexibility
  - Storage: Array in frontmatter, comma-separated in Orama index

- **ArticlePageData<T>**: Generic wrapper type
  - Combines metadata + MDX content component
  - Type parameter for Projects/Notes discrimination

**Output**: [data-model.md](./data-model.md)

### 2. Type Contracts Generation

**Zod Schemas Created** (`/contracts/schema.ts`):

```typescript
// Base schema with fumadocs extension
const baseArticleSchema = frontmatterSchema.extend({
  imageType: z.enum(["static", "generated"]).default("static"),
  image: z.string().regex(/^\/images\/(projects|notes)\/(zh-TW|en|ja)\/...$/),
  date: z.union([z.string(), z.date()]).transform(...),
  tags: z.array(z.string()).default([]),
});

// Projects extension
const projectArticleSchema = baseArticleSchema.extend({
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(1).max(99).optional(),
});

// Notes schema (= base)
const noteArticleSchema = baseArticleSchema;
```

**TypeScript Types** (via `z.infer`):

```typescript
export type BaseArticle = z.infer<typeof baseArticleSchema>;
export type ProjectArticle = z.infer<typeof projectArticleSchema>;
export type NoteArticle = z.infer<typeof noteArticleSchema>;
export type ArticlePageData<T extends BaseArticle> = T & { content; body };
```

**Output**: [contracts/schema.ts](./contracts/schema.ts)

### 3. Component Contracts

**Article Component Props** (`/contracts/article-props.ts`):

- `ArticleProps<T extends BaseArticle>`: Main component interface
  - Generic type for Projects/Notes type safety
  - contentType discriminator for conditional rendering

- `ArticleInfoProps`: Internal metadata component interface
  - date, locale, tags, githubUrl, demoUrl, contentType
  - Conditional project links based on contentType

**Output**: [contracts/article-props.ts](./contracts/article-props.ts)

### 4. Search Integration Contracts

**Orama Search Types** (`/contracts/tag-system.ts`):

- `OramaSearchIndex`: Extended index schema with tag fields
  - `tag`: Primary tag (backward compatibility)
  - `tags`: Comma-separated all tags (multi-filter support)

- `OramaBuildIndexFn`: Build-time indexing function type
  - Extracts tags from page metadata
  - Transforms to search-optimized format

**Output**: [contracts/tag-system.ts](./contracts/tag-system.ts)

### 5. Developer Documentation

**Quickstart Guide Created** ([quickstart.md](./quickstart.md)):

- 6 main sections with step-by-step instructions
- Section 1: Creating Projects with frontmatter examples
- Section 2: Creating Notes with schema differences
- Section 3: Tag usage (suggested + custom)
- Section 4: Image handling (static + generated OG)
- Section 5: Testing tag filtering scenarios
- Section 6: Troubleshooting common errors

### 6. Agent Context Update

**CLAUDE.md Updated** (executed `update-agent-context.sh claude`):

```bash
# Command executed:
.specify/scripts/bash/update-agent-context.sh claude

# Added to CLAUDE.md Active Technologies:
- TypeScript 5.9 (strict mode) + Next.js 16.0.0, React 19.2.0, fumadocs-mdx 13.0.0, fumadocs-ui 16.0.1, fumadocs-core 16.0.1, Zod 3.x, lucide-react 0.546.0 (004-mdx-frontmatter-1)
- File-based (MDX files in content/projects/ and content/notes/), fumadocs-mdx for content parsing (004-mdx-frontmatter-1)
```

**Output**: [CLAUDE.md](../../CLAUDE.md) (repository root)

### 7. Validation Matrix

**Schema Validation Scenarios Documented**:

| Scenario                               | Valid? | Notes                  |
| -------------------------------------- | ------ | ---------------------- |
| Project with static image + both links | ✅     | Standard case          |
| Project with generated OG + no links   | ✅     | Links optional         |
| Note with image                        | ✅     | No links allowed       |
| Note with links                        | ❌     | Schema prevents this   |
| Invalid date format                    | ❌     | Regex validation fails |
| Invalid image path                     | ❌     | Path regex fails       |
| Tags not array                         | ❌     | Zod validation fails   |

**Post-Design Constitution Re-check**: ✅ PASS (no new violations)

**Outputs Summary**:

- ✅ [data-model.md](./data-model.md) - 7 sections, 420 lines
- ✅ [contracts/schema.ts](./contracts/schema.ts) - Zod schemas + types
- ✅ [contracts/article-props.ts](./contracts/article-props.ts) - Component interfaces
- ✅ [contracts/tag-system.ts](./contracts/tag-system.ts) - Search integration types
- ✅ [quickstart.md](./quickstart.md) - Developer guide, 472 lines
- ✅ [CLAUDE.md](../../CLAUDE.md) - Agent context updated

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

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

- [x] Phase 0: Research complete (/plan command) ✅ 2025-10-27
- [x] Phase 1: Design complete (/plan command) ✅ 2025-10-27
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅ 2025-10-27
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented: N/A (no violations)

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
