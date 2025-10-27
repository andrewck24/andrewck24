# Phase 1: Data Model

**Feature**: MDX Frontmatter Schema Unification & Article Layout Enhancement
**Date**: 2025-10-26

## Overview

This document defines the data models for unified Article schema across Projects and Notes collections. All schemas are defined using Zod with TypeScript types inferred via `z.infer`.

---

## Entity Hierarchy

```
BaseArticle (shared fields)
├── ProjectArticle (extends BaseArticle + project-specific fields)
└── NoteArticle (= BaseArticle, no extensions)
```

---

## 1. BaseArticle

**Purpose**: Shared frontmatter schema for both Projects and Notes

**Zod Schema** (`source.config.ts`):

```typescript
import { frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

const baseArticleSchema = frontmatterSchema.extend({
  // Image configuration
  imageType: z.enum(["static", "generated"]).default("static"),

  // Static image path (when imageType === "static")
  image: z
    .string()
    .regex(
      /^\/images\/(projects|notes)\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
      "圖片路徑格式: /images/{projects|notes}/{locale}/*.{jpg|jpeg|png|webp|avif}"
    )
    .optional(),

  // Generated OG image config (when imageType === "generated")
  ogImage: z
    .object({
      icon: z.string().optional(),
      background: z.string().optional(),
      className: z.string().optional(),
    })
    .optional(),

  // Publication date
  date: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式: YYYY-MM-DD"),
      z.date(),
    ])
    .transform((val) => {
      if (val instanceof Date) {
        return val.toISOString().split("T")[0];
      }
      return val;
    }),

  // Tags for search filtering
  tags: z.array(z.string()).default([]),

  // Note: fumadocs frontmatterSchema already includes:
  // - title: string
  // - description: string
  // - slug: string (auto-generated from filename)
});
```

**Fields**:

| Field         | Type     | Required      | Default    | Description                                           |
| ------------- | -------- | ------------- | ---------- | ----------------------------------------------------- |
| `title`       | string   | ✅ Yes        | -          | Article title (from fumadocs base)                    |
| `description` | string   | ✅ Yes        | -          | Article description (from fumadocs base)              |
| `imageType`   | enum     | ✅ Yes        | `"static"` | Image type: `"static"` or `"generated"`               |
| `image`       | string   | ❌ No         | -          | Path to static image (required if imageType="static") |
| `ogImage`     | object   | ❌ No         | -          | OG image config (optional if imageType="generated")   |
| `date`        | string   | ✅ Yes        | -          | Publication date in YYYY-MM-DD format                 |
| `tags`        | string[] | ❌ No         | `[]`       | Array of tag strings for filtering                    |
| `slug`        | string   | ✅ Yes (auto) | -          | URL slug (auto-generated from filename)               |
| `locale`      | enum     | ✅ Yes (auto) | -          | Language code: `"zh-TW"`, `"en"`, or `"ja"`           |

**Validation Rules**:

- `image` path must match pattern: `/images/(projects|notes)/{locale}/*.{ext}`
- `date` must be valid YYYY-MM-DD format or Date object
- `tags` array elements can be any non-empty strings
- `imageType` determines which image field is required:
  - `"static"` → `image` should be provided
  - `"generated"` → `ogImage` can be provided (optional)

**Inferred TypeScript Type**:

```typescript
export type BaseArticle = z.infer<typeof baseArticleSchema>;

// Resolves to approximately:
// {
//   title: string;
//   description: string;
//   imageType: "static" | "generated";
//   image?: string;
//   ogImage?: {
//     icon?: string;
//     background?: string;
//     className?: string;
//   };
//   date: string;
//   tags: string[];
//   slug: string;
//   locale: "zh-TW" | "en" | "ja";
//   // ... other fumadocs base fields
// }
```

---

## 2. ProjectArticle

**Purpose**: Projects-specific extension with GitHub/Demo links and featured/order fields

**Zod Schema** (`source.config.ts`):

```typescript
const projectArticleSchema = baseArticleSchema.extend({
  // Project links
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),

  // Featured flag (existing field)
  featured: z.boolean().default(false),

  // Display order (existing field)
  order: z.number().int().min(1).max(99).optional(),
});

export const projects = defineDocs({
  dir: "content/projects",
  docs: {
    schema: projectArticleSchema,
  },
});
```

