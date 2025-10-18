# Contract: ArticleImage Component

**Component**: `src/components/article/image.tsx`
**Status**: Pending Implementation
**Created**: 2025-10-19

## Purpose

泛用型文章主視覺元件，整合 GeneratedHero 和 ProjectDetailImage 的功能，支援靜態圖片和動態生成兩種模式，並保留 View Transition API 支援。

---

## Component Props

### TypeScript Interface

```typescript
export interface ArticleImageProps {
  /** Article slug (用於 view transition name) */
  slug: string;

  /** Article title (用於 alt text) */
  title: string;

  /** Image type: static image or generated */
  imageType?: "static" | "generated";

  /** Static image path (required when imageType="static") */
  image?: string;

  /** Generated OG image config (optional when imageType="generated") */
  ogImage?: {
    text?: string;
    background?: string; // CSS gradient / color / image path
    className?: string;
  };

  /** Additional CSS classes */
  className?: string;

  /** Image priority (for LCP optimization) */
  priority?: boolean;
}
```

---

## Behavior Contract

### B1: Static Image Mode

**Given** `imageType="static"` and `image="/path/to/image.jpg"`
**When** component renders
**Then**:

- Display Next.js `<Image>` component with src=`{image}`
- Set alt text to `{title}`
- Apply `priority={priority}` for loading strategy
- Wrap with `ViewTransition` using name `article-image-{slug}`
- Apply aspect-ratio via `aspect-video` class

### B2: Generated Mode with Background Image

**Given** `imageType="generated"` and `ogImage.background="/images/bg.jpg"`
**When** component renders
**Then**:

- Display `<div>` with background-image: `url(/images/bg.jpg)`
- Display `ogImage.text` as centered heading (if provided)
- Apply `ogImage.className` (if provided)
- Wrap with `ViewTransition` using name `article-image-{slug}`

### B3: Generated Mode with CSS Gradient

**Given** `imageType="generated"` and `ogImage.background="linear-gradient(...)"`
**When** component renders
**Then**:

- Display `<div>` with background: `linear-gradient(...)`
- Display `ogImage.text` as centered heading (if provided)
- Apply default fallback gradient if `background` is undefined

### B4: Generated Mode with Solid Color

**Given** `imageType="generated"` and `ogImage.background="#667eea"`
**When** component renders
**Then**:

- Display `<div>` with background-color: `#667eea`
- Display `ogImage.text` as centered heading (if provided)

### B5: View Transition Support

**Given** any imageType
**When** component is used in both list (ArticleCard) and detail page (Article)
**Then**:

- Both instances use same transition name: `article-image-{slug}`
- Apply `viewTransitionName` inline style for CSS fallback
- Wrap content with React `ViewTransition` component

### B6: Missing Image Handling

**Given** `imageType="static"` but `image` is undefined
**When** component renders
**Then**:

- Fall back to generated mode with default gradient
- Log warning to console (development only)

---

## Accessibility Contract

### A1: Alt Text (Static Mode)

**Given** static image mode
**When** image loads
**Then**:

- `<Image>` has `alt={title}` attribute
- If title is empty, use "Article image" as fallback

### A2: ARIA Labels (Generated Mode)

**Given** generated mode with text
**When** heading renders
**Then**:

- Apply `aria-label` if text is decorative
- Use semantic `<h1>` or `<div>` based on context

### A3: Keyboard Navigation

**Given** component is interactive
**When** user tabs through page
**Then**:

- Image container is not focusable (decorative)
- No keyboard trap

---

## Performance Contract

### P1: Image Optimization (Static Mode)

**Given** static image with `priority=true`
**When** component renders
**Then**:

- Next.js Image uses `priority` attribute (no lazy loading)
- Optimized formats (WebP/AVIF) served automatically
- Responsive `sizes` attribute applied

**Given** static image with `priority=false`
**When** component renders
**Then**:

- Lazy loading enabled
- Load only when visible in viewport

### P2: Generated Mode Performance

**Given** generated mode
**When** component renders
**Then**:

- No network requests (pure CSS rendering)
- Minimal DOM nodes (< 5 elements)
- No heavy JavaScript calculations

---

## Style Contract

### S1: Aspect Ratio

**Given** any mode
**When** component renders
**Then**:

- Apply `aspect-video` class (16:9 ratio)
- Maintain aspect ratio on all screen sizes

