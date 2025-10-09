# Research Report: About Me Page

**Feature Branch**: `001-about-page` | **Date**: 2025-10-01 | **Phase**: 0 (Research)

## Research Scope

Based on Technical Context in [plan.md](./plan.md), this research resolves technical decisions for:

1. Timeline Visualization Approach
2. Multi-language Content Structure
3. Date Formatting Strategy
4. Responsive Design Implementation

## Decision 1: Timeline Visualization Approach

**Decision**: Vertical timeline with CSS-only implementation using Tailwind CSS

**Rationale**:

- 垂直版面在所有裝置上保持一致的使用者體驗
- 簡化響應式設計，無需處理 horizontal ↔ vertical 轉換
- 保持輕量級，避免額外的第三方庫依賴
- Tailwind CSS 4+ 已提供足夠的 utility classes 支援客製化設計
- 更容易整合 shadcn/ui 的設計語言

**Alternatives Considered**:

- **react-chrono**: 功能強大但樣式客製化困難，bundle size 較大（~100KB）
- **react-vertical-timeline-component**: 功能完整但限制客製化，且增加依賴
- **Flowbite Timeline**: 需要額外依賴 Flowbite React，但專案已使用 shadcn/ui

**Design Pattern**:

- 所有裝置尺寸：Vertical timeline with left-aligned line
- Desktop (≥1024px): 較寬的卡片 (max-width: 800px)
- Tablet (768px-1023px): 中等寬度卡片 (max-width: 600px)
- Mobile (<768px): 全寬卡片，較小間距

**CSS Structure**:

```css
/* Vertical timeline container */
.timeline-vertical {
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Timeline line */
.timeline-vertical::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

/* Milestone marker */
.timeline-milestone::before {
  content: "";
  position: absolute;
  left: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  border: 2px solid var(--background);
}
```

**Component Structure**:

- `Timeline`: 主容器組件，管理垂直排列
- `CareerMilestone`: 個別事件卡片，支援不同類型（education/certification/skill）
- 使用 Lucide React icons 標示不同類型的 milestone

## Decision 2: Multi-language Content Structure

**Decision**: Fumadocs i18n with static MDX files + typed data objects

**Rationale**:

- Fumadocs 內建的 `defineI18n` 和 `defineI18nUI` 提供完整的 i18n 支援
- MDX 檔案適合靜態內容（頁面描述、介紹文字）
- TypeScript typed objects 適合結構化資料（career milestones）
- 支援 `hideLocale: 'default-locale'` 簡化 URL 結構
- 使用 `RootProvider` 的 `i18n` prop 統一管理 UI translations

**Alternatives Considered**:

- **next-intl**: 功能完整但 Fumadocs 已內建 i18n，無需額外依賴
- **react-i18next**: 需要額外設定，且與 Fumadocs 的 i18n 整合較複雜
- **純 JSON 檔案**: 不支援 MDX 的豐富格式，無法使用 React 組件

**Implementation Strategy**:

1. **i18n Configuration** (`lib/i18n.ts` - already exists):

```typescript
import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  defaultLanguage: "zh-TW",
  languages: ["zh-TW", "en", "ja"],
  hideLocale: "default-locale",
});
```

2. **Static Content** (MDX files):

```plaintext
content/docs/
├── zh-TW/about.mdx   # 中文頁面內容
├── en/about.mdx      # English page content
└── ja/about.mdx      # 日本語ページコンテンツ
```

3. **Typed Data Objects** (`lib/data/timeline.ts`):

```typescript
import type { CareerMilestone } from "@/types/timeline";

export const careerMilestones: Record<string, CareerMilestone[]> = {
  "zh-TW": [
    {
      id: "edu-ntu",
      type: "education",
      date: new Date("2015-06-30"),
      title: "國立台灣大學",
      description: "主修日本語文學、輔修經濟學",
    },
    // ...
  ],
  en: [
    {
      id: "edu-ntu",
      type: "education",
      date: new Date("2015-06-30"),
      title: "National Taiwan University",
      description:
        "Major in Japanese Language and Literature, Minor in Economics",
    },
    // ...
  ],
  ja: [
    {
      id: "edu-ntu",
      type: "education",
      date: new Date("2015-06-30"),
      title: "国立台湾大学",
      description: "日本語文学専攻、経済学副専攻",
    },
    // ...
  ],
};
```

4. **UI Translations** (in `app/layout.tsx`):

```typescript
import { defineI18nUI } from "fumadocs-ui/i18n";

const { provider } = defineI18nUI(i18n, {
  translations: {
    "zh-TW": {
      displayName: "繁體中文",
      search: "搜尋文檔",
      toc: "目錄",
    },
    en: {
      displayName: "English",
    },
    ja: {
      displayName: "日本語",
      search: "ドキュメントを検索",
      toc: "目次",
    },
  },
});
```

