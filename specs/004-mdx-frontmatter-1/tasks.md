# 任務清單：MDX Frontmatter Schema 統一化與文章版面強化

**輸入**: 設計文件來自 `/specs/004-mdx-frontmatter-1/`
**前置條件**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## 執行流程 (main)

```plaintext
1. 載入 plan.md ✅
   → 技術堆疊: TypeScript 5.9, Next.js 16.0.0, React 19.2.0, fumadocs-mdx 13.0.0
   → 結構: 單一 Next.js App Router 應用
2. 載入設計文件: ✅
   → data-model.md: 4 個實體 (BaseArticle, ProjectArticle, NoteArticle, Tag System)
   → contracts/: 3 個型別契約 (schema.ts, article-props.ts, tag-system.ts)
   → quickstart.md: 3 個測試場景 (標籤過濾案例)
3. 依類別產生任務:
   → 設定: Schema 遷移、型別更新
   → 測試: 單元 (schema 驗證)、元件 (Article Info)、E2E (標籤過濾)
   → 核心: Schema 實作、Article 元件強化、Orama 整合
   → 整合: 建置驗證、MDX 內容更新
   → 潤飾: 圖片遷移、效能驗證
4. 套用 TDD 規則:
   → 測試先於實作 (Phase 3.2 在 3.3 之前)
   → 不同檔案 = [P] 可平行執行
   → 相同檔案 = 循序執行
5. 任務編號 (T001-T026)
6. 依據檔案關係套用相依性
7. 驗證: 所有實體已涵蓋、所有測試在實作前 ✅
```

## 格式: `[ID] [P?] 描述`

- **[P]**: 可平行執行 (不同檔案、無相依性)
- 所有檔案路徑為從專案根目錄的絕對路徑

## 路徑慣例

單一 Next.js 網頁應用結構：

- 設定檔: `source.config.ts` 位於專案根目錄
- 原始碼: `src/` 包含元件、型別、函式庫
- 內容: `content/projects/`、`content/notes/`
- 測試: `tests/` 存放 E2E、`src/` 內各目錄的 `__tests__/` 存放單元與元件測試
- 公開資源: `public/images/` 存放靜態資源

---

## Phase 3.1: 設定與準備

- [x] **T001** [P] 更新 source.config.ts 統一 baseArticleSchema ✅ 完成於 0f7deb8
  - 檔案: `source.config.ts`
  - 使用 `frontmatterSchema.extend()` 抽取基礎 schema
  - 新增欄位: imageType, image, ogImage, date, tags
  - 圖片路徑正規表達式: `/^\/images\/(projects|notes)\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i`
  - 日期驗證: YYYY-MM-DD 格式並轉換
  - 標籤: `z.array(z.string()).default([])`
  - 相依性: 無

- [x] **T002** [P] 在 source.config.ts 擴充 projectArticleSchema ✅ 完成於 0f7deb8
  - 檔案: `source.config.ts`
  - 擴充 baseArticleSchema 加入專案特有欄位
  - 新增: githubUrl (選填 URL)、demoUrl (選填 URL)
  - 保留既有: featured (boolean, 預設 false)、order (1-99)
  - 套用至 projects.defineDocs() schema
  - 相依性: T001 (相同檔案)

- [x] **T003** [P] 更新 source.config.ts 的 noteArticleSchema ✅ 完成於 0f7deb8
  - 檔案: `source.config.ts`
  - 設定 noteArticleSchema = baseArticleSchema.extend({ featured })
  - 套用至 notes.defineDocs() schema
  - 移除 category 欄位（與 tags 功能重複）
  - 相依性: T001 (相同檔案)

- [x] **T004** [P] 更新 src/types/article.ts 加入推斷型別 ✅ 完成於 0f7deb8
  - 檔案: `src/types/article.ts`
  - 建立為 Single Source of Truth，定義所有 schemas
  - 新增: `export type BaseArticle = z.infer<typeof baseArticleSchema>`
  - 新增: `export type ProjectArticle = z.infer<typeof projectArticleSchema>`
  - 新增: `export type NoteArticle = z.infer<typeof noteArticleSchema>`
  - 新增: `export type ArticleCardData<T>` (用於列表/卡片元件)
  - 新增: `export type ArticlePageData<T extends BaseArticle> = T & { content: React.ComponentType; body: string }`
  - 保留既有: SUPPORTED_LOCALES, Locale (L17-18)
  - 移除: 任何重複 Zod 推斷的手動型別定義
  - 相依性: T001-T003 (schema 定義)

