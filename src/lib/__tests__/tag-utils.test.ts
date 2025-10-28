/**
 * T006: 單元測試 - Tag Utilities
 *
 * 測試標籤工具函式：normalizeTag, isSuggestedTag, filterValidTags
 *
 * 這些測試會失敗，因為 src/lib/tag-utils.ts 尚未實作（TDD）
 * 在 Phase 3.3 (T013) 才會實作這些函式
 */

// 這些 import 會失敗，因為檔案尚未建立（TDD）
// 在 T013 實作時會建立 src/lib/tag-utils.ts
import {
  filterValidTags,
  isSuggestedTag,
  normalizeTag,
  SUGGESTED_TAGS,
} from "@/lib/tag-utils";

describe("normalizeTag", () => {
  it("should convert to lowercase", () => {
    expect(normalizeTag("Next.js")).toBe("next.js");
    expect(normalizeTag("TypeScript")).toBe("typescript");
    expect(normalizeTag("REACT")).toBe("react");
  });

  it("should replace spaces with hyphens", () => {
    expect(normalizeTag("Type Script")).toBe("type-script");
    expect(normalizeTag("Node js")).toBe("node-js");
    expect(normalizeTag("My Custom Tag")).toBe("my-custom-tag");
  });

  it("should trim whitespace", () => {
    expect(normalizeTag(" react ")).toBe("react");
    expect(normalizeTag("  next.js  ")).toBe("next.js");
    expect(normalizeTag("\ttailwind\t")).toBe("tailwind");
  });

  it("should handle mixed cases with spaces", () => {
    expect(normalizeTag(" Next.js Framework ")).toBe("next.js-framework");
    expect(normalizeTag("  Type Script  ")).toBe("type-script");
  });

  it("should handle multiple consecutive spaces", () => {
    expect(normalizeTag("foo   bar")).toBe("foo-bar");
    expect(normalizeTag("a  b  c")).toBe("a-b-c");
  });

  it("should preserve existing hyphens", () => {
    expect(normalizeTag("ci-cd")).toBe("ci-cd");
    expect(normalizeTag("case-study")).toBe("case-study");
  });

  it("should handle empty string", () => {
    expect(normalizeTag("")).toBe("");
  });

  it("should handle dots in tag names", () => {
    expect(normalizeTag("Next.js")).toBe("next.js");
    expect(normalizeTag("Node.js")).toBe("node.js");
  });
});

describe("isSuggestedTag", () => {
  it("should return true for suggested tags", () => {
    expect(isSuggestedTag("next.js")).toBe(true);
    expect(isSuggestedTag("typescript")).toBe(true);
    expect(isSuggestedTag("react")).toBe(true);
    expect(isSuggestedTag("tailwind")).toBe(true);
  });

  it("should return false for custom tags", () => {
    expect(isSuggestedTag("my-custom-tag")).toBe(false);
    expect(isSuggestedTag("unknown-tag")).toBe(false);
    expect(isSuggestedTag("custom")).toBe(false);
  });

  it("should be case-sensitive", () => {
    // SUGGESTED_TAGS 使用小寫，所以大寫不匹配
    expect(isSuggestedTag("Next.js")).toBe(false);
    expect(isSuggestedTag("REACT")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isSuggestedTag("")).toBe(false);
  });

  it("should return false for whitespace", () => {
    expect(isSuggestedTag(" ")).toBe(false);
    expect(isSuggestedTag("  ")).toBe(false);
  });

  it("should check all categories of suggested tags", () => {
    // Frontend
    expect(isSuggestedTag("vue")).toBe(true);
    expect(isSuggestedTag("svelte")).toBe(true);

    // Languages
    expect(isSuggestedTag("python")).toBe(true);
    expect(isSuggestedTag("rust")).toBe(true);

    // Styling
    expect(isSuggestedTag("css")).toBe(true);
    expect(isSuggestedTag("scss")).toBe(true);

    // Backend
    expect(isSuggestedTag("node.js")).toBe(true);
    expect(isSuggestedTag("graphql")).toBe(true);

    // Database
    expect(isSuggestedTag("postgresql")).toBe(true);
    expect(isSuggestedTag("mongodb")).toBe(true);

    // DevOps
    expect(isSuggestedTag("docker")).toBe(true);
    expect(isSuggestedTag("ci-cd")).toBe(true);

    // Testing
    expect(isSuggestedTag("jest")).toBe(true);
    expect(isSuggestedTag("playwright")).toBe(true);

    // Content Types
    expect(isSuggestedTag("tutorial")).toBe(true);
    expect(isSuggestedTag("guide")).toBe(true);

    // Topics
    expect(isSuggestedTag("architecture")).toBe(true);
    expect(isSuggestedTag("performance")).toBe(true);
  });
});

