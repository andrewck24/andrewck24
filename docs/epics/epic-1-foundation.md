# Epic 1: 基礎網站建立與首頁

## Epic 概述

建立專案的技術基礎和首頁設計，確保訪客能快速了解個人背景和專業能力，並提供清晰的網站導航。

## Epic 目標

- 建立穩定且功能豐富的網站基礎架構
- 實作專業且吸引人的首頁
- 提供良好的使用者體驗和視覺效果
- 支援多語言國際化功能

## Status

**開始日期**: TBD
**預計完成**: TBD
**目前狀態**: Planning

## Stories

### Story 1.1: 專案初始化與基礎架構

**User Story**:  
As a 前端/全端工程師,
I want 建立一個基於 Fumadocs 的專案架構,
so that 我有一個穩定且功能豐富的網站基礎來展示個人作品和技術能力。

**Acceptance Criteria**:

1. 使用 Fumadocs 或 Next.js 15+ 建立專案，支援 TypeScript 和 App Router
2. 配置 Tailwind CSS 和基本的設計系統（顏色、字體、間距）
3. 設定 ESLint、Prettier 和基本的 Git hooks
4. 建立基本的檔案結構：pages、components、styles、lib 等目錄
5. 設定基本的 meta tags 和 SEO 配置

**優先順序**: P0 (必要)  
**估算工時**: 4-6 小時  
**依賴**: 無

### Story 1.2: 響應式首頁設計與實作

**User Story**:  
As a 潛在雇主或招募人員,  
I want 在首頁快速了解這位工程師的基本資料和核心技能,  
so that 我能快速評估是否符合職位需求。

**Acceptance Criteria**:

1. 首頁包含個人照片、姓名、職稱（前端/全端工程師）
2. 展示核心技術技能：React、Node.js、TypeScript、GCP、AWS
3. 提供 GitHub、LinkedIn 等專業平台的連結
4. 包含簡潔的個人介紹（中英日三語版本）
5. 主要 CTA 按鈕導向作品集和聯絡方式
6. 響應式設計，在手機和桌面都有良好體驗
7. 載入時間低於 3 秒，包含所有圖片和樣式

**優先順序**: P0 (必要)  
**估算工時**: 8-10 小時  
**依賴**: Story 1.1

### Story 1.3: CSS 動畫效果與視覺增強

**User Story**:  
As a 網站訪客,  
I want 體驗流暢且專業的視覺效果,  
so that 對這位工程師的前端技術能力產生正面印象。

**Acceptance Criteria**:

1. 實作 blurry floating elements 背景動畫效果，使用純 CSS
2. 加入 hover 效果到主要的互動元素（按鈕、連結、卡片）
3. 頁面載入時的漸入動畫效果
4. 滑動捲動時的 reveal 動畫
5. 確保動畫在不同裝置和瀏覽器上的流暢性
6. 提供 prefers-reduced-motion 的可訪問性支援
7. 動畫不影響頁面的效能分數（Lighthouse > 90）

**優先順序**: P1 (重要)  
**估算工時**: 6-8 小時  
**依賴**: Story 1.2

### Story 1.4: 多語言導航與基礎頁面

**User Story**:  
As a 國際求職者,  
I want 網站能支援中英日三種語言,  
so that 我能向不同地區的雇主展示語言能力和文化適應性。

**Acceptance Criteria**:

1. 配置 fumadocs 原生國際化功能
2. 實作語言切換功能，支援繁體中文、英文、日文
3. 建立基礎的頁面路由：首頁、作品集、部落格、關於我
4. 導航選單在所有裝置上都清晰可用
5. 語言切換會記住使用者偏好（localStorage）
6. 每個語言版本的 URL 結構清晰（/en、/ja 等）
7. 基本的 404 錯誤頁面處理
8. 所有基礎頁面都有對應的多語言內容框架

**優先順序**: P0 (必要)  
**估算工時**: 10-12 小時  
**依賴**: Story 1.1

## Definition of Done

- [ ] 所有 Stories 的 Acceptance Criteria 已完成
- [ ] 程式碼通過 ESLint 和 TypeScript 檢查
- [ ] 響應式設計在主要裝置上測試通過
- [ ] 多語言功能正常運作
- [ ] 首頁載入時間 < 3 秒
- [ ] Lighthouse 效能分數 > 90
- [ ] 可訪問性符合 WCAG AA 標準
- [ ] 程式碼已進行 Code Review
- [ ] 部署到 staging 環境測試通過

## 技術架構要點

- **框架**: Fumadocs / Next.js 15+ with App Router
- **樣式**: Tailwind CSS + CSS Modules
- **TypeScript**: 嚴格模式
- **國際化**: next-intl 或 fumadocs 原生支援
- **動畫**: 純 CSS transitions 和 transforms
- **SEO**: Next.js Metadata API

## 風險與考量

- **風險**: Fumadocs 框架限制可能影響自訂設計
- **緩解**: 準備 Next.js 備選方案
- **考量**: 多語言內容管理需要清楚的檔案結構
- **考量**: 動畫效能需要仔細調整

## 交付成果

1. 功能完整的首頁（支援三語言）
2. 基本導航架構
3. 設計系統和樣式指南
4. 開發環境設定文件
5. 部署配置和 CI/CD 設定
