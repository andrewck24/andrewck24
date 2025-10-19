/**
 * T007-T009: ArticleImage Component Tests
 *
 * TDD Red Phase - These tests MUST FAIL before implementation
 *
 * Test Coverage:
 * - T007: Static mode rendering (Next.js Image)
 * - T008: Generated mode background format detection (gradient/color/image)
 * - T009: View transition name validation
 */

import { render, screen } from "@testing-library/react";
import { ArticleImage } from "../image";

describe("ArticleImage Component", () => {
  // T007: Static mode rendering tests
  describe("Static Image Mode", () => {
    it("should render Next.js Image with correct src and alt", () => {
      render(
        <ArticleImage
          slug="test-article"
          title="Test Article"
          imageType="static"
          image="/images/projects/hero/zh-TW/test.jpg"
        />
      );

      const img = screen.getByAltText("Test Article");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", expect.stringContaining("test.jpg"));
    });

    it("should apply priority attribute when priority=true", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="static"
          image="/images/projects/hero/zh-TW/test.jpg"
          priority={true}
        />
      );

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("loading", "eager");
    });

    it("should use lazy loading when priority=false", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="static"
          image="/images/projects/hero/zh-TW/test.jpg"
          priority={false}
        />
      );

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it("should use fallback alt text if title is empty", () => {
      render(
        <ArticleImage
          slug="test"
          title=""
          imageType="static"
          image="/images/projects/hero/zh-TW/test.jpg"
        />
      );

      const img = screen.getByAltText("Article image");
      expect(img).toBeInTheDocument();
    });
  });

  // T008: Generated mode background format detection tests
  describe("Generated Mode - Background Format Detection", () => {
    it("should render div with CSS gradient background", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="generated"
          ogImage={{
            text: "Test Text",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        />
      );

      const div = container.querySelector(
        '[data-testid="article-image-container"]'
      );
      expect(div).toHaveStyle({
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      });
    });

    it("should render div with solid color background", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="generated"
          ogImage={{
            background: "#667eea",
          }}
        />
      );

      const div = container.querySelector(
        '[data-testid="article-image-container"]'
      );
      expect(div).toHaveStyle({
        background: "#667eea",
      });
    });

    it("should detect image path and apply url() wrapper", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="generated"
          ogImage={{
            background: "/images/projects/og-backgrounds/common/bg.jpg",
          }}
        />
      );

      const div = container.querySelector(
        '[data-testid="article-image-container"]'
      );
      expect(div).toHaveStyle({
        backgroundImage: "url(/images/projects/og-backgrounds/common/bg.jpg)",
      });
    });

    it("should use default gradient when background is undefined", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="generated"
          ogImage={{
            text: "Test",
          }}
        />
      );

      const div = container.querySelector(
        '[data-testid="article-image-container"]'
      );
      expect(div).toHaveStyle({
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      });
    });

    it("should display ogImage text as heading", () => {
      render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="generated"
          ogImage={{
            text: "Custom Text",
          }}
        />
      );

      expect(screen.getByText("Custom Text")).toBeInTheDocument();
    });

    it("should apply custom className from ogImage", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="generated"
          ogImage={{
            text: "Test",
            className: "custom-og-style",
          }}
        />
      );

      const div = container.querySelector(".custom-og-style");
      expect(div).toBeInTheDocument();
    });
  });

  // T009: View transition name validation tests
  describe("View Transition Support", () => {
    it("should apply view transition name with slug", () => {
      const { container } = render(
        <ArticleImage
          slug="my-article"
          title="Test"
          imageType="static"
          image="/test.jpg"
        />
      );

      const element = container.querySelector('[style*="viewTransitionName"]');
      expect(element).toHaveStyle({
        viewTransitionName: "article-image-my-article",
      });
    });

    it("should use same transition name for both static and generated modes", () => {
      const { container: staticContainer } = render(
        <ArticleImage
          slug="same-slug"
          title="Test"
          imageType="static"
          image="/test.jpg"
        />
      );

      const { container: generatedContainer } = render(
        <ArticleImage
          slug="same-slug"
          title="Test"
          imageType="generated"
          ogImage={{ text: "Test" }}
        />
      );

      const staticElement = staticContainer.querySelector(
        '[style*="viewTransitionName"]'
      );
      const generatedElement = generatedContainer.querySelector(
        '[style*="viewTransitionName"]'
      );

      expect(staticElement).toHaveStyle({
        viewTransitionName: "article-image-same-slug",
      });
      expect(generatedElement).toHaveStyle({
        viewTransitionName: "article-image-same-slug",
      });
    });

    it("should have data-testid for e2e testing", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="static"
          image="/test.jpg"
        />
      );

      const element = container.querySelector(
        '[data-testid="article-image-container"]'
      );
      expect(element).toBeInTheDocument();
    });
  });

  // Edge cases and fallback behavior
  describe("Fallback Behavior", () => {
    it("should fallback to generated mode when imageType=static but image is undefined", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const { container } = render(
        <ArticleImage slug="test" title="Test" imageType="static" />
      );

      // Should render generated mode div instead
      const div = container.querySelector(
        '[data-testid="article-image-container"]'
      );
      expect(div).toBeInTheDocument();

      // Should log warning in development
      if (process.env.NODE_ENV === "development") {
        expect(consoleWarnSpy).toHaveBeenCalled();
      }

      consoleWarnSpy.mockRestore();
    });

    it("should apply additional className prop", () => {
      const { container } = render(
        <ArticleImage
          slug="test"
          title="Test"
          imageType="static"
          image="/test.jpg"
          className="custom-wrapper"
        />
      );

      const element = container.querySelector(".custom-wrapper");
      expect(element).toBeInTheDocument();
    });
  });
});
