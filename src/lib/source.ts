import { about, notes, projects } from "@/.source";
import { i18n } from "@/lib/i18n";
import { loader } from "fumadocs-core/source";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const notesSource = loader({
  baseUrl: "/notes",
  source: notes.toFumadocsSource(),
  i18n,
});

export const aboutSource = loader({
  baseUrl: "/about",
  source: about.toFumadocsSource(),
  i18n,
});

export const projectsSource = loader({
  baseUrl: "/projects",
  source: projects.toFumadocsSource(),
  i18n,
});
