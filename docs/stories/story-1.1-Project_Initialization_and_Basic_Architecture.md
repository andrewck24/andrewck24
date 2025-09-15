# Story 1.1: 專案初始化與基礎架構

## Status

Done

## Story

**As a** 前端/全端工程師,
**I want** 建立一個基於 Fumadocs 的專案架構,
**so that** 我有一個穩定且功能豐富的網站基礎來展示個人作品和技術能力。

## Acceptance Criteria

1. ✓ 使用 Fumadocs 或 Next.js 15+ 建立專案，支援 TypeScript 和 App Router
2. ✓ 配置 Tailwind CSS 和基本的設計系統（顏色、字體、間距）
3. ✓ 設定 ESLint、Prettier 和基本的 Git hooks
4. ✓ 建立基本的檔案結構：pages、components、styles、lib 等目錄
5. ✓ 設定基本的 meta tags 和 SEO 配置

## Tasks / Subtasks

- [x] 完成 Tailwind CSS 設計系統配置 (AC: 2)
  - [x] 在 globals.css 中使用 @theme 配置色彩系統 (primary, accent)
  - [x] 設定字體和間距系統
  - [x] 配置 globals.css 基礎樣式和 @import "tailwindcss"
- [x] 設定程式碼品質工具 (AC: 3)
  - [x] 配置 ESLint 規則 (eslint.config.ts)
  - [x] 設定 Prettier 格式化 (.prettierrc)
  - [x] 建立 pre-commit hooks 腳本 (.husky/)
  - [x] 設定 lint-staged 配置
- [x] 配置 SEO 和 meta tags (AC: 5)
  - [x] 設定 Next.js metadata API
  - [x] 建立 sitemap.ts 配置
  - [x] 配置基本的 robots.txt
- [x] 驗證專案結構完整性 (AC: 4)
  - [x] 確認所有必要目錄存在
  - [x] 驗證 TypeScript 配置正常
  - [x] 測試建構流程運作

## Dev Notes

### 技術棧與框架

[Source: architecture/tech-stack.md]

- **前端框架**: Next.js 15.0+ with App Router, TypeScript 5.3+
- **樣式系統**: Tailwind CSS 4.0+ with Shadcn/ui 元件庫
- **開發工具**: ESLint 8.50+, Prettier 3.0+, pnpm 8.15+
- **部署平台**: Vercel (自動部署，零配置)

### 專案結構對齊

[Source: architecture/source-tree.md]

**目前符合項目**:

- ✓ Next.js App Router 結構 (`src/app/`)
- ✓ 多語言 i18n 路由 (`src/app/[lang]/`)
- ✓ API Routes 存在 (`src/app/api/`)
- ✓ 基礎元件目錄 (`src/components/`)
- ✓ 共用邏輯目錄 (`src/lib/`)
- ✓ 內容目錄存在 (`content/`)

**需完成項目**:

- 完整的設計系統配置
- 程式碼品質工具設定
- SEO 基礎配置
- 環境變數管理

### 程式碼標準

[Source: architecture/coding-standards.md]

**Tailwind CSS 4.x + shadcn/ui 色彩系統** (使用 CSS 變數配置):

```css
@import "tailwindcss";

:root {
  --radius: 0.625rem;
  --primary: oklch(0.21 0.034 264.665);
  --primary-foreground: oklch(0.985 0.002 247.839);
  --accent: oklch(0.967 0.003 264.542);
  --accent-foreground: oklch(0.21 0.034 264.665);
  /* 其他 shadcn/ui 系統色彩變數 */
}

.dark {
  --primary: oklch(0.928 0.006 264.531);
  --primary-foreground: oklch(0.21 0.034 264.665);
  --accent: oklch(0.278 0.033 256.848);
  --accent-foreground: oklch(0.985 0.002 247.839);
}

@theme inline {
  --color-primary: var(--primary);
  --color-accent: var(--accent);
}
```

**測試 ID 標準**: 使用 data-testid 屬性，命名格式為 `[component]-[element]`

**Pre-commit 檢查**: pnpm type-check, pnpm lint, pnpm test

### 國際化配置

