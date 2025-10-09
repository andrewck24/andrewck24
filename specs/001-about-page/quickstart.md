# Quickstart: About Page E2E Test Scenarios

**Feature Branch**: `001-about-page` | **Date**: 2025-10-01 | **Phase**: 1 (Design)

## Overview

This document defines E2E test scenarios for the About Me page feature. These scenarios validate acceptance criteria from [spec.md](./spec.md) and guide E2E test implementation using Playwright.

## Prerequisites

- Development server running on `http://localhost:3000`
- All three language variants of About page MDX content created
- Navigation links configured in `layout.shared.tsx`
- Playwright installed and configured

## Test Scenario 1: Basic Page Access and Content Rendering

**Acceptance Criteria**: FR-001, FR-002, FR-003, FR-004

**Steps**:

1. Navigate to `/zh-TW/about`
2. Wait for page to load completely
3. Verify page title in browser tab is "關於我 | Andrew Tseng"
4. Verify page heading (h1 or title) displays "關於我" or equivalent
5. Verify the following sections exist:
   - Introduction section
   - Skills & Technologies section
   - Education section (with "國立台灣大學")
   - Certifications section (with at least 4 certifications)
6. Verify Education section contains:
   - Institution: "國立台灣大學"
   - Years: "2017-2023"
   - Degree: "文學士"
   - Major: "日本語文學"
   - Minor: "經濟學"
7. Verify Certifications section contains:
   - Google Cloud Platform (2025)
   - TOEIC (2024) with score "965 / 990"
   - USCPA (2023)
   - JLPT N1 (2019)

**Expected Result**: Page loads successfully with all content sections visible and correctly formatted.

**Test Data Attributes**:

- `[data-testid="about-page"]` on main container
- `[data-testid="about-section-introduction"]`
- `[data-testid="about-section-skills"]`
- `[data-testid="about-section-education"]`
- `[data-testid="about-section-certifications"]`

## Test Scenario 2: Multi-language Content Switching

**Acceptance Criteria**: FR-005

**Steps**:

1. Navigate to `/zh-TW/about`
2. Verify page content is in Traditional Chinese
3. Click language selector and select "English"
4. Verify URL changes to `/en/about`
5. Verify page content changes to English:
   - Page title: "About Me | Andrew Tseng"
   - Institution: "National Taiwan University"
   - Degree: "Bachelor of Arts"
   - Major: "Japanese Language and Literature"
6. Click language selector and select "日本語"
7. Verify URL changes to `/ja/about`
8. Verify page content changes to Japanese:
   - Page title: "私について | Andrew Tseng"
   - Institution: "国立台湾大学"
   - Degree: "文学士"

**Expected Result**: Content updates correctly for each language without layout breaking or missing translations.

**Assertion Points**:

- URL pathname matches expected locale prefix
- H1/title text matches expected language
- At least 3 different text elements verified per language

## Test Scenario 3: Navigation Integration

**Acceptance Criteria**: FR-006

**Steps**:

1. Navigate to homepage `/zh-TW`
2. Verify navigation menu is visible
3. Locate "關於我" link in navigation
4. Verify link href is `/zh-TW/about`
5. Click the "關於我" link
6. Verify redirected to `/zh-TW/about`
7. Verify About page loads successfully
8. Navigate to `/en` homepage
9. Verify "About" link exists in navigation
10. Click "About" link
11. Verify redirected to `/en/about`

**Expected Result**: About link exists in navigation on all pages and correctly navigates to About page with proper locale.

**Test Data Attributes**:

- `[data-testid="nav-about-link"]` on navigation About link

## Test Scenario 4: Responsive Design - Mobile View

**Acceptance Criteria**: FR-009

**Steps**:

1. Set viewport to mobile size (375x667 - iPhone SE)
2. Navigate to `/en/about`
3. Verify page loads without horizontal scroll
4. Verify text is readable (check computed font-size >= 14px)
5. Verify headings are properly sized and legible
6. Verify list items are not cut off
7. Verify spacing between sections is appropriate
8. Test scroll behavior through all sections

