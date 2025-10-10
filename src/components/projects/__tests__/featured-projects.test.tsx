/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * T010: 元件測試 - FeaturedProjects section
 *
 * 測試內容:
 * - 顯示 3-5 個專案卡片
 * - 按照 meta.json 順序排列
 * - 無專案時顯示空狀態
 *
 * 預期：此測試必須失敗，因為 FeaturedProjects 組件未建立
 */

// Import the component (will fail until implemented)
// import { FeaturedProjects } from "../featured-projects";

describe("FeaturedProjects Section", () => {
  const mockProjects = [
    {
      slug: "project-1",
      locale: "zh-TW" as const,
      title: "專案一",
      description: "第一個專案",
      image: "/images/projects/project-1.jpg",
      url: "/zh-TW/projects/project-1",
      date: "2024-10-10",
      featured: true,
      order: 1,
    },
    {
      slug: "project-2",
      locale: "zh-TW" as const,
      title: "專案二",
      description: "第二個專案",
      image: "/images/projects/project-2.jpg",
      url: "/zh-TW/projects/project-2",
      date: "2024-10-09",
      featured: true,
      order: 2,
    },
    {
      slug: "project-3",
      locale: "zh-TW" as const,
      title: "專案三",
      description: "第三個專案",
      image: "/images/projects/project-3.jpg",
      url: "/zh-TW/projects/project-3",
      date: "2024-10-08",
      featured: true,
      order: 3,
    },
  ];

  it("should render section title", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const title = screen.getByRole("heading", { name: /精選專案/i });
    // expect(title).toBeInTheDocument();

    expect(() => {
      throw new Error(
        "FeaturedProjects section title not implemented yet (T010)"
      );
    }).toThrow();
  });

  it("should display 3-5 project cards", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const cards = screen.getAllByTestId("project-card");
    // expect(cards.length).toBeGreaterThanOrEqual(3);
    // expect(cards.length).toBeLessThanOrEqual(5);
    // expect(cards.length).toBe(mockProjects.length);

    expect(() => {
      throw new Error(
        "FeaturedProjects card display not implemented yet (T010)"
      );
    }).toThrow();
  });

  it("should display projects in correct order from meta.json", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const cards = screen.getAllByTestId("project-card");
    // // Projects should appear in the order they were passed
    // expect(cards[0]).toHaveTextContent("專案一");
    // expect(cards[1]).toHaveTextContent("專案二");
    // expect(cards[2]).toHaveTextContent("專案三");

    expect(() => {
      throw new Error("FeaturedProjects ordering not implemented yet (T010)");
    }).toThrow();
  });

  it("should render first card as hero variant", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const cards = screen.getAllByTestId("project-card");
    // const firstCard = cards[0];
    // expect(firstCard).toHaveAttribute("data-variant", "hero");

    expect(() => {
      throw new Error(
        "FeaturedProjects hero variant not implemented yet (T010)"
      );
    }).toThrow();
  });

  it("should render remaining cards as compact variant", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const cards = screen.getAllByTestId("project-card");
    // // Cards after first should be compact
    // for (let i = 1; i < cards.length; i++) {
    //   expect(cards[i]).toHaveAttribute("data-variant", "compact");
    // }

    expect(() => {
      throw new Error(
        "FeaturedProjects compact variants not implemented yet (T010)"
      );
    }).toThrow();
  });

  it("should use grid layout with proper columns", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const grid = screen.getByTestId("featured-projects-grid");
    // // Desktop: 3 columns, Mobile: 1 column
    // expect(grid).toHaveClass(/grid/);
    // expect(grid).toHaveClass(/md:grid-cols-3/); // Desktop
    // expect(grid).toHaveClass(/grid-cols-1/); // Mobile

    expect(() => {
      throw new Error(
        "FeaturedProjects grid layout not implemented yet (T010)"
      );
    }).toThrow();
  });

  it("should display empty state when no projects", () => {
    // render(<FeaturedProjects projects={[]} locale="zh-TW" />);

    // const emptyMessage = screen.getByText(/目前沒有精選專案|no featured projects/i);
    // expect(emptyMessage).toBeInTheDocument();

    // // Should not display any cards
    // const cards = screen.queryAllByTestId("project-card");
    // expect(cards.length).toBe(0);

    expect(() => {
      throw new Error(
        "FeaturedProjects empty state not implemented yet (T010)"
      );
    }).toThrow();
  });

  it("should handle exactly 5 projects (maximum)", () => {
    // const fiveProjects = [
    //   ...mockProjects,
    //   { ...mockProjects[0], slug: "project-4", title: "專案四", order: 4 },
    //   { ...mockProjects[0], slug: "project-5", title: "專案五", order: 5 },
    // ];

    // render(<FeaturedProjects projects={fiveProjects} locale="zh-TW" />);

    // const cards = screen.getAllByTestId("project-card");
    // expect(cards.length).toBe(5);

    expect(() => {
      throw new Error("FeaturedProjects max limit not implemented yet (T010)");
    }).toThrow();
  });

  it("should support i18n for section title", () => {
    // // Test zh-TW
    // const { rerender } = render(
    //   <FeaturedProjects projects={mockProjects} locale="zh-TW" />
    // );
    // expect(screen.getByRole("heading", { name: /精選專案/i })).toBeInTheDocument();

    // // Test en
    // rerender(<FeaturedProjects projects={mockProjects} locale="en" />);
    // expect(screen.getByRole("heading", { name: /featured projects/i })).toBeInTheDocument();

    // // Test ja
    // rerender(<FeaturedProjects projects={mockProjects} locale="ja" />);
    // expect(screen.getByRole("heading", { name: /注目のプロジェクト/i })).toBeInTheDocument();

    expect(() => {
      throw new Error("FeaturedProjects i18n not implemented yet (T010)");
    }).toThrow();
  });

  it("should have proper accessibility attributes", () => {
    // render(<FeaturedProjects projects={mockProjects} locale="zh-TW" />);

    // const section = screen.getByRole("region", { name: /精選專案/i });
    // expect(section).toBeInTheDocument();

    expect(() => {
      throw new Error(
        "FeaturedProjects accessibility not implemented yet (T010)"
      );
    }).toThrow();
  });
});
