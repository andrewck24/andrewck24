import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const notes = defineDocs({
  dir: "content/notes",
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const about = defineDocs({
  dir: "content/about",
  docs: {
    schema: frontmatterSchema,
  },
});

// Projects collection with featured and order fields
export const projects = defineDocs({
  dir: "content/projects",
  docs: {
    schema: frontmatterSchema.extend({
      // Image type selector
      imageType: z.enum(["static", "generated"]).default("static"),

      // Static image path (for imageType: "static")
      image: z
        .string()
        .regex(
          /^\/images\/projects\/hero\/(zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
          "圖片路徑格式: /images/projects/hero/{locale}/*.{jpg|jpeg|png|webp|avif}"
        )
        .optional(),

      // Generated OG Image config (for imageType: "generated")
      ogImage: z
        .object({
          text: z.string().optional(),
          background: z
            .string()
            .regex(
              /^\/images\/projects\/og-backgrounds\/(common|zh-TW|en|ja)\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i,
              "背景圖路徑格式: /images/projects/og-backgrounds/{common|locale}/*.{jpg|jpeg|png|webp|avif}"
            )
            .optional(),
          className: z.string().optional(),
        })
        .optional(),

      date: z
        .union([
          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式: YYYY-MM-DD"),
          z.date(),
        ])
        .transform((val) => {
          if (val instanceof Date) {
            return val.toISOString().split("T")[0];
          }
          return val;
        }),
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
