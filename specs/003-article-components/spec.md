# Feature Specification: Article 元件泛用化系統

**Feature Branch**: `003-article-components`
**Created**: 2025-10-19
**Status**: Draft
**Input**: User description: "1. generated-hero, featured-project-card, project-detail, project-detail-image 為 project article 專用的元件 2. 將這些文件已最佳實踐重構成 article 泛用型元件，以供 projects, notes 文章共用"

## Execution Flow (main)

```
1. Parse user description from Input
   → Identified: 4 components need refactoring for reusability
2. Extract key concepts from description
   → Actors: Content authors (writing projects/notes)
   → Actions: Display articles with hero images, cards, detail views
   → Data: Article metadata (title, description, images, dates)
   → Constraints: Must support both projects and notes content types
3. For each unclear aspect:
   → Background image customization options clarified with user
4. Fill User Scenarios & Testing section
   → Primary: Author publishes article, visitors view it
5. Generate Functional Requirements
   → 7 requirements defined (FR-001 to FR-007)
6. Identify Key Entities
   → ArticleMetadata, ArticlePageData, ArticleImage config
7. Run Review Checklist
   → No [NEEDS CLARIFICATION] markers remain ✓
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

作為**內容作者**，我希望能夠使用統一的文章展示系統來發布專案展示（projects）和技術筆記（notes）兩種內容類型，讓訪客能夠以一致的視覺體驗瀏覽所有文章，同時每篇文章可以自訂主視覺的呈現方式（靜態圖片、純色背景、漸層色、或背景圖）。

### Acceptance Scenarios

#### Scenario 1: 作者發布使用漸層背景的文章

1. **Given** 作者撰寫一篇新的技術筆記
2. **When** 作者在文章設定中指定「使用動態生成的主視覺」並設定背景為 CSS 漸層色
3. **Then** 系統應在文章列表卡片和詳細頁面中顯示該漸層背景，並在社群分享時生成相同風格的預覽圖

#### Scenario 2: 訪客瀏覽精選文章列表

1. **Given** 系統中有 5 篇精選專案和 3 篇精選筆記
2. **When** 訪客造訪首頁的精選文章區塊
3. **Then** 系統應以統一的卡片樣式展示所有精選文章，無論其內容類型為何

#### Scenario 3: 作者切換文章主視覺類型

1. **Given** 一篇文章原本使用靜態圖片作為主視覺
2. **When** 作者將設定改為動態生成，並指定純色背景
3. **Then** 系統應在所有展示位置（列表、詳細頁、社群預覽）使用新的純色背景

#### Scenario 4: 多語言文章展示

1. **Given** 一篇文章有繁中、英文、日文三種語言版本
2. **When** 訪客切換語言
3. **Then** 系統應顯示對應語言的文章內容，但保持主視覺的一致性（除非該語言版本有獨立的視覺設定）

### Edge Cases

- **背景設定為無效 CSS 值**: 系統應使用預設的漸層背景
- **圖片路徑不存在**: 系統應顯示替代視覺（純色或漸層）
- **沒有精選文章**: 精選文章區塊應顯示「暫無精選內容」的友善訊息
- **文章缺少主視覺設定**: 系統應使用預設的主視覺樣式（漸層背景 + 文章標題）

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: 系統必須提供統一的文章資料結構，支援專案（projects）和筆記（notes）兩種內容類型共用相同的展示元件

- **FR-002**: 系統必須支援兩種主視覺模式：
  - **靜態圖片模式**: 使用作者上傳的圖片檔案
  - **動態生成模式**: 根據作者設定動態產生主視覺

- **FR-003**: 在動態生成模式中，系統必須支援三種背景樣式：
  - **CSS 漸層**: 如 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
  - **純色**: 如 `#667eea` 或 `rgb(102, 126, 234)`
  - **背景圖片**: 圖片路徑如 `/images/bg.jpg`

- **FR-004**: 系統必須在以下三個位置提供一致的文章視覺呈現：
  - **文章卡片**（列表頁、精選區塊）
  - **文章詳細頁**（頁面頂部主視覺）
  - **社群分享預覽**（Open Graph 圖片）

- **FR-005**: 系統必須支援兩種文章卡片佈局變體：
  - **Hero 變體**: 大尺寸卡片，適合首篇精選文章
  - **Compact 變體**: 緊湊型卡片，適合列表展示

- **FR-006**: 系統必須保持以下既有功能：
  - **頁面轉場動畫**: 從列表卡片點擊進入詳細頁時的流暢轉場
  - **多語言支援**: 所有文章內容支援繁中、英文、日文三種語言
  - **響應式設計**: 在桌面、平板、手機上都有良好的瀏覽體驗

- **FR-007**: 筆記（notes）功能必須支援完整的文章展示結構：
  - **精選筆記展示**: 類似專案的精選區塊
  - **筆記列表頁**: 顯示所有筆記
  - **筆記詳細頁**: 完整的筆記內容展示

### Key Entities _(include if feature involves data)_

- **ArticleMetadata**: 文章基礎資料，包含標題、描述、日期、作者、語言、主視覺設定等屬性。此實體為所有文章類型（專案、筆記）的共同基礎。

- **ArticleImage**: 文章主視覺設定，包含：
  - 視覺模式（靜態圖片 / 動態生成）
  - 靜態圖片路徑（當模式為靜態時）
  - 動態生成設定（當模式為動態時）：
    - 顯示文字內容
    - 背景樣式（CSS 值或圖片路徑）
    - 自訂樣式類別

- **ArticleCard**: 文章卡片展示資訊，包含：
  - 文章基礎資料引用（ArticleMetadata）
  - 卡片佈局變體（Hero / Compact）
  - 優先載入標記（影響圖片載入策略）

- **ArticlePageData**: 文章詳細頁資料，包含：
  - 文章基礎資料（ArticleMetadata）
  - 完整內容（已編譯的內容元件）
  - 原始內容文字

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
- [x] Ambiguities marked (resolved with user)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
