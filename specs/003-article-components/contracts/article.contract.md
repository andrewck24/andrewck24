# Contract: Article Component

**Component**: `src/components/article/index.tsx`
**Status**: Pending Implementation
**Created**: 2025-10-19

## Purpose

泛用型文章詳細頁面元件，展示完整的文章內容（MDX）、metadata、以及導航功能。泛用化自 ProjectDetail。

---

## Component Props

### TypeScript Interface

```typescript
export interface ArticleProps<T extends ArticleMetadata = ArticleMetadata> {
  /** Article page data (metadata + MDX content) */
  article: ArticlePageData<T>;

  /** Content type for back link */
  contentType?: "projects" | "notes";

  /** Custom back link text (i18n) */
  backLinkText?: string;
}
```

---

## Behavior Contract

### B1: Article Header Rendering

**Given** article with metadata
**When** component renders
**Then**:

- Display `<ArticleImage>` at top with slug, title, imageType, image, ogImage
- Display article title as `<h1>`
- Display article description as subtitle
- Display formatted date using article.locale format
- Apply appropriate semantic HTML structure

### B2: MDX Content Rendering

**Given** article.content (React component)
**When** component renders
**Then**:

- Render `<article.content />` inside prose container
- Apply `prose` utility classes (fumadocs or tailwind-typography)
- Support all MDX features (headings, lists, code blocks, custom components)
- Maintain responsive typography

### B3: Back Link Navigation

**Given** `contentType="projects"`
**When** back link is clicked
**Then**:

- Navigate to `/{article.locale}/projects`
- Use Next.js `<Link>` for client-side navigation

**Given** `backLinkText="返回專案列表"`
**When** back link renders
**Then**:

- Display custom text instead of default

### B4: Responsive Layout

**Given** mobile viewport (< 1024px)
**When** component renders
**Then**:

- Full-width container with padding: `mx-4`
- Prose max-width automatically constrains content

**Given** desktop viewport (≥ 1024px)
**When** component renders
**Then**:

- Wider side margins: `lg:mx-12`
- Prose maintains readable line length (~65-75 characters)

---

## Accessibility Contract

### A1: Semantic HTML Structure

**Given** article content
**When** rendered
**Then**:

- Use `<article>` as main container
- Use `<header>` for metadata section
- Use `<h1>` for article title (only one per page)
- Use `<time>` with `dateTime` for date
- Use `<footer>` for back link section

### A2: Heading Hierarchy

**Given** article with MDX headings
**When** content renders
**Then**:

- Page title is `<h1>` (appears once)
- MDX headings start at `<h2>` level
- No skipped heading levels (h2 → h3, not h2 → h4)

### A3: Focus Management

**Given** user navigates from list page
**When** article page loads
**Then**:

- Focus moves to article title or skip-to-content link
- Back link is keyboard accessible

---

## Performance Contract

### P1: Image Priority

**Given** hero image at top of article
**When** page loads
**Then**:

- ArticleImage has `priority=true`
- Image loads immediately (contributes to LCP)

### P2: MDX Lazy Loading

**Given** long article with many components
**When** page initially loads
**Then**:

- Only above-the-fold content renders immediately
- Below-the-fold content lazy loads as user scrolls

### P3: Font Loading

**Given** prose content with custom fonts
**When** page loads
**Then**:

- Use font-display: swap to prevent FOIT
- System fonts as fallback during loading

---

## Style Contract

### S1: Container Layout

**Structure**:

```tsx
<div className="prose prose-neutral dark:prose-invert mx-4 w-full overflow-x-hidden lg:mx-12">
  <article className="bg-background/50 border-border my-4 flex-2 rounded-2xl border px-4 py-10 lg:px-8">
    <ArticleImage />
    <header>{/* title, description, date */}</header>
    <div className="prose">{/* MDX content */}</div>
    <footer>{/* back link */}</footer>
  </article>
</div>
```

### S2: Typography Scales

| Element        | Mobile       | Desktop       |
| -------------- | ------------ | ------------- |
| Title (`<h1>`) | `text-4xl`   | `md:text-5xl` |
| Description    | `text-xl`    | `text-xl`     |
| Date           | `text-sm`    | `text-sm`     |
| Body text      | `prose` base | `prose` base  |

### S3: Spacing

**Header Section**:

- Margin bottom: `mb-12` (separate from MDX content)

**MDX Content**:

- Max width: `max-w-none` (prose handles line length)
- Vertical rhythm: handled by `prose` classes

**Footer Section**:

- Border top: `border-t border-border`
- Margin top: `mt-12`
- Padding top: `pt-8`

### S4: Dark Mode

**Given** dark mode enabled
**When** article renders
**Then**:

- Use `prose-invert` for inverted typography
- Border color: `border-border` (CSS variable)
- Background: `bg-background/50` (semi-transparent)

---

## Test Scenarios

### Unit Tests (Jest + RTL)

