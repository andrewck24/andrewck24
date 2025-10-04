import { meta, notes } from "@/.source";
import { i18n } from "@/lib/i18n";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const notesSource = loader({
  baseUrl: "/notes",
  source: createMDXSource(notes, meta),
  i18n,
});