### S2: Responsive Design

**Given** mobile viewport (< 768px)
**When** component renders
**Then**:

- Full width container
- Appropriate font size scaling for text

**Given** desktop viewport (≥ 768px)
**When** component renders
**Then**:

- Container respects max-width constraints
- Text remains readable

### S3: Dark Mode Support

**Given** user has dark mode enabled
**When** component renders
**Then**:

- Generated mode text uses appropriate contrast
- Background colors adapt to theme (if using CSS variables)

---

## Test Scenarios

### Unit Tests (Jest + RTL)

```typescript
describe('ArticleImage', () => {
  it('renders static image with correct src and alt', () => {
    render(<ArticleImage
      slug="test"
      title="Test Article"
      imageType="static"
      image="/test.jpg"
    />);

    const img = screen.getByAltText('Test Article');
    expect(img).toHaveAttribute('src', expect.stringContaining('/test.jpg'));
  });

  it('renders generated mode with gradient background', () => {
    const { container } = render(<ArticleImage
      slug="test"
      title="Test"
      imageType="generated"
      ogImage={{ background: 'linear-gradient(...)' }}
    />);

    const div = container.querySelector('[data-testid="article-image-container"]');
    expect(div).toHaveStyle({ background: 'linear-gradient(...)' });
  });

  it('detects image path and applies url()', () => {
    const { container } = render(<ArticleImage
      slug="test"
      title="Test"
      imageType="generated"
      ogImage={{ background: '/images/bg.jpg' }}
    />);

    const div = container.querySelector('[data-testid="article-image-container"]');
    expect(div).toHaveStyle({ backgroundImage: 'url(/images/bg.jpg)' });
  });

  it('applies view transition name', () => {
    const { container } = render(<ArticleImage slug="my-article" title="Test" />);

    const element = container.querySelector('[style*="viewTransitionName"]');
    expect(element).toHaveStyle({ viewTransitionName: 'article-image-my-article' });
  });
});
```

### E2E Tests (Playwright)

```typescript
test("view transition animates between card and detail page", async ({
  page,
}) => {
  await page.goto("/zh-TW/projects");

  // Click on project card
  await page.click('[data-testid="project-card"]');

  // Verify view transition occurred
  await page.waitForSelector('[data-testid="article-image-container"]');

  // Check transition name matches
  const transitionName = await page.$eval(
    '[data-testid="article-image-container"]',
    (el) => (el as HTMLElement).style.viewTransitionName
  );

  expect(transitionName).toContain("article-image-");
});
```

---

## Migration from Existing Components

### From ProjectDetailImage

**Changes**:

- Component name: `ProjectDetailImage` → `ArticleImage`
- Props rename: `project.slug` → `slug`, `project.title` → `title`
- No functional changes in logic

### From GeneratedHero

**Changes**:

- Component integrated into ArticleImage
- Logic moves to `imageType="generated"` branch
- Props structure unified with `ogImage` object

---

## Dependencies

**Required**:

- `next/image` (Next.js Image component)
- `react` (ViewTransition API)
- `clsx` or `cn` utility (className merging)

**Optional**:

- TailwindCSS classes (aspect-video, responsive utilities)

---

## File Structure

```
src/components/article/
├── image.tsx                  # Main component
└── __tests__/
    ├── image.test.tsx        # Unit tests
    └── image.snapshot.test.tsx  # Snapshot tests
```

---

## Implementation Checklist

- [ ] Create `src/components/article/image.tsx`
- [ ] Implement static mode (Next.js Image)
- [ ] Implement generated mode (background detection)
- [ ] Add View Transition wrapper
- [ ] Add data-testid attributes
- [ ] Write unit tests (background format detection)
- [ ] Write component tests (rendering variants)
- [ ] Update ArticleCard to use ArticleImage
- [ ] Update Article (detail) to use ArticleImage
- [ ] Remove `src/components/custom/generated-hero.tsx`
- [ ] Remove `src/components/projects/project-detail-image.tsx`

---

## Success Criteria

✅ Component renders both static and generated modes correctly
✅ Background format detection works (gradient/color/image)
✅ View transitions animate smoothly between pages
✅ All tests pass (unit + E2E)
✅ No performance regression vs. existing components
✅ Accessibility audit passes (Lighthouse score >95)