**Expected Result**: Page is fully readable on mobile with minimum 14px font size and proper spacing.

**Viewport Sizes to Test**:

- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080

## Test Scenario 5: Performance Validation

**Acceptance Criteria**: FR-010

**Steps**:

1. Clear browser cache
2. Navigate to `/en/about`
3. Measure page load time using Performance API
4. Verify page loads within 2 seconds
5. Run Lighthouse performance audit
6. Verify Lighthouse performance score >= 90
7. Check Time to First Contentful Paint (FCP) < 1.5s
8. Check Largest Contentful Paint (LCP) < 2.5s

**Expected Result**: Page loads within 2 seconds and achieves Lighthouse score > 90.

**Metrics to Capture**:

- Total page load time
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

## Test Scenario 6: Content Integrity Across Languages

**Acceptance Criteria**: FR-005, FR-013

**Steps**:

1. Navigate to `/zh-TW/about`
2. Count number of certification items (should be 4)
3. Count number of skill categories (should be 4-5)
4. Navigate to `/en/about`
5. Verify same number of certification items
6. Verify same number of skill categories
7. Navigate to `/ja/about`
8. Verify same number of certification items
9. Verify same number of skill categories
10. Verify chronological order is consistent:
    - Introduction → Skills → Education → Certifications

**Expected Result**: All three language variants have identical structure and item counts, with consistent chronological organization.

**Assertion Points**:

- Same number of h2 headings across languages
- Same number of h3 headings in Certifications section
- Same section order

## Test Scenario 7: Link Accessibility and Navigation

**Acceptance Criteria**: General usability

**Steps**:

1. Navigate to `/en/about`
2. Tab through all interactive elements using keyboard
3. Verify focus indicators are visible on:
   - Navigation links
   - Language selector
   - Any in-content links (if present)
4. Test screen reader compatibility (optional):
   - Verify proper heading hierarchy announced
   - Verify link purposes are clear
   - Verify no unlabeled buttons

**Expected Result**: All interactive elements are keyboard accessible with visible focus indicators and proper ARIA labels.

## Test Scenario 8: Error Handling - Invalid Locale

**Acceptance Criteria**: General robustness

**Steps**:

1. Navigate to `/invalid-locale/about`
2. Verify one of the following:
   - 404 error page is shown
   - Redirect to default locale (`/zh-TW/about`)
   - Appropriate error message
3. Navigate to `/en/about/invalid-page`
4. Verify 404 page is shown

**Expected Result**: Invalid routes display appropriate error pages or redirect to valid routes.

## Test Scenario 9: Browser Compatibility

**Acceptance Criteria**: General compatibility

**Browsers to Test**:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Steps** (repeat for each browser):

1. Navigate to `/en/about`
2. Verify page renders correctly
3. Test language switching
4. Test responsive behavior (resize window)
5. Check console for JavaScript errors

**Expected Result**: Page functions correctly across all major browsers without errors.

## Automation Strategy

**High Priority** (Automate in E2E suite):

- Scenario 1: Basic Page Access ✅
- Scenario 2: Multi-language Switching ✅
- Scenario 3: Navigation Integration ✅
- Scenario 4: Responsive Design ✅
- Scenario 5: Performance Validation ✅

**Medium Priority** (Automate selectively):

- Scenario 6: Content Integrity ✅
- Scenario 7: Link Accessibility (partially automated)

**Low Priority** (Manual testing):

- Scenario 8: Error Handling (one-time verification)
- Scenario 9: Browser Compatibility (manual cross-browser testing)

## Test Execution Order

1. Run automated E2E tests (Scenarios 1-6)
2. Perform accessibility audit (Scenario 7)
3. Conduct cross-browser testing (Scenario 9)
4. Verify error handling (Scenario 8)

## Success Criteria

✅ All automated E2E tests pass
✅ No accessibility violations (WCAG AA)
✅ Page functions correctly in 4 major browsers
✅ Lighthouse performance score >= 90

---

**Status**: ✅ Test Scenarios Defined - Ready for E2E test implementation
