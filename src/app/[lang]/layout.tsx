import "@/app/globals.css";
import { i18n } from "@/lib/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

const { provider } = defineI18nUI(i18n, {
  translations: {
    "zh-TW": {
      displayName: "繁體中文",
      search: "搜尋",
    },
    en: {
      displayName: "English",
      search: "Search",
    },
    ja: {
      displayName: "日本語",
      search: "検索",
    },
  },
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    "zh-TW": "曾立維 - 全端工程師",
    en: "Andrew Tseng - Full-stack Developer",
    ja: "アンドリュー・ツェン - フルスタック開発者",
  };

  const descriptions = {
    "zh-TW":
      "專精於 React、Node.js 和現代網頁技術的全端開發工程師。個人作品集與技術部落格。",
    en: "Full-stack developer specializing in React, Node.js, and modern web technologies. Portfolio and technical blog.",
    ja: "React、Node.js、モダンウェブ技術を専門とするフルスタック開発者。ポートフォリオと技術ブログ。",
  };

  const title = titles[lang as keyof typeof titles] || titles["zh-TW"];
  const description =
    descriptions[lang as keyof typeof descriptions] || descriptions["zh-TW"];

  return {
    metadataBase: new URL("https://andrewck24.vercel.app"),
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    keywords: [
      "Full-stack Developer",
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "Front-end Development",
      "Portfolio",
      "Taiwan",
    ],
    authors: [{ name: "Andrew Tseng", url: "https://andrewck24.vercel.app" }],
    creator: "Andrew Tseng",
    openGraph: {
      type: "website",
      locale: lang === "zh-TW" ? "zh_TW" : lang === "ja" ? "ja_JP" : "en_US",
      title,
      description,
      siteName: title,
      url: "https://andrewck24.vercel.app",
      images: [
        {
          url: "/images/profile/avatar.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@andrewck24",
      images: ["/images/profile/avatar.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateStaticParams() {
  return i18n.languages.map((language) => ({
    lang: language,
  }));
}

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}