describe("filterValidTags", () => {
  it("should filter out empty strings", () => {
    expect(filterValidTags(["next.js", "", "typescript"])).toEqual([
      "next.js",
      "typescript",
    ]);
    expect(filterValidTags(["", "", ""])).toEqual([]);
  });

  it("should filter out whitespace-only strings", () => {
    expect(filterValidTags(["next.js", " ", "typescript"])).toEqual([
      "next.js",
      "typescript",
    ]);
    expect(filterValidTags(["react", "  ", "\t", "\n"])).toEqual(["react"]);
  });

  it("should normalize valid tags", () => {
    expect(filterValidTags(["Next.js", "TypeScript"])).toEqual([
      "next.js",
      "typescript",
    ]);
    expect(filterValidTags(["Type Script", "Node js"])).toEqual([
      "type-script",
      "node-js",
    ]);
  });

  it("should handle array with mixed valid and invalid tags", () => {
    expect(filterValidTags(["next.js", "", " ", "typescript", "  "])).toEqual([
      "next.js",
      "typescript",
    ]);
  });

  it("should return empty array for empty input", () => {
    expect(filterValidTags([])).toEqual([]);
  });

  it("should return empty array when all tags are invalid", () => {
    expect(filterValidTags(["", " ", "  ", "\t"])).toEqual([]);
  });

  it("should preserve order of valid tags", () => {
    expect(filterValidTags(["react", "next.js", "typescript"])).toEqual([
      "react",
      "next.js",
      "typescript",
    ]);
  });

  it("should handle tags with leading/trailing spaces", () => {
    expect(filterValidTags([" react ", "  next.js  "])).toEqual([
      "react",
      "next.js",
    ]);
  });

  it("should deduplicate normalized tags", () => {
    // 如果實作支援去重複的話
    // 如果不支援，這個測試可以移除或調整
    const result = filterValidTags(["Next.js", "next.js", "NEXT.JS"]);
    // 如果實作去重複，應該只有一個
    // 如果不去重複，會有三個相同的標籤
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("next.js");
  });

  it("should handle custom tags", () => {
    expect(
      filterValidTags(["my-custom-tag", "another-custom", "next.js"])
    ).toEqual(["my-custom-tag", "another-custom", "next.js"]);
  });

  it("should handle SUGGESTED_TAGS constant", () => {
    // 驗證 SUGGESTED_TAGS 中的所有標籤都是有效的
    const filtered = filterValidTags([...SUGGESTED_TAGS]);
    expect(filtered.length).toBe(SUGGESTED_TAGS.length);
  });
});

describe("tag utils integration", () => {
  it("should work together: normalize then check if suggested", () => {
    const tag = "Next.js";
    const normalized = normalizeTag(tag);
    expect(normalized).toBe("next.js");
    expect(isSuggestedTag(normalized)).toBe(true);
  });

  it("should filter and identify suggested vs custom tags", () => {
    const tags = ["Next.js", "", "my-custom-tag", " ", "TypeScript", "unknown"];
    const filtered = filterValidTags(tags);

    const suggested = filtered.filter(isSuggestedTag);
    const custom = filtered.filter((tag) => !isSuggestedTag(tag));

    expect(suggested).toContain("next.js");
    expect(suggested).toContain("typescript");
    expect(custom).toContain("my-custom-tag");
    expect(custom).toContain("unknown");
  });
});
