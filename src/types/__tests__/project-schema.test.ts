/**
 * T012: 單元測試 - projectFrontmatterSchema validation
 *
 * 測試內容:
 * - 驗證合法 frontmatter 通過
 * - title 長度限制（≤100）
 * - description 長度限制（≤200）
 * - image 路徑格式驗證
 * - date 格式驗證（YYYY-MM-DD）
 * - order 範圍驗證（1-99）
 */

import { projectFrontmatterSchema } from "../project";

describe("Project Frontmatter Schema Validation", () => {
  const validFrontmatter = {
    title: "測試專案",
    description: "這是一個測試專案的描述",
    image: "/images/projects/test.jpg",
    date: "2024-10-10",
    featured: true,
    order: 1,
  };

  it("should accept valid frontmatter", () => {
    const result = projectFrontmatterSchema.safeParse(validFrontmatter);
    expect(result.success).toBe(true);
  });

  describe("title validation", () => {
    it("should reject titles longer than 100 characters", () => {
      const longTitle = {
        ...validFrontmatter,
        title: "A".repeat(101), // 101 characters
      };
      const result = projectFrontmatterSchema.safeParse(longTitle);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("title");
      }
    });

    it("should accept title with exactly 100 characters", () => {
      const maxLengthTitle = {
        ...validFrontmatter,
        title: "A".repeat(100), // Exactly 100 characters
      };
      const result = projectFrontmatterSchema.safeParse(maxLengthTitle);
      expect(result.success).toBe(true);
    });

    it("should reject empty title", () => {
      const emptyTitle = {
        ...validFrontmatter,
        title: "",
      };
      const result = projectFrontmatterSchema.safeParse(emptyTitle);
      expect(result.success).toBe(false);
    });
  });

  describe("description validation", () => {
    it("should reject descriptions longer than 200 characters", () => {
      const longDesc = {
        ...validFrontmatter,
        description: "B".repeat(201), // 201 characters
      };
      const result = projectFrontmatterSchema.safeParse(longDesc);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("description");
      }
    });

    it("should accept description with exactly 200 characters", () => {
      const maxLengthDesc = {
        ...validFrontmatter,
        description: "B".repeat(200),
      };
      const result = projectFrontmatterSchema.safeParse(maxLengthDesc);
      expect(result.success).toBe(true);
    });

    it("should reject empty description", () => {
      const emptyDesc = {
        ...validFrontmatter,
        description: "",
      };
      const result = projectFrontmatterSchema.safeParse(emptyDesc);
      expect(result.success).toBe(false);
    });
  });

  describe("image path validation", () => {
    it("should accept valid image paths", () => {
      const validImages = [
        "/images/projects/test.jpg",
        "/images/projects/test.png",
        "/images/projects/test.webp",
        "/images/projects/test.avif",
      ];

      validImages.forEach((image) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validFrontmatter,
          image,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid image extensions", () => {
      const invalidImage = {
        ...validFrontmatter,
        image: "/images/projects/test.txt",
      };
      const result = projectFrontmatterSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });
  });

  describe("date validation", () => {
    it("should accept valid date format (YYYY-MM-DD)", () => {
      const validDates = ["2024-10-10", "2023-01-01", "2025-12-31"];

      validDates.forEach((date) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validFrontmatter,
          date,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid date formats", () => {
      const invalidDates = [
        "10-10-2024",
        "2024/10/10",
        "Oct 10, 2024",
        "invalid",
      ];

      invalidDates.forEach((date) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validFrontmatter,
          date,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe("featured field validation", () => {
    it("should accept featured as optional boolean", () => {
      // featured: true
      const featured = projectFrontmatterSchema.safeParse({
        ...validFrontmatter,
        featured: true,
      });
      expect(featured.success).toBe(true);

      // featured: false
      const notFeatured = projectFrontmatterSchema.safeParse({
        ...validFrontmatter,
        featured: false,
      });
      expect(notFeatured.success).toBe(true);

      // featured omitted (should default to false)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { featured: _, ...withoutFeatured } = validFrontmatter;
      const noFeatured = projectFrontmatterSchema.safeParse(withoutFeatured);
      expect(noFeatured.success).toBe(true);
    });
  });

  describe("order field validation", () => {
    it("should accept order values between 1-99", () => {
      const validOrders = [1, 50, 99];

      validOrders.forEach((order) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validFrontmatter,
          order,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject order values outside 1-99 range", () => {
      const invalidOrders = [0, -1, 100, 1000];

      invalidOrders.forEach((order) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validFrontmatter,
          order,
        });
        expect(result.success).toBe(false);
      });
    });

    it("should accept order as optional", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order: _, ...withoutOrder } = validFrontmatter;
      const result = projectFrontmatterSchema.safeParse(withoutOrder);
      expect(result.success).toBe(true);
    });
  });

  describe("comprehensive validation", () => {
    it("should provide helpful error messages for multiple invalid fields", () => {
      const invalidFrontmatter = {
        title: "A".repeat(101), // Too long
        description: "B".repeat(201), // Too long
        image: "/images/test.txt", // Invalid extension
        date: "invalid-date", // Invalid format
        order: 100, // Out of range
      };

      const result = projectFrontmatterSchema.safeParse(invalidFrontmatter);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have multiple errors
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });
});