**Additional Fields** (beyond BaseArticle):

| Field       | Type         | Required | Default | Description                                |
| ----------- | ------------ | -------- | ------- | ------------------------------------------ |
| `githubUrl` | string (URL) | ❌ No    | -       | GitHub repository URL                      |
| `demoUrl`   | string (URL) | ❌ No    | -       | Live demo URL                              |
| `featured`  | boolean      | ❌ No    | `false` | Whether project is featured on homepage    |
| `order`     | number       | ❌ No    | -       | Display order (1-99) for featured projects |

**Validation Rules**:

- `githubUrl` and `demoUrl` must be valid URLs if provided
- `order` must be integer between 1-99 (inclusive)
- Both links are optional (projects can have 0, 1, or 2 links)

**Inferred TypeScript Type**:

```typescript
export type ProjectArticle = z.infer<typeof projectArticleSchema>;

// Extends BaseArticle with:
// {
//   ...BaseArticle,
//   githubUrl?: string;
//   demoUrl?: string;
//   featured: boolean;
//   order?: number;
// }
```

**Example Frontmatter**:

```yaml
---
title: "My Awesome Project"
description: "A full-stack Next.js application"
imageType: static
image: /images/projects/zh-TW/my-project.jpg
date: 2025-01-15
tags: ["next.js", "typescript", "tailwind"]
githubUrl: https://github.com/username/my-project
demoUrl: https://my-project.vercel.app
featured: true
order: 1
---
```

---

## 3. NoteArticle

**Purpose**: Notes collection (uses base schema without extensions)

**Zod Schema** (`source.config.ts`):

```typescript
const noteArticleSchema = baseArticleSchema;

export const notes = defineDocs({
  dir: "content/notes",
  docs: {
    schema: noteArticleSchema,
  },
});
```

**Fields**: Same as BaseArticle (no additional fields)

**Notes**:

- Notes do NOT have `githubUrl`, `demoUrl`, `featured`, or `order`
- Image paths use `/images/notes/{locale}/` pattern
- Otherwise identical to BaseArticle

**Inferred TypeScript Type**:

```typescript
export type NoteArticle = z.infer<typeof noteArticleSchema>;

// Identical to BaseArticle:
// {
//   title: string;
//   description: string;
//   imageType: "static" | "generated";
//   image?: string;
//   ogImage?: { ... };
//   date: string;
//   tags: string[];
//   slug: string;
//   locale: "zh-TW" | "en" | "ja";
// }
```

**Example Frontmatter**:

```yaml
---
title: "Learning TypeScript Generics"
description: "深入理解 TypeScript 泛型的使用方式"
imageType: static
image: /images/notes/zh-TW/typescript-generics.png
date: 2025-02-20
tags: ["typescript", "programming", "tutorial"]
---
```

---

## 4. ArticlePageData (Wrapper Type)

**Purpose**: Combines article metadata with MDX content component

**TypeScript Type** (`src/types/article.ts`):

```typescript
export type ArticlePageData<T extends BaseArticle = BaseArticle> = T & {
  /** MDX content component (compiled React component) */
  content: React.ComponentType;

  /** Raw MDX body text */
  body: string;
};

// Usage examples:
// ArticlePageData<ProjectArticle> - Project with content
// ArticlePageData<NoteArticle> - Note with content
// ArticlePageData<BaseArticle> - Generic article with content
```

**Fields**:

- All fields from article metadata (BaseArticle/ProjectArticle/NoteArticle)
- `content`: React component to render MDX
- `body`: Raw MDX string (for search indexing, etc.)

---

## 5. Tag System

**Purpose**: Tag taxonomy and filtering support

**Data Structure**:

```typescript
// Simple string array in frontmatter
export type Tag = string;

// Suggested tags (can be extended)
export const SUGGESTED_TAGS = [
  // Frontend
  "next.js",
  "react",
  "typescript",
  "javascript",
  "tailwind",
  "css",

  // Backend
  "node.js",
  "api",
  "database",

  // DevOps
  "docker",
  "ci-cd",

  // Other
  "tutorial",
  "architecture",
  "performance",
] as const;

// Orama search index field
export interface SearchIndex {
  id: string;
  title: string;
  description: string;
  url: string;
  structuredData: unknown;
  tag: string; // Primary tag (first in array) or 'uncategorized'
  tags: string; // All tags as comma-separated string
}
```

