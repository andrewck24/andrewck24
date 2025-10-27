# Phase 0: Research & Technical Decisions

**Feature**: MDX Frontmatter Schema Unification & Article Layout Enhancement
**Date**: 2025-10-26

## Research Areas

### 1. Fumadocs MDX Schema Extension

**Decision**: Use `frontmatterSchema.extend()` for schema unification

**Rationale**:

- Fumadocs provides `frontmatterSchema` as a base schema that includes common fields
- `.extend()` method allows adding custom fields while preserving base functionality
- Supports schema composition: base schema → collection-specific extensions
- Enables type inference via Zod's `z.infer<typeof schema>`

**Implementation Pattern**:

```typescript
import { frontmatterSchema, defineDocs } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Extract unified base schema
const baseArticleSchema = frontmatterSchema.extend({
  imageType: z.enum(["static", "generated"]).default("static"),
  image: z.string().regex(/^\/images\/(projects|notes)\/(zh-TW|en|ja)\/...$/i).optional(),
  tags: z.array(z.string()).default([]),
  date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()]).transform(...),
});

// Projects-specific extension
export const projects = defineDocs({
  dir: "content/projects",
  docs: {
    schema: baseArticleSchema.extend({
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().min(1).max(99).optional(),
    }),
  },
});

// Notes use base schema only
export const notes = defineDocs({
  dir: "content/notes",
  docs: {
    schema: baseArticleSchema,
  },
});
```

**Alternatives Considered**:

- Manual schema duplication: Rejected due to maintenance burden and type drift risk
- Separate schema files: Rejected as Fumadocs `defineDocs` expects schema in `source.config.ts`
- Schema without base extraction: Rejected as it duplicates common fields

**References**:

- Fumadocs docs: `fumadocs-mdx/config` - `frontmatterSchema.extend()`
- Zod documentation on schema composition

---

### 2. Zod Schema to TypeScript Type Inference

**Decision**: Use `z.infer<typeof schema>` with `type` declarations (not `interface`)

**Rationale**:

- `z.infer` automatically generates TypeScript types from Zod schemas
- Eliminates manual type definition and keeps schema as single source of truth
- `type` (not `interface`) is compatible with Zod's inferred unions and intersections
- Supports generic typing: `ArticlePageData<T extends BaseArticle>`

**Implementation Pattern**:

```typescript
// In contracts/schema.ts
export const baseArticleSchema = frontmatterSchema.extend({
  /* ... */
});
export const projectArticleSchema = baseArticleSchema.extend({
  /* ... */
});
export const noteArticleSchema = baseArticleSchema;

// TypeScript types via inference
export type BaseArticle = z.infer<typeof baseArticleSchema>;
export type ProjectArticle = z.infer<typeof projectArticleSchema>;
export type NoteArticle = z.infer<typeof noteArticleSchema>;

// Generic wrapper type
export type ArticlePageData<T extends BaseArticle = BaseArticle> = T & {
  content: React.ComponentType;
  body: string;
};
```

**Alternatives Considered**:

- Manual type definitions: Rejected due to duplicate maintenance and drift risk
- `interface` declarations: Rejected as `z.infer` produces type aliases, not interfaces
- Runtime validation without types: Rejected as it loses compile-time safety

**References**:

- Zod docs: Type inference with `z.infer`
- TypeScript handbook: Type aliases vs interfaces

---

### 3. Fumadocs Orama Tag Filtering Integration

**Decision**: Add `tags` field to search index via `buildIndex()` configuration

**Rationale**:

- Fumadocs Orama integration supports custom fields in search index
- `buildIndex()` function in search server allows extracting frontmatter data
- Client-side search hook (`useDocsSearch`) accepts `tag` parameter for filtering
- Build-time indexing ensures no runtime performance impact

**Implementation Pattern**:

**Server-side (Search Index Generation)**:

```typescript
// In search configuration (e.g., app/api/search/route.ts or similar)
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

const searchServer = createFromSource(source, {
  buildIndex(page) {
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: page.data.tags?.[0] || "uncategorized", // Use first tag or default
      // OR: Store all tags as comma-separated string
      tags: page.data.tags?.join(",") || "",
    };
  },
});
```

**Client-side (Tag Filtering)**:

