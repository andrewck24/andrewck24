import { render, screen } from "@testing-library/react";
import { TerminalAnimation } from "../terminal-animation";

// Mock DynamicCodeBlock to avoid fumadocs-ui import issues
jest.mock("fumadocs-ui/components/dynamic-codeblock", () => ({
  DynamicCodeBlock: ({
    code,
    lang,
    codeblock,
  }: {
    code: string;
    lang: string;
    codeblock?: { className?: string };
  }) => (
    <div
      data-testid="dynamic-codeblock"
      data-lang={lang}
      className={codeblock?.className}
    >
      <pre data-testid="terminal-code">{code}</pre>
    </div>
  ),
}));

describe("TerminalAnimation", () => {
  it("renders terminal animation component", () => {
    render(<TerminalAnimation />);

    const terminalContainer = screen.getByTestId("terminal-animation");
    expect(terminalContainer).toBeInTheDocument();
  });

  it("renders DynamicCodeBlock with correct props", () => {
    render(<TerminalAnimation />);

    const codeBlock = screen.getByTestId("dynamic-codeblock");
    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveAttribute("data-lang", "bash");
  });

  it("displays terminal code content", () => {
    render(<TerminalAnimation />);

    const terminalCode = screen.getByTestId("terminal-code");

    expect(terminalCode).toHaveTextContent("npm install andrewck24");
    expect(terminalCode).toHaveTextContent("cd andrewck24");
    expect(terminalCode).toHaveTextContent("npm run build");
    expect(terminalCode).toHaveTextContent("npm start");
    expect(terminalCode).toHaveTextContent("Starting server...");
    expect(terminalCode).toHaveTextContent(
      "Server started at http://localhost:3000"
    );
    expect(terminalCode).toHaveTextContent(
      "AT runtime, where our ideas execute"
    );
  });

  it("contains all expected terminal commands in sequence", () => {
    render(<TerminalAnimation />);

    const terminalCode = screen.getByTestId("terminal-code");
    const content = terminalCode.textContent;

    // Check that commands appear in the correct order
    const installIndex = content?.indexOf("npm install andrewck24");
    const cdIndex = content?.indexOf("cd andrewck24");
    const buildIndex = content?.indexOf("npm run build");
    const startIndex = content?.indexOf("npm start");

    expect(installIndex).toBeLessThan(cdIndex!);
    expect(cdIndex).toBeLessThan(buildIndex!);
    expect(buildIndex).toBeLessThan(startIndex!);
  });

  it("shows server startup messages", () => {
    render(<TerminalAnimation />);

    const terminalCode = screen.getByTestId("terminal-code");

    expect(terminalCode).toHaveTextContent("Starting server...");
    expect(terminalCode).toHaveTextContent(
      "Server started at http://localhost:3000"
    );
    expect(terminalCode).toHaveTextContent(
      "AT runtime, where our ideas execute"
    );
  });
});
