/**
 * T007-T008: Article Component Tests (including ArticleInfo)
 *
 * TDD Red Phase - These tests MUST FAIL before implementation
 *
 * Test Coverage:
 * - T007: ArticleInfo internal component (date, tags, links, language toggle)
 * - T008: Article component integration and layout
 * - Existing tests: Header section, MDX content, back link navigation
 */

// Mock getMDXComponents (must be before imports that use it)
jest.mock("../../../lib/mdx-components", () => ({
  getMDXComponents: jest.fn(() => ({})),
}));

import type { ArticlePageData, ProjectArticle } from "@/types/article";
import { render, screen } from "@testing-library/react";
import { Article } from "../index";

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

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">←</div>,
  Tag: () => <div data-testid="tag-icon">🏷️</div>,
  Github: () => <div data-testid="github-icon">GitHub</div>,
  ExternalLink: () => <div data-testid="external-link-icon">🔗</div>,
  Languages: () => <div data-testid="languages-icon">🌐</div>,
}));

// Mock LanguageToggle component
jest.mock("../../language-toggle", () => ({
  LanguageToggle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="language-toggle-component">{children}</div>
  ),
}));

// Mock GithubInfo component (async Server Component)
jest.mock("../../github-info", () => ({
  GithubInfo: ({ url, className }: { url: string; className?: string }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View on GitHub"
      data-testid="github-info"
      className={className}
    >
      GitHub
    </a>
  ),
}));