```typescript
import { useDocsSearch } from "fumadocs-core/search/client";

// In search UI component
const { search, setSearch, query } = useDocsSearch({
  type: "fetch",
  tag: selectedTag, // Filter by selected tag
});
```

**Tag Schema in Frontmatter**:

```typescript
// In source.config.ts
schema: baseArticleSchema.extend({
  tags: z.array(z.string()).default([]),
  // Tags are array of strings, e.g., ['next.js', 'react', 'typescript']
});
```

**Alternatives Considered**:

- Runtime tag filtering: Rejected due to performance impact on large content sets
- Full-text search only (no tags): Rejected as it doesn't support structured filtering
- Separate tag index: Rejected as Fumadocs Orama supports custom fields natively

**References**:

- Fumadocs docs: Orama search configuration with `buildIndex`
- Fumadocs docs: Client-side search with tag filtering

---

### 4. Fumadocs GitHub Info Components

**Decision**: Use Fumadocs built-in GitHub components for repository links

**Rationale**:

- Fumadocs UI provides pre-built GitHub info components (likely `<GitHubLink />` or similar)
- Consistent styling with Fumadocs theme
- Handles external link best practices (rel="noopener noreferrer")
- Reduces custom component development

**Research Finding**:
After checking Fumadocs UI exports, the specific component name needs verification. Common patterns:

- `fumadocs-ui` may export `<GitHubLink />` or similar
- May need to check `fumadocs-ui/components` for available exports
- Fallback: Use Next.js `<Link>` with GitHub icon from lucide-react

**Implementation Pattern (Pending Verification)**:

```typescript
// Option 1: If Fumadocs provides GitHub component
import { GitHubLink } from 'fumadocs-ui/components';

<GitHubLink href={githubUrl} />

// Option 2: Custom implementation with fumadocs styling
import { buttonVariants } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';

<Link
  href={githubUrl}
  className={buttonVariants({ variant: 'outline' })}
  target="_blank"
  rel="noopener noreferrer"
>
  <Github className="size-4" />
  View on GitHub
</Link>
```

**Alternatives Considered**:

- Custom GitHub link component: Will use if Fumadocs doesn't provide one
- Plain anchor tag: Rejected due to lack of Next.js optimizations
- Button component for all links: Rejected as GitHub may need different styling than Demo

**Action Required**: Verify `fumadocs-ui` exports during implementation phase

**References**:

- Fumadocs UI documentation (component exports)
- lucide-react icons library

---

### 5. Responsive Article Layout (Article Info Section)

**Decision**: Implement Article Info as internal component using Tailwind grid at lg breakpoint

**Rationale**:

- Tailwind `lg:` breakpoint is 1024px (matches requirement)
- CSS Grid provides clean 2-column layout on wide screens
- Internal component (not exported) keeps implementation encapsulated
- Conditional rendering for project-specific links (GitHub/Demo)

**Implementation Pattern**:

```tsx
// In src/components/article/index.tsx

// Internal component (not exported)
interface ArticleInfoProps {
  date: string;
  locale: Locale;
  tags: string[];
  githubUrl?: string;      // Projects only
  demoUrl?: string;    // Projects only
  contentType: "projects" | "notes";
}

function ArticleInfo({ date, locale, tags, githubUrl, demoUrl, contentType }: ArticleInfoProps) {
  return (
    <aside className="space-y-6">
      {/* Date */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Published</h3>
        <time dateTime={date}>
          {new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Project Links (Projects only) */}
      {contentType === "projects" && (githubUrl || demoUrl) && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Links</h3>
          <div className="space-y-2">
            {githubUrl && (
              // Fumadocs GitHub component or custom Link
            )}
            {demoUrl && (
              <Button variant="outline" asChild>
                <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                  Live Demo
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Language Toggle */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Language</h3>
        <LanguageToggle>
          <Languages className="size-5" />
        </LanguageToggle>
      </div>
    </aside>
  );
}

// Main Article component
export function Article<T extends BaseArticle>({ article, contentType }: ArticleProps<T>) {
  return (
    <div className="w-full">
      {/* Remove border/background from article container */}
      <article className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        {/* Main content */}
        <div>
          <ArticleImage {...} />
          <header>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
          </header>
          <MDXContent />
        </div>

        {/* Article Info sidebar (lg+) or bottom (mobile) */}
        <ArticleInfo
          date={article.date}
          locale={article.locale}
          tags={article.tags}
          githubUrl={'githubUrl' in article ? article.githubUrl : undefined}
          demoUrl={'demoUrl' in article ? article.demoUrl : undefined}
          contentType={contentType}
        />
      </article>
    </div>
  );
}
```

