import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const { docs: notes, meta } = defineDocs({
  dir: "content/notes",
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const { docs: about } = defineDocs({
  dir: "content/about",
  docs: {
    schema: frontmatterSchema,
  },
});

// Projects collection with featured and order fields
export const { docs: projects, meta: projectsMeta } = defineDocs({
  dir: "content/projects",
  docs: {
    schema: frontmatterSchema.extend({
      featured: z.boolean().optional().default(false),
      order: z.number().int().min(1).max(99).optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {},
});
