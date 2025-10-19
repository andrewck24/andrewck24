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
  // Valid static frontmatter
  const validStaticFrontmatter = {
    title: "測試專案",
    description: "這是一個測試專案的描述",
    imageType: "static" as const,
    image: "/images/projects/hero/zh-TW/test.jpg",
    date: "2024-10-10",
    featured: true,
    order: 1,
  };

  // Valid generated frontmatter
  const validDynamicFrontmatter = {
    title: "動態 OG 專案",
    description: "使用動態 OG Image 的專案",
    imageType: "generated" as const,
    ogImage: {
      background: "/images/projects/og-backgrounds/common/tech.jpg",
    },
    date: "2024-10-10",
    featured: true,
    order: 2,
  };

  // Use static as default for backward compatibility tests
  const validFrontmatter = validStaticFrontmatter;

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

  describe("image path validation (static mode)", () => {
    it("should accept valid image paths with locale", () => {
      const validImages = [
        "/images/projects/hero/zh-TW/test.jpg",
        "/images/projects/hero/en/test.png",
        "/images/projects/hero/ja/test.webp",
        "/images/projects/hero/zh-TW/my-project.avif",
      ];

      validImages.forEach((image) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validStaticFrontmatter,
          image,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject old image path format (without locale)", () => {
      const oldFormatImage = {
        ...validStaticFrontmatter,
        image: "/images/projects/test.jpg",
      };
      const result = projectFrontmatterSchema.safeParse(oldFormatImage);
      expect(result.success).toBe(false);
    });

    it("should reject invalid image extensions", () => {
      const invalidImage = {
        ...validStaticFrontmatter,
        image: "/images/projects/hero/zh-TW/test.txt",
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

  describe("imageType validation", () => {
    it("should accept 'static' imageType", () => {
      const result = projectFrontmatterSchema.safeParse(validStaticFrontmatter);
      expect(result.success).toBe(true);
    });

    it("should accept 'generated' imageType", () => {
      const result = projectFrontmatterSchema.safeParse(
        validDynamicFrontmatter
      );
      expect(result.success).toBe(true);
    });

    it("should default to 'static' if imageType is omitted", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { imageType: _, ...withoutImageType } = validStaticFrontmatter;
      const result = projectFrontmatterSchema.safeParse(withoutImageType);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.imageType).toBe("static");
      }
    });
  });

  describe("ogImage validation (generated mode)", () => {
    it("should accept ogImage with background (common folder)", () => {
      const withCommonBg = {
        ...validDynamicFrontmatter,
        ogImage: {
          background: "/images/projects/og-backgrounds/common/bg.jpg",
        },
      };
      const result = projectFrontmatterSchema.safeParse(withCommonBg);
      expect(result.success).toBe(true);
    });

    it("should accept ogImage with background (locale-specific)", () => {
      const validLocales = ["zh-TW", "en", "ja"];

      validLocales.forEach((locale) => {
        const withLocaleBg = {
          ...validDynamicFrontmatter,
          ogImage: {
            background: `/images/projects/og-backgrounds/${locale}/bg.png`,
          },
        };
        const result = projectFrontmatterSchema.safeParse(withLocaleBg);
        expect(result.success).toBe(true);
      });
    });

    it("should accept ogImage with custom className", () => {
      const withClassName = {
        ...validDynamicFrontmatter,
        ogImage: {
          background: "/images/projects/og-backgrounds/common/bg.jpg",
          className: "custom-og-style",
        },
      };
      const result = projectFrontmatterSchema.safeParse(withClassName);
      expect(result.success).toBe(true);
    });

    it("should accept ogImage without background (gradient fallback)", () => {
      const withoutBackground = {
        ...validDynamicFrontmatter,
        ogImage: {
          className: "gradient-blue",
        },
      };
      const result = projectFrontmatterSchema.safeParse(withoutBackground);
      expect(result.success).toBe(true);
    });

    it("should accept CSS gradient as background", () => {
      const gradientBg = {
        ...validDynamicFrontmatter,
        ogImage: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      };
      const result = projectFrontmatterSchema.safeParse(gradientBg);
      expect(result.success).toBe(true);
    });

    it("should accept solid color as background", () => {
      const colorBgs = [
        "#667eea",
        "rgb(102, 126, 234)",
        "rgba(102, 126, 234, 0.8)",
        "hsl(235, 72%, 61%)",
      ];

      colorBgs.forEach((background) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validDynamicFrontmatter,
          ogImage: { background },
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid background format", () => {
      const invalidBgs = ["invalid-value", "notacolor", "background-image"];

      invalidBgs.forEach((background) => {
        const result = projectFrontmatterSchema.safeParse({
          ...validDynamicFrontmatter,
          ogImage: { background },
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          // Should have background validation error
          const bgError = result.error.issues.find((issue) =>
            issue.path.includes("background")
          );
          expect(bgError).toBeDefined();
        }
      });
    });
  });

  describe("comprehensive validation", () => {
    it("should provide helpful error messages for multiple invalid fields", () => {
      const invalidFrontmatter = {
        title: "A".repeat(101), // Too long
        description: "B".repeat(201), // Too long
        imageType: "static" as const,
        image: "/images/test.txt", // Invalid extension & old format
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
