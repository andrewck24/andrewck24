import { i18n } from "@/lib/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(locale: string): BaseLayoutProps {
  const getTitle = () => {
    switch (locale) {
      case "zh-TW":
        return "我的應用程式";
      case "ja":
        return "私のアプリ";
      default:
        return "My App";
    }
  };

  const getDocsText = () => {
    switch (locale) {
      case "zh-TW":
        return "文檔";
      case "ja":
        return "ドキュメント";
      default:
        return "Documentation";
    }
  };

  return {
    i18n,
    nav: {
      title: (
        <>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logo"
          >
            <circle cx={12} cy={12} r={12} fill="currentColor" />
          </svg>
          {getTitle()}
        </>
      ),
      url: `/${locale}`,
    },
    githubUrl: "https://github.com",
    links: [
      {
        type: "main",
        text: getDocsText(),
        url: `/${locale}/docs`,
      },
    ],
  };
}