// Mock UI components
jest.mock("../../ui/badge", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock("../../ui/button", () => ({
  Button: ({
    children,
    variant,
    asChild,
  }: {
    children: React.ReactNode;
    variant?: string;
    asChild?: boolean;
  }) => (
    <div data-testid="button" data-variant={variant} data-as-child={asChild}>
      {children}
    </div>
  ),
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
    tags: [],
    featured: false,
    body: MockMDXContent,
  };

  // T024: Header section rendering tests
  describe("Header Section Rendering", () => {
    it("should render article title as h1", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Test Article Title");
    });

    it("should render article description", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const description = screen.getByText(
        "This is a comprehensive test article description."
      );
      expect(description).toBeInTheDocument();
    });

    it("should render formatted date with time element", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const timeElement = screen.getByText(/2025/);
      expect(timeElement.tagName).toBe("TIME");
      expect(timeElement).toHaveAttribute("dateTime", "2025-10-19");
    });

    it("should format date according to article locale", () => {
      const enArticle = {
        ...mockArticle,
        locale: "en" as const,
      };

      render(<Article article={enArticle} availableLocales={["en"]} />);

      const timeElement = screen.getByText(/2025/);
      expect(timeElement).toBeInTheDocument();
      // Exact format depends on browser's Intl implementation
    });

    it("should render ArticleImage with priority=true", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const image = screen.getByTestId("article-image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("data-slug", "test-article");
      expect(image).toHaveAttribute("data-title", "Test Article Title");
    });

    it("should have semantic header element", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });
  });

  // T025: MDX content rendering tests
  describe("MDX Content Rendering", () => {
    it("should render MDX content component", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const mdxContent = screen.getByTestId("mdx-content");
      expect(mdxContent).toBeInTheDocument();
    });

    it("should render MDX headings", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Mock Heading");
    });

    it("should render MDX paragraph content", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const paragraph = screen.getByText(
        "This is mock MDX content for testing."
      );
      expect(paragraph).toBeInTheDocument();
    });

    it("should wrap MDX content in prose container", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const proseContainer = container.querySelector(".prose");
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toContainElement(
        screen.getByTestId("mdx-content")
      );
    });

    it("should have article element as main container", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("should have data-testid for e2e testing", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const articleSection = container.querySelector(
        '[data-testid="article-section"]'
      );
      expect(articleSection).toBeInTheDocument();
    });
  });

  // T026: Back link navigation tests
  describe("Back Link Navigation", () => {
    it("should render back link for projects contentType", () => {
      render(
        <Article
          article={mockArticle}
          contentType="projects"
          availableLocales={["zh-TW"]}
        />
      );

      const backLink = screen.getByRole("link");
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/zh-TW/projects");
    });

    it("should render back link for notes contentType", () => {
      const notesArticle = {
        ...mockArticle,
        url: "/zh-TW/notes/test-note",
      };

      render(
        <Article
          article={notesArticle}
          contentType="notes"
          availableLocales={["zh-TW"]}
        />
      );

      const backLink = screen.getByRole("link");
      expect(backLink).toHaveAttribute("href", "/zh-TW/notes");
    });

    it("should default to projects contentType when not specified", () => {
      render(<Article article={mockArticle} availableLocales={["zh-TW"]} />);

      const backLink = screen.getByRole("link");
      expect(backLink).toHaveAttribute("href", "/zh-TW/projects");
    });

    it("should display custom back link text when provided", () => {
      render(
        <Article
          article={mockArticle}
          contentType="projects"
          backLinkText="回到專案"
          availableLocales={["zh-TW"]}
        />
      );

      expect(screen.getByText("回到專案")).toBeInTheDocument();
    });

    it("should use default back link text when not provided", () => {
      render(
        <Article
          article={mockArticle}
          contentType="projects"
          availableLocales={["zh-TW"]}
        />
      );

      // Default text should be "返回專案列表" or "返回筆記列表" depending on contentType
      const backLink = screen.getByRole("link");
      expect(backLink.textContent).toContain("返回");
    });

    it("should render ArrowLeft icon in back link", () => {
      render(
        <Article
          article={mockArticle}
          contentType="projects"
          availableLocales={["zh-TW"]}
        />
      );

      const icon = screen.getByTestId("arrow-left-icon");
      expect(icon).toBeInTheDocument();
    });

    it("should have footer element for back link section", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

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

      render(
        <Article
          article={jaArticle}
          contentType="projects"
          availableLocales={["ja"]}
        />
      );

      const backLink = screen.getByRole("link");
      expect(backLink).toHaveAttribute("href", "/ja/projects");
    });
  });

  // Responsive layout tests
  describe("Responsive Layout", () => {
    it("should have responsive margin classes", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const outerContainer = container.querySelector(".mx-4");
      expect(outerContainer).toBeInTheDocument();
      expect(outerContainer).toHaveClass("lg:mx-12");
    });

    it("should have prose classes for typography", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const proseContainer = container.querySelector(".prose");
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass("prose-neutral");
      expect(proseContainer).toHaveClass("dark:prose-invert");
    });

    it("should have proper article container styling", () => {
      const { container } = render(
        <Article article={mockArticle} availableLocales={["zh-TW"]} />
      );

      const article = container.querySelector("article");
      expect(article).toHaveClass("bg-background/50");
      expect(article).toHaveClass("lg:grid");
      expect(article).toHaveClass("lg:grid-cols-[1fr_300px]");
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

      render(
        <Article article={generatedImageArticle} availableLocales={["zh-TW"]} />
      );

      const image = screen.getByTestId("article-image");
      expect(image).toBeInTheDocument();
    });

    it("should handle empty description", () => {
      const noDescArticle = {
        ...mockArticle,
        description: "",
      };

      render(<Article article={noDescArticle} availableLocales={["zh-TW"]} />);

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
        body: ComplexMDXContent,
      };

      const { container } = render(
        <Article article={complexArticle} availableLocales={["zh-TW"]} />
      );

      const mdxContent = screen.getByTestId("complex-mdx");
      expect(mdxContent).toBeInTheDocument();

      // Query within the MDX content container to avoid ArticleInfo headings
      const h2 = container.querySelector('[data-testid="complex-mdx"] h2');
      const h3 = container.querySelector('[data-testid="complex-mdx"] h3');
      expect(h2).toHaveTextContent("Section 1");
      expect(h3).toHaveTextContent("Subsection 1.1");
    });
  });

  // T007: ArticleInfo Component Tests
  describe("ArticleInfo Component", () => {
    const mockArticleWithTags: ArticlePageData = {
      ...mockArticle,
      tags: ["next.js", "typescript", "tailwind"],
    };

    const mockProjectArticle: ArticlePageData<ProjectArticle> = {
      ...mockArticleWithTags,
      githubUrl: "https://github.com/andrewck24/andrewck24",
      demoUrl: "https://andrewck24.vercel.com",
      featured: false,
    };

    describe("ArticleInfo rendering", () => {
      it("should render ArticleInfo aside element", () => {
        render(
          <Article
            article={mockArticleWithTags}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const articleInfo = screen.getByTestId("article-info");
        expect(articleInfo).toBeInTheDocument();
        expect(articleInfo.tagName).toBe("ASIDE");
      });

      it("should format date in ArticleInfo for zh-TW locale", () => {
        render(
          <Article
            article={mockArticleWithTags}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const dateElement = screen.getByTestId("article-date");
        expect(dateElement.tagName).toBe("TIME");
        expect(dateElement).toHaveAttribute("dateTime", "2025-10-19");
        expect(dateElement).toHaveTextContent(/2025.*10.*19/);
      });

      it("should format date in ArticleInfo for en locale", () => {
        const enArticle = { ...mockArticleWithTags, locale: "en" as const };
        render(
          <Article
            article={enArticle}
            contentType="projects"
            availableLocales={["en"]}
          />
        );

        const dateElement = screen.getByTestId("article-date");
        expect(dateElement).toHaveTextContent(/October|2025/);
      });

      it("should format date in ArticleInfo for ja locale", () => {
        const jaArticle = { ...mockArticleWithTags, locale: "ja" as const };
        render(
          <Article
            article={jaArticle}
            contentType="projects"
            availableLocales={["ja"]}
          />
        );

        const dateElement = screen.getByTestId("article-date");
        expect(dateElement).toHaveTextContent(/2025.*10.*19/);
      });
    });

    describe("Tags display", () => {
      it("should render all tags using Badge component", () => {
        render(
          <Article
            article={mockArticleWithTags}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const tagsContainer = screen.getByTestId("article-tags");
        expect(tagsContainer).toBeInTheDocument();

        expect(screen.getByText("next.js")).toBeInTheDocument();
        expect(screen.getByText("typescript")).toBeInTheDocument();
        expect(screen.getByText("tailwind")).toBeInTheDocument();
      });

      it("should not render tags section when tags array is empty", () => {
        render(
          <Article
            article={mockArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        expect(screen.queryByTestId("article-tags")).not.toBeInTheDocument();
      });

      it("should render single tag correctly", () => {
        const singleTagArticle = { ...mockArticle, tags: ["react"] };
        render(
          <Article
            article={singleTagArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        expect(screen.getByTestId("article-tags")).toBeInTheDocument();
        expect(screen.getByText("react")).toBeInTheDocument();
      });
    });

    describe("Project links (Projects only)", () => {
      it("should render GitHub link when githubUrl is provided", () => {
        render(
          <Article
            article={mockProjectArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const linksContainer = screen.getByTestId("project-links");
        expect(linksContainer).toBeInTheDocument();

        const githubLink = screen.getByRole("link", { name: /github/i });
        expect(githubLink).toHaveAttribute(
          "href",
          "https://github.com/andrewck24/andrewck24"
        );
        expect(githubLink).toHaveAttribute("target", "_blank");
        expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      });

      it("should render Demo link when demoUrl is provided", () => {
        render(
          <Article
            article={mockProjectArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const demoLink = screen.getByRole("link", { name: /demo/i });
        expect(demoLink).toHaveAttribute(
          "href",
          "https://andrewck24.vercel.com"
        );
        expect(demoLink).toHaveAttribute("target", "_blank");
      });

      it("should not render project links for notes contentType", () => {
        const noteArticle = { ...mockArticleWithTags };
        render(
          <Article
            article={noteArticle}
            contentType="notes"
            availableLocales={["zh-TW"]}
          />
        );

        expect(screen.queryByTestId("project-links")).not.toBeInTheDocument();
      });

      it("should render only GitHub link when demoUrl is missing", () => {
        const githubOnlyArticle = {
          ...mockProjectArticle,
          demoUrl: undefined,
        };
        render(
          <Article
            article={githubOnlyArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        expect(
          screen.getByRole("link", { name: /github/i })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole("link", { name: /demo/i })
        ).not.toBeInTheDocument();
      });

      it("should render only Demo link when githubUrl is missing", () => {
        const demoOnlyArticle = {
          ...mockProjectArticle,
          githubUrl: undefined,
        };
        render(
          <Article
            article={demoOnlyArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        expect(
          screen.queryByRole("link", { name: /github/i })
        ).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: /demo/i })).toBeInTheDocument();
      });

      it("should not render project links when both URLs are missing", () => {
        render(
          <Article
            article={mockArticleWithTags}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        expect(screen.queryByTestId("project-links")).not.toBeInTheDocument();
      });
    });

    describe("Language toggle", () => {
      it("should render LanguageToggle component", () => {
        render(
          <Article
            article={mockArticleWithTags}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const languageToggle = screen.getByTestId("language-toggle");
        expect(languageToggle).toBeInTheDocument();
      });
    });

    describe("Accessibility", () => {
      it("should have accessible names for project links", () => {
        render(
          <Article
            article={mockProjectArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        const githubLink = screen.getByRole("link", { name: /github/i });
        const demoLink = screen.getByRole("link", { name: /demo/i });

        expect(githubLink).toHaveAccessibleName();
        expect(demoLink).toHaveAccessibleName();
      });

      it("should have data-testid for E2E testing", () => {
        render(
          <Article
            article={mockProjectArticle}
            contentType="projects"
            availableLocales={["zh-TW"]}
          />
        );

        expect(screen.getByTestId("article-info")).toBeInTheDocument();
        expect(screen.getByTestId("article-date")).toBeInTheDocument();
        expect(screen.getByTestId("article-tags")).toBeInTheDocument();
        expect(screen.getByTestId("project-links")).toBeInTheDocument();
        expect(screen.getByTestId("language-toggle")).toBeInTheDocument();
      });
    });
  });
});
