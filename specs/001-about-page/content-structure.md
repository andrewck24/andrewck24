# Content Structure: About Page MDX

**Feature Branch**: `001-about-page` | **Date**: 2025-10-01 | **Phase**: 1 (Design)

## Overview

This document defines the MDX content structure for the About Me page. Content is stored in locale-specific MDX files using Fumadocs conventions.

## File Locations

```plaintext
content/about/
├── zh-TW/
│   └── index.mdx    # 繁體中文內容
├── en/
│   └── index.mdx    # English content
└── ja/
    └── index.mdx    # 日本語コンテンツ
```

## Frontmatter Schema

**Required Fields**:

- `title`: Page title (string)
- `description`: Meta description for SEO (string)

**Optional Fields**:

- `full`: Boolean to enable full-width layout (default: false)

**Example**:

```yaml
---
title: About Me
description: Professional background, education, certifications, and technical skills
---
```

## Content Sections

### 1. Introduction

**Purpose**: Professional summary and current focus

**Structure**:

```markdown
## Introduction

[1 paragraphs describing professional background, expertise, and current focus]

**Key strengths:**

- Background in accounting and economics with business logic expertise
- Full-stack development with modern technologies
- Product thinking and user-intuitive design
```

**Example (zh-TW)**:

```markdown
## 簡介

具備會計與經濟學背景，擅長快速理解業務邏輯並進行流程分析。在動態環境中表現出色，享受解決複雜問題的過程。致力於運用現代技術和產品思維，打造使用者直覺且高效能的網站。正在尋找創新團隊的工作機會！
```

### 2. Skills & Technologies

**Purpose**: Display technical skills organized by category

**Structure**:

```markdown
## Skills & Technologies

### Languages

- JavaScript / TypeScript
- Python
- HTML / CSS

### Frontend

- React (Hooks)
- Next.js (App Router)
- Redux / Redux Toolkit
- Tailwind CSS
- styled-components
- Framer Motion
- Web APIs (IntersectionObserver, ViewTransition, etc.)
- Storybook

### Backend & Cloud

- Node.js
- MongoDB / Mongoose
- Google Cloud Platform
- Vercel
- PWA / Serwist

### Tools & Others

- Git / GitHub
- Fumadocs
- MDX
- ESLint / Prettier
```

**MDX Component**: Use standard unordered lists (`<ul>`)

**Optional Enhancement**: Custom `<Badge>` components for skill tags

### 3. Education

**Purpose**: Display educational background with details

**Structure**:

```markdown
## Education

### National Taiwan University (2017-2023)

**Bachelor of Arts** in Japanese Language and Literature
**Minor** in Economics

**Relevant Coursework:**

- Web Application Programming (A+)
- Programming for Business Computing (A+)
- Data Analysis and Machine Learning with Python (A+)
```

**Example (ja)**:

```markdown
## 学歴

### 国立台湾大学（2017-2023）

**文学士** 日本語文学専攻
**副専攻** 経済学

**関連科目：**

- ウェブアプリケーションプログラミング（A+）
- ビジネスコンピューティングプログラミング（A+）
- Python によるデータ分析と機械学習（A+）
```

### 4. Certifications

**Purpose**: List professional certifications with dates and details

**Structure**:

```markdown
## Certifications

### Google Cloud Platform (2025)

**Google 數位人才探索計畫 - Certificate of Completion**

Completed courses:

- Google Cloud Computing Foundations
- Cloud Computing Fundamentals
- Infrastructure in Google Cloud
- Networking & Security in Google Cloud
- Data, ML, and AI in Google Cloud
- Google Cloud Capstone Course
- Generative AI for Developers
- Introduction to Generative AI
- Introduction to Large Language Models
- Introduction to Responsible AI
- Introduction to Vertex AI Studio
- Introduction to Image Generation
- Prompt Design in Vertex AI
- Integrating Applications with Gemini 1.0 Pro on Google Cloud

### TOEIC Listening and Reading Test (May 2024)

**Score**: 965 / 990

Demonstrates advanced English proficiency for international business communication and technical documentation.

### US Certified Public Accountant (USCPA) (May 2023)

Professional accounting certification demonstrating expertise in financial reporting, auditing, taxation, and business concepts.

### Japanese-Language Proficiency Test (JLPT) N1 (July 2019)

Highest level of Japanese language certification, demonstrating advanced comprehension and communication skills in Japanese.
```

