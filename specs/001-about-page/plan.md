# Implementation Plan: About Me Page

**Branch**: `001-about-page` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/andrew/projects/andrewck24/specs/001-about-page/spec.md`
**Architecture**: Fumadocs MDX-based content pages (similar to `/docs` structure)

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
6. Execute Phase 1 → content-structure.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Create an "About Me" page at `/about` route displaying professional background, education (National Taiwan University 2017-2023, major in Japanese Language and Literature, minor in Economics), certifications (GCP, USCPA, JLPT N1, TOEIC 965), and skills. Content stored as MDX files in `content/about/{locale}/index.mdx` using Fumadocs MDX infrastructure. Page supports three languages (zh-TW, en, ja) via Fumadocs i18n and responsive layout with DocsLayout. Target users are technical recruiters and hiring managers.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 15+, React 19+
**Primary Dependencies**: Fumadocs 15+ (MDX + i18n), Tailwind CSS 4+, shadcn/ui (for enhanced MDX components if needed)
**Storage**: Static MDX content in `content/about/{locale}/index.mdx` (no database, no TypeScript data objects)
**Testing**: Jest 30+ + React Testing Library 16+ (component tests), Playwright 1+ (E2E tests)
**Target Platform**: Web (SSG deployment via Vercel), responsive design for desktop + mobile
**Project Type**: Web application (Next.js App Router with Fumadocs MDX integration)
**Performance Goals**: Page load < 2 seconds, Lighthouse score > 90, minimum 14px font on mobile
**Constraints**: Static generation only (no SSR), Vercel free tier limits, MDX content-based (no complex interactive components)
**Scale/Scope**: Single-page feature with 3 language variants, ~6-8 content sections

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Type Safety & Explicit Contracts

✅ **PASS** - Feature requires:

- TypeScript configuration in `source.config.ts` for `about` collection
- Zod schema for frontmatter validation (`frontmatterSchema`)
- Type-safe MDX imports from `@/.source`
- Type-safe page component with proper params typing

### Principle II: Component Standards & Conventions

✅ **PASS** - Feature will follow:

- kebab-case file naming (e.g., `content/about/zh-TW/index.mdx`)
- PascalCase component exports in page.tsx
- data-testid attributes: `about-page`, `about-section-{name}`
- Consistent with existing docs structure

### Principle III: Test-Driven Development - Hybrid Strategy

✅ **PASS** - Test strategy planned:

- **E2E Tests (Playwright)**: Full page navigation, language switching, content rendering
- **Component Tests (RTL)**: Page component rendering, MDX content loading, error states
- Tests written BEFORE implementation (Red-Green-Refactor)

### Principle IV: Internationalization First

✅ **PASS** - Feature design includes:

- Three languages (zh-TW, en, ja) using existing Fumadocs i18n configuration
- MDX content files per locale: `content/about/{locale}/index.mdx`
- Locale-aware routing via `[lang]` dynamic segment

### Principle V: Performance & Optimization

✅ **PASS** - Performance requirements:

- Static Site Generation (no SSR)
- Page load < 2 seconds (FR-010)
- Lighthouse score target > 90
- Mobile-first responsive design with prose styling

**Initial Gate Status**: ✅ PASS - No constitutional violations detected

## Project Structure

### Documentation (this feature)

```plaintext
specs/001-about-page/
├── plan.md              # This file (/plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/plan command)
├── content-structure.md # Phase 1 output (/plan command) - MDX content organization
├── quickstart.md        # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```plaintext
source.config.ts                     # Add 'about' collection definition

content/
└── about/                           # NEW: About page content
    ├── zh-TW/
    │   └── index.mdx                # Chinese content
    ├── en/
    │   └── index.mdx                # English content
    └── ja/
        └── index.mdx                # Japanese content

src/
├── app/[lang]/
│   ├── about/                       # NEW: About page route
│   │   ├── layout.tsx               # About layout (using DocsLayout or custom)
│   │   └── [[...slug]]/
│   │       └── page.tsx             # About page component
│   └── (home)/
│       └── layout.tsx               # Update navigation links
└── lib/
    ├── source.ts                    # Add aboutSource loader
    └── layout.shared.tsx            # Update baseOptions with About link

__tests__/
└── e2e/
    └── about-page.spec.ts           # NEW: E2E tests (Playwright)
```

**Structure Decision**: Next.js 15 App Router with Fumadocs MDX integration. The feature uses:

- Fumadocs `defineDocs` to create `about` collection in `source.config.ts`
- MDX content files in `content/about/{locale}/index.mdx`
- Fumadocs `loader()` to create `aboutSource` in `src/lib/source.ts`
- Next.js App Router page at `app/[lang]/about/[[...slug]]/page.tsx`
- Centralized E2E tests in `__tests__/e2e/`

## Phase 0: Outline & Research

**Status**: ✅ Complete (see [research.md](./research.md))

**Key Decisions Made**:

1. **Content Structure**: MDX files with Fumadocs collection system
2. **Multi-language**: Fumadocs i18n with `defineI18n` (already configured)
3. **Responsive Design**: Mobile-first Tailwind CSS with prose styling
4. **No Timeline Component**: Use MDX prose with semantic HTML (no complex React components)

## Phase 1: Design & Contracts

(Prerequisites: research.md complete)

### 1. Define MDX Content Structure

**Output**: `content-structure.md`

Document the structure of About page MDX content:

```markdown
# Content Structure: About Page MDX

