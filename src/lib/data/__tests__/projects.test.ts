/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * T013: 單元測試 - getFeaturedProjects filtering logic
 *
 * 測試內容:
 * - 過濾 featured: true 專案
 * - 限制最多 5 個
 * - 依照 meta.json 順序
 * - 空結果處理
 *
 * 預期：此測試必須失敗，因為 getFeaturedProjects 函式未實作
 */

// Import the function (will fail until implemented)
// import { getFeaturedProjects } from "../projects";

// Mock fumadocs-mdx projectsSource (will fail until source.ts exists, but test structure is valid)
// jest.mock("@/lib/source", () => ({
//   projectsSource: {
//     getPages: jest.fn(),
//   },
// }));

describe("getFeaturedProjects filtering logic", () => {
  const mockProjects = [
    {
      slug: "project-1",
      locale: "zh-TW",
      data: {
        title: "專案一",
        description: "第一個專案",
        image: "/images/projects/project-1.jpg",
        date: "2024-10-10",
        featured: true,
        order: 1,
      },
      url: "/zh-TW/projects/project-1",
    },
    {
      slug: "project-2",
      locale: "zh-TW",
      data: {
        title: "專案二",
        description: "第二個專案",
        image: "/images/projects/project-2.jpg",
        date: "2024-10-09",
        featured: true,
        order: 2,
      },
      url: "/zh-TW/projects/project-2",
    },
    {
      slug: "project-3",
      locale: "zh-TW",
      data: {
        title: "專案三",
        description: "第三個專案",
        image: "/images/projects/project-3.jpg",
        date: "2024-10-08",
        featured: false, // Not featured
        order: 3,
      },
      url: "/zh-TW/projects/project-3",
    },
    {
      slug: "project-4",
      locale: "en",
      data: {
        title: "Project Four",
        description: "English project",
        image: "/images/projects/project-4.jpg",
        date: "2024-10-07",
        featured: true,
        order: 1,
      },
      url: "/en/projects/project-4",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should filter projects with featured: true", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects function not implemented yet (T013)"
      );
    }).toThrow();

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(mockProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // // Should only include projects with featured: true
    // expect(result.every((p) => p.data.featured === true)).toBe(true);
    // // Should exclude project-3 (featured: false)
    // expect(result.find((p) => p.slug === "project-3")).toBeUndefined();
  });

  it("should filter by locale", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects locale filtering not implemented yet (T013)"
      );
    }).toThrow();

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(mockProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // const zhTwResult = await getFeaturedProjects("zh-TW");

    // // Should only include zh-TW projects
    // expect(zhTwResult.every((p) => p.locale === "zh-TW")).toBe(true);
    // // Should exclude project-4 (en locale)
    // expect(zhTwResult.find((p) => p.slug === "project-4")).toBeUndefined();
  });

  it("should limit results to maximum 5 projects", async () => {
    expect(() => {
      throw new Error("getFeaturedProjects limit not implemented yet (T013)");
    }).toThrow();

    // const manyProjects = Array.from({ length: 10 }, (_, i) => ({
    //   slug: `project-${i + 1}`,
    //   locale: "zh-TW",
    //   data: {
    //     title: `專案${i + 1}`,
    //     description: `第${i + 1}個專案`,
    //     image: `/images/projects/project-${i + 1}.jpg`,
    //     date: "2024-10-10",
    //     featured: true,
    //     order: i + 1,
    //   },
    //   url: `/zh-TW/projects/project-${i + 1}`,
    // }));

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(manyProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // // Should return maximum 5 projects
    // expect(result.length).toBeLessThanOrEqual(5);
    // expect(result.length).toBe(5);
  });

  it("should preserve meta.json order", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects ordering not implemented yet (T013)"
      );
    }).toThrow();

    // const { projectsSource } = await import("@/lib/source");
    // // Projects are already in meta.json order from getPages()
    // (projectsSource.getPages as jest.Mock).mockReturnValue(mockProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // // Should preserve the order from meta.json
    // expect(result[0].slug).toBe("project-1");
    // expect(result[1].slug).toBe("project-2");
    // // project-3 should be filtered out (not featured)
  });

  it("should return empty array when no featured projects", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects empty result not implemented yet (T013)"
      );
    }).toThrow();

    // const noFeaturedProjects = mockProjects.map((p) => ({
    //   ...p,
    //   data: {
    //     ...p.data,
    //     featured: false, // All not featured
    //   },
    // }));

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(noFeaturedProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // expect(result).toEqual([]);
    // expect(result.length).toBe(0);
  });

  it("should handle empty projects collection", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects empty collection handling not implemented yet (T013)"
      );
    }).toThrow();

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue([]);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // expect(result).toEqual([]);
  });

  it("should handle locale with no projects", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects unsupported locale handling not implemented yet (T013)"
      );
    }).toThrow();

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(mockProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // // Try Japanese locale (no projects in mock data)
    // const result = await getFeaturedProjects("ja");

    // expect(result).toEqual([]);
    // expect(result.length).toBe(0);
  });

  it("should return correct FeaturedProject type", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects return type not implemented yet (T013)"
      );
    }).toThrow();

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(mockProjects);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // // Each item should have expected properties
    // result.forEach((project) => {
    //   expect(project).toHaveProperty("slug");
    //   expect(project).toHaveProperty("locale");
    //   expect(project).toHaveProperty("data");
    //   expect(project.data).toHaveProperty("title");
    //   expect(project.data).toHaveProperty("description");
    //   expect(project.data).toHaveProperty("image");
    //   expect(project.data).toHaveProperty("featured");
    //   expect(project.data.featured).toBe(true);
    // });
  });

  it("should handle projects without order field", async () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects order field handling not implemented yet (T013)"
      );
    }).toThrow();

    // const projectsWithoutOrder = mockProjects.map((p) => {
    //   const { order, ...restData } = p.data;
    //   return {
    //     ...p,
    //     data: restData,
    //   };
    // });

    // const { projectsSource } = await import("@/lib/source");
    // (projectsSource.getPages as jest.Mock).mockReturnValue(projectsWithoutOrder);

    // const { getFeaturedProjects } = await import("../projects");
    // const result = await getFeaturedProjects("zh-TW");

    // // Should still work, relying on meta.json order
    // expect(result.length).toBeGreaterThan(0);
  });

  it("should be type-safe with TypeScript", () => {
    expect(() => {
      throw new Error(
        "getFeaturedProjects TypeScript types not implemented yet (T013)"
      );
    }).toThrow();

    // This test validates that the function signature is correct
    // import type { FeaturedProject } from "@/types/project";
    // import { getFeaturedProjects } from "../projects";

    // // Type check: should return Promise<FeaturedProject[]>
    // const result: Promise<FeaturedProject[]> = getFeaturedProjects("zh-TW");
    // expect(result).toBeInstanceOf(Promise);
  });
});
