/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * T008: 元件測試 - FeaturedProjectCard (hero variant)
 *
 * 測試內容:
 * - 渲染標題、描述、圖片
 * - Mobile: flex-col, 圖上文下, aspect-video
 * - Desktop: 保持 hero 樣式
 * - 圖片使用 priority={true}
 *
 * 預期：此測試必須失敗，因為 FeaturedProjectCard 組件未建立
 * 參考：contracts/api-contracts.md Section 3.3
 */

// Import the component (will fail until implemented)
// import { FeaturedProjectCard } from "../featured-project-card";

describe("FeaturedProjectCard - Hero Variant", () => {
  const mockProject = {
    slug: "test-project",
    locale: "zh-TW" as const,
    title: "測試專案標題",
    description: "這是一個測試專案的描述文字，用於驗證卡片元件的渲染。",
    image: "/images/projects/test-hero.jpg",
    url: "/zh-TW/projects/test-project",
    date: "2024-10-10",
    featured: true,
    order: 1,
  };

  it("should render project title, description, and image", () => {
    // This test will fail until FeaturedProjectCard is implemented
    // render(<FeaturedProjectCard project={mockProject} variant="hero" priority />);

    // expect(screen.getByRole("heading", { name: mockProject.title })).toBeInTheDocument();
    // expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    // expect(screen.getByRole("img", { name: mockProject.title })).toBeInTheDocument();

    // Placeholder assertion to make test fail intentionally
    expect(() => {
      throw new Error(
        "FeaturedProjectCard component not implemented yet (T008)"
      );
    }).toThrow();
  });

  it("should use flex-col layout (image on top, text below)", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="hero" />);

    // const card = screen.getByTestId("project-card");
    // expect(card).toHaveClass(/flex-col/);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard hero layout not implemented yet (T008)"
      );
    }).toThrow();
  });

  it("should use aspect-video for hero image (16:9 ratio)", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="hero" />);

    // const image = screen.getByRole("img", { name: mockProject.title });
    // expect(image).toHaveClass(/aspect-video/);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard aspect-video not implemented yet (T008)"
      );
    }).toThrow();
  });

  it("should pass priority={true} to Next.js Image component", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="hero" priority />);

    // const image = screen.getByRole("img", { name: mockProject.title });
    // // Next.js Image with priority should have fetchpriority="high"
    // expect(image).toHaveAttribute("fetchpriority", "high");
    // expect(image).not.toHaveAttribute("loading", "lazy");

    expect(() => {
      throw new Error(
        "FeaturedProjectCard priority prop not implemented yet (T008)"
      );
    }).toThrow();
  });

  it("should link to project detail page", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="hero" />);

    // const link = screen.getByRole("link");
    // expect(link).toHaveAttribute("href", mockProject.url);

    expect(() => {
      throw new Error("FeaturedProjectCard link not implemented yet (T008)");
    }).toThrow();
  });

  it("should have correct data-testid attribute", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="hero" />);

    // expect(screen.getByTestId("project-card")).toBeInTheDocument();

    expect(() => {
      throw new Error(
        "FeaturedProjectCard data-testid not implemented yet (T008)"
      );
    }).toThrow();
  });

  it("should respect title length limit (≤100 characters)", () => {
    // const longTitleProject = {
    //   ...mockProject,
    //   title: "A".repeat(101), // 101 characters (exceeds limit)
    // };

    // render(<FeaturedProjectCard project={longTitleProject} variant="hero" />);

    // const title = screen.getByRole("heading");
    // const titleText = title.textContent || "";
    // // Should truncate or handle long titles
    // expect(titleText.length).toBeLessThanOrEqual(100);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard title length validation not implemented yet (T008)"
      );
    }).toThrow();
  });

  it("should respect description length limit (≤200 characters)", () => {
    // const longDescProject = {
    //   ...mockProject,
    //   description: "B".repeat(201), // 201 characters (exceeds limit)
    // };

    // render(<FeaturedProjectCard project={longDescProject} variant="hero" />);

    // const description = screen.getByText(/B+/);
    // const descText = description.textContent || "";
    // expect(descText.length).toBeLessThanOrEqual(200);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard description length validation not implemented yet (T008)"
      );
    }).toThrow();
  });
});