---

## Phase 3.2: 測試優先 (TDD) ⚠️ 必須在 3.3 之前完成

**關鍵**: 這些測試必須撰寫且必須失敗，才能進行任何實作

### 單元測試 (Schema 驗證)

- [x] **T005** [P] 建立 `src/types/__tests__/article-schema.test.ts`
  - 檔案: `src/types/__tests__/article-schema.test.ts` (新檔案)
  - 測試結果: ✅ 所有 34 個測試通過 (schema 已在 Phase 3.1 實作)
  - 測試 BaseArticle 驗證:
    - 有效: 靜態圖片且路徑格式正確
    - 有效: 產生的 OG 圖片 (icon + background)
    - 有效: 日期為 YYYY-MM-DD 字串
    - 有效: 日期為 Date 物件 (應轉換為字串)
    - 有效: 空標籤陣列 (預設值)
    - 無效: 圖片路徑缺少 locale
    - 無效: 圖片路徑副檔名錯誤
    - 無效: 日期格式錯誤 (MM/DD/YYYY)
    - 無效: 標籤不是陣列
  - 測試 ProjectArticle 驗證:
    - 有效: 同時有 githubUrl 和 demoUrl
    - 有效: 只有 githubUrl
    - 有效: 兩個連結都沒有 (都是選填)
    - 有效: order 在 1-99 之間
    - 無效: githubUrl 不是 URL
    - 無效: order = 0 或 100
  - 測試 NoteArticle 驗證:
    - 有效: Note 有圖片和標籤
    - Schema 不應接受 githubUrl/demoUrl (驗證型別錯誤)
  - 相依性: T004 (型別定義)
  - 預期: 所有測試失敗 (尚未實作)

- [x] **T006** [P] 建立 `src/lib/__tests__/tag-utils.test.ts`
  - 檔案: `src/lib/__tests__/tag-utils.test.ts` (新檔案)
  - 測試結果: ✅ 測試失敗 (符合 TDD 預期，src/lib/tag-utils.ts 尚未實作)
  - 測試 normalizeTag 函式:
    - "Next.js" → "next.js"
    - "Type Script" → "type-script"
    - " react " → "react" (修剪空白)
  - 測試 isSuggestedTag 函式:
    - "next.js" → true
    - "my-custom-tag" → false
  - 測試 filterValidTags 函式:
    - ["next.js", "", " ", "typescript"] → ["next.js", "typescript"]
  - 相依性: 無 (工具函式尚未實作)

### 元件測試 (Article 與內部 ArticleInfo)

- [x] **T007** [P] 更新 `src/components/article/__tests__/index.test.tsx` 加入 ArticleInfo 測試
  - 檔案: `src/components/article/__tests__/index.test.tsx` (既有檔案)
  - 測試結果: ✅ 測試失敗 (符合 TDD 預期，ArticleInfo 元件尚未實作)
  - 注意: ArticleInfo 是 Article 的內部元件，不單獨匯出，測試透過 Article 元件進行
  - 測試 ArticleInfo 渲染 (透過 Article 元件):
    - 以 locale 格式化日期顯示 (zh-TW, en, ja)
    - 使用 Badge 元件渲染標籤
    - 提供 githubUrl 時渲染 GitHub 連結 (僅 Projects)
    - 提供 demoUrl 時渲染 Demo 連結 (僅 Projects)
    - contentType="notes" 時不渲染連結
    - 渲染 LanguageToggle 元件
    - 空標籤陣列 → 不顯示標籤區塊
  - 測試響應式版面:
    - 桌面版 (≥1024px): 右側邊欄版面 (lg:grid lg:grid-cols-[1fr_300px])
    - 行動版 (<1024px): 內容下方版面 (flex flex-col)
  - 測試無障礙性:
    - ArticleInfo 中的日期使用 `<time>` 元素及 dateTime 屬性
    - 連結有適當的 aria-labels
    - 存在 data-testid 屬性供 E2E 使用
  - 相依性: T004 (ArticleInfoProps 型別)