**Date Format**: Use natural language dates (e.g., "May 2024", "2025")

**Score/Level Format**: Use universal formats that don't require translation

- TOEIC: `965 / 990`
- JLPT: `N1`
- USCPA: No score (pass/fail certification)

### 5. Projects (Optional)

**Purpose**: Showcase key projects with links

**Structure**:

```markdown
## Projects

### VolleyBro

A volleyball match recording PWA with real-time data presentation and analysis.

**Tech Stack:** React, TypeScript, Next.js (App Router), Redux, SWR, Auth.js, PWA, Tailwind

**Key Features:**

- Built a custom UI for match recording, enabling users to record a rally within 4 taps
- Implemented REST APIs using Next.js Route Handlers, applying SWR for fetching and caching
- Integrated SWR to update UI optimistically for the fast-changing dynamics of the match
- Built a PWA using Serwist for offline functionality and mobile-native-app-like UX

**Links:**

- [GitHub](https://github.com/AndrewCK24/volleybro)
- [Live Demo](https://volleybro.vercel.app/)
```

## MDX Components

### Default Components (Fumadocs UI)

All standard Markdown elements are styled by Fumadocs UI prose styling:

- Headings: `h2`, `h3`, `h4`
- Paragraphs: `p`
- Lists: `ul`, `ol`, `li`
- Links: `a` (with hover effects)
- Emphasis: `strong`, `em`
- Code: `code`, `pre` (with syntax highlighting)

### Optional Custom Components

**Badge Component** (for skills):

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="secondary">TypeScript</Badge>;
```

**Card Component** (for certifications):

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>JLPT N1</CardTitle>
    <CardDescription>July 2019</CardDescription>
  </CardHeader>
  <CardContent>Highest level of Japanese language certification...</CardContent>
</Card>;
```

**Note**: Custom components are optional. Standard MDX prose styling is sufficient for MVP.

## Content Length Guidelines

| Section               | Recommended Length                            |
| --------------------- | --------------------------------------------- |
| Introduction          | 100-200 words (2-3 paragraphs)                |
| Skills & Technologies | 20-30 items across 4-5 categories             |
| Education             | 1 institution with 3-5 coursework items       |
| Certifications        | 4 major certifications with 50-100 words each |
| Projects              | 1-2 major projects with 100-150 words each    |

**Total Page Length**: ~800-1200 words

## SEO Metadata

**Title Template**:

- zh-TW: `關於我 | Andrew Tseng`
- en: `About Me | Andrew Tseng`
- ja: `私について | Andrew Tseng`

**Description Template**:

- zh-TW: `全端開發工程師 - 曾立維 (Andrew Tseng) 的專業背景、教育經歷、技術認證與技能`
- en: `Professional background, education, certifications, and technical skills of Andrew Tseng, a Full-Stack Developer`
- ja: `フルスタック開発者 Andrew Tseng の専門的背景、学歴、技術認定、およびスキル`

## Accessibility Considerations

- Use semantic HTML headings (h2 → h3 hierarchy)
- Provide alt text for images (if any)
- Ensure minimum 14px font size on mobile
- Maintain proper color contrast (WCAG AA)
- Use ARIA labels for interactive elements

## Performance Optimization

- Keep total page size < 100KB (excluding images)
- Use `loading="lazy"` for images below the fold
- Avoid heavy JavaScript in MDX content
- Leverage Fumadocs built-in code splitting

## Content Maintenance

**Update Frequency**:

- Skills: Update quarterly with new technologies
- Certifications: Add immediately upon completion
- Projects: Update semi-annually with new major projects

**Version Control**:

- All content changes via Git commits
- Use descriptive commit messages (e.g., "docs(about): add GCP certification")
- Review changes in preview deployment before merging

---

**Status**: ✅ Content Structure Defined - Ready for MDX content creation
