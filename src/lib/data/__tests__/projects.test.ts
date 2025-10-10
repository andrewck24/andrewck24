/**
 * T013: 單元測試 - getFeaturedProjects filtering logic
 *
 * 測試內容:
 * - 過濾 featured: true 專案
 * - 限制最多 5 個
 * - 依照 meta.json 順序
 * - 空結果處理
 */

// Mock fumadocs-mdx projectsSource (must be before import)
jest.mock("@/lib/source", () => ({
  projectsSource: {
    getPages: jest.fn(),
  },
}));

import { getFeaturedProjects } from "../projects";

describe("getFeaturedProjects filtering logic", () => {
  // Mock fumadocs Page structure
  const mockPages = [
    {
      slugs: ["project-1"],
      url: "/zh-TW/projects/project-1",
      data: {
        title: "專案一",
        description: "第一個專案",
        image: "/images/projects/project-1.jpg",
        date: "2024-10-10",
        featured: true,
        order: 1,
      },
    },
    {
      slugs: ["project-2"],
      url: "/zh-TW/projects/project-2",
      data: {
        title: "專案二",
        description: "第二個專案",
        image: "/images/projects/project-2.jpg",
        date: "2024-10-09",
        featured: true,
        order: 2,
      },
    },
    {
      slugs: ["project-3"],
      url: "/zh-TW/projects/project-3",
      data: {
        title: "專案三",
        description: "第三個專案",
        image: "/images/projects/project-3.jpg",
        date: "2024-10-08",
        featured: false, // Not featured
        order: 3,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should filter projects with featured: true", async () => {
    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(mockPages);

    const result = await getFeaturedProjects("zh-TW");

    // Should only include projects with featured: true
    expect(result.every((p) => p.featured === true)).toBe(true);
    // Should exclude project-3 (featured: false)
    expect(result.find((p) => p.slug === "project-3")).toBeUndefined();
    // Should include project-1 and project-2
    expect(result.length).toBe(2);
  });

  it("should filter by locale", async () => {
    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(mockPages);

    const result = await getFeaturedProjects("zh-TW");

    // Should only include zh-TW locale (getPages already filters by locale)
    expect(result.every((p) => p.locale === "zh-TW")).toBe(true);
  });

  it("should limit results to maximum 5 projects", async () => {
    const manyPages = Array.from({ length: 10 }, (_, i) => ({
      slugs: [`project-${i + 1}`],
      url: `/zh-TW/projects/project-${i + 1}`,
      data: {
        title: `專案${i + 1}`,
        description: `第${i + 1}個專案`,
        image: `/images/projects/project-${i + 1}.jpg`,
        date: "2024-10-10",
        featured: true,
        order: i + 1,
      },
    }));

    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(manyPages);

    const result = await getFeaturedProjects("zh-TW");

    // Should return maximum 5 projects
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result.length).toBe(5);
  });

  it("should preserve meta.json order", async () => {
    const { projectsSource } = await import("@/lib/source");
    // Projects are already in meta.json order from getPages()
    (projectsSource.getPages as jest.Mock).mockReturnValue(mockPages);

    const result = await getFeaturedProjects("zh-TW");

    // Should preserve the order from meta.json
    expect(result[0].slug).toBe("project-1");
    expect(result[1].slug).toBe("project-2");
    // project-3 should be filtered out (not featured)
  });

  it("should return empty array when no featured projects", async () => {
    const noFeaturedPages = mockPages.map((p) => ({
      ...p,
      data: {
        ...p.data,
        featured: false, // All not featured
      },
    }));

    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(noFeaturedPages);

    const result = await getFeaturedProjects("zh-TW");

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it("should handle empty projects collection", async () => {
    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue([]);

    const result = await getFeaturedProjects("zh-TW");

    expect(result).toEqual([]);
  });

  it("should handle locale with no projects", async () => {
    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue([]);

    // Try Japanese locale (no projects in mock data)
    const result = await getFeaturedProjects("ja");

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it("should return correct FeaturedProject type", async () => {
    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(mockPages);

    const result = await getFeaturedProjects("zh-TW");

    // Each item should have expected properties
    result.forEach((project) => {
      expect(project).toHaveProperty("slug");
      expect(project).toHaveProperty("locale");
      expect(project).toHaveProperty("title");
      expect(project).toHaveProperty("description");
      expect(project).toHaveProperty("image");
      expect(project).toHaveProperty("featured");
      expect(project.featured).toBe(true);
    });
  });

  it("should handle projects without order field", async () => {
    const pagesWithoutOrder = mockPages.map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order: _, ...restData } = p.data;
      return {
        ...p,
        data: restData,
      };
    });

    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(pagesWithoutOrder);

    const result = await getFeaturedProjects("zh-TW");

    // Should still work, relying on meta.json order
    expect(result.length).toBeGreaterThan(0);
  });

  it("should be type-safe with TypeScript", async () => {
    // This test validates that the function signature is correct
    const { projectsSource } = await import("@/lib/source");
    (projectsSource.getPages as jest.Mock).mockReturnValue(mockPages);

    // Type check: should return Promise<FeaturedProject[]>
    const result = await getFeaturedProjects("zh-TW");
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
  });
});