- [x] **T008** [P] 更新 `src/components/article/__tests__/index.test.tsx` 加入整合測試
  - 檔案: `src/components/article/__tests__/index.test.tsx` (既有檔案)
  - 測試結果: ✅ 與 T007 同時完成
  - 測試 Article 元件整合 (在既有測試基礎上擴充):
    - 從 article.content 渲染 MDX 內容
    - 以正確 props 渲染 ArticleImage
    - 渲染包含 title 和 description 的標頭
    - 傳遞正確 props 至 ArticleInfo (內部元件)
    - Projects vs Notes 的條件 props:
      - Projects: 定義時傳遞 githubUrl、demoUrl
      - Notes: 不傳遞連結 (型別安全檢查)
    - 返回連結在 URL 中使用正確的 contentType
  - 測試泛型型別參數:
    - `ArticleProps<ProjectArticle>` 接受專案資料
    - `ArticleProps<NoteArticle>` 接受筆記資料
    - 傳遞錯誤資料型別時產生型別錯誤
  - 相依性: T004 (ArticleProps 型別)

### E2E 測試 (標籤過濾與導航)

- [x] **T009** [P] 建立 `tests/e2e/article-tag-filtering.spec.ts`
  - 檔案: `tests/e2e/article-tag-filtering.spec.ts` (新檔案)
  - 測試案例 1: 單一標籤過濾 (來自 quickstart.md)
    - 設定: 建立 3 篇有重疊標籤的測試文章
    - 動作: 導航至搜尋 UI，選擇 "next.js" 標籤
    - 斷言: 僅看到文章 1 和 2 (有 "next.js" 標籤)
  - 測試案例 2: 多標籤過濾
    - 動作: 同時選擇 "next.js" 和 "typescript" 標籤
    - 斷言: 僅看到文章 1 (兩個標籤都有)
  - 測試案例 3: 自訂標籤
    - 設定: 建立有自訂標籤 "my-custom-tag" 的文章
    - 動作: 以 "my-custom-tag" 過濾
    - 斷言: 文章出現在結果中
  - 驗證 Orama 索引:
    - 建置後檢查搜尋索引結構
    - 驗證 tag 欄位 (主要標籤) 存在
    - 驗證 tags 欄位 (逗號分隔) 存在
  - 相依性: T001-T003 (有標籤的 schema)、既有搜尋 UI
  - 預期: 測試失敗 (Orama 索引尚未設定)

- [x] **T010** [P] 建立 `tests/e2e/article-language-toggle.spec.ts`
  - 檔案: `tests/e2e/article-language-toggle.spec.ts` (新檔案)
  - 測試 Article Info 中的語言切換:
    - 設定: 建立有全部 3 種語言版本的文章 (zh-TW, en, ja)
    - 動作: 點擊文章頁面的語言切換
    - 斷言: 重新導向至所選語言的相同文章
    - 斷言: URL 從 /{lang}/projects/{slug} 變更為 /{newLang}/projects/{slug}
  - 測試缺少翻譯:
    - 設定: 建立只有 zh-TW 版本的文章
    - 斷言: 語言切換只顯示 zh-TW 選項
    - 斷言: en/ja 選項被停用或隱藏
  - 測試跨內容類型:
    - 驗證 /projects 和 /notes 頁面都能運作
  - 相依性: T004 (型別)、既有 LanguageToggle 元件
  - 預期: 測試失敗 (ArticleInfo 尚未整合)

- [x] **T011** [P] 建立 `tests/e2e/article-project-links.spec.ts`
  - 檔案: `tests/e2e/article-project-links.spec.ts` (新檔案)
  - 測試 GitHub 連結顯示:
    - 設定: 建立有 githubUrl 的專案
    - 斷言: GitHub 連結在 Article Info 側邊欄中可見
    - 斷言: 連結有正確的 href 且在新分頁開啟
    - 斷言: 使用 Fumadocs GitHub 元件或自訂圖示
  - 測試 Demo 連結顯示:
    - 設定: 建立有 demoUrl 的專案
    - 斷言: Demo 連結以 Button 元件顯示
    - 斷言: 連結在新分頁開啟
  - 測試 Notes 頁面:
    - 設定: 建立筆記 (不應有連結)
    - 斷言: Article Info 中無專案連結區塊
  - 測試響應式版面:
    - 桌面版: 連結在右側邊欄 (寬度 300px)
    - 行動版: 連結在內容下方
  - 相依性: T004 (型別)、T002 (projectArticleSchema)
  - 預期: 測試失敗 (ArticleInfo 尚未實作)

