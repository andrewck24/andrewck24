# Projects Images

此目錄用於存放專案的首圖 (hero images)。

## 所需圖片

根據 MDX frontmatter 設定，需要以下圖片：

1. `andrewck24-portfolio-hero.jpg` (1200x675 推薦)
2. `example-project-2-hero.jpg` (1200x675 推薦)
3. `example-project-3-hero.jpg` (1200x675 推薦)

## 圖片規格

- **格式**: jpg, jpeg, png, webp, 或 avif
- **建議尺寸**: 1200x675 (16:9 比例)
- **檔案大小**: < 500KB (建議使用 WebP 或 AVIF 格式以獲得更好的壓縮率)
- **命名規則**: `[project-slug]-hero.[ext]`

## 取得 Placeholder 圖片

在開發階段，可以使用以下服務取得 placeholder 圖片：

```bash
# 使用 https://picsum.photos/ (Lorem Picsum)
curl -o andrewck24-portfolio-hero.jpg "https://picsum.photos/1200/675"
curl -o example-project-2-hero.jpg "https://picsum.photos/1200/675"
curl -o example-project-3-hero.jpg "https://picsum.photos/1200/675"
```

或使用 https://placehold.co/:

```bash
curl -o andrewck24-portfolio-hero.jpg "https://placehold.co/1200x675/png"
curl -o example-project-2-hero.jpg "https://placehold.co/1200x675/png"
curl -o example-project-3-hero.jpg "https://placehold.co/1200x675/png"
```

## 圖片優化

上傳圖片前，建議使用以下工具優化：

- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim**: https://imageoptim.com/ (macOS)

Next.js Image 元件會自動處理不同裝置的尺寸優化與格式轉換。
