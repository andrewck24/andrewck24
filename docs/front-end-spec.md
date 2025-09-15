# 個人形象網站 UI/UX 規格文件

## 📋 文件資訊

- **版本**: 1.0
- **日期**: 2025-09-06
- **作者**: UX Expert
- **審核狀態**: Approved

## 1. 執行摘要

### 1.1 專案概述

建立一個現代化的個人形象網站，展示從前端到全端工程師的技術能力和產品思維。網站採用現代漸層風格配合 Glassmorphism 設計，強調互動性和視覺吸引力。

### 1.2 核心目標

- 提升在台灣、遠端及日本市場的求職競爭力
- 展示作品集排球 App "VolleyBro" 專案的技術實力
- 建立專業技術內容平台
- 創造令人印象深刻的第一印象

### 1.3 設計原則

- **Modern Gradient** - 使用現代漸層和 Glassmorphism
- **Interactive First** - 強調互動體驗而非靜態展示
- **Performance Focused** - 確保快速載入和流暢動畫
- **International Ready** - 支援中英日三語無縫切換

## 2. 設計系統

### 2.1 視覺風格定義

#### 品牌個性

- **專業現代** - 展現技術專業與設計敏感度
- **動態互動** - 透過動畫和互動增強參與感
- **國際化** - 體現跨文化工作能力

#### 設計語言

```scss
// 設計原則
$design-principles: (
  style: "Modern Gradient + Glassmorphism",
  mood: "Professional yet Creative",
  interaction: "Smooth and Responsive",
  animation: "Subtle but Impactful",
);
```

### 2.2 色彩系統

#### 主要色板

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}

@layer base {
  .glass-effect {
    @apply bg-background/30 border border-border backdrop-blur-md box-shadow-md;
  }
}
```

### 2.3 字體系統

```css
:root {
  /* Font Families */
  --font-sans: "Inter", "Noto Sans TC", "Noto Sans JP", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  /* Font Sizes - Fluid Typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem);
  --text-4xl: clamp(2.25rem, 1.8rem + 2.25vw, 3rem);
  --text-5xl: clamp(3rem, 2.25rem + 3.75vw, 4rem);

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 2.4 間距系統

```css
:root {
  /* Spacing Scale */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;

  /* Container Widths */
  --container-xs: 475px;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### 2.5 動畫系統

```css
:root {
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Easing Functions */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## 3. 元件規格

### 3.1 導航元件

#### 3.1.1 主導航配置（使用 Fumadocs Layout）

使用 Fumadocs 內建的 layout 系統來配置導航，不需要自訂 Navigation 元件。

```tsx
// lib/layout.shared.tsx
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Languages, Github } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Andrew Chen",
      // 可選：自訂 logo
      // logo: <CustomLogo />
    },
    links: [
      {
        text: "Blog",
        url: "/blog",
        active: "nested-url",
      },
      {
        text: "Portfolio",
        url: "/portfolio",
        active: "nested-url",
      },
      {
        type: "icon",
        label: "GitHub",
        icon: <Github />,
        url: "https://github.com/andrewck24",
      },
      {
        type: "custom",
        secondary: true,
        children: <LanguageSwitch />, // 自訂語言切換元件
      },
    ],
    githubUrl: "https://github.com/andrewck24",
  };
}
```

#### 3.1.2 首頁 Layout 配置

```tsx
// app/(home)/layout.tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      // 首頁特定的導航項目
      links={[
        ...baseOptions().links,
        {
          type: "custom",
          on: "nav", // 只在導航列顯示
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>技術文件</NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink href="/docs">開發指南</NavbarMenuLink>
                <NavbarMenuLink href="/docs/api">API 文件</NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
```

#### 3.1.3 文件頁面 Layout 配置

```tsx
// app/docs/layout.tsx
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.pageTree}
      // 文件頁面的導航會自動整合側邊欄
    >
      {children}
    </DocsLayout>
  );
}
```

#### 3.1.4 語言切換器（自訂元件）

雖然使用 Fumadocs layout，但語言切換功能需要自訂元件實作：

```tsx
interface LanguageSwitchProps {
  currentLocale: "zh-TW" | "en" | "ja";
}

