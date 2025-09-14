import { source } from "@/lib/source";
import { stopwords as japaneseStopwords } from "@orama/stopwords/japanese";
import { stopwords as mandarinStopwords } from "@orama/stopwords/mandarin";
import { createTokenizer as createJapaneseTokenizer } from "@orama/tokenizers/japanese";
import { createTokenizer as createMandarinTokenizer } from "@orama/tokenizers/mandarin";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source, {
  localeMap: {
    en: { language: "english" },
    "zh-tw": {
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
