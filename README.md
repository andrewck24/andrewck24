# 個人形象網站 - andrewck24.github.io

專業的個人品牌網站，展示前端到全端工程師的技術能力和產品思維。基於 Fumadocs 框架建構，支援多語言內容和互動式專案展示。

## 🚀 快速開始

### 環境需求

- Node.js 20.0 或更高版本
- npm 9.0 或更高版本（或 pnpm/yarn）

### 安裝步驟

Step 1. **Clone 專案**

```bash
git clone https://github.com/andrewck24/andrewck24.github.io.git
cd andrewck24.github.io
```

Step 2. **安裝依賴**

```bash
npm install
```

Step 3. **執行開發伺服器**

```bash
npm run dev
```

Step 4. **開啟瀏覽器**
前往 [http://localhost:3000](http://localhost:3000) 查看結果

## 📁 專案結構

```plaintext
├── docs/                   # 專案文件
│   ├── epics/              # Epic 文件
│   ├── prd.md              # 產品需求文件
│   └── architecture.md     # 技術架構文件
├── content/                # 多語言內容
│   └── docs/
│       ├── en/             # 英文內容
│       ├── ja/             # 日文內容
│       └── zh-tw/          # 繁體中文內容
├── src/
│   ├── app/                # Next.js App Router
│   │   └── [lang]/         # 多語言路由
│   ├── components/         # React 元件
│   └── lib/                # 工具函式和配置
└── public/                 # 靜態資源
```

## 🛠 可用指令

| 指令            | 說明             |
| --------------- | ---------------- |
| `npm run dev`   | 啟動開發伺服器   |
| `npm run build` | 建置生產版本     |
| `npm start`     | 啟動生產伺服器   |
| `npm run lint`  | 執行 ESLint 檢查 |

## 🌍 多語言支援

網站支援三種語言：

- 🇹🇼 繁體中文 (zh-tw)
- 🇺🇸 English (en)
- 🇯🇵 日本語 (ja)

URL 結構：

- `/` - 預設語言（繁體中文）
- `/en` - 英文版本
- `/ja` - 日文版本

## 📋 開發工作流程

### Epic 開發流程

1. 查看 `docs/epics/` 中的 Epic 文件
2. 按照 Story 優先順序進行開發
3. 確保符合 Definition of Done 標準

### 內容管理

- 技術文章放在 `content/docs/[lang]/`
- 支援 MDX 格式，可嵌入 React 元件
- 使用 frontmatter 管理文章 metadata

## 🚀 部署

專案設計用於部署到 Vercel：

1. **自動部署**：推送到 `main` 分支自動觸發部署
2. **手動部署**：執行 `npm run build` 後部署 `out/` 目錄

## 🔧 技術堆疊

- **框架**: Next.js 15 + Fumadocs
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **內容**: MD/MDX
- **部署**: Vercel

## 📚 相關文件

- [產品需求文件 (PRD)](docs/prd.md)
- [技術架構文件](docs/architecture/index.md)
- [Epic 1: 基礎網站建立](docs/epics/epic-1-foundation.md)
- [Epic 2: 作品集展示](docs/epics/epic-2-portfolio.md)
- [Epic 3: 技術部落格](docs/epics/epic-3-blog.md)
- [Epic 4: 互動展示](docs/epics/epic-4-interactive.md)
