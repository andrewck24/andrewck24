# Feature Specification: MDX Frontmatter Schema Unification & Article Layout Enhancement

**Feature Branch**: `004-mdx-frontmatter-1`
**Created**: 2025-10-26
**Status**: Draft
**Input**: User description: "mdx frontmatter

1. @source.config.ts 中，notes 的 frontmatter schema 應該與 projects 共用（需注意圖片路徑差異）
2. 因為 @source.config.ts 中已有 imageType 的預設值，所以 article 相關元件的介面應該將 imageType 設為必填
3. 若可以將 2. 的 zod schema 直接轉為 typescript interface/type 套用在 article 相關元件的介面會更好（思考應該使用 interface 還是 type）
4. 查看 fumadocs orama 的 tag filter 相關文件，在 article 型別中加入 tags 欄位（此處需要在查看文件後深入討論）
5. 移除 Article 元件的邊框，加入 tags, date 等資訊，並且重新排版（有 RWD，在最寬畫面時將這些資訊放在右欄）
6. 在上一點中的 Article 資訊欄中加入語言切換功能

Navbar

1. 將 Header 元件從 `src/components/layouts/home/index.tsx` 與同資料夾中相關元件移動到 `src/components/layouts/navbar.tsx` 列為獨立元件
2. 在 notes, projects 頁面中提供 language toggle 功能，透過 layout props 禁用 navbar 中的語言切換按鈕

## Additional Requirements

- Project metadata 需要 GitHub 和 Live Demo 連結欄位（選填）
- 這些連結顯示在右側欄元數據區域
- Notes 不需要這些連結欄位"

## Execution Flow (main)