```typescript
describe('Article', () => {
  const mockArticle: ArticlePageData = {
    title: 'Test Article',
    description: 'Test description',
    slug: 'test-article',
    locale: 'zh-TW',
    url: '/zh-TW/projects/test-article',
    date: '2025-10-19',
    imageType: 'static',
    image: '/test.jpg',
    content: () => <div>Mock MDX Content</div>,
    body: '',
  };

  it('renders article title as h1', () => {
    render(<Article article={mockArticle} />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Test Article');
  });

  it('renders article description', () => {
    render(<Article article={mockArticle} />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('formats date according to locale', () => {
    render(<Article article={mockArticle} />);

    const time = screen.getByText(/2025/);
    expect(time).toHaveAttribute('dateTime', '2025-10-19');
  });

  it('renders MDX content', () => {
    render(<Article article={mockArticle} />);

    expect(screen.getByText('Mock MDX Content')).toBeInTheDocument();
  });

  it('renders back link with correct href', () => {
    render(<Article article={mockArticle} contentType="projects" />);

    const link = screen.getByRole('link', { name: /返回/i });
    expect(link).toHaveAttribute('href', '/zh-TW/projects');
  });

  it('uses custom back link text when provided', () => {
    render(
      <Article
        article={mockArticle}
        backLinkText="回到專案"
      />
    );

    expect(screen.getByText('回到專案')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
test("article page displays all content sections", async ({ page }) => {
  await page.goto("/zh-TW/projects/example-project");

  // Verify header
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("time")).toBeVisible();

  // Verify MDX content
  await expect(page.locator(".prose")).toBeVisible();

  // Verify back link
  await expect(page.locator('a:has-text("返回")')).toBeVisible();
});

test("back link navigates to list page", async ({ page }) => {
  await page.goto("/zh-TW/projects/example-project");

  await page.click('a:has-text("返回專案列表")');

  await expect(page).toHaveURL("/zh-TW/projects");
});

test("article supports keyboard navigation", async ({ page }) => {
  await page.goto("/zh-TW/projects/example-project");

  // Tab through article
  await page.keyboard.press("Tab"); // Focus back link
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBe("A"); // Link element
});

test("article image uses view transition", async ({ page }) => {
  // Navigate from list to detail
  await page.goto("/zh-TW/projects");
  await page.click('[data-testid="article-card"]:first-child');

  // Verify view transition name persists
  const transitionName = await page.$eval(
    '[data-testid="article-image-container"]',
    (el) => (el as HTMLElement).style.viewTransitionName
  );

  expect(transitionName).toContain("article-image-");
});
```

---

## Migration from ProjectDetail

### Props Mapping

| Old Prop (ProjectDetail)   | New Prop (Article)                   | Notes                            |
| -------------------------- | ------------------------------------ | -------------------------------- |
| `project: ProjectPageData` | `article: ArticlePageData`           | Generic type parameter           |
| N/A                        | `contentType: "projects" \| "notes"` | 🆕 New: determines back link URL |
| N/A                        | `backLinkText: string`               | 🆕 New: i18n support             |

### Component Rename

**Old**:

```typescript
import { ProjectDetail } from "@/components/projects/project-detail";

<ProjectDetail project={project} />
```

**New**:

```typescript
import { Article } from "@/components/article";

<Article article={project} contentType="projects" backLinkText="返回專案列表" />
```

---

## MDX Components Support

### Custom Components

**Given** article MDX imports custom components
**When** content renders
**Then**:

- Support all fumadocs built-in components (Callout, CodeBlock, Tabs, etc.)
- Support custom components defined in `mdx-components.tsx`
- Components receive proper context and props

### Code Syntax Highlighting

**Given** MDX contains code blocks
**When** content renders
**Then**:

- Apply syntax highlighting via fumadocs (Shiki)
- Support language-specific highlighting
- Display line numbers if configured
- Support code copy button

---

## Dependencies

**Required**:

- `@/components/article/image` (ArticleImage)
- `next/link` (Next.js Link)
- `@/types/article` (ArticlePageData)
- `lucide-react` (ArrowLeft icon for back link)

**Optional**:

- `@/lib/mdx-components` (custom MDX components)
- `fumadocs-ui` (prose styling)

---

## File Structure

```
src/components/article/
├── index.tsx                  # Main Article component
└── __tests__/
    ├── index.test.tsx        # Unit tests
    └── index.snapshot.test.tsx # Snapshot tests
```

---

## Implementation Checklist

- [ ] Create `src/components/article/index.tsx`
- [ ] Implement header section (title, description, date)
- [ ] Integrate ArticleImage component
- [ ] Implement MDX content rendering
- [ ] Implement back link with i18n support
- [ ] Add responsive layout (mx-4 / lg:mx-12)
- [ ] Add data-testid attributes
- [ ] Write unit tests (rendering, navigation)
- [ ] Write E2E tests (full page flow)
- [ ] Update `src/app/[lang]/projects/[slug]/page.tsx` to use Article
- [ ] Update `src/app/[lang]/notes/[[...slug]]/page.tsx` to use Article
- [ ] Remove `src/components/projects/project-detail.tsx` (after migration)

---

## Success Criteria

✅ Article displays all metadata correctly
✅ MDX content renders with proper styling
✅ Back link navigates to correct list page
✅ Responsive layout works on all screen sizes
✅ Dark mode support functional
✅ All tests pass (unit + E2E)
✅ Can be used for both projects and notes
✅ View transitions work smoothly