## Frontmatter Schema

- title: string (required)
- description: string (required)
- lastUpdated: date (optional)

## Content Sections

1. Introduction (## Introduction)
   - Professional summary
   - Current role/focus

2. Skills & Technologies (## Skills & Technologies)
   - Frontend: React, Next.js, TypeScript, etc.
   - Backend & Cloud: Node.js, GCP, etc.
   - Tools: Git, Fumadocs, etc.

3. Education (## Education)
   - ### National Taiwan University (2017-2023)
     - Bachelor of Arts
     - Major: Japanese Language and Literature
     - Minor: Economics
     - Relevant coursework

4. Certifications (## Certifications)
   - ### Google Cloud Platform (2025)
   - ### TOEIC (May 2024) - 965/990
   - ### USCPA (May 2023)
   - ### JLPT N1 (July 2019)

## MDX Components Used

- Default prose components (h2, h3, p, ul, etc.)
- Optional: Custom Card component for certifications
- Optional: Badge component for skills
```

### 2. Update Fumadocs Configuration

**File**: `source.config.ts`

Add `about` collection:

```typescript
import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";

// Existing docs collection
export const { docs, meta } = defineDocs({
  dir: "content/docs",
});

// NEW: About collection
export const about = defineDocs({
  dir: "content/about",
  docs: {
    schema: frontmatterSchema.extend({
      // about-specific fields if needed
    }),
  },
  // No meta files needed for about pages
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
```

### 3. Create About Source Loader

**File**: `src/lib/source.ts`

```typescript
import { docs, about } from "@/.source";
import { i18n } from "@/lib/i18n";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

// Existing docs source
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
});

// NEW: About source
export const aboutSource = loader({
  baseUrl: "/about",
  source: about.toFumadocsSource(),
  i18n,
});
```

### 4. Generate E2E Test Scenarios

**Output**: `quickstart.md`

Extract test scenarios from user stories in spec.md:

```markdown
# Quickstart: About Page E2E Tests

## Test Scenario 1: Basic Page Access

1. Navigate to `/zh-TW/about`
2. Verify page title is "關於我"
3. Verify sections: Introduction, Skills, Education, Certifications

## Test Scenario 2: Multi-language Switching

1. Start at `/zh-TW/about`
2. Switch to English
3. Verify URL is `/en/about`
4. Verify content is in English

## Test Scenario 3: Navigation Integration

1. Navigate to homepage
2. Verify "About" link exists in navigation
3. Click "About" link
4. Verify redirected to `/about` page
```

### 5. Update Navigation Links

**File**: `src/lib/layout.shared.tsx`

Update `baseOptions` to include About link:

```typescript
export function baseOptions(locale: string): BaseLayoutProps {
  const getAboutText = () => {
    switch (locale) {
      case "zh-TW":
        return "關於我";
      case "ja":
        return "について";
      default:
        return "About";
    }
  };

  return {
    // ... existing config
    links: [
      {
        type: "main",
        text: getDocsText(),
        url: `/${locale}/docs`,
      },
      // NEW
      {
        type: "main",
        text: getAboutText(),
        url: `/${locale}/about`,
      },
    ],
  };
}
```

### 6. Update Agent Context File

Run the agent context update script:

```bash
.specify/scripts/bash/update-agent-context.sh claude
```

**IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.

This will update `.claude/CLAUDE.md` with:

- About page routes and structure
- MDX content organization
- New test files

**Output**: content-structure.md, updated source.config.ts (documented), updated source.ts (documented), quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

(This section describes what the /tasks command will do - DO NOT execute during /plan)

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs
- Each content section → MDX content creation task
- Each route → page component creation task
- Each test scenario → E2E test task

**Ordering Strategy**:

- TDD order: E2E tests before implementation
- Dependency order: Configuration → Content → Routes → Tests Pass
- Mark [P] for parallel execution (independent MDX files)

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**Task Categories**:

1. Configuration tasks (source.config.ts, source.ts)
2. Content creation tasks (MDX files for each locale) [P]
3. Route implementation (page.tsx, layout.tsx)
4. Navigation integration (layout.shared.tsx)
5. Test implementation (E2E tests)
6. Validation tasks (run tests, performance checks)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

(These phases are beyond the scope of the /plan command)

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

(Fill ONLY if Constitution Check has violations that must be justified)

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

**Status**: No complexity deviations required

## Progress Tracking

(This checklist is updated during execution flow)

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---

_Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`_