**Locale-Keyed Data Benefits**:

- Type-safe: 編譯時檢查缺少的翻譯
- Maintainable: 所有語言版本集中管理
- Performance: Static data, no runtime translation overhead

## Decision 3: Date Formatting Strategy

**Decision**: Use native `Intl.DateTimeFormat` with locale-aware formatting

**Rationale**:

- 瀏覽器原生 API，無需額外依賴（如 date-fns、dayjs）
- 自動處理不同語系的日期格式（zh-TW: 2023 年 1 月、en: Jan 2023、ja: 2023 年 1 月）
- 支援 `dateStyle` 和 `timeStyle` 選項
- TypeScript 型別定義完整

**Alternatives Considered**:

- **date-fns**: 功能強大但增加 bundle size (~70KB for locale data)
- **dayjs**: 輕量但仍需 ~10KB，原生 API 已足夠
- **moment.js**: 過時且體積龐大，不考慮

**Implementation** (`lib/utils/date-formatter.ts`):

```typescript
export function formatMilestoneDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date);
}

// Usage example:
// formatMilestoneDate(new Date('2023-01-15'), 'zh-TW') → "2023年1月"
// formatMilestoneDate(new Date('2023-01-15'), 'en') → "January 2023"
// formatMilestoneDate(new Date('2023-01-15'), 'ja') → "2023年1月"
```

**Edge Cases Handling**:

- Missing dates: Display "Present" / "目前" / "現在"
- Approximate dates (year only): Use `{ year: 'numeric' }` option
- Date ranges: Format separately and join with " - "

## Decision 4: Responsive Design Implementation

**Decision**: Mobile-first Tailwind CSS with vertical timeline layout

**Rationale**:

- Tailwind CSS 4+ 預設的 breakpoints 符合大多數裝置
- Mobile-first 策略確保基礎體驗在小螢幕可用
- 垂直 timeline 在所有裝置上保持一致的閱讀方向
- 支援 FR-012 要求的 14px 最小字體

**Alternatives Considered**:

- **CSS-in-JS (Emotion, Styled Components)**: 增加 runtime overhead，與 Tailwind 整合度低
- **CSS Modules**: 需要手動管理響應式樣式，不如 Tailwind utilities 方便
- **Bootstrap Grid**: 過於龐大，且設計語言與專案不符

**Breakpoint Strategy**:

```typescript
// tailwind.config.ts (existing configuration)
export default {
  theme: {
    screens: {
      sm: "640px", // Mobile landscape
      md: "768px", // Tablet portrait
      lg: "1024px", // Desktop
      xl: "1280px", // Large desktop
    },
  },
};
```

**Layout Transformation**:

| Screen Size    | Card Width        | Card Padding | Font Size   |
| -------------- | ----------------- | ------------ | ----------- |
| < 768px        | 100%              | px-4         | 14px (base) |
| 768px - 1023px | max-w-2xl (672px) | px-6         | 16px        |
| ≥ 1024px       | max-w-3xl (768px) | px-8         | 16px        |

**Component Classes Example**:

```tsx
<div className="relative flex flex-col gap-6 md:gap-8">
  {/* Timeline line */}
  <div className="bg-border absolute top-0 bottom-0 left-5 w-0.5" />

  <article className="relative max-w-full pl-12 text-sm md:max-w-2xl md:pl-16 md:text-base lg:max-w-3xl">
    {/* Milestone marker */}
    <div className="bg-primary border-background absolute top-1 left-2.5 h-5 w-5 rounded-full border-2" />

    {/* Milestone content */}
  </article>
</div>
```

**Performance Considerations**:

- Lazy load images in milestone cards (using `loading="lazy"`)
- Use `scroll-margin-top` for smooth anchor navigation
- Minimize layout shifts with explicit width/height

## Implementation Checklist

Based on research findings, Phase 1 (Design & Contracts) will require:

- [ ] Define TypeScript interfaces in `types/timeline.ts`
- [ ] Create data objects in `lib/data/timeline.ts`
- [ ] Create `lib/utils/date-formatter.ts` utility
- [ ] Design Timeline component structure
- [ ] Design CareerMilestone card variants
- [ ] Write E2E test scenarios in quickstart.md
- [ ] Write component test specifications
- [ ] Update agent context file

## External Resources

- [Fumadocs i18n Documentation](https://fumadocs.dev/docs/headless/internationalization)
- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

**Status**: ✅ Research Complete - Ready for Phase 1 (Design & Contracts)