---

## Phase 3.3: 核心實作 (僅在測試失敗後)

### Schema 與型別實作

- [ ] **T012** 在 source.config.ts 實作統一 schema
  - 檔案: `source.config.ts`
  - 實作 T001-T003 的 schema 變更
  - 以 `npm run build` 驗證建置成功
  - 檢查建置輸出中的 schema 驗證錯誤
  - 以一個範例專案和筆記 frontmatter 測試
  - 相依性: T005 (測試必須先失敗)
  - 成功標準: T005 測試的有效案例通過

- [ ] **T013** 在 src/lib/tag-utils.ts 建立標籤工具函式
  - 檔案: `src/lib/tag-utils.ts` (新檔案)
  - 實作 normalizeTag(tag: string): string
    - 轉換為小寫
    - 將空格替換為連字號
    - 修剪空白
  - 實作 isSuggestedTag(tag: string): tag is SuggestedTag
    - 對照 contracts/tag-system.ts 的 SUGGESTED_TAGS 檢查
  - 實作 filterValidTags(tags: string[]): string[]
    - 移除空字串
    - 移除僅空白的字串
    - 對每個套用 normalizeTag
  - 匯出 SUGGESTED_TAGS 常數
  - 相依性: T006 (測試必須先失敗)
  - 成功標準: T006 測試通過

### 元件實作

- [ ] **T014** 以 ArticleInfo 區塊強化 Article 元件
  - 檔案: `src/components/article/index.tsx`
  - 定義 ArticleInfo 為內部函式元件:
    - Props: 來自 contracts/article-props.ts 的 ArticleInfoProps
    - 日期顯示: `<time dateTime={date}>{格式化日期}</time>`
    - 標籤: 將標籤對應至 Badge 元件 (來自 shadcn/ui)
    - 專案連結區塊 (條件於 contentType="projects"):
      - GitHub 連結: 若可用使用 Fumadocs GitHub 元件，否則用 lucide-react Github 圖示的自訂 Link
      - Demo 連結: shadcn/ui Button 加 lucide-react ExternalLink 圖示
    - 語言切換: 匯入並渲染 LanguageToggle 元件
  - 更新 Article 元件版面:
    - 行動版 (<1024px): `flex flex-col` (ArticleInfo 在內容後)
    - 桌面版 (≥1024px): `lg:grid lg:grid-cols-[1fr_300px] lg:gap-8`
    - ArticleInfo 在 `<aside>` 中，桌面版固定寬度 300px
  - 更新 ArticleProps 介面:
    - 新增 contentType: "projects" | "notes"
    - 新增選填 backLinkText?: string
  - 型別安全的 props 傳遞至 ArticleInfo:
    - 使用 `'githubUrl' in article && article.githubUrl` 檢查
    - TypeScript 應正確收窄型別
  - 為 E2E 測試新增 data-testid 屬性:
    - data-testid="article-info"
    - data-testid="article-tags"
    - data-testid="project-links"
    - data-testid="language-toggle"
  - 相依性: T007, T008 (測試必須先失敗)、T013 (標籤工具)
  - 成功標準: T007, T008 測試通過

### 搜尋整合

- [ ] **T015** 設定 Orama buildIndex 加入標籤萃取
  - 檔案: 位置不定 (檢查 fumadocs Orama 設定，可能在 app/api/search 或 lib/search)
  - 找到既有的 Orama createFromSource 設定
  - 擴充 buildIndex 函式:

    ```typescript
    buildIndex(page) {
      return {
        id: page.url,
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        structuredData: page.data.structuredData,
        tag: page.data.tags?.[0] || 'uncategorized', // 主要標籤
        tags: page.data.tags?.join(',') || '',        // 所有標籤逗號分隔
      };
    }
    ```

  - 驗證 tags 欄位已正確索引
  - 必要時更新搜尋 schema 以包含 tag/tags 欄位
  - 相依性: T009 (測試必須先失敗)、T012 (有標籤的 schema)
  - 成功標準: T009 測試通過 (標籤過濾運作)

