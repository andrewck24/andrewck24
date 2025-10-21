# Contract: ArticleCard Component

**Component**: `src/components/article/card.tsx`
**Status**: Pending Implementation
**Created**: 2025-10-19

## Purpose

泛用型文章卡片元件，支援 hero 和 compact 兩種佈局變體，用於文章列表和精選文章展示。泛用化自 FeaturedProjectCard。

---

## Component Props

### TypeScript Interface

```typescript
export interface ArticleCardProps<T extends ArticleMetadata = ArticleMetadata> {
  /** Article metadata */
  article: T;

  /** Card layout variant */
  variant?: "hero" | "compact";

  /** Image loading priority (for first card) */
  priority?: boolean;

  /** Content type for URL prefix */
  contentType?: "projects" | "notes";

  /** Additional CSS classes */
  className?: string;
}
```

---

## Behavior Contract

### B1: Hero Variant Layout

**Given** `variant="hero"`
**When** component renders on desktop (≥ 768px)
**Then**:

- Use 2-column grid layout (image + content)
- Image occupies left 50%, content occupies right 50%
- Image aspect ratio: 16:9 (aspect-video)

**When** component renders on mobile (< 768px)
**Then**:

- Use single-column layout
- Image on top, content below
- Full-width card

### B2: Compact Variant Layout

**Given** `variant="compact"`
**When** component renders on desktop (≥ 768px)
**Then**:

- Use row layout: image (1/3 width) + content (2/3 width)
- Image aspect ratio: 1:1 (aspect-square)

**When** component renders on mobile (< 768px)
**Then**:

- Use single-column layout
- Image on top (aspect-video), content below

### B3: Link Navigation

**Given** any variant
**When** user clicks card
**Then**:

- Navigate to `/{article.locale}/{contentType}/{article.slug}`
- Support Cmd/Ctrl+Click for new tab
- Support middle-click for new tab
- Use Next.js `<Link>` component for client-side navigation

### B4: Hover Effects

**Given** any variant
**When** user hovers over card
**Then**:

- Apply shadow elevation (shadow-sm → shadow-md)
- Scale image slightly (scale-105)
- Change title color (text-gray-900 → text-blue-600)
- Smooth transition (300ms duration)

### B5: ArticleImage Integration

**Given** article has image data
**When** card renders
**Then**:

- Use `<ArticleImage>` component for hero section
- Pass `slug`, `title`, `imageType`, `image`, `ogImage` props
- Set `priority={priority}` for first card

---

## Accessibility Contract

### A1: Semantic HTML

**Given** card component
**When** rendered
**Then**:

- Use `<Link>` as container (keyboard accessible)
- Title uses `<h3>` heading
- Date uses `<time>` with `dateTime` attribute

### A2: Screen Reader Support

**Given** card link
**When** screen reader announces
**Then**:

- Announce: "{title}, link, {description}, published {date}"
- Image has appropriate alt text (from ArticleImage)

### A3: Keyboard Navigation

**Given** user navigates with keyboard
**When** card receives focus
**Then**:

- Apply focus-visible ring
- Enter key activates link
- Tab moves to next focusable element

---

## Performance Contract

### P1: Image Loading

**Given** `priority=true` (first card)
**When** page loads
**Then**:

- ArticleImage loads immediately (no lazy loading)
- Contributes to LCP optimization

**Given** `priority=false` (subsequent cards)
**When** card enters viewport
**Then**:

- ArticleImage lazy loads
- Loading="lazy" attribute applied

### P2: View Transition

**Given** card with ArticleImage
**When** user clicks to navigate to detail page
**Then**:

- Image smoothly transitions using View Transition API
- Transition name: `article-image-{slug}`
- No layout shift during transition

---

## Style Contract

### S1: Responsive Breakpoints

| Viewport                 | Hero Layout                                    | Compact Layout                                  |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------- |
| Mobile (< 768px)         | Column: Image (aspect-video) + Content         | Column: Image (aspect-video) + Content          |
| Tablet/Desktop (≥ 768px) | Row: Image (50%, aspect-video) + Content (50%) | Row: Image (33%, aspect-square) + Content (67%) |

### S2: Spacing & Typography

**Card Container**:

- Padding: `p-0` (image + content have own padding)
- Border: `border border-border`
- Border radius: `rounded-lg`
- Background: transparent (inherits theme)

**Content Section**:

- Padding: `p-6`
- Gap between elements: `gap-4`

**Title**:

- Font size: `text-xl`
- Font weight: `font-semibold`
- Color: `text-gray-900 dark:text-gray-100`
- Hover color: `text-blue-600 dark:text-blue-400`

**Description**:

- Font size: `text-sm`
- Color: `text-gray-600 dark:text-gray-400`
- Line clamp: 3 lines max

**Date**:

- Font size: `text-xs`
- Color: `text-gray-500 dark:text-gray-500`

### S3: Dark Mode

**Given** user has dark mode enabled
**When** card renders
**Then**:

- Border color adapts: `border-border` (CSS variable)
- Text colors use dark variants
- Hover effects maintain sufficient contrast

