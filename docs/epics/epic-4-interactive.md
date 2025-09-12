# Epic 4: 互動展示與後端整合

## Epic 概述

實作可直接操作的前端元件和即時的後端功能展示，讓訪客親身體驗技術能力而非僅止於閱讀介紹。

## Epic 目標

- 提供可直接操作的前端元件展示
- 實作即時 API 請求和回應展示
- 展現全端開發和雲端整合能力
- 證明系統設計和後端開發技術

## Status

**開始日期**: TBD  
**預計完成**: TBD  
**目前狀態**: Planning  
**依賴**: Phase 1 (Epic 1-3) 完成

## Stories

### Story 4.1: 排球 App 關鍵元件嵌入

**User Story**:  
As a 潛在雇主,  
I want 直接操作和體驗排球 app 的核心功能,  
so that 親身感受工程師的前端開發能力和使用者體驗設計。

**Acceptance Criteria**:

1. ⬜ 選擇 2-3 個排球 app 的關鍵 React 元件嵌入展示
2. ⬜ 元件必須完全可互動，包含狀態管理和事件處理
3. ⬜ 提供模擬資料，讓訪客能進行完整的操作流程
4. ⬜ 元件展示區有清楚的說明和操作指引
5. ⬜ 響應式設計，在不同裝置上都能正常操作
6. ⬜ 包含 loading 狀態和錯誤處理的展示
7. ⬜ 元件代碼可以通過 code viewer 檢視（optional）

**優先順序**: P0 (必要)  
**估算工時**: 10-12 小時  
**依賴**: Epic 1 完成

### Story 4.2: 即時 API 展示系統

**User Story**:  
As a 技術主管,  
I want 看到即時的 API 請求和回應,  
so that 驗證工程師的後端開發和系統整合能力。

**Acceptance Criteria**:

1. ⬜ 建立類似 Vercel 後台的 logs 展示器 UI 元件
2. ⬜ 當訪客操作前端元件時，即時顯示對應的 API 請求
3. ⬜ 展示請求的 method、URL、headers 和 payload
4. ⬜ 顯示回應的狀態碼、執行時間和回應內容
5. ⬜ 實作簡單的後端 API（使用 Vercel Functions 或 Serverless）
6. ⬜ 包含模擬的資料庫操作（create、read、update）
7. ⬜ API 請求記錄會定期清理，避免累積過多資料

**優先順序**: P1 (重要)  
**估算工時**: 12-16 小時  
**依賴**: Story 4.1

### Story 4.3: 後端服務與雲端整合

**User Story**:  
As a 全端開發職位的面試官,  
I want 了解候選人的雲端服務和後端系統能力,  
so that 確認其能勝任全端開發的工作需求。

**Acceptance Criteria**:

1. ⬜ 使用 Vercel Functions 建立 API（優先選項，GCP 作為備案）
2. ⬜ 實作基本的 CRUD 操作 API endpoints
3. ⬜ 使用 Vercel 內建資料庫整合服務（如 Vercel Postgres）
4. ⬜ 實作 API rate limiting 和錯誤處理
5. ⬜ 展示 API 文件（使用 OpenAPI 或類似工具）
6. ⬜ 包含 API 監控和日誌記錄功能

**優先順序**: P1 (重要)  
**估算工時**: 12-16 小時  
**依賴**: Story 4.2

## Definition of Done

- [ ] 所有 Stories 的 Acceptance Criteria 已完成
- [ ] 互動元件在主要瀏覽器上正常運作
- [ ] API 展示系統即時且準確
- [ ] 後端服務穩定且安全
- [ ] 雲端服務成本控制在預算內
- [ ] API 文件完整且易於理解
- [ ] 錯誤處理和邊界情況處理完善
- [ ] 程式碼已進行 Code Review
- [ ] 功能測試和整合測試通過

## 技術架構要點

- **前端元件**: React + TypeScript，完全可互動
- **狀態管理**: Context API 或 Zustand
- **API 通信**: Fetch API 或 Axios
- **後端**: Vercel Functions（主要）或 GCP Cloud Functions（備案）
- **資料庫**: Vercel Postgres 或其他 Vercel 整合服務
- **監控**: 基本的日誌和錯誤追蹤

## 風險與考量

- **風險**: 雲端服務成本可能超出預算
- **緩解**: 優先使用 Vercel 免費額度，GCP 作為備案
- **風險**: 複雜的後端整合可能影響開發時程
- **緩解**: 從簡單功能開始，逐步增加複雜性
- **考量**: 展示用途的 API 安全性需要適當但不過度複雜的處理
- **考量**: 模擬資料需要真實且有代表性

## 交付成果

1. 可互動的排球 app 元件展示
2. 即時 API 請求展示系統
3. 功能完整的後端 API 服務
4. API 文件和使用說明
5. 雲端部署配置和監控設定
