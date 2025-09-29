import { DynamicIcon } from "@/app/icon";
import { i18n } from "@/lib/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(locale: string): BaseLayoutProps {
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
      title: <DynamicIcon />,
      url: `/${locale}`,
      transparentMode: "top",
    },
    githubUrl: "https://github.com/andrewck24",
    links: [
      {
        type: "main",
        text: getDocsText(),
        url: `/${locale}/docs`,
      },
    ],
  };
}