[Source: architecture/source-tree.md#中介軟體配置]

- Fumadocs 原生 i18n 支援 (lib/i18n.ts)
- 支援語言: zh-TW (預設), en, ja
- 中介軟體: createI18nMiddleware (middleware.ts)

### 測試

#### 測試架構

[Source: architecture/testing-strategy.md]

- **測試框架**: Jest + React Testing Library
- **測試位置**: `__tests__/` 目錄
- **E2E 測試**: Playwright
- **測試標準**: 所有元件需要基本測試，使用 data-testid

#### 測試檔案結構

```txt
__tests__/
├── components/
└── utils/
```

#### 基礎測試範例

```typescript
describe("Component", () => {
  it("should render with testids", () => {
    render(<Component />);
    expect(screen.getByTestId("component-element")).toBeInTheDocument();
  });
});
```

### 環境配置與部署

**開發環境工具**:

- pnpm: 套件管理
- Next.js dev server: 開發伺服器
- TypeScript compiler: 靜態型別檢查

**Vercel 部署配置**:

- 自動部署: main branch → production
- 預覽部署: feature branches → preview

### 檔案位置

根據架構文件，重要檔案應位於：

- 配置檔案: 專案根目錄
- 樣式檔案: `src/app/globals.css`
- TypeScript 配置: `tsconfig.json`
- 環境變數範例: `.env.local.example`

## Change Log

| Date       | Version | Description            | Author   |
| ---------- | ------- | ---------------------- | -------- |
| 2025-09-14 | 1.0     | Initial story creation | Bob (sm) |

## Dev Agent Record

_This section will be populated by the development agent during implementation._

### Agent Model Used

Sonnet 4 (claude-sonnet-4-20250514)

### Debug Log References

- ESLint v9 遷移到 flat config 格式 (eslint.config.ts)
- Husky 新版本設定方式 (npx husky init)
- Next.js metadata metadataBase 警告修復

### Completion Notes List

- ✅ Tailwind CSS 4.x 設計系統完整配置，包含明暗主題
- ✅ ESLint 9.x flat config 配置，兼容 Next.js 最佳實踐
- ✅ Prettier + Husky + lint-staged 程式碼品質工具鏈
- ✅ Next.js metadata API 多語言 SEO 配置
- ✅ 動態 sitemap 和 robots.txt 生成
- ✅ 完整環境變數類型定義和範例檔案
- ✅ TypeScript 編譯和專案建構驗證通過

### File List

**新增檔案:**

- `.prettierrc` - Prettier 格式化配置
- `.husky/pre-commit` - Git pre-commit hook
- `eslint.config.ts` - ESLint flat config
- `src/app/sitemap.ts` - 動態 sitemap 生成
- `src/app/robots.ts` - robots.txt 配置
- `src/types/env.d.ts` - 環境變數類型定義

**修改檔案:**

- `src/app/globals.css` - 完整設計系統色彩配置
- `src/app/[lang]/layout.tsx` - metadata 和 SEO 配置
- `package.json` - 開發腳本和 lint-staged 配置

## QA Results

### Review Date: 2025-09-14

### Reviewed By: Quinn (Test Architect)

### Code Quality Assessment

優秀的基礎架構實作。所有驗收條件均已正確實現，採用了現代化的技術棧和最佳實踐。框架配置完整，包含完整的 Tailwind CSS 4.x 設計系統、ESLint 9.x flat config、以及 Next.js 15 的最新功能。

### Refactoring Performed

- **File**: `jest.config.ts`
  - **Change**: 修復 Jest 配置以符合 Next.js 官方建議，移除多餘的 transform 配置
  - **Why**: 原配置缺少 ts-node 依賴且過於複雜
  - **How**: 使用 next/jest 自動處理配置，簡化設定並添加缺少的依賴

- **File**: `package.json`
  - **Change**: 自動添加 ts-node 和 @types/jest 依賴
  - **Why**: Jest TypeScript 配置需要這些依賴
  - **How**: npm install 自動更新 package.json

### Compliance Check

- Coding Standards: ✓ 完全符合 TypeScript strict mode、ESLint 9.x、Prettier 配置
- Project Structure: ✓ 完全符合 Next.js App Router 和 Fumadocs 結構
- Testing Strategy: ✓ Jest + RTL 配置正確，測試執行成功
- All ACs Met: ✓ 所有 5 個驗收條件均已完成

### Improvements Checklist

- [x] 修復 Jest 配置使測試正常運行 (`jest.config.ts`)
- [x] 驗證所有程式碼品質工具正常運作 (ESLint, TypeScript, 建構)
- [x] 確認多語言 SEO 配置正確 (`layout.tsx`, `sitemap.ts`, `robots.ts`)
- [x] 確認基礎設施檔案不需測試 (sitemap, robots, i18n 等為靜態配置)
- [ ] 未來開發業務邏輯組件時添加相應測試
- [ ] 待功能開發完成後建立 E2E 測試流程

### Security Review

✓ **環境變數管理**: 完整的 TypeScript 類型定義和範例檔案
✓ **SEO 安全配置**: robots.txt 正確排除敏感路徑
✓ **TypeScript 嚴格模式**: 啟用所有安全檢查
◐ **內容安全策略**: 基礎架構階段暫未實作，後續功能開發時建議添加

### Performance Considerations

✓ **靜態生成優化**: SSG 和預渲染配置正確
✓ **Bundle 大小合理**: First Load JS 約 102-131kB，符合預期
✓ **現代化工具鏈**: Next.js 15 + Tailwind CSS 4.x 提供最佳效能
✓ **字體優化**: next/font 自動優化 Inter 字體載入

### Files Modified During Review

- `jest.config.ts` - 修復配置使其符合 Next.js 官方建議
- `package.json` - 添加 ts-node 和 @types/jest 依賴 (自動更新)

請開發者更新 File List 以包含這些變更。

### Gate Status

Gate: PASS → docs/qa/gates/1.1-project-initialization-and-basic-architecture.yml
Quality Score: 95/100

### Recommended Status

✓ Ready for Done
基礎架構配置完美，符合真實世界最佳實踐。靜態配置檔案 (sitemap, robots, i18n) 無需測試。測試架構已就緒，待業務邏輯開發時再添加對應測試。
(Story owner decides final status)