// components/LanguageSwitch.tsx
export const LanguageSwitch = ({ currentLocale }: LanguageSwitchProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="glass-effect">
          <Languages className="h-4 w-4" />
          <span className="sr-only">切換語言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-effect">
        <DropdownMenuItem onClick={() => switchLanguage('zh-TW')}>
          <span className="mr-2">🇹🇼</span>
          繁體中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('en')}>
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('ja')}>
          <span className="mr-2">🇯🇵</span>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 在 layout.shared.tsx 中使用
{
  type: 'custom',
  secondary: true,
  children: <LanguageSwitch currentLocale={currentLocale} />,
}
```

### 3.2 Hero Section 元件

#### 3.2.1 個人介紹卡片

```tsx
interface HeroCardProps {
  image: {
    src: string;
    alt: string;
    shape: "circle" | "hexagon" | "blob";
  };
  title: string;
  subtitle: string;
  description: string;
  skills: Skill[];
  socials: SocialLink[];
}

// Creative Shape Background Example
<div className="relative">
  {/* Animated Blob Background */}
  <div className="absolute inset-0 blob-animation">
    <svg viewBox="0 0 200 200">
      <path d="..." /> {/* Animated blob path */}
    </svg>
  </div>

  {/* Profile Image */}
  <img className="relative z-10" />
</div>;
```

#### 3.2.2 技能展示元件

```tsx
interface SkillDisplayProps {
  variant: "progress-bar" | "radar-chart" | "tag-cloud";
  skills: {
    name: string;
    level: number; // 0-100
    category: "frontend" | "backend" | "cloud" | "tool";
  }[];
}

// Aceternity-inspired Progress Bar
<div className="skill-progress">
  <div className="progress-track">
    <div
      className="progress-fill"
      style={{
        background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
        width: `${level}%`,
      }}
    >
      <span className="progress-glow" />
    </div>
  </div>
</div>;
```

### 3.3 作品集展示元件

#### 3.3.1 排球 App 展示卡片

基於提供的排球 App 元件，設計互動展示：

```tsx
interface VolleyballAppShowcaseProps {
  mode: "preview" | "interactive" | "fullscreen";
  features: {
    court: boolean;
    scoreBoard: boolean;
    statistics: boolean;
    apiLogs: boolean;
  };
}

// Interactive Court Component
<div className="showcase-container glass-effect">
  <div className="showcase-header">
    <h3>即時計分系統</h3>
    <Badge>Live Demo</Badge>
  </div>

  <div className="showcase-body">
    {/* Embedded RecordCourt Component */}
    <RecordCourt recordId="demo" mode="preview" className="scale-90" />
  </div>

  <div className="showcase-footer">
    <Button variant="glass">
      <Play /> 開始互動
    </Button>
  </div>
</div>;
```

#### 3.3.2 API Logs 展示器

```tsx
interface APILogsDisplayProps {
  logs: APILog[];
  variant: "vercel" | "minimal" | "detailed";
  showHeaders?: boolean;
  showPayload?: boolean;
  showResponse?: boolean;
}

// Vercel-style Logs Display
<div className="logs-container">
  <div className="logs-header glass-effect">
    <span className="logs-title">API Requests</span>
    <Badge variant="success">Live</Badge>
  </div>

  <div className="logs-body">
    {logs.map((log) => (
      <div className="log-entry">
        <span className="log-method">{log.method}</span>
        <span className="log-url">{log.url}</span>
        <span className="log-status">{log.status}</span>
        <span className="log-time">{log.responseTime}ms</span>

        {showPayload && (
          <div className="log-details">
            <CodeBlock language="json">
              {JSON.stringify(log.payload, null, 2)}
            </CodeBlock>
          </div>
        )}
      </div>
    ))}
  </div>
</div>;
```

### 3.4 背景動畫元件

#### 3.4.1 Blurry Floating Elements

```tsx
interface FloatingElementsProps {
  density: 'low' | 'medium' | 'high';
  colors: string[];
  blur: number; // 0-100
  speed: 'slow' | 'medium' | 'fast';
}

