/**
 * T024-T026: Article Component Tests
 *
 * TDD Red Phase - These tests MUST FAIL before implementation
 *
 * Test Coverage:
 * - T024: Header section rendering (title, description, date)
 * - T025: MDX content rendering
 * - T026: Back link navigation (contentType prop)
 */

import { render, screen } from "@testing-library/react";
import { Article } from "../index";
import type { ArticlePageData } from "@/types/article";

// Mock ArticleImage component
jest.mock("../image", () => ({
  ArticleImage: ({
    slug,
    title,
  }: {
    slug: string;
    title: string;
    priority?: boolean;
  }) => (
    <div data-testid="article-image" data-slug={slug} data-title={title}>
      Mock ArticleImage
    </div>
  ),
}));

// Mock lucide-react ArrowLeft icon
jest.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">←</div>,
}));

describe("Article Component", () => {
  const MockMDXContent = () => (
    <div data-testid="mdx-content">
      <h2>Mock Heading</h2>
      <p>This is mock MDX content for testing.</p>
    </div>
  );

  const mockArticle: ArticlePageData = {
    title: "Test Article Title",
    description: "This is a comprehensive test article description.",
    slug: "test-article",
    locale: "zh-TW",
    url: "/zh-TW/projects/test-article",
    date: "2025-10-19",
    imageType: "static",
    image: "/test-image.jpg",
    content: MockMDXContent,
    body: "",
  };

  // T024: Header section rendering tests
  describe("Header Section Rendering", () => {
    it("should render article title as h1", () => {
      render(<Article article={mockArticle} />);

      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Test Article Title");
    });

    it("should render article description", () => {
      render(<Article article={mockArticle} />);

      const description = screen.getByText(
        "This is a comprehensive test article description."
      );
      expect(description).toBeInTheDocument();
    });

    it("should render formatted date with time element", () => {
      render(<Article article={mockArticle} />);

      const timeElement = screen.getByText(/2025/);
      expect(timeElement.tagName).toBe("TIME");
      expect(timeElement).toHaveAttribute("dateTime", "2025-10-19");
    });

    it("should format date according to article locale", () => {
      const enArticle = {
        ...mockArticle,
        locale: "en" as const,
      };

      render(<Article article={enArticle} />);

      const timeElement = screen.getByText(/2025/);
      expect(timeElement).toBeInTheDocument();
      // Exact format depends on browser's Intl implementation
    });

    it("should render ArticleImage with priority=true", () => {
      render(<Article article={mockArticle} />);

      const image = screen.getByTestId("article-image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("data-slug", "test-article");
      expect(image).toHaveAttribute("data-title", "Test Article Title");
    });

    it("should have semantic header element", () => {
      const { container } = render(<Article article={mockArticle} />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });
  });

  // T025: MDX content rendering tests
  describe("MDX Content Rendering", () => {
    it("should render MDX content component", () => {
      render(<Article article={mockArticle} />);

      const mdxContent = screen.getByTestId("mdx-content");
      expect(mdxContent).toBeInTheDocument();
    });

    it("should render MDX headings", () => {
      render(<Article article={mockArticle} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Mock Heading");
    });

    it("should render MDX paragraph content", () => {
      render(<Article article={mockArticle} />);

      const paragraph = screen.getByText(
        "This is mock MDX content for testing."
      );
      expect(paragraph).toBeInTheDocument();
    });

    it("should wrap MDX content in prose container", () => {
      const { container } = render(<Article article={mockArticle} />);

      const proseContainer = container.querySelector(".prose");
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toContainElement(
        screen.getByTestId("mdx-content")
      );
    });

    it("should have article element as main container", () => {
      const { container } = render(<Article article={mockArticle} />);

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("should have data-testid for e2e testing", () => {
      const { container } = render(<Article article={mockArticle} />);

      const articleSection = container.querySelector(
        '[data-testid="article-section"]'
      );
      expect(articleSection).toBeInTheDocument();
    });
  });

  // T026: Back link navigation tests
  describe("Back Link Navigation", () => {
    it("should render back link for projects contentType", () => {
      render(<Article article={mockArticle} contentType="projects" />);

      const backLink = screen.getByRole("link");
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/zh-TW/projects");
    });

    it("should render back link for notes contentType", () => {
      const notesArticle = {
        ...mockArticle,
        url: "/zh-TW/notes/test-note",
      };

      render(<Article article={notesArticle} contentType="notes" />);

      const backLink = screen.getByRole("link");
      expect(backLink).toHaveAttribute("href", "/zh-TW/notes");
    });

    it("should default to projects contentType when not specified", () => {
      render(<Article article={mockArticle} />);

      const backLink = screen.getByRole("link");
      expect(backLink).toHaveAttribute("href", "/zh-TW/projects");
    });

    it("should display custom back link text when provided", () => {
      render(
        <Article
          article={mockArticle}
          contentType="projects"
          backLinkText="回到專案"
        />
      );

      expect(screen.getByText("回到專案")).toBeInTheDocument();
    });

    it("should use default back link text when not provided", () => {
      render(<Article article={mockArticle} contentType="projects" />);

      // Default text should be "返回專案列表" or "返回筆記列表" depending on contentType
      const backLink = screen.getByRole("link");
      expect(backLink.textContent).toContain("返回");
    });

    it("should render ArrowLeft icon in back link", () => {
      render(<Article article={mockArticle} contentType="projects" />);

      const icon = screen.getByTestId("arrow-left-icon");
      expect(icon).toBeInTheDocument();
    });

    it("should have footer element for back link section", () => {
      const { container } = render(<Article article={mockArticle} />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
      expect(footer).toContainElement(screen.getByRole("link"));
    });

    it("should handle different locales in back link URL", () => {
      const jaArticle = {
        ...mockArticle,
        locale: "ja" as const,
        url: "/ja/projects/test-article",
      };

      render(<Article article={jaArticle} contentType="projects" />);

      const backLink = screen.getByRole("link");
      expect(backLink).toHaveAttribute("href", "/ja/projects");
    });
  });

  // Responsive layout tests
  describe("Responsive Layout", () => {
    it("should have responsive margin classes", () => {
      const { container } = render(<Article article={mockArticle} />);

      const outerContainer = container.querySelector(".mx-4");
      expect(outerContainer).toBeInTheDocument();
      expect(outerContainer).toHaveClass("lg:mx-12");
    });

    it("should have prose classes for typography", () => {
      const { container } = render(<Article article={mockArticle} />);

      const proseContainer = container.querySelector(".prose");
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass("prose-neutral");
      expect(proseContainer).toHaveClass("dark:prose-invert");
    });

    it("should have proper article container styling", () => {
      const { container } = render(<Article article={mockArticle} />);

      const article = container.querySelector("article");
      expect(article).toHaveClass("rounded-2xl");
      expect(article).toHaveClass("border");
    });
  });

  // Edge cases
  describe("Edge Cases", () => {
    it("should handle article with generated image type", () => {
      const generatedImageArticle: ArticlePageData = {
        ...mockArticle,
        imageType: "generated",
        image: undefined,
        ogImage: {
          icon: "/images/generated.svg",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      };

      render(<Article article={generatedImageArticle} />);

      const image = screen.getByTestId("article-image");
      expect(image).toBeInTheDocument();
    });

    it("should handle empty description", () => {
      const noDescArticle = {
        ...mockArticle,
        description: "",
      };

      render(<Article article={noDescArticle} />);

      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toBeInTheDocument();
    });

    it("should handle complex MDX content component", () => {
      const ComplexMDXContent = () => (
        <div data-testid="complex-mdx">
          <h2>Section 1</h2>
          <p>Paragraph 1</p>
          <h3>Subsection 1.1</h3>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      );

      const complexArticle = {
        ...mockArticle,
        content: ComplexMDXContent,
      };

      render(<Article article={complexArticle} />);

      expect(screen.getByTestId("complex-mdx")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Section 1"
      );
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Subsection 1.1"
      );
    });
  });
});