---

## Test Scenarios

### Unit Tests (Jest + RTL)

```typescript
describe('ArticleCard', () => {
  const mockArticle: ArticleMetadata = {
    title: 'Test Article',
    description: 'Test description',
    slug: 'test-article',
    locale: 'zh-TW',
    url: '/zh-TW/projects/test-article',
    date: '2025-10-19',
    imageType: 'static',
    image: '/test.jpg',
  };

  it('renders hero variant with correct layout', () => {
    render(<ArticleCard article={mockArticle} variant="hero" />);

    const card = screen.getByTestId('article-card');
    expect(card).toHaveClass('md:col-span-2');  // 2-column span
  });

  it('renders compact variant with correct layout', () => {
    render(<ArticleCard article={mockArticle} variant="compact" />);

    const card = screen.getByTestId('article-card');
    expect(card).toHaveClass('flex-col', 'md:flex-row');
  });

  it('navigates to correct URL on click', () => {
    render(<ArticleCard article={mockArticle} contentType="projects" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/zh-TW/projects/test-article');
  });

  it('formats date according to locale', () => {
    render(<ArticleCard article={mockArticle} />);

    const time = screen.getByText(/2025/);
    expect(time).toBeInTheDocument();
  });

  it('passes priority to ArticleImage for first card', () => {
    const { container } = render(
      <ArticleCard article={mockArticle} priority={true} />
    );

    // Verify ArticleImage receives priority prop
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'eager');  // priority=true disables lazy loading
  });
});
```

### E2E Tests (Playwright)

```typescript
test("article card navigates to detail page", async ({ page }) => {
  await page.goto("/zh-TW/projects");

  // Click first card
  await page.click('[data-testid="article-card"]:first-child');

  // Verify navigation
  await expect(page).toHaveURL(/\/zh-TW\/projects\/[a-z0-9-]+$/);
});

test("article card supports keyboard navigation", async ({ page }) => {
  await page.goto("/zh-TW/projects");

  // Tab to first card
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() =>
    document.activeElement?.getAttribute("data-testid")
  );
  expect(focused).toBe("article-card");

  // Press Enter
  await page.keyboard.press("Enter");

  // Verify navigation
  await expect(page).toHaveURL(/\/zh-TW\/projects\/[a-z0-9-]+$/);
});

test("hover effects apply correctly", async ({ page }) => {
  await page.goto("/zh-TW/projects");

  const card = page.locator('[data-testid="article-card"]').first();

  // Hover
  await card.hover();

  // Check shadow class change
  await expect(card).toHaveClass(/hover:shadow-md/);
});
```

---

## Migration from FeaturedProjectCard

### Props Mapping

| Old Prop (FeaturedProjectCard) | New Prop (ArticleCard)               | Notes                         |
| ------------------------------ | ------------------------------------ | ----------------------------- |
| `project: FeaturedProject`     | `article: ArticleMetadata`           | Generic type parameter        |
| `variant: "hero" \| "compact"` | `variant: "hero" \| "compact"`       | ✅ No change                  |
| `priority: boolean`            | `priority: boolean`                  | ✅ No change                  |
| N/A                            | `contentType: "projects" \| "notes"` | 🆕 New: determines URL prefix |

### Component Rename

**Old**:

```typescript
import { FeaturedProjectCard } from "@/components/projects/featured-project-card";

<FeaturedProjectCard project={project} variant="hero" priority />
```

**New**:

```typescript
import { ArticleCard } from "@/components/article/card";

<ArticleCard article={project} variant="hero" priority contentType="projects" />
```

---

## Dependencies

**Required**:

- `next/link` (Next.js Link component)
- `@/components/article/image` (ArticleImage)
- `@/lib/utils` (cn utility)
- `@/types/article` (ArticleMetadata)

**Optional**:

- `clsx` or `tailwind-merge` (className merging)

---

## File Structure

```
src/components/article/
├── card.tsx                   # Main component
└── __tests__/
    ├── card-hero.test.tsx    # Hero variant tests
    ├── card-compact.test.tsx # Compact variant tests
    └── card.snapshot.test.tsx # Snapshot tests
```

---

## Implementation Checklist

- [ ] Create `src/components/article/card.tsx`
- [ ] Implement hero variant layout
- [ ] Implement compact variant layout
- [ ] Integrate ArticleImage component
- [ ] Add hover effects and transitions
- [ ] Add data-testid attributes
- [ ] Write unit tests (layout variants)
- [ ] Write component tests (interaction)
- [ ] Write E2E tests (navigation, keyboard)
- [ ] Update FeaturedProjects component to use ArticleCard
- [ ] Update Notes list component to use ArticleCard
- [ ] Remove `src/components/projects/featured-project-card.tsx` (after migration)

---

## Success Criteria

✅ Both hero and compact variants render correctly
✅ Responsive layout works on mobile/tablet/desktop
✅ View transitions animate smoothly
✅ Hover effects and focus states work
✅ Keyboard navigation fully functional
✅ All tests pass (unit + E2E)
✅ Can be used for both projects and notes