- [ ] **T016** 驗證搜尋 UI 支援標籤過濾
  - 檔案: 檢查既有搜尋元件 (可能在 src/components/ 或 app/)
  - 找到 useDocsSearch hook 的使用處
  - 驗證可傳遞 tag 參數: `useDocsSearch({ tag: selectedTag })`
  - 若不支援，新增標籤過濾 UI:
    - 標籤下拉選單或按鈕群組
    - 優先顯示建議的標籤
    - 允許選擇以過濾結果
  - 測試與 T015 的 Orama 索引整合
  - 相依性: T015 (有標籤的 Orama 設定)
  - 成功標準: 可以標籤過濾搜尋結果

---

## Phase 3.4: 整合與內容遷移

- [x] **T017** 將圖片路徑從 /hero/ 遷移至簡化結構
  - 檔案: `public/images/projects/`、`public/images/notes/`
  - 目前結構: `public/images/projects/hero/{locale}/*.jpg`
  - 目標結構: `public/images/projects/{locale}/*.jpg`
  - 執行結果:
    - 移動 hero/zh-TW/ 下的 3 個圖片檔案至 zh-TW/
    - 刪除空的 hero 目錄
    - notes 目錄下無圖片，無需遷移
  - 驗證: ✅ 不再有 /hero/ 目錄
  - 成功標準: ✅ 圖片在新路徑可存取

- [x] **T018** [P] 以新 frontmatter 更新既有專案 MDX 檔案
  - 檔案: `content/projects/zh-TW/*.mdx` (3 個檔案)
  - 更新內容:
    - ✅ 更新圖片路徑移除 /hero/
    - ✅ 新增 tags 陣列
    - ✅ 新增 githubUrl (andrewck24-portfolio.mdx)
    - ✅ 確認 date 為 YYYY-MM-DD 格式
    - ✅ 保留既有 featured/order 欄位
  - 成功標準: ✅ dev server 正常啟動，無 schema 驗證錯誤

- [x] **T019** [P] 以新 frontmatter 更新既有筆記 MDX 檔案
  - 檔案: `content/notes/{zh-TW,en,ja}/index.mdx` (3 個檔案)
  - 更新內容:
    - ✅ 新增必填的 date 欄位 (2024-10-01)
    - ✅ 新增 tags 空陣列
    - ✅ 確認無 githubUrl/demoUrl 欄位
  - 成功標準: ✅ dev server 正常啟動，無 schema 驗證錯誤

- [ ] **T020** 更新專案頁面元件使用強化的 Article
  - 檔案: `src/app/[lang]/projects/[slug]/page.tsx` 或類似檔案
  - 更新 Article 元件用法:
    - 傳遞 contentType="projects"
    - 以 ProjectArticle 型別傳遞文章資料
    - 提供 backLinkText (i18n 為 "返回專案列表")
  - 驗證型別安全: TypeScript 應接受 ProjectArticle 資料
  - 測試渲染: 檢查 Article Info 顯示專案連結
  - 相依性: T014 (Article 元件已強化)、T018 (專案已更新)
  - 成功標準: 專案頁面以 Article Info 側邊欄渲染

- [ ] **T021** 更新筆記頁面元件使用強化的 Article
  - 檔案: `src/app/[lang]/notes/[slug]/page.tsx` 或類似檔案
  - 更新 Article 元件用法:
    - 傳遞 contentType="notes"
    - 以 NoteArticle 型別傳遞文章資料
    - 提供 backLinkText (i18n 為 "返回筆記列表")
  - 驗證型別安全: TypeScript 應接受 NoteArticle 資料
  - 驗證無專案連結: ArticleInfo 不應為筆記渲染連結
  - 相依性: T014 (Article 元件已強化)、T019 (筆記已更新)
  - 成功標準: 筆記頁面以 Article Info 渲染 (無專案連結)

---

## Phase 3.5: 潤飾與驗證

- [ ] **T022** [P] 執行 E2E 測試套件並修正失敗
  - 指令: `npm run test:e2e` 或 `npx playwright test`
  - 執行 Phase 3.2 的所有 E2E 測試:
    - tests/e2e/article-tag-filtering.spec.ts
    - tests/e2e/article-language-toggle.spec.ts
    - tests/e2e/article-project-links.spec.ts
  - 修正任何失敗或不穩定的測試
  - 驗證 quickstart.md 的所有場景運作
  - 相依性: T009-T011 (E2E 測試)、T014-T021 (實作)
  - 成功標準: 所有 E2E 測試穩定通過