// CSS Implementation
.floating-element {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.7;
  animation: float var(--duration) ease-in-out infinite;
  background: radial-gradient(
    circle at center,
    var(--color-1) 0%,
    var(--color-2) 100%
  );
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
```

## 4. 頁面規格

### 4.1 首頁 (Landing Page)

#### 結構層次

```plaintext
Header (Fixed/Glass)
├── Logo
├── Navigation
├── Language Switch
└── Theme Toggle

Hero Section
├── Floating Elements Background
├── Personal Introduction Card
│   ├── Creative Profile Image
│   ├── Name & Title
│   ├── Bio (Multi-language)
│   └── CTA Buttons
└── Skills Showcase

Portfolio Preview
├── Section Title
├── Volleyball App Card
│   ├── Interactive Demo
│   └── View Details CTA
└── More Projects Link

Tech Stack Section
├── Frontend Technologies
├── Backend Technologies
└── Cloud Services
└── Tools & Methodologies

Blog Preview
├── Latest Articles
├── Language Filter
└── View All Articles

Footer
├── Quick Links
├── Social Links
├── Copyright
└── Language Switch (Alternative)
```

### 4.2 作品集頁面

#### 排球 App 詳細展示

```plaintext
Project Hero
├── Project Title
├── Problem Statement
└── Solution Overview

Interactive Demo Section
├── Tab Navigation
│   ├── Court View
│   ├── Score Board
│   └── Statistics
├── Live Component Display
└── Interaction Instructions

Technical Architecture
├── Mermaid Diagrams
├── Tech Stack Cards
└── Code Snippets

API Integration Demo
├── Request Builder
├── Live API Logs
└── Response Viewer

Outcome & Impact
├── Metrics
├── User Feedback
└── Future Plans
```

### 4.3 技術部落格頁面

#### 文章列表頁

```plaintext
Blog Header
├── Page Title
├── Search Bar
└── Filters
    ├── Categories
    ├── Tags
    └── Language

Articles Grid
├── Article Card
│   ├── Cover Image
│   ├── Title
│   ├── Excerpt
│   ├── Meta Info
│   └── Read More
└── Pagination

Sidebar (Desktop Only)
├── Popular Posts
├── Categories
└── Tags Cloud
```

## 5. 互動設計規格

### 5.1 頁面轉場動畫

#### View Transitions API 實作

```css
/* Enable view transitions */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

/* Custom page transitions */
.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}
```

### 5.2 元件互動狀態

#### Hover Effects

```scss
// Glass Card Hover
.glass-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 60px rgba(79, 172, 254, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

// Button Hover with Gradient Shift
.btn-gradient {
  background-size: 200% 200%;
  background-position: 0% 50%;
  transition: background-position 0.3s ease;

  &:hover {
    background-position: 100% 50%;
  }
}
```

### 5.3 捲動觸發動畫

```typescript
// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-visible");
    }
  });
}, observerOptions);
```

## 6. 響應式設計規格

### 6.1 斷點定義

```scss
$breakpoints: (
  "xs": 475px,
  // Small phones
  "sm": 640px,
  // Phones
  "md": 768px,
  // Tablets portrait
  "lg": 1024px,
  // Tablets landscape / Small laptops
  "xl": 1280px,
  // Desktops
  "2xl": 1536px, // Large desktops,,,,,,
);
```

### 6.2 裝置適配策略

#### 手機版 (< 768px)

- 保留所有核心功能
- 簡化動畫效果（降低 floating elements 數量）
- 垂直堆疊布局
- 底部固定導航
- 全寬度卡片

#### 平板直立 (768px - 1023px)

- 視為增強版手機體驗
- 2 欄網格布局
- 保留互動功能
- 側邊滑出式導航

#### 平板橫向 & 桌面 (≥ 1024px)

- 完整桌面體驗
- 多欄布局
- 全部動畫效果
- Hover 互動增強
- 固定側邊欄

### 6.3 觸控優化

```css
/* Touch-friendly targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Remove hover effects on touch devices */
@media (hover: none) {
  .hover-effect {
    transition: none;
  }
}
```

## 7. 效能優化規格

### 7.1 載入效能

#### 關鍵指標

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTI**: < 3.5s

#### 優化策略

```typescript
// Image Optimization
<Image
  src="/profile.jpg"
  alt="Profile"
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>;

// Code Splitting
const VolleyballDemo = dynamic(() => import("@/components/VolleyballDemo"), {
  loading: () => <DemoSkeleton />,
  ssr: false,
});