**Alternatives Considered**:

- Separate sidebar component file: Rejected as it's not reusable outside Article
- Flexbox layout: Rejected as Grid provides cleaner 2-column semantics
- Fixed sidebar width: Using 300px as reasonable width for metadata

**References**:

- Tailwind docs: Responsive design with lg breakpoint
- Tailwind docs: Grid layout utilities

---

### 6. Image Path Simplification

**Decision**: Remove `/hero/` subdirectory from image paths

**Rationale**:

- Simplifies path structure: `/images/{collection}/{locale}/*`
- Reduces nesting depth
- More flexible for future image types (not just hero images)
- Backward compatible if we migrate existing images

**Updated Paths**:

```
Before: /images/projects/hero/zh-TW/project-name.jpg
After:  /images/projects/zh-TW/project-name.jpg

Before: /images/notes/hero/en/note-slug.png
After:  /images/notes/en/note-slug.png
```

**Schema Regex Update**:

```typescript
// Before
image: z.string().regex(
  /^\/images\/projects\/hero\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i
);

// After
image: z.string().regex(
  /^\/images\/(projects|notes)\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i
);
```

**Migration Note**: Existing image files may need to be moved during implementation

---

### 7. Existing Components Reuse Strategy

**Decision**: Prioritize fumadocs > shadcn/ui > custom components

**Components Inventory**:

✅ **Existing & Reusable**:

- `LanguageToggle` (`src/components/language-toggle.tsx`): Integrates with Fumadocs i18n context
- `Badge` (`src/components/ui/badge.tsx`): shadcn/ui, use for tags
- `Button` (`src/components/ui/button.tsx`): shadcn/ui, use for demo links

⚠️ **To Verify**:

- Fumadocs GitHub info component: Check `fumadocs-ui` exports

🆕 **To Create**:

- `ArticleInfo` (internal component within `Article`)

**Integration Points**:

```typescript
// LanguageToggle usage
import { LanguageToggle } from '@/components/language-toggle';
import { Languages } from 'lucide-react';

<LanguageToggle>
  <Languages className="size-5" />
</LanguageToggle>

// Badge usage for tags
import { Badge } from '@/components/ui/badge';

{tags.map(tag => (
  <Badge key={tag} variant="secondary">{tag}</Badge>
))}

// Button usage for demo link
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

<Button variant="outline" asChild>
  <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
    <ExternalLink className="size-4" />
    Live Demo
  </Link>
</Button>
```

**lucide-react Icons Needed**:

- `Github`: For GitHub link
- `ExternalLink`: For Live Demo link
- `Tags`: For tags section heading
- `Languages`: For language toggle trigger

---

## Summary of Decisions

| Area               | Decision                                              | Key Tool/Pattern                          |
| ------------------ | ----------------------------------------------------- | ----------------------------------------- |
| Schema Unification | Extract base schema with `.extend()`                  | `frontmatterSchema.extend()`              |
| Type System        | Use `z.infer` with `type` declarations                | `z.infer<typeof schema>`                  |
| Tag Filtering      | Build-time Orama indexing with custom field           | `buildIndex()` + `useDocsSearch({ tag })` |
| GitHub Links       | Use Fumadocs component (verify) or custom with lucide | `fumadocs-ui` or `<Link>` + `<Github />`  |
| Responsive Layout  | CSS Grid with lg breakpoint (1024px)                  | `lg:grid lg:grid-cols-[1fr_300px]`        |
| Component Reuse    | Maximize existing components                          | LanguageToggle, Badge, Button             |
| Image Paths        | Simplify to `/images/{collection}/{locale}/*`         | Remove `/hero/` nesting                   |

---

## Next Phase

All technical unknowns resolved. Proceeding to **Phase 1: Design & Contracts**.
