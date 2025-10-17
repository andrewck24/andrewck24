/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * T011: 元件測試 - ProjectDetail component
 *
 * 測試內容:
 * - 渲染專案標題、首圖
 * - 渲染四個章節（問題、思考、方案、影響）
 * - MDX 內容正確編譯
 *
 * 預期：此測試必須失敗，因為 ProjectDetail 組件未建立
 */

// Import the component (will fail until implemented)
// import { ProjectDetail } from "../project-detail";

describe("ProjectDetail Component", () => {
  // Mock MDX content component
  const MockMDXContent = () => (
    <div>
      <h2>此專案欲解決的問題</h2>
      <p>問題描述內容</p>
      <h2>思考過程</h2>
      <p>思考過程內容</p>
      <h2>採用方案</h2>
      <p>解決方案內容</p>
      <h2>產生的影響</h2>
      <p>影響成果內容</p>
    </div>
  );

  const mockProject = {
    slug: "test-project-detail",
    locale: "zh-TW" as const,
    title: "專案詳細頁面測試",
    description: "用於測試專案詳細頁面的描述",
    image: "/images/projects/detail-test-hero.jpg",
    url: "/zh-TW/projects/test-project-detail",
    date: "2024-10-10",
    featured: true,
    order: 1,
    content: MockMDXContent, // MDX component
    body: "MDX body content", // Raw MDX text
  };

  it("should render project title as h1", () => {
    // render(<ProjectDetail project={mockProject} />);

    // const title = screen.getByRole("heading", { level: 1, name: mockProject.title });
    // expect(title).toBeInTheDocument();

    expect(() => {
      throw new Error(
        "ProjectDetail title rendering not implemented yet (T011)"
      );
    }).toThrow();
  });

  it("should render hero image with priority loading", () => {
    // render(<ProjectDetail project={mockProject} />);

    // const heroImage = screen.getByTestId("project-hero-image");
    // expect(heroImage).toBeInTheDocument();
    // expect(heroImage).toHaveAttribute("alt", mockProject.title);
    // // Should use priority loading
    // expect(heroImage).toHaveAttribute("fetchpriority", "high");
    // expect(heroImage).not.toHaveAttribute("loading", "lazy");

    expect(() => {
      throw new Error("ProjectDetail hero image not implemented yet (T011)");
    }).toThrow();
  });

  it("should render MDX content sections", () => {
    // render(<ProjectDetail project={mockProject} />);

    // // Check all four section headings exist
    // expect(screen.getByRole("heading", { level: 2, name: /要解決的問題/i })).toBeInTheDocument();
    // expect(screen.getByRole("heading", { level: 2, name: /思考過程/i })).toBeInTheDocument();
    // expect(screen.getByRole("heading", { level: 2, name: /採用方案/i })).toBeInTheDocument();
    // expect(screen.getByRole("heading", { level: 2, name: /產生的影響/i })).toBeInTheDocument();

    // // Check section content exists
    // expect(screen.getByText(/問題描述內容/i)).toBeInTheDocument();
    // expect(screen.getByText(/思考過程內容/i)).toBeInTheDocument();
    // expect(screen.getByText(/解決方案內容/i)).toBeInTheDocument();
    // expect(screen.getByText(/影響成果內容/i)).toBeInTheDocument();

    expect(() => {
      throw new Error("ProjectDetail MDX sections not implemented yet (T011)");
    }).toThrow();
  });

  it("should render back link", () => {
    // render(<ProjectDetail project={mockProject} />);

    // const backLink = screen.getByRole("link", { name: /返回|back/i });
    // expect(backLink).toBeInTheDocument();
    // // Should link back to homepage or projects page
    // expect(backLink).toHaveAttribute("href", expect.stringMatching(/\/(zh-TW)?\/?$/));

    expect(() => {
      throw new Error("ProjectDetail back link not implemented yet (T011)");
    }).toThrow();
  });

  it("should properly style h2 headings", () => {
    // render(<ProjectDetail project={mockProject} />);

    // const h2Headings = screen.getAllByRole("heading", { level: 2 });
    // h2Headings.forEach((heading) => {
    //   // Should have proper styling classes
    //   expect(heading).toHaveClass(/text-2xl|text-xl|font-bold/);
    // });

    expect(() => {
      throw new Error("ProjectDetail h2 styling not implemented yet (T011)");
    }).toThrow();
  });

  it("should have semantic HTML structure", () => {
    // render(<ProjectDetail project={mockProject} />);

    // // Should use article or main tag
    // const article = screen.getByRole("article") || screen.getByRole("main");
    // expect(article).toBeInTheDocument();

    expect(() => {
      throw new Error("ProjectDetail semantic HTML not implemented yet (T011)");
    }).toThrow();
  });

  it("should handle MDX with code blocks", () => {
    // const MockMDXWithCode = () => (
    //   <div>
    //     <h2>採用方案</h2>
    //     <pre>
    //       <code>const example = "code block";</code>
    //     </pre>
    //   </div>
    // );

    // const projectWithCode = {
    //   ...mockProject,
    //   content: MockMDXWithCode,
    // };

    // render(<ProjectDetail project={projectWithCode} />);

    // const codeBlock = screen.getByText(/const example/i);
    // expect(codeBlock).toBeInTheDocument();
    // expect(codeBlock.tagName).toBe("CODE");

    expect(() => {
      throw new Error(
        "ProjectDetail code block handling not implemented yet (T011)"
      );
    }).toThrow();
  });

  it("should handle MDX with images", () => {
    // const MockMDXWithImages = () => (
    //   <div>
    //     <h2>解決方案</h2>
    //     <p>內容</p>
    //     <img src="/images/example.jpg" alt="Example" />
    //   </div>
    // );

    // const projectWithImages = {
    //   ...mockProject,
    //   content: MockMDXWithImages,
    // };

    // render(<ProjectDetail project={projectWithImages} />);

    // const contentImage = screen.getByAltText("Example");
    // expect(contentImage).toBeInTheDocument();

    expect(() => {
      throw new Error("ProjectDetail MDX images not implemented yet (T011)");
    }).toThrow();
  });

  it("should handle MDX with links", () => {
    // const MockMDXWithLinks = () => (
    //   <div>
    //     <h2>相關連結</h2>
    //     <p>
    //       <a href="https://example.com">External Link</a>
    //     </p>
    //   </div>
    // );

    // const projectWithLinks = {
    //   ...mockProject,
    //   content: MockMDXWithLinks,
    // };

    // render(<ProjectDetail project={projectWithLinks} />);

    // const link = screen.getByRole("link", { name: "External Link" });
    // expect(link).toBeInTheDocument();
    // expect(link).toHaveAttribute("href", "https://example.com");

    expect(() => {
      throw new Error("ProjectDetail MDX links not implemented yet (T011)");
    }).toThrow();
  });

  it("should display project metadata (date, tags, etc.)", () => {
    // render(<ProjectDetail project={mockProject} />);

    // // Check if date is displayed
    // const dateElement = screen.getByText(/2024-10-10/);
    // expect(dateElement).toBeInTheDocument();

    expect(() => {
      throw new Error(
        "ProjectDetail metadata display not implemented yet (T011)"
      );
    }).toThrow();
  });
});
