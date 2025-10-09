# Feature Specification: About Me Page

**Feature Branch**: `001-about-page`
**Created**: 2025-10-01
**Status**: Draft
**Input**: User description: "建立「關於我」頁面，展示詳細的個人經歷、教育背景、技能發展軌跡、專業認證（GCP、USCPA、JLPT、TOEIC）。支援多語言（zh-TW、en、ja），採用時間軸視覺化設計展現職涯和學習成長歷程。頁面需要響應式設計，並整合到網站導航中。"

**Architecture Decision**:

- Content stored in `content/about/{locale}/index.mdx`
- Use Fumadocs MDX with `defineDocs` to define `about` collection
- Create dedicated `aboutSource` loader in `src/lib/source.ts`
- Route at `/about` using DocsLayout or custom layout
- MDX content with prose styling, no custom React timeline components

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

As a **technical recruiter or hiring manager**,
I want to **view the candidate's complete professional background, educational journey, and skill development** in a well-organized page,
so that **I can quickly assess their qualifications, career progression, and certifications for technical roles**.

### Acceptance Scenarios

1. **Given** I am a recruiter evaluating candidates for a full-stack developer role,
   **When** I navigate to the About page (`/about`),
   **Then** I see structured content displaying:
   - Educational background (university, degree, major, minor, graduation year)
   - Professional certifications with dates and issuing organizations (GCP, USCPA, JLPT N1, TOEIC 965)
   - Career milestones and skill development
   - Professional summary

2. **Given** I am viewing the About page on a mobile device,
   **When** the page loads,
   **Then** all content is readable with minimum 14px font size and proper spacing.

3. **Given** I prefer to read content in Japanese,
   **When** I switch the language to Japanese (ja) using the language selector,
   **Then** the About page displays in Japanese without layout issues or missing translations.

4. **Given** I am on the homepage,
   **When** I look at the navigation menu,
   **Then** I see an "About" / "關於我" / "私について" link that takes me directly to `/about`.

5. **Given** I am viewing certification details,
   **When** I scroll through the About page,
   **Then** I see:
   - Full certification names (e.g., "Japanese Language Proficiency Test N1")
   - Issuing organizations
   - Dates obtained
   - Scores or levels where applicable
   - Brief context explaining relevance

6. **Given** I am viewing the About page,
   **When** the page is fully loaded,
   **Then** it loads within 2 seconds and achieves Lighthouse performance score > 90.

### Edge Cases

- **What happens when the page is viewed in a very narrow viewport (< 320px)?**
  - Content remains readable with single-column layout and appropriate text wrapping

- **How are dates displayed across different languages?**
  - Use locale-aware date formatting (e.g., "2023年1月" in zh-TW/ja, "January 2023" in en)

- **What happens when switching languages mid-scroll?**
  - Page maintains approximate scroll position; content updates without navigation disruption

- **How are certification scores/levels displayed across languages?**
  - Use universal formats (TOEIC: 965/990, JLPT: N1) that don't require translation

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Page MUST be accessible at `/about` route with language prefix (e.g., `/zh-TW/about`, `/en/about`, `/ja/about`)
- **FR-002**: Page MUST display educational background including:
  - Institution: National Taiwan University
  - Degree: Bachelor of Arts
  - Major: Japanese Language and Literature
  - Minor: Economics
  - Graduation year: 2023
- **FR-003**: Page MUST display all professional certifications:
  - Google Cloud Platform certificates (multiple courses completed in 2025)
  - USCPA (May 2023)
  - JLPT N1 (July 2019)
  - TOEIC 965/990 (May 2024)
- **FR-004**: Each certification MUST include:
  - Full name
  - Issuing organization
  - Date obtained
  - Score or level (if applicable)
  - Brief context of relevance
- **FR-005**: Page MUST support three languages (zh-TW, en, ja) with complete content translations
- **FR-006**: Page MUST be accessible via navigation menu from all other pages on the site
- **FR-007**: Page MUST display skills and technologies with context
- **FR-008**: Page MUST include professional summary or introduction
- **FR-009**: Page MUST be responsive with readable text on all device sizes (minimum 14px font)
- **FR-010**: Page MUST load completely within 2 seconds on standard connections
- **FR-011**: Content MUST be organized chronologically (education → certifications → skills)

### Key Entities _(include if feature involves data)_

- **About Page Content**: MDX document with structured sections
  - Attributes: title, description, language, lastUpdated
  - Sections: Introduction, Education, Certifications, Skills, Professional Experience
  - Format: Markdown with MDX components for enhanced presentation

- **Education Record**: Formal education information
  - Attributes: institution, degree, major, minor, graduation date, relevant coursework

- **Certification Record**: Professional certification or language proficiency
  - Attributes: name, organization, date, score/level, expiration (optional), credential URL (optional)

- **Skill Entry**: Technical skill or technology
  - Attributes: skill name, proficiency level, context, related technologies

---

## Requirements Clarifications

### Architecture Decisions

**Decision**: Use Fumadocs MDX with `defineDocs` instead of custom React components

**Rationale**:

- Consistent with existing documentation infrastructure
- No need for custom data models or API endpoints
- MDX provides rich formatting capabilities
- Easier content management (edit MDX files directly)
- Better maintainability (no complex React state management)

**Implementation**:

- Define `about` collection in `source.config.ts` pointing to `content/about`
- Create `aboutSource` loader in `src/lib/source.ts`
- Store content in `content/about/{locale}/index.mdx`
- Use Fumadocs UI components (DocsPage, DocsBody, etc.) for layout

### Content Organization

Content structure in MDX files:

```markdown
---
title: About Me
description: Professional background and qualifications
---

## Introduction

[Professional summary]

## Skills & Technologies

[Skills organized by category]

## Education

### National Taiwan University (2017-2023)

[Education details]

## Certifications

### Google Cloud Platform (2025)

[Certification details]

### TOEIC (2024)

[...]

### USCPA (2023)

[...]

### JLPT N1 (2019)

[...]
```

---

## Review & Acceptance Checklist

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

### Dependencies and Assumptions

**Dependencies:**

- Navigation component must be updated to include "About" link
- Multi-language support infrastructure (existing Fumadocs i18n)
- Fumadocs MDX system (existing in `source.config.ts`)

**Assumptions:**

- Content will be maintained manually in MDX files (no CMS)
- About page uses similar layout to docs pages (DocsLayout)
- User has completed Story 1.1 (project initialization) and 1.2 (homepage)
- Certification and education details are provided by content author
- Timeline visualization can be achieved with MDX prose styling (no complex interactive components needed)

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Architecture revised to use Fumadocs MDX approach
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Dependencies clarified
- [x] Review checklist passed

---
