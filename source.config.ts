import { noteArticleSchema, projectArticleSchema } from "@/types/article";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";

// ============================================================================
// Collection Definitions
// (Schemas 定義於 src/types/article.ts)
// ============================================================================

// About collection (unchanged)
export const about = defineDocs({
  dir: "content/about",
  docs: {
    schema: frontmatterSchema,
  },
});

// Projects collection with unified schema
export const projects = defineDocs({
  dir: "content/projects",
  docs: {
    schema: projectArticleSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// Notes collection with unified schema
export const notes = defineDocs({
  dir: "content/notes",
  docs: {
    schema: noteArticleSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      lazy: true,
      langs: ["ts", "js", "html", "tsx", "mdx"],
      inline: "tailing-curly-colon",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
