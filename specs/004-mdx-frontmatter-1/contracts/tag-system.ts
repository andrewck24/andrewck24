/**
 * Tag System Contracts
 *
 * Type definitions for tag taxonomy, Orama search integration,
 * and tag filtering functionality.
 *
 * Implementation Locations:
 * - Tag constants: lib/constants/tags.ts (to be created)
 * - Orama integration: app/api/search/* or search configuration
 */

// ============================================================================
// Tag Types
// ============================================================================

/**
 * Tag is a simple string identifier.
 * Supports hybrid mode: suggested tags (from SUGGESTED_TAGS) + custom tags.
 */
export type Tag = string;

/**
 * Suggested tags list for content authors.
 * Authors can use these or create custom tags.
 *
 * Convention: lowercase kebab-case
 *
 * @example
 * ```yaml
 * # In MDX frontmatter
 * tags: ["next.js", "typescript", "custom-tag"]
 * ```
 */
export const SUGGESTED_TAGS = [
  // Frontend Frameworks & Libraries
  "next.js",
  "react",
  "vue",
  "svelte",

  // Languages
  "typescript",
  "javascript",
  "python",
  "rust",

  // Styling
  "tailwind",
  "css",
  "scss",

  // Backend & APIs
  "node.js",
  "api",
  "graphql",
  "rest",

  // Database & Storage
  "database",
  "postgresql",
  "mongodb",
  "redis",

  // DevOps & Tools
  "docker",
  "ci-cd",
  "git",

  // Testing
  "testing",
  "jest",
  "playwright",

  // Content Types
  "tutorial",
  "guide",
  "reference",
  "case-study",

  // Topics
  "architecture",
  "performance",
  "security",
  "accessibility",
] as const;

/**
 * Union type of suggested tags.
 * Useful for autocomplete in IDEs.
 */
export type SuggestedTag = (typeof SUGGESTED_TAGS)[number];

// ============================================================================
// Orama Search Index Types
// ============================================================================

/**
 * Orama search index document structure.
 * Extended from fumadocs base index with tag fields.
 *
 * @see research.md Section 3: Fumadocs Orama Tag Filtering Integration
 */
export interface OramaSearchIndex {
  /**
   * Unique document ID (usually page URL)
   */
  id: string;

  /**
   * Page title
   */
  title: string;

  /**
   * Page description
   */
  description: string;

  /**
   * Page URL
   */
  url: string;

  /**
   * Structured data for advanced search
   */
  structuredData: unknown;

  /**
   * Primary tag (first tag from article.tags, or 'uncategorized')
   * For backward compatibility and simple filtering
   */
  tag: string;

  /**
   * All tags as comma-separated string
   * For multi-tag filtering: "next.js,typescript,tailwind"
   */
  tags: string;
}

/**
 * Configuration for Orama buildIndex function.
 * Extracts tag data from page metadata.
 *
 * @example
 * ```typescript
 * import { createFromSource } from 'fumadocs-core/search/server';
 *
 * const server = createFromSource(source, {
 *   buildIndex(page) {
 *     return {
 *       id: page.url,
 *       title: page.data.title,
 *       description: page.data.description,
 *       url: page.url,
 *       structuredData: page.data.structuredData,
 *       tag: page.data.tags?.[0] || 'uncategorized',
 *       tags: page.data.tags?.join(',') || '',
 *     };
 *   },
 * });
 * ```
 */
export type OramaBuildIndexFn = (page: {
  url: string;
  data: {
    title: string;
    description: string;
    structuredData: unknown;
    tags?: string[];
  };
}) => OramaSearchIndex;

// ============================================================================
// Tag Filtering Types
// ============================================================================

/**
 * Tag filter configuration for search client.
 * Used with useDocsSearch hook.
 *
 * @example
 * ```typescript
 * const { search, setSearch, query } = useDocsSearch({
 *   type: 'fetch',
 *   tag: selectedTag, // Single tag filter
 * });
 * ```
 */
export interface TagFilter {
  /**
   * Selected tag for filtering search results
   */
  tag?: string;
}

/**
 * Multi-tag filter (for advanced filtering).
 * Filters results that match ALL selected tags.
 *
 * @example
 * ```typescript
 * const filters: MultiTagFilter = {
 *   tags: ['next.js', 'typescript'], // AND condition
 * };
 * ```
 */
