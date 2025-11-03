# Quickstart Guide: Unified Article Schema & Enhanced Layout

**Feature**: MDX Frontmatter Schema Unification & Article Layout Enhancement
**Date**: 2025-10-26

本指南展示如何使用新的統一 schema 建立和管理 Projects 和 Notes 內容。

---

## Table of Contents

1. [Creating a New Project](#1-creating-a-new-project)
2. [Creating a New Note](#2-creating-a-new-note)
3. [Adding Tags](#3-adding-tags)
4. [Working with Images](#4-working-with-images)
5. [Testing Tag Filtering](#5-testing-tag-filtering)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Creating a New Project

### Step 1: Create MDX File

```bash
# Create project file (replace {locale} with zh-TW, en, or ja)
touch content/projects/{locale}/my-new-project.mdx
```

### Step 2: Add Frontmatter

**Minimum Required Fields:**

```yaml
---
title: "My New Project"
description: "A brief description of the project"
imageType: static
image: /images/projects/zh-TW/my-new-project.jpg
date: 2025-01-15
---
```

**Full Example with All Optional Fields:**

```yaml
---
title: "Full-Stack E-Commerce Platform"
description: "A modern e-commerce platform built with Next.js and TypeScript"
imageType: static
image: /images/projects/zh-TW/ecommerce-platform.jpg
date: 2025-01-15
tags: ["next.js", "typescript", "e-commerce", "tailwind"]
githubUrl: https://github.com/username/ecommerce-platform
demoUrl: https://ecommerce-demo.vercel.app
featured: true
order: 1
---
# My Project Content

Start writing your project documentation here...
```

### Step 3: Add Image

```bash
# Place image in correct directory
cp /path/to/image.jpg public/images/projects/zh-TW/my-new-project.jpg
```

**Image Path Rules:**

- Pattern: `/images/projects/{locale}/{slug}.{ext}`
- Supported formats: jpg, jpeg, png, webp, avif
- locale must be: `zh-TW`, `en`, or `ja`
- slug should match MDX filename

### Step 4: Build and Verify

```bash
# Build the site
npm run build

# Check for schema validation errors in build output
# If successful, the page will be generated at:
# http://localhost:3000/{locale}/projects/my-new-project
```

---

## 2. Creating a New Note

### Step 1: Create MDX File

```bash
# Create note file
touch content/notes/{locale}/my-learning-note.mdx
```

### Step 2: Add Frontmatter

**Note Example:**

```yaml
---
title: "深入理解 TypeScript Generics"
description: "詳細解說 TypeScript 泛型的概念與實際應用"
imageType: static
image: /images/notes/zh-TW/typescript-generics.png
date: 2025-02-20
tags: ["typescript", "programming", "tutorial"]
---
# Introduction

Notes content starts here...
```

**Key Differences from Projects:**

- ❌ NO `githubUrl` or `demoUrl` fields
- ❌ NO `featured` or `order` fields
- ✅ Image path uses `/images/notes/` instead of `/images/projects/`
- ✅ All other fields are identical to projects

---

## 3. Adding Tags

### Using Suggested Tags

Recommended tags for consistency:

```yaml
tags: [
    # Frontend
    "next.js",
    "react",
    "vue",
    "svelte",
    "typescript",
    "javascript",
    "tailwind",
    "css",

    # Backend
    "node.js",
    "api",
    "graphql",
    "rest",
    "database",
    "postgresql",
    "mongodb",

    # DevOps
    "docker",

    "ci-cd",
    "git",
    # Content Types
    "tutorial",

    "guide",
    "reference",
    "case-study",
    # Topics
    "architecture",
    "performance",
    "security",
    "accessibility",
  ]
```

### Creating Custom Tags

You can also create custom tags:

```yaml
---
title: "Custom Project"
tags: [
    "next.js", # Suggested tag
    "my-custom-topic", # Custom tag (also valid!)
    "experimental-feature",
  ]
---
```

**Tag Conventions:**

- Use lowercase
- Use kebab-case for multi-word tags
- Keep tags concise and descriptive
- Prefer existing suggested tags when applicable

### Tag Examples by Content Type

**Tutorial:**

```yaml
tags: ["tutorial", "typescript", "beginner"]
```

**Case Study:**

```yaml
tags: ["case-study", "next.js", "performance", "seo"]
```

**Reference:**

```yaml
tags: ["reference", "api", "documentation"]
```

---

## 4. Working with Images

### Option A: Static Image (Recommended)

```yaml
---
imageType: static
image: /images/projects/zh-TW/my-project.jpg
---
```

**Steps:**

1. Place image in `public/images/{projects|notes}/{locale}/`
2. Reference in frontmatter with absolute path
3. Image dimensions: Recommended 1200x630px for optimal OG image

### Option B: Generated OG Image

```yaml
---
imageType: generated
ogImage:
  icon: /images/icons/project-icon.svg
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  className: "custom-og-class"
---
```

**Background Options:**

- CSS Gradient: `"linear-gradient(...)"`
- Solid Color: `"#667eea"`
- Image Path: `"/images/backgrounds/pattern.jpg"`

### Image Path Migration

If you have existing images in `/hero/` subdirectory:

```bash
# Old path (before this feature)
public/images/projects/hero/zh-TW/project.jpg

# New path (after this feature)
public/images/projects/zh-TW/project.jpg

# Migration command
cd public/images/projects
mv hero/zh-TW/* zh-TW/
mv hero/en/* en/
mv hero/ja/* ja/
rmdir hero/zh-TW hero/en hero/ja hero
```

---

## 5. Testing Tag Filtering

### Test Case 1: Single Tag Filter

1. Create multiple articles with overlapping tags:

```yaml
# Article 1
tags: ["next.js", "typescript"]

# Article 2
tags: ["next.js", "react"]

# Article 3
tags: ["typescript", "tutorial"]
```

2. Navigate to search/filter UI
3. Select "next.js" tag
4. **Expected**: Should see Articles 1 and 2 only

### Test Case 2: Multi-Tag Filter

1. Select both "next.js" AND "typescript" tags
2. **Expected**: Should see Article 1 only

### Test Case 3: Custom Tag

1. Create article with custom tag:

```yaml
tags: ["my-custom-tag", "typescript"]
```

2. Filter by "my-custom-tag"
3. **Expected**: Article should appear in results

### Verify Orama Index

```bash
# After build, check search index
npm run build

# Inspect generated search index (location varies)
# Next.js: .next/server/app/static.json.body
cat .next/server/app/static.json.body | jq '.[] | {title, tag, tags}'
```

**Expected Output:**

```json
{
  "title": "My Project",
  "tag": "next.js",
  "tags": "next.js,typescript,tailwind"
}
```

---

## 6. Troubleshooting

### Problem: Build fails with schema validation error

**Error Message:**

```
Error: Invalid frontmatter in content/projects/zh-TW/my-project.mdx
Expected string matching pattern /^\/images\/(projects|notes)\/...$/
```

**Solution:**

1. Check image path format matches pattern
2. Ensure locale is one of: `zh-TW`, `en`, `ja`
3. Verify image file exists at specified path

### Problem: Tags not appearing in search results

**Checklist:**

- ✅ Tags are defined as array in frontmatter: `tags: ["tag1", "tag2"]`
- ✅ Build completed successfully (`npm run build`)
- ✅ Orama index generation includes tag extraction
- ✅ Search configuration imports and uses tag filter

**Debug Steps:**

```bash
# 1. Verify frontmatter parsing
npm run build 2>&1 | grep -i "tag"

# 2. Check Orama index contains tags
cat .next/server/app/static.json.body | jq '.[0]'

# 3. Verify search client configuration
grep -r "useDocsSearch" src/
```

### Problem: GitHub/Demo links not showing on project page

**Checklist:**

- ✅ URLs are valid (must start with `http://` or `https://`)
- ✅ Field names are exact: `githubUrl`, `demoUrl` (camelCase)
- ✅ Content type is "projects" (not "notes")
- ✅ At least one URL is provided

**Example:**

```yaml
# ✅ Correct
githubUrl: https://github.com/user/repo
demoUrl: https://example.com

# ❌ Wrong (invalid URL)
githubUrl: github.com/user/repo

# ❌ Wrong (typo in field name)
github_url: https://github.com/user/repo
```

### Problem: Date format error

**Error Message:**

```
Error: Invalid date format. Expected YYYY-MM-DD
```

**Solution:**

```yaml
# ✅ Correct formats
date: 2025-01-15
date: 2025-01-15T00:00:00Z  # ISO 8601 also accepted

# ❌ Wrong formats
date: 01/15/2025
date: 2025-1-15  # Must be zero-padded
date: January 15, 2025
```

### Problem: Image not displaying

**Checklist:**

- ✅ Image file exists in `public/` directory
- ✅ Path is absolute (starts with `/`)
- ✅ Path matches regex pattern exactly
- ✅ File extension is supported (jpg, jpeg, png, webp, avif)
- ✅ Correct collection directory (projects vs notes)

**Verify Image:**

```bash
# Check file exists
ls -lh public/images/projects/zh-TW/my-project.jpg

# Test image loads in browser
# Navigate to: http://localhost:3000/images/projects/zh-TW/my-project.jpg
```

---

## Quick Reference

### Project Frontmatter Template

```yaml
---
title: "Project Title"
description: "Brief project description"
imageType: static
image: /images/projects/{locale}/{slug}.jpg
date: YYYY-MM-DD
tags: ["tag1", "tag2", "tag3"]
githubUrl: https://github.com/user/repo # Optional
demoUrl: https://example.com # Optional
featured: true # Optional
order: 1 # Optional (1-99)
---
```

### Note Frontmatter Template

```yaml
---
title: "Note Title"
description: "Brief note description"
imageType: static
image: /images/notes/{locale}/{slug}.jpg
date: YYYY-MM-DD
tags: ["tag1", "tag2", "tag3"]
---
```

### Common Commands

```bash
# Create new project (zh-TW)
touch content/projects/zh-TW/my-project.mdx

# Create new note (en)
touch content/notes/en/my-note.mdx

# Build and check for errors
npm run build

# Run dev server
npm run dev

# Type check
npm run type-check

# Run tests
npm test
```

---

## Next Steps

After creating your content:

1. **Add Translations**: Create equivalent files in other locales
2. **Test Responsively**: Check Article Info layout on mobile and desktop
3. **Verify Search**: Ensure tags appear in search filters
4. **Check Accessibility**: Test keyboard navigation and screen readers
5. **Performance**: Optimize images using next/image recommendations

For implementation details, see:

- [data-model.md](./data-model.md) - Schema definitions
- [contracts/](./contracts/) - TypeScript type contracts
- [research.md](./research.md) - Technical decisions
