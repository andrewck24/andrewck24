import { DynamicIcon } from "@/app/icon";
import { i18n } from "@/lib/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(locale: string): BaseLayoutProps {
  const getAboutText = () => {
    switch (locale) {
      case "zh-TW":
        return "關於";
      case "ja":
        return "私について";
      default:
        return "About";
    }
  };

  // const getNotesText = () => {
  //   switch (locale) {
  //     case "zh-TW":
  //       return "筆記";
  //     case "ja":
  //       return "ノート";
  //     default:
  //       return "Notes";
  //   }
  // };

  const getProjectsText = () => {
    switch (locale) {
      case "zh-TW":
        return "專案";
      case "ja":
        return "プロジェクト";
      default:
        return "Projects";
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
    searchToggle: { enabled: false },
    links: [
      {
        type: "main",
        text: getProjectsText(),
        url: `/${locale}/projects`,
      },
      // {
      //   type: "main",
      //   text: getNotesText(),
      //   url: `/${locale}/notes`,
      // },
      {
        type: "main",
        text: getAboutText(),
        url: `/${locale}/about`,
      },
    ],
  };
}