```plaintext
1. Parse user description from Input
   → ✓ Identified three main areas: MDX frontmatter, Article layout, Navbar
2. Extract key concepts from description
   → ✓ Actors: Content authors, readers, site administrators
   → ✓ Actions: Viewing articles, filtering by tags, switching languages, navigating, accessing project links
   → ✓ Data: Article metadata (tags, dates, images, project links), frontmatter schemas
   → ✓ Constraints: Maintain consistency, support multi-language, differentiate Projects vs Notes
3. For each unclear aspect:
   → ✓ RESOLVED: Tag taxonomy - hybrid mode (suggested tags + custom tags)
   → ✓ RESOLVED: Language toggle behavior - redirect to equivalent page in other language
   → ✓ RESOLVED: Right column layout breakpoint - 1024px (lg)
   → ✓ RESOLVED: Missing language handling - hide unavailable options + create not found page
   → ✓ RESOLVED: Project links (GitHub/Live Demo) - both optional, display in metadata sidebar
   → ✓ RESOLVED: Notes links - not needed
4. Fill User Scenarios & Testing section
   → ✓ Completed below
5. Generate Functional Requirements
   → ✓ Completed below (28 requirements)
6. Identify Key Entities
   → ✓ Completed below
7. Run Review Checklist
   → ✓ All items verified
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

**As a content author**, I want to use a unified content structure for both projects and notes so that I can manage metadata consistently and leverage the same feature set (tags, images, dates) across all content types. For projects specifically, I want to include optional links to GitHub repositories and live demos. I also want flexibility to use suggested tags or create custom ones as needed.

**As a reader**, I want to view well-organized article pages with clear metadata (publication date, tags, and for projects: GitHub/demo links) and easy language switching so that I can quickly understand the content context, access the same article in my preferred language, and explore project resources.

**As a site administrator**, I want content to be searchable by tags so that readers can discover related articles efficiently through the search system.

### Acceptance Scenarios

1. **Given** I am viewing a project article on a wide screen (≥1024px), **When** the page loads, **Then** I should see the article content in the main column and metadata (date, tags, GitHub link, Live Demo link, language toggle) displayed in a right sidebar

2. **Given** I am viewing a project article that has a GitHub repository, **When** I look at the metadata sidebar, **Then** I should see a clickable GitHub link

3. **Given** I am viewing a project article that has no Live Demo, **When** I look at the metadata sidebar, **Then** the Live Demo link should not be displayed

4. **Given** I am viewing a note article on a wide screen, **When** I look at the metadata sidebar, **Then** I should see date, tags, and language toggle, but NOT GitHub or Live Demo links

5. **Given** I am viewing an article page on a narrow screen (<1024px), **When** the page loads, **Then** I should see the article content and metadata arranged in a single-column layout without horizontal scrolling

6. **Given** I am viewing an article in Traditional Chinese (zh-TW), **When** I click on the English language option in the article metadata section, **Then** I should be navigated to the English version of the same article

7. **Given** I am viewing an article that doesn't have a Japanese translation, **When** I look at the language toggle options, **Then** the Japanese option should be hidden from the list

8. **Given** I am a content author creating a new note, **When** I define the frontmatter, **Then** I should use the same base schema fields as projects (title, description, imageType, image, ogImage, date, tags) with note-specific image paths, but without GitHub/Live Demo fields

9. **Given** I am a content author adding tags to an article, **When** I start typing, **Then** I should see a list of suggested tags, but I can also create and add my own custom tags

10. **Given** a reader is searching for content using tag filters, **When** they select one or more tags, **Then** the search results should show only articles (both projects and notes) matching those tags

11. **Given** I am viewing the projects or notes listing page, **When** I interact with the navigation bar, **Then** I should see a language toggle control, and the global navbar language toggle should be disabled to avoid confusion

### Edge Cases

- What happens when a project has both GitHub and Live Demo links? Both should be displayed in the metadata sidebar.
- What happens when a project has neither GitHub nor Live Demo links? The links section should be hidden or not rendered.
- What happens when an article has 10+ tags? The layout should handle overflow gracefully without breaking the design.
- What happens if a user manually types a URL for an article translation that doesn't exist? The system should display a not found page explaining that the article is not available in that language.
- How does the system handle very long tag names (e.g., "advanced-machine-learning-techniques")? Tags should wrap or truncate with ellipsis as needed.
- What happens if a tag filter is applied but no results match? The search should show a "no results" message and suggest removing filters.
- How does the system handle articles with no tags? The tags section should either be hidden or show "No tags" placeholder text.
- What happens when a GitHub or Live Demo URL is invalid? Validation should catch this during schema checking and show an error message.

## Requirements _(mandatory)_

### Functional Requirements

#### Content Schema & Metadata

- **FR-001**: System MUST support a unified base frontmatter schema that can be used by both projects and notes content types
- **FR-002**: System MUST allow different image path patterns for projects (`/images/projects/hero/{locale}/*`) vs. notes (`/images/notes/hero/{locale}/*`) while maintaining the same base schema structure
- **FR-003**: System MUST include a tags field in article metadata that supports an array of tag strings
- **FR-004**: System MUST provide a suggested tags list for content authors while also allowing custom tag creation (hybrid mode)
- **FR-005**: System MUST include imageType as a required field in article metadata with values "static" or "generated"
- **FR-006**: System MUST validate all frontmatter against the defined schema and show clear error messages when validation fails
- **FR-007**: Tags MUST be compatible with Fumadocs Orama search tag filtering functionality
- **FR-008**: Projects schema MUST extend the base schema with optional GitHub repository URL field
- **FR-009**: Projects schema MUST extend the base schema with optional Live Demo URL field
- **FR-010**: Notes schema MUST NOT include GitHub or Live Demo URL fields
- **FR-011**: System MUST validate GitHub and Live Demo URLs when provided (proper URL format)

#### Article Display & Layout

- **FR-012**: Article pages MUST display publication date in a user's locale-appropriate format (e.g., "October 26, 2025" for en, "2025年10月26日" for zh-TW, "2025年10月26日" for ja)
- **FR-013**: Article pages MUST display all associated tags in the metadata section as clickable/interactive elements
- **FR-014**: Project article pages MUST display GitHub link in metadata sidebar when provided
- **FR-015**: Project article pages MUST display Live Demo link in metadata sidebar when provided
- **FR-016**: Project article pages MUST hide GitHub/Live Demo sections when those links are not provided
- **FR-017**: Note article pages MUST NOT display GitHub or Live Demo links regardless of data
- **FR-018**: Article pages MUST remove the border and background card styling from the main content container for a cleaner, borderless design
- **FR-019**: Article pages MUST use a responsive layout with a breakpoint at 1024px (lg) where:
  - ≥1024px: Metadata displayed in a right sidebar
  - <1024px: Metadata displayed in single-column layout
- **FR-020**: Article metadata section MUST include a language toggle control showing only available language options
- **FR-021**: System MUST maintain consistent visual hierarchy and readability across all viewport sizes
- **FR-022**: Article pages MUST handle edge cases gracefully (many tags, long tag names, no tags, missing links)

#### Navigation & Language Switching

- **FR-023**: Language toggle in article metadata MUST navigate to the equivalent article in the selected language
- **FR-024**: Language toggle MUST hide language options that are not available for the current article
- **FR-025**: System MUST display a not found page when users attempt to access an article translation that doesn't exist (e.g., via manual URL entry)
- **FR-026**: Projects and notes page layouts MUST support disabling the global navbar language toggle via layout configuration when content-specific language controls are active
- **FR-027**: Language toggle controls MUST clearly indicate the current language with visual styling

#### Search & Discovery

- **FR-028**: System MUST support tag-based filtering in search functionality integrated with Fumadocs Orama
- **FR-029**: Tags MUST be indexed and searchable via the site's search engine
- **FR-030**: Search results MUST be filterable by one or more tags simultaneously
- **FR-031**: Tag filtering MUST work consistently across both projects and notes content types
- **FR-032**: Search MUST show appropriate "no results" messaging when tag filters produce no matches

### Key Entities _(include if feature involves data)_

- **Article (Base)**: Represents any content item (project or note)
  - Base Attributes: title, description, date, locale (zh-TW/en/ja), slug, imageType (static/generated), image path (optional), ogImage config (optional), tags array
  - Relationships: Belongs to a content collection (projects or notes); may have translations in other locales

- **Project Article (extends Article)**: Represents a project showcase item
  - Extended Attributes: githubUrl (optional), demoUrl (optional), featured (boolean), order (number)
  - Image Path Pattern: `/images/projects/{locale}/*`
  - Relationships: Inherits all Article relationships

- **Note Article (extends Article)**: Represents a note or blog post
  - Extended Attributes: (none beyond base Article)
  - Image Path Pattern: `/images/notes/{locale}/*`
  - Relationships: Inherits all Article relationships

- **Tag**: A categorical label for content discovery
  - Attributes: tag identifier (string)
  - Source: Hybrid - either from suggested tag list or custom-created by author
  - Relationships: Associated with one or more Articles (Projects or Notes); used in search filtering via Orama

- **Content Collection**: A grouping of articles by type
  - Types: Projects, Notes
  - Attributes: collection name, image path pattern, schema definition (base + extensions)
  - Relationships: Contains multiple Articles; enforces schema validation

- **Language/Locale**: Represents a supported site language
  - Supported values: zh-TW (Traditional Chinese), en (English), ja (Japanese)
  - Relationships: Each Article exists in one locale; may have translations (equivalent Articles) in other locales

- **Not Found Page**: Special page for missing article translations
  - Purpose: Inform users when a requested article translation doesn't exist
  - Trigger: Manual URL entry for non-existent translation
  - Content: User-friendly message explaining the article is not available in the requested language

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked and resolved via user clarification
- [x] User scenarios defined (11 acceptance scenarios)
- [x] Requirements generated (32 functional requirements)
- [x] Entities identified (7 entities including base + extended types)
- [x] Review checklist passed

---

## Notes for Planning Phase

When moving to the planning phase, the following technical considerations will be relevant:

### Schema Type System

- Determine whether to use TypeScript `interface` or `type` for schema definitions
- Consider: extension needs (Projects extends Article), union requirements, declaration merging capabilities
- Evaluate integration with Zod schema inference (`z.infer<typeof schema>`)
- Design inheritance strategy for base Article schema and type-specific extensions

### Tag Implementation Details

- Define format for suggested tags list (array vs. object with metadata)
- Determine tag validation rules (character limits, allowed characters, case sensitivity)
- Design tag input UI (autocomplete, multiselect, free-form hybrid)
- Consider tag normalization strategy (lowercase, slug format)

### Project Links (GitHub & Live Demo)

- URL validation using Zod (proper format, optional but validated when present)
- Design link display in metadata sidebar (icons, labels, styling)
- Handle missing links gracefully (conditional rendering)
- Consider adding rel="noopener noreferrer" for external links

### Layout Breakpoints

- Confirm use of Tailwind's `lg` breakpoint (1024px)
- Define responsive behavior for intermediate screen sizes
- Specify sidebar width and spacing on wide screens
- Design metadata section layout for mobile (order of elements)

### Component Architecture

- Design Article component to accept generic metadata type (`Article<ProjectMetadata>` vs `Article<NoteMetadata>`)
- Evaluate whether to fully extract navbar component or maintain coupling with home layout
- Consider shared state management needs between global and content-specific language toggles
- Design component prop interface for enabling/disabling language toggles

### Internationalization Strategy

- Define URL structure for article translations (`/{locale}/projects/{slug}`)
- Implement fallback behavior for missing translations
- Create not found page with i18n support (message in user's selected language)
- Handle language toggle visibility based on available translations

### Fumadocs Orama Integration

- Implement `buildIndex` function with tag field extraction
- Configure client-side search with tag filtering support
- Ensure tag indexing happens during build process
- Test tag filtering across Projects and Notes collections
