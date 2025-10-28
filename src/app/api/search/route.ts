import { notesSource } from "@/lib/source";
import { stopwords as japaneseStopwords } from "@orama/stopwords/japanese";
import { stopwords as mandarinStopwords } from "@orama/stopwords/mandarin";
import { createTokenizer as createJapaneseTokenizer } from "@orama/tokenizers/japanese";
import { createTokenizer as createMandarinTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";

/**
 * T015: Orama search with tag support
 *
 * Note: Tags from frontmatter are automatically indexed by Fumadocs
 * The tag-utils.ts functions can be used for tag filtering in UI components
 */
export const { GET } = createFromSource(notesSource, {
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
});
