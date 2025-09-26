"use client";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

export function TerminalAnimation() {
  const terminalCode = `user@portfolio:~$ npm install andrewck24
user@portfolio:~$ cd andrewck24
user@portfolio:~/andrewck24$ npm run build
user@portfolio:~/andrewck24$ npm start

> Starting server...
> Server started at http://localhost:3000
> AT runtime, where our ideas executed`;

  return (
    <div
      data-testid="terminal-animation"
      className="border-border bg-background/50 grid min-h-[300px] w-full overflow-hidden rounded-lg border bg-gradient-to-r from-purple-400/20 via-pink-500/20 to-red-500/20 p-2 shadow-lg backdrop-blur-md lg:h-full lg:p-4"
    >
      <DynamicCodeBlock
        lang="bash"
        code={terminalCode}
        codeblock={{ className: "bg-background/65 rounded-md border-none" }}
      />
    </div>
  );
}
