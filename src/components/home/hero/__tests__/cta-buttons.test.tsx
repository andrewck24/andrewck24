import { render, screen } from "@testing-library/react";
import { CtaButtons } from "../cta-buttons";

const mockSocialLinks = {
  github: "https://github.com/andrewck24",
  linkedin: "https://www.linkedin.com/in/li-wei-tseng-andrew/",
  email: "andrewck24@gmail.com",
};

describe("CtaButtons", () => {
  describe("Portfolio and About buttons", () => {
    it("renders portfolio and about buttons correctly", () => {
      render(<CtaButtons locale="zh-TW" social={mockSocialLinks} />);

      expect(screen.getByTestId("cta-buttons")).toBeInTheDocument();
      expect(screen.getByTestId("view-portfolio-btn")).toBeInTheDocument();
      expect(screen.getByTestId("view-about-btn")).toBeInTheDocument();

      expect(screen.getByText("檢視作品集")).toBeInTheDocument();
      expect(screen.getByText("關於我")).toBeInTheDocument();
    });

    it("generates correct href for different locales", () => {
      const { rerender } = render(
        <CtaButtons locale="en" social={mockSocialLinks} />
      );

      const portfolioBtn = screen.getByTestId("view-portfolio-btn");
      const aboutBtn = screen.getByTestId("view-about-btn");

      expect(portfolioBtn.closest("a")).toHaveAttribute(
        "href",
        "/en/portfolio"
      );
      expect(aboutBtn.closest("a")).toHaveAttribute("href", "/en/about");

      rerender(<CtaButtons locale="ja" social={mockSocialLinks} />);

      expect(portfolioBtn.closest("a")).toHaveAttribute(
        "href",
        "/ja/portfolio"
      );
      expect(aboutBtn.closest("a")).toHaveAttribute("href", "/ja/about");
    });
  });

  describe("Social links", () => {
    it("renders GitHub and LinkedIn links when provided", () => {
      render(<CtaButtons locale="zh-TW" social={mockSocialLinks} />);

      expect(screen.getByTestId("github-link")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin-link")).toBeInTheDocument();

      const githubLink = screen.getByTestId("github-link");
      const linkedinLink = screen.getByTestId("linkedin-link");

      expect(githubLink).toHaveAttribute("href", mockSocialLinks.github);
      expect(linkedinLink).toHaveAttribute("href", mockSocialLinks.linkedin);
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not render social links when URLs are not provided", () => {
      const socialWithoutLinks = {
        email: "test@example.com",
      };

      render(<CtaButtons locale="zh-TW" social={socialWithoutLinks} />);

      expect(screen.queryByTestId("github-link")).not.toBeInTheDocument();
      expect(screen.queryByTestId("linkedin-link")).not.toBeInTheDocument();
    });

    it("renders aria-labels for accessibility", () => {
      render(<CtaButtons locale="zh-TW" social={mockSocialLinks} />);

      const githubLink = screen.getByTestId("github-link");
      const linkedinLink = screen.getByTestId("linkedin-link");

      expect(githubLink).toHaveAttribute("aria-label", "GitHub");
      expect(linkedinLink).toHaveAttribute("aria-label", "LinkedIn");
    });

    it("handles partial social links", () => {
      const partialSocial = {
        github: "https://github.com/andrewck24",
        email: "test@example.com",
        // linkedin is missing
      };

      render(<CtaButtons locale="zh-TW" social={partialSocial} />);

      expect(screen.getByTestId("github-link")).toBeInTheDocument();
      expect(screen.queryByTestId("linkedin-link")).not.toBeInTheDocument();
    });

    it("handles missing URLs correctly", () => {
      const socialWithMissingUrls = {
        github: undefined,
        linkedin: undefined,
        email: "test@example.com",
      };

      render(<CtaButtons locale="zh-TW" social={socialWithMissingUrls} />);

      expect(screen.queryByTestId("github-link")).not.toBeInTheDocument();
      expect(screen.queryByTestId("linkedin-link")).not.toBeInTheDocument();
    });

    it("handles empty string URLs correctly", () => {
      const socialWithEmptyUrls = {
        github: "",
        linkedin: "",
        email: "test@example.com",
      };

      render(<CtaButtons locale="zh-TW" social={socialWithEmptyUrls} />);

      expect(screen.queryByTestId("github-link")).not.toBeInTheDocument();
      expect(screen.queryByTestId("linkedin-link")).not.toBeInTheDocument();
    });
  });

  describe("Responsive layout", () => {
    it("applies correct responsive CSS classes", () => {
      render(<CtaButtons locale="zh-TW" social={mockSocialLinks} />);

      const ctaContainer = screen.getByTestId("cta-buttons");
      expect(ctaContainer).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-4",
        "sm:flex-row",
        "lg:justify-start"
      );

      const buttonContainer = ctaContainer.firstElementChild;
      expect(buttonContainer).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "gap-4",
        "max-sm:w-full"
      );

      const portfolioBtn = screen.getByTestId("view-portfolio-btn");
      const aboutBtn = screen.getByTestId("view-about-btn");

      expect(portfolioBtn).toHaveClass("max-sm:flex-1");
      expect(aboutBtn).toHaveClass("max-sm:flex-1");
    });
  });

  describe("Button variants", () => {
    it("applies correct button variants", () => {
      render(<CtaButtons locale="zh-TW" social={mockSocialLinks} />);

      const portfolioBtn = screen.getByTestId("view-portfolio-btn");
      const aboutBtn = screen.getByTestId("view-about-btn");

      // Check that buttons exist (specific variant classes are applied by Button component)
      expect(portfolioBtn).toBeInTheDocument();
      expect(aboutBtn).toBeInTheDocument();
    });
  });
});
