import { about, meta, notes, projects, projectsMeta } from "@/.source";
import { i18n } from "@/lib/i18n";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const notesSource = loader({
  baseUrl: "/notes",
  source: createMDXSource(notes, meta),
  i18n,
});

export const aboutSource = loader({
  baseUrl: "/about",
  source: createMDXSource(about),
  i18n,
});

export const projectsSource = loader({
  baseUrl: "/projects",
  source: createMDXSource(projects, projectsMeta),
  i18n,
});