// Font Optimization
<link
  rel="preload"
  href="/fonts/Inter-var.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>;
```

### 7.2 動畫效能

```css
/* Use GPU-accelerated properties */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Enable GPU acceleration */
}

/* Reduce animation for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 8. 無障礙設計規格

### 8.1 WCAG 2.1 AA 合規

#### 色彩對比

- 正常文字: 4.5:1
- 大型文字: 3:1
- 互動元件: 3:1

#### 鍵盤導航

```tsx
// Focus visible styles
.focus-visible:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

// Skip to content link
<a href="#main" className="skip-to-content">
  Skip to main content
</a>
```

### 8.2 螢幕閱讀器支援

```tsx
// Semantic HTML
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/portfolio">作品集</a></li>
  </ul>
</nav>

// ARIA labels for interactive elements
<button
  aria-label="切換語言選單"
  aria-expanded={isOpen}
  aria-controls="language-menu"
>
  <Globe />
</button>
```

## 9. 國際化設計規格

### 9.1 多語言架構

```typescript
// Locale Configuration
export const locales = ["zh-TW", "en", "ja"] as const;
export const defaultLocale = "zh-TW";

// Translation Structure
const translations = {
  "zh-TW": {
    hero: {
      title: "全端工程師",
      subtitle: "專注於 React 與 Node.js",
      cta: "查看作品",
    },
  },
  en: {
    hero: {
      title: "Full-Stack Developer",
      subtitle: "Specialized in React & Node.js",
      cta: "View Portfolio",
    },
  },
  ja: {
    hero: {
      title: "フルスタックエンジニア",
      subtitle: "React と Node.js に特化",
      cta: "ポートフォリオを見る",
    },
  },
};
```

### 9.2 語言切換體驗

```tsx
// Smooth language transition
const changeLanguage = async (locale: string) => {
  // Start view transition
  if (document.startViewTransition) {
    await document.startViewTransition(async () => {
      await router.push(pathname, { locale });
    }).finished;
  } else {
    await router.push(pathname, { locale });
  }

  // Save preference
  localStorage.setItem("preferred-locale", locale);
};
```

## 10. 元件實作範例

### 10.1 Glass Card Component

```tsx
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
}

export const GlassCard = ({
  children,
  className,
  variant = "dark",
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "backdrop-blur-lg backdrop-saturate-150",
        "border border-white/20",
        "shadow-xl",
        variant === "dark" ? "bg-white/10" : "bg-black/10",
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

### 10.2 Floating Elements Background

```tsx
export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${200 + Math.random() * 300}px`,
            height: `${200 + Math.random() * 300}px`,
            background: `radial-gradient(circle, ${
              ["#4facfe", "#00f2fe", "#667eea", "#764ba2"][i % 4]
            } 0%, transparent 70%)`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${20 + i * 5}s`,
          }}
        />
      ))}
    </div>
  );
};
```

## 11. 技術架構建議

### 11.1 框架選擇

基於需求分析，建議使用：

#### 主要框架：Next.js 15 + Fumadocs

- **理由**：
  - Fumadocs 提供優秀的文檔/部落格功能
  - 內建 MDX 支援和國際化
  - 優化的 SEO 和效能

#### 備選方案：Next.js 15 App Router

- **使用場景**：如果 Fumadocs 限制太多
- **額外設置**：
  - next-intl 處理國際化
  - contentlayer 處理 MDX

### 11.2 技術棧建議

```javascript
// package.json dependencies
{
  "dependencies": {
    // Core
    "next": "^15.0.0",
    "react": "^19.0.0",
    "fumadocs-core": "^14.0.0",
    "fumadocs-ui": "^14.0.0",

    // Styling
    "tailwindcss": "^4.0.0",
    "shadcn-ui": "latest",
    "framer-motion": "^11.0.0",

    // Utilities
    "next-intl": "^3.0.0",
    "next-themes": "^0.3.0",
    "clsx": "^2.0.0",

    // MDX & Content
    "mdx": "^3.0.0",
    "@next/mdx": "^15.0.0",
    "shiki": "^1.0.0",

    // Data Visualization
    "recharts": "^2.0.0",
    "mermaid": "^10.0.0"
  }
}
```

## 12. 實作優先順序

### Phase 1: 基礎架構 (Week 1-2)

1. ✅ 專案初始化與環境設置
2. ✅ 設計系統實作
3. ✅ 國際化架構
4. ✅ 基礎元件庫

### Phase 2: 核心頁面 (Week 3-4)

1. ✅ 首頁與個人介紹
2. ✅ 導航與語言切換
3. ✅ 響應式布局
4. ✅ 基礎動畫效果

### Phase 3: 作品集展示 (Week 5-6)

1. ✅ 排球 App 互動展示
2. ✅ API Logs 展示器
3. ✅ 技術架構圖表
4. ✅ 程式碼展示

### Phase 4: 內容平台 (Week 7-8)

1. ✅ 部落格架構
2. ✅ MDX 內容管理
3. ✅ 文章分類與標籤
4. ✅ 搜尋功能

### Phase 5: 優化與部署 (Week 9-10)

1. ✅ 效能優化
2. ✅ SEO 優化
3. ✅ 測試與除錯
4. ✅ 部署至生產環境

## 13. 設計交付清單

### 設計檔案

- [ ] Figma 設計稿連結
- [ ] 設計系統文件
- [ ] 元件規格說明
- [ ] 互動原型展示

### 開發資源

- [ ] 設計 Token JSON
- [ ] 圖示與資源檔案
- [ ] 動畫規格文件
- [ ] 響應式斷點指南

### 測試規格

- [ ] 使用者測試腳本
- [ ] A/B 測試計畫
- [ ] 效能測試基準
- [ ] 無障礙測試清單

## 14. 特殊功能規格

### 14.1 排球 App 即時展示

基於提供的程式碼，設計以下互動展示：

#### 14.1.1 計分板元件整合

```tsx
// 整合 RecordHeader 元件的展示
interface ScoreBoardShowcaseProps {
  mode: "static" | "animated" | "interactive";
  data: {
    homeScore: number;
    awayScore: number;
    sets: SetData[];
  };
}

export const ScoreBoardShowcase = ({ mode, data }: ScoreBoardShowcaseProps) => {
  return (
    <div className="showcase-wrapper glass-effect p-6">
      <div className="showcase-title flex items-center gap-2 mb-4">
        <Badge variant="pulse" className="bg-green-500">
          LIVE
        </Badge>
        <h3 className="text-xl font-bold">即時計分系統</h3>
      </div>

      {/* 嵌入實際的 Scores 元件 */}
      <div className="showcase-content scale-95 origin-top">
        <Scores recordId="demo" onClick={() => handleDemoInteraction()} />
      </div>

      {/* 互動提示 */}
      <div className="showcase-hint mt-4 text-sm text-muted">
        <Info className="inline w-4 h-4 mr-1" />
        點擊上方計分板查看詳細統計
      </div>
    </div>
  );
};
```

#### 14.1.2 球場視覺化展示

```tsx
// 整合 RecordCourt 元件
export const CourtVisualization = () => {
  const [activePlayer, setActivePlayer] = useState(null);

  return (
    <div className="court-showcase">
      {/* 說明標題 */}
      <div className="showcase-header mb-4">
        <h3 className="text-2xl font-bold gradient-text">戰術配置視覺化</h3>
        <p className="text-muted mt-2">即時顯示球員位置與輪轉狀態</p>
      </div>

      {/* 球場元件包裝 */}
      <div className="court-wrapper relative">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl" />

        {/* 實際球場元件 */}
        <div className="relative z-10 p-4">
          <RecordCourt recordId="demo" mode="general" />
        </div>

        {/* 互動層 */}
        <div className="court-overlay absolute inset-0 pointer-events-none">
          {activePlayer && <PlayerTooltip player={activePlayer} />}
        </div>
      </div>

      {/* 功能說明 */}
      <div className="feature-list mt-6 grid grid-cols-2 gap-4">
        <FeatureCard
          icon={<Users />}
          title="即時陣容"
          description="顯示場上六名球員配置"
        />
        <FeatureCard
          icon={<Activity />}
          title="輪轉追蹤"
          description="自動記錄球員輪轉位置"
        />
      </div>
    </div>
  );
};
```

#### 14.1.3 逐球紀錄展示

```tsx
// 整合 Entry 元件的展示
export const EntryLogShowcase = () => {
  const [entries, setEntries] = useState<Entry[]>(sampleEntries);
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="entry-log-showcase">
      <div className="log-container glass-effect rounded-xl p-4">
        {/* 標題區 */}
        <div className="log-header flex justify-between items-center mb-4">
          <h4 className="font-semibold">逐球紀錄</h4>
          <Badge variant={isLive ? "success" : "secondary"}>
            {isLive ? "LIVE" : "DEMO"}
          </Badge>
        </div>

        {/* 紀錄列表 */}
        <div className="log-list space-y-2 max-h-96 overflow-y-auto">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="entry-wrapper animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Entry
                entry={entry}
                players={demoPlayers}
                className="hover:bg-white/5 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* 控制按鈕 */}
        <div className="log-controls mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause /> : <Play />}
            {isLive ? "暫停" : "播放"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => addRandomEntry()}>
            <Plus /> 新增紀錄
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### 14.2 API 即時監控展示

#### 14.2.1 Request/Response 視覺化

```tsx
interface APIMonitorProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  showTiming?: boolean;
  showHeaders?: boolean;
}

export const APIMonitor = ({
  endpoint,
  method,
  showTiming = true,
  showHeaders = false,
}: APIMonitorProps) => {
  const [logs, setLogs] = useState<APILog[]>([]);
  const [activeLog, setActiveLog] = useState<APILog | null>(null);

  return (
    <div className="api-monitor grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Request Builder */}
      <div className="request-panel">
        <h4 className="text-lg font-semibold mb-4">API Request</h4>

        <div className="request-builder glass-effect rounded-lg p-4">
          <div className="method-url flex gap-2 mb-4">
            <Badge className={`method-${method.toLowerCase()}`}>{method}</Badge>
            <code className="flex-1 bg-black/20 rounded px-2 py-1">
              {endpoint}
            </code>
          </div>

          {showHeaders && (
            <div className="headers mb-4">
              <h5 className="text-sm font-medium mb-2">Headers</h5>
              <CodeBlock language="json">
                {JSON.stringify(defaultHeaders, null, 2)}
              </CodeBlock>
            </div>
          )}

          <div className="payload mb-4">
            <h5 className="text-sm font-medium mb-2">Payload</h5>
            <CodeBlock language="json" editable>
              {JSON.stringify(samplePayload, null, 2)}
            </CodeBlock>
          </div>

          <Button className="w-full" onClick={() => executeRequest()}>
            <Send className="mr-2" /> 發送請求
          </Button>
        </div>
      </div>

      {/* Response Viewer */}
      <div className="response-panel">
        <h4 className="text-lg font-semibold mb-4">API Response</h4>

        <div className="response-viewer glass-effect rounded-lg p-4">
          {activeLog ? (
            <>
              {/* Status Bar */}
              <div className="status-bar flex justify-between items-center mb-4">
                <Badge variant={activeLog.status < 400 ? "success" : "error"}>
                  {activeLog.status} {getStatusText(activeLog.status)}
                </Badge>
                {showTiming && (
                  <span className="text-sm text-muted">
                    {activeLog.responseTime}ms
                  </span>
                )}
              </div>

              {/* Response Body */}
              <div className="response-body">
                <CodeBlock language="json">
                  {JSON.stringify(activeLog.response, null, 2)}
                </CodeBlock>
              </div>
            </>
          ) : (
            <div className="empty-state text-center py-12 text-muted">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>等待 API 回應...</p>
            </div>
          )}
        </div>

        {/* Logs History */}
        <div className="logs-history mt-4">
          <h5 className="text-sm font-medium mb-2">請求歷史</h5>
          <div className="logs-list space-y-1 max-h-32 overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "log-item flex justify-between items-center",
                  "px-2 py-1 rounded cursor-pointer",
                  "hover:bg-white/5 transition-colors",
                  activeLog === log && "bg-white/10"
                )}
                onClick={() => setActiveLog(log)}
              >
                <span className="text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-xs">
                  {log.method} - {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 14.3 技術架構圖表

#### 14.3.1 Mermaid 圖表整合

```tsx
export const ArchitectureDiagram = () => {
  const mermaidCode = `
    graph TB
      subgraph Frontend
        A[Next.js App] --> B[React Components]
        B --> C[Tailwind CSS]
        B --> D[Framer Motion]
      end
      
      subgraph Backend
        E[Node.js Server] --> F[Express API]
        F --> G[PostgreSQL]
        F --> H[Redis Cache]
      end
      
      subgraph Cloud
        I[GCP Cloud Run] --> J[Cloud Storage]
        I --> K[Cloud Functions]
      end
      
      A --> E
      E --> I
  `;

  return (
    <div className="architecture-diagram">
      <div className="diagram-header mb-4">
        <h3 className="text-2xl font-bold">系統架構</h3>
        <p className="text-muted mt-2">全端應用架構與技術棧視覺化</p>
      </div>

      <div className="diagram-container glass-effect rounded-xl p-6">
        <Mermaid chart={mermaidCode} />
      </div>

      <div className="tech-badges mt-6 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="outline" className="tech-badge">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
};
```

## 15. 效能監控與分析

### 15.1 Core Web Vitals 追蹤

```typescript
// Web Vitals Monitoring
import { getCLS, getFID, getLCP, getTTFB, getFCP } from "web-vitals";

export const reportWebVitals = (metric: any) => {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // Send to analytics
  if (window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      non_interaction: true,
    });
  }
};
```

### 15.2 使用者行為追蹤

```typescript
// User Interaction Tracking
export const trackInteraction = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Usage Example
trackInteraction("Portfolio", "view_project", "volleyball_app");
trackInteraction("Language", "switch", "en_to_ja");
```

## 16. 測試規格

### 16.1 元件測試

```typescript
// Component Testing Example
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitch } from "@/components/LanguageSwitch";