**Tag Storage**:

- In frontmatter: Array of strings (`tags: ["next.js", "react"]`)
- In Orama index:
  - `tag`: First tag or "uncategorized" (for backward compat)
  - `tags`: All tags joined by comma (for multi-tag filtering)

**Tag Validation**:

- No strict validation (hybrid mode: suggested + custom tags allowed)
- Tags should be lowercase kebab-case by convention
- Empty strings filtered out during processing

---

## 6. Language/Locale

**Purpose**: Multi-language support

**Supported Locales**:

```typescript
export const SUPPORTED_LOCALES = ["zh-TW", "en", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
// Resolves to: "zh-TW" | "en" | "ja"
```

**Locale Usage**:

- Determines image path: `/images/{collection}/{locale}/...`
- Used for date formatting: `toLocaleDateString(locale, {...})`
- Integrated with Fumadocs i18n system
- Language toggle requires available translations (detected via file existence)

**Translation Detection**:

```typescript
// Pseudo-code for checking available translations
function getAvailableLocales(
  slug: string,
  contentType: "projects" | "notes"
): Locale[] {
  return SUPPORTED_LOCALES.filter((locale) => {
    const page = source.getPage([slug], locale);
    return page !== null;
  });
}
```

---

## 7. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ MDX File (content/{projects|notes}/{locale}/*.mdx)     │
│                                                         │
│ ---                                                     │
│ title: "Example"                                        │
│ date: 2025-01-15                                        │
│ tags: ["next.js"]                                       │
│ githubUrl: "https://..."  # Projects only              │
│ ---                                                     │
│                                                         │
│ # Content here                                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Parsed by fumadocs-mdx
                 ↓
┌─────────────────────────────────────────────────────────┐
│ Zod Schema Validation (source.config.ts)               │
│ - baseArticleSchema.extend({...})                       │
│ - Validates all fields                                  │
│ - Transforms date                                       │
│ - Applies defaults (imageType, tags, etc.)             │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ z.infer<typeof schema>
                 ↓
┌─────────────────────────────────────────────────────────┐
│ TypeScript Type (BaseArticle | ProjectArticle | Note)  │
│ - Type-safe access to all fields                       │
│ - Generic support: ArticlePageData<ProjectArticle>     │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Used in components
                 ↓
┌─────────────────────────────────────────────────────────┐
│ Article Component (src/components/article/index.tsx)   │
│ - Renders article content + MDX                         │
│ - ArticleInfo displays metadata                         │
│ - Conditional rendering (project links, etc.)          │
└─────────────────────────────────────────────────────────┘
```

---

## Validation Matrix

| Scenario                  | imageType   | image             | ogImage | githubUrl | demoUrl | Valid?                           |
| ------------------------- | ----------- | ----------------- | ------- | --------- | ------- | -------------------------------- |
| Project with static image | "static"    | ✅                | -       | ✅        | ✅      | ✅ Yes                           |
| Project with generated OG | "generated" | -                 | ✅      | ✅        | -       | ✅ Yes                           |
| Project no links          | "static"    | ✅                | -       | -         | -       | ✅ Yes                           |
| Note with image           | "static"    | ✅                | -       | -         | -       | ✅ Yes                           |
| Note with links           | "static"    | ✅                | -       | ✅        | ✅      | ❌ No (Notes can't have links)   |
| Missing required title    | -           | -                 | -       | -         | -       | ❌ No (fumadocs base validation) |
| Invalid date format       | "static"    | ✅                | -       | -         | -       | ❌ No (regex fails)              |
| Invalid image path        | "static"    | `/wrong/path.jpg` | -       | -         | -       | ❌ No (regex fails)              |
| Tags not array            | "static"    | ✅                | -       | -         | -       | ❌ No (schema validation fails)  |

---

## Next Steps

With data model defined, proceed to **Contracts** generation (TypeScript interfaces and Zod schemas as code files).
