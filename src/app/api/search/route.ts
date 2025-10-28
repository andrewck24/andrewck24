import { notesSource, projectsSource } from "@/lib/source";
import { tagsToOramaFormat } from "@/lib/tag-utils";
import { stopwords as japaneseStopwords } from "@orama/stopwords/japanese";
import { stopwords as mandarinStopwords } from "@orama/stopwords/mandarin";
import { createTokenizer as createJapaneseTokenizer } from "@orama/tokenizers/japanese";
import { createTokenizer as createMandarinTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";
import { type Page } from "fumadocs-core/source";

/**
 * T015: Orama buildIndex with tag extraction
 *
 * Extract tags from page metadata and add to search index
 */
export const { GET } = createFromSource(
  [notesSource, projectsSource], // Include both sources
  {
    localeMap: {
      en: { language: "english" },
      "zh-TW": {
        components: {
          tokenizer: createMandarinTokenizer({
            stopWords: mandarinStopwords,
            language: "mandarin",
          }),
        },
        search: {
          threshold: 0,
          tolerance: 0,
        },
      },
      ja: {
        components: {
          tokenizer: createJapaneseTokenizer({
            stopWords: japaneseStopwords,
            language: "japanese",
          }),
        },
        search: {
          threshold: 0,
          tolerance: 0,
        },
      },
    },
    /**
     * Build index with tags extraction
     * @see specs/004-mdx-frontmatter-1/contracts/tag-system.ts
     */
    buildIndex(page: Page) {
      // Extract tags from frontmatter
      const tags = (page.data as { tags?: string[] }).tags || [];

      // Convert tags to Orama format
      const { tag, tags: tagsString } = tagsToOramaFormat(tags);

      return {
        title: page.data.title,
        description: page.data.description || "",
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        // Tag fields for filtering
        tag, // Primary tag (first tag or 'uncategorized')
        tags: tagsString, // All tags as comma-separated string
      };
    },
  }
);