describe("LanguageSwitch", () => {
  it("should switch language on selection", () => {
    render(<LanguageSwitch currentLocale="zh-TW" />);

    const button = screen.getByRole("button", { name: /切換語言/i });
    fireEvent.click(button);

    const englishOption = screen.getByText("English");
    fireEvent.click(englishOption);

    expect(mockRouter.push).toHaveBeenCalledWith(expect.anything(), {
      locale: "en",
    });
  });
});
```

### 16.2 E2E 測試

```typescript
// Playwright E2E Test
import { test, expect } from "@playwright/test";

test.describe("Portfolio Page", () => {
  test("should display volleyball app demo", async ({ page }) => {
    await page.goto("/portfolio");

    // Check if demo is visible
    const demo = await page.locator('[data-testid="volleyball-demo"]');
    await expect(demo).toBeVisible();

    // Interact with demo
    await page.click('[data-testid="start-demo"]');
    await expect(page.locator(".court-display")).toBeVisible();

    // Check API logs
    await page.click('[data-testid="view-logs"]');
    await expect(page.locator(".api-logs")).toBeVisible();
  });
});
```

## 17. 部署與維護

### 17.1 部署策略

使用 Vercel 進行持續部署

## 18. 總結與下一步

### 18.1 關鍵成功因素

1. **視覺吸引力** - 現代漸層與 Glassmorphism 創造專業形象
2. **互動體驗** - 實際可操作的元件展示技術能力
3. **效能優化** - 快速載入確保良好第一印象
4. **國際化支援** - 三語切換展現國際工作能力

### 18.2 實作建議

1. 優先實作核心功能（首頁、排球 App 展示）
2. 逐步添加動畫效果，確保不影響效能
3. 持續測試不同裝置和瀏覽器
4. 收集使用者回饋並迭代改進

### 18.3 長期維護計畫

1. 定期更新作品集內容
2. 持續發布技術文章
3. 監控網站效能指標
4. 根據求職市場調整展示重點

---

## 附錄 A: 技術參考文件

- [Next.js 15 文檔](https://nextjs.org/docs)
- [Fumadocs 文檔](https://fumadocs.vercel.app)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 附錄 B: 測試檢查清單

### 瀏覽器相容性

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

### 裝置測試

- [ ] iPhone 14/15
- [ ] Samsung Galaxy
- [ ] iPad Pro
- [ ] Desktop (1920x1080)
- [ ] Desktop (2560x1440)

### 效能指標

- [ ] Lighthouse Score > 90
- [ ] First Paint < 1s
- [ ] TTI < 3.5s
- [ ] Bundle Size < 200KB