export interface MultiTagFilter {
  /**
   * Array of tags (AND condition)
   * Results must have all these tags
   */
  tags: string[];
}

// ============================================================================
// Tag Processing Utilities (Type Definitions)
// ============================================================================

/**
 * Normalize tag string to consistent format.
 * Convention: lowercase, kebab-case
 *
 * @example
 * ```typescript
 * normalizeTag("Next.js") // => "next.js"
 * normalizeTag("Type Script") // => "type-script"
 * ```
 */
export type NormalizeTagFn = (tag: string) => string;

/**
 * Validate if a tag is in suggested list.
 * Used for UI hints (e.g., show different styling for custom tags).
 *
 * @example
 * ```typescript
 * isSuggestedTag("next.js") // => true
 * isSuggestedTag("my-custom-tag") // => false
 * ```
 */
export type IsSuggestedTagFn = (tag: string) => tag is SuggestedTag;

/**
 * Filter empty or invalid tags from array.
 *
 * @example
 * ```typescript
 * filterValidTags(["next.js", "", " ", "typescript"]) // => ["next.js", "typescript"]
 * ```
 */
export type FilterValidTagsFn = (tags: string[]) => string[];

// ============================================================================
// Implementation Guidelines
// ============================================================================

/**
 * TAG STORAGE FORMAT:
 *
 * In MDX Frontmatter:
 * ```yaml
 * tags: ["next.js", "typescript", "tailwind"]
 * ```
 *
 * In Zod Schema (source.config.ts):
 * ```typescript
 * tags: z.array(z.string()).default([])
 * ```
 *
 * In Orama Index:
 * ```typescript
 * {
 *   tag: "next.js",            // Primary tag
 *   tags: "next.js,typescript,tailwind"  // All tags
 * }
 * ```
 */

/**
 * TAG FILTERING WORKFLOW:
 *
 * 1. Build Time (Orama Indexing):
 *    - Extract tags from article.tags
 *    - Store first tag as 'tag' field
 *    - Store all tags as comma-separated 'tags' field
 *
 * 2. Search Time (Client):
 *    - User selects tag from filter UI
 *    - Pass tag to useDocsSearch({ tag: selectedTag })
 *    - Orama filters results by tag field
 *
 * 3. Multi-Tag Filtering (Advanced):
 *    - Split 'tags' field by comma
 *    - Check if result tags include all selected tags
 *    - Filter results client-side or via Orama query
 */

/**
 * TAG VALIDATION RULES:
 *
 * - No strict validation (hybrid mode allows custom tags)
 * - Empty strings should be filtered out
 * - Whitespace-only strings should be filtered out
 * - Case-insensitive matching recommended
 * - Convention: lowercase kebab-case
 *
 * Example validation function:
 * ```typescript
 * function isValidTag(tag: string): boolean {
 *   return tag.trim().length > 0;
 * }
 * ```
 */

/**
 * TAG UI COMPONENTS:
 *
 * 1. Tag Display (in ArticleInfo):
 *    - Use shadcn/ui Badge component
 *    - Variant: "secondary" for normal tags
 *    - Optional: different variant for suggested vs custom tags
 *
 * 2. Tag Filter (in search UI):
 *    - Dropdown or button group
 *    - Show suggested tags first
 *    - Allow multi-select for advanced filtering
 *
 * 3. Tag Input (content authoring):
 *    - Autocomplete with suggested tags
 *    - Allow free-form custom tags
 *    - Visual indication of suggested vs custom
 */

/**
 * IMPLEMENTATION CHECKLIST:
 *
 * 1. Create lib/constants/tags.ts:
 *    - Export SUGGESTED_TAGS
 *    - Export utility functions (normalize, validate, filter)
 *
 * 2. Update Orama configuration:
 *    - Implement buildIndex with tag extraction
 *    - Ensure tags are indexed properly
 *
 * 3. Update Article component:
 *    - Display tags in ArticleInfo using Badge
 *    - Handle empty tags array gracefully
 *
 * 4. Add tag filtering to search:
 *    - Update search UI to include tag filter
 *    - Pass selected tag to useDocsSearch
 *
 * 5. Testing:
 *    - Unit tests for tag utility functions
 *    - Integration tests for tag filtering
 *    - E2E tests for tag search workflow
 */