- [ ] **T023** [P] 執行元件測試套件
  - 指令: `npm test` 或 `npm run test:unit`
  - 執行所有元件測試:
    - src/components/article/**tests**/article-info.test.tsx
    - src/components/article/**tests**/article.test.tsx
  - 驗證 Article 元件和 ArticleInfo 的覆蓋率
  - 新增實作期間發現的任何遺漏測試案例
  - 相依性: T007-T008 (元件測試)、T014 (實作)
  - 成功標準: 所有元件測試通過，覆蓋率 ≥80%

- [ ] **T024** [P] 執行單元測試套件
  - 指令: `npm test` 或 `npm run test:unit`
  - 執行所有單元測試:
    - tests/unit/schemas/article-schema.test.ts
    - src/lib/**tests**/tag-utils.test.ts
  - 驗證所有 schema 驗證場景通過
  - 驗證標籤工具函式正確運作
  - 相依性: T005-T006 (單元測試)、T012-T013 (實作)
  - 成功標準: 所有單元測試通過

- [ ] **T025** 驗證建置與型別檢查
  - 指令:
    - `npm run build` - 完整正式環境建置
    - `npm run type-check` - TypeScript 型別檢查
  - 驗證:
    - 無 TypeScript 錯誤
    - 建置輸出無 schema 驗證錯誤
    - 所有 MDX 檔案成功編譯
    - Orama 搜尋索引正確產生
    - 為所有文章產生靜態頁面 (專案 + 筆記)
  - 檢查建置輸出大小 (不應顯著增加)
  - 相依性: T012-T021 (所有實作)
  - 成功標準: 乾淨建置，無錯誤或警告

- [ ] **T026** 執行 quickstart.md 手動驗證
  - 檔案: `specs/004-mdx-frontmatter-1/quickstart.md`
  - 依照 quickstart 指南的所有章節:
    1. 建立新專案 (第 1 節)
    2. 建立新筆記 (第 2 節)
    3. 新增與測試標籤 (第 3 節)
    4. 處理圖片 (第 4 節)
    5. 測試標籤過濾 (第 5 節)
  - 驗證所有範例如文件所述運作
  - 檢查疑難排解章節的常見錯誤
  - 若有步驟不正確則更新 quickstart.md
  - 相依性: T012-T025 (所有實作與測試)
  - 成功標準: 所有 quickstart 場景正確運作

---

## 相依性

```plaintext
設定階段 (T001-T004):
  T001 → T002, T003 (相同檔案，循序)
  T001-T003 → T004 (型別定義需要 schemas)

測試階段 (T005-T011):
  T004 → T005-T011 (所有測試需要型別定義)
  獨立: T005, T006, T007, T008, T009, T010, T011 [全部平行]

實作階段 (T012-T016):
  T005 → T012 (schema 測試必須先失敗)
  T006 → T013 (標籤工具測試必須先失敗)
  T007, T008 → T014 (元件測試必須先失敗)
  T009 → T015 (E2E 測試必須先失敗)
  T012 → T015 (標籤必須存在於 schema 中)
  T013 → T014 (Article 需要標籤工具)
  T015 → T016 (搜尋 UI 需要 Orama 設定)

整合階段 (T017-T021):
  T012 → T017 (schema 必須支援新路徑)
  T017 → T018, T019 (圖片必須存在於新路徑)
  T012, T017 → T018, T019 (內容更新需要 schema + 圖片)
  T014, T018 → T020 (專案頁面需要 Article + 專案內容)
  T014, T019 → T021 (筆記頁面需要 Article + 筆記內容)

潤飾階段 (T022-T026):
  T009-T011 + T014-T021 → T022 (E2E 需要完整實作)
  T007-T008 + T014 → T023 (元件測試需要實作)
  T005-T006 + T012-T013 → T024 (單元測試需要實作)
  T012-T021 → T025 (建置需要所有程式碼)
  T012-T025 → T026 (quickstart 驗證需要一切)
```

## 平行執行範例

### 範例 1: 型別契約 (獨立檔案)

```bash
# 3 個型別契約檔案可平行建立
# 它們彼此不相依
Task: "建立 contracts/schema.ts (Zod schemas)"
Task: "建立 contracts/article-props.ts (元件介面)"
Task: "建立 contracts/tag-system.ts (搜尋型別)"
```

