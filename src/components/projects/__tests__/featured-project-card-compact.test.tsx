/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * T009: 元件測試 - FeaturedProjectCard (compact variant)
 *
 * 測試內容:
 * - Mobile: flex-row, 圖左文右, aspect-square
 * - Desktop: grid layout
 * - 圖片 lazy loading
 *
 * 預期：此測試必須失敗，因為 FeaturedProjectCard 組件未建立
 * 參考：quickstart.md 測試場景 2.4
 */

// Import the component (will fail until implemented)
// import { FeaturedProjectCard } from "../featured-project-card";

describe("FeaturedProjectCard - Compact Variant", () => {
  const mockProject = {
    slug: "compact-project",
    locale: "zh-TW" as const,
    title: "緊湊型專案卡片",
    description: "用於測試 compact variant 的專案描述。",
    image: "/images/projects/compact-test.jpg",
    url: "/zh-TW/projects/compact-project",
    date: "2024-10-10",
    featured: true,
    order: 2,
  };

  it("should use flex-row layout on mobile (image left, text right)", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="compact" />);

    // const card = screen.getByTestId("project-card");
    // // Mobile should use flex-row
    // expect(card).toHaveClass(/flex-row/);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard compact mobile layout not implemented yet (T009)"
      );
    }).toThrow();
  });

  it("should use aspect-square for compact image (1:1 ratio)", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="compact" />);

    // const image = screen.getByRole("img", { name: mockProject.title });
    // expect(image).toHaveClass(/aspect-square/);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard aspect-square not implemented yet (T009)"
      );
    }).toThrow();
  });

  it("should use lazy loading for compact card images", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="compact" />);

    // const image = screen.getByRole("img", { name: mockProject.title });
    // // Compact cards should lazy load (not priority)
    // expect(image).toHaveAttribute("loading", "lazy");
    // expect(image).not.toHaveAttribute("fetchpriority", "high");

    expect(() => {
      throw new Error(
        "FeaturedProjectCard lazy loading not implemented yet (T009)"
      );
    }).toThrow();
  });

  it("should render smaller image dimensions for compact variant", () => {
    // render(<FeaturedProjectCard project={mockProject} variant="compact" />);

    // const image = screen.getByRole("img", { name: mockProject.title });
    // // Compact image should have smaller width (e.g., w-24 on mobile)
    // expect(image).toHaveClass(/w-24|w-32/);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard compact image dimensions not implemented yet (T009)"
      );
    }).toThrow();
  });

  it("should have consistent height across compact cards", () => {
    // const projects = [
    //   mockProject,
    //   { ...mockProject, slug: "project-2", title: "Another Project" },
    // ];

    // const { rerender } = render(
    //   <FeaturedProjectCard project={projects[0]} variant="compact" />
    // );
    // const card1 = screen.getByTestId("project-card");
    // const height1 = card1.getBoundingClientRect().height;

    // rerender(<FeaturedProjectCard project={projects[1]} variant="compact" />);
    // const card2 = screen.getByTestId("project-card");
    // const height2 = card2.getBoundingClientRect().height;

    // // Heights should be similar (allowing small variance)
    // expect(Math.abs(height1 - height2)).toBeLessThan(10);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard consistent height not implemented yet (T009)"
      );
    }).toThrow();
  });

  it("should truncate long text in compact variant", () => {
    // const longTextProject = {
    //   ...mockProject,
    //   description: "B".repeat(200), // Very long description
    // };

    // render(<FeaturedProjectCard project={longTextProject} variant="compact" />);

    // const description = screen.getByText(/B+/);
    // // Should use text truncation (line-clamp or similar)
    // expect(description).toHaveClass(/line-clamp/);

    expect(() => {
      throw new Error(
        "FeaturedProjectCard text truncation not implemented yet (T009)"
      );
    }).toThrow();
  });
});