### 範例 2: 單元測試 (獨立測試檔案)

```bash
# T004 (型別就緒) 後，所有單元測試可平行撰寫
Task: "建立 tests/unit/schemas/article-schema.test.ts"
Task: "建立 src/lib/__tests__/tag-utils.test.ts"
```

### 範例 3: 元件測試 (獨立測試檔案)

```bash
# 元件測試檔案獨立，可平行執行
Task: "建立 src/components/article/__tests__/article-info.test.tsx"
Task: "建立 src/components/article/__tests__/article.test.tsx"
```

### 範例 4: E2E 測試 (獨立場景)

```bash
# E2E 測試場景獨立，可平行執行
Task: "建立 tests/e2e/article-tag-filtering.spec.ts"
Task: "建立 tests/e2e/article-language-toggle.spec.ts"
Task: "建立 tests/e2e/article-project-links.spec.ts"
```

### 範例 5: 內容遷移 (不同內容類型)

```bash
# 專案和筆記更新獨立
Task: "以新 frontmatter 更新既有專案 MDX 檔案"
Task: "以新 frontmatter 更新既有筆記 MDX 檔案"
```

### 範例 6: 最終驗證 (獨立測試套件)

```bash
# 實作後，驗證任務可平行執行
Task: "執行 E2E 測試套件並修正失敗"
Task: "執行元件測試套件"
Task: "執行單元測試套件"
```

---

## 備註

- **[P] = 平行**: 標記 [P] 的任務可同時執行，因為它們修改不同檔案
- **循序**: 沒有 [P] 的任務修改相同檔案或有相依性
- **TDD 關鍵**: Phase 3.2 (測試) 必須在 Phase 3.3 (實作) 之前完成
- **驗證測試失敗**: 實作每個功能前，確認測試失敗 (紅 → 綠 → 重構)
- **提交策略**: 每個任務後或每個階段完成後提交
- **型別安全**: 使用 TypeScript strict mode、所有型別定義使用 `z.infer`、不手動重複

---

## 驗證檢查清單

(關卡: 將 tasks.md 標記為完成前驗證完整性)

- [x] data-model.md 的所有實體都有任務
  - [x] BaseArticle → T001, T005, T012
  - [x] ProjectArticle → T002, T005, T012
  - [x] NoteArticle → T003, T005, T012
  - [x] Tag System → T006, T013, T015
  - [x] ArticlePageData → T004 (型別定義)

- [x] 所有 contracts 都有任務
  - [x] contracts/schema.ts → T004 (在型別中參照)
  - [x] contracts/article-props.ts → T004, T014 (元件 props)
  - [x] contracts/tag-system.ts → T013, T015 (標籤工具、Orama)

- [x] 所有 quickstart 場景都有測試
  - [x] 第 5 節: 標籤過濾 → T009 (E2E 測試)
  - [x] 語言切換 → T010 (E2E 測試)
  - [x] 專案連結 → T011 (E2E 測試)
  - [x] Quickstart 驗證 → T026 (手動測試)

- [x] 測試金字塔已實作
  - [x] 單元測試: T005 (schema)、T006 (標籤工具)、T024 (執行套件)
  - [x] 元件測試: T007 (ArticleInfo)、T008 (Article)、T023 (執行套件)
  - [x] E2E 測試: T009-T011 (標籤過濾、語言、連結)、T022 (執行套件)

- [x] TDD 工作流程已強制執行
  - [x] Phase 3.2 (測試) 在 Phase 3.3 (實作) 之前
  - [x] 每個實作任務參照對應的測試任務
  - [x] 測試預期在實作前失敗

- [x] 平行任務真正獨立
  - [x] T005-T011: 全部不同測試檔案 ✅
  - [x] T018, T019: 不同內容目錄 ✅
  - [x] T022, T023, T024: 不同測試套件 ✅

- [x] 所有任務都指定確切檔案路徑
  - [x] 每個任務都包含檔案路徑或目錄
  - [x] 路徑為從專案根目錄的絕對路徑

- [x] [P] 任務中無相同檔案衝突
  - [x] T001-T003 不平行 (相同檔案: source.config.ts)
  - [x] 所有 [P] 任務修改不同檔案 ✅

✅ **驗證完成**: 所有標準符合，tasks.md 已就緒可執行
