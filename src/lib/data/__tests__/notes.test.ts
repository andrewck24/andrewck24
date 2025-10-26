/**
 * Notes Data Layer Tests
 *
 * 測試 notes data layer 函式的行為
 * Tests: T032-T034 (TDD Red Phase)
 */

import { getAllNotes, getFeaturedNotes, getNote } from "@/lib/data/notes";
import { notesSource } from "@/lib/source";

// Mock notesSource
jest.mock("../../source", () => ({
  notesSource: {
    getPages: jest.fn(),
    getPage: jest.fn(),
    generateParams: jest.fn(),
  },
}));

describe("Notes Data Layer", () => {
  describe("T032: getFeaturedNotes()", () => {
    it("should return featured notes only", async () => {
      // Mock data
      (notesSource.getPages as jest.Mock).mockReturnValue([
        {
          slugs: ["note-1"],
          url: "/zh-TW/notes/note-1",
          data: {
            title: "Featured Note 1",
            description: "Description 1",
            date: "2025-01-01",
            featured: true,
            tags: ["tag1"],
            category: "frontend" as const,
          },
        },
        {
          slugs: ["note-2"],
          url: "/zh-TW/notes/note-2",
          data: {
            title: "Regular Note",
            description: "Description 2",
            date: "2025-01-02",
            featured: false,
          },
        },
        {
          slugs: ["note-3"],
          url: "/zh-TW/notes/note-3",
          data: {
            title: "Featured Note 2",
            description: "Description 3",
            date: "2025-01-03",
            featured: true,
            category: "backend" as const,
          },
        },
      ] as unknown);

      const result = await getFeaturedNotes("zh-TW");

      expect(result).toHaveLength(2);
      expect(result[0].featured).toBe(true);
      expect(result[0].title).toBe("Featured Note 1");
      expect(result[1].featured).toBe(true);
      expect(result[1].title).toBe("Featured Note 2");
    });

    it("should limit to maximum 5 featured notes", async () => {
      // Mock 7 featured notes
      const mockNotes = Array.from({ length: 7 }, (_, i) => ({
        slugs: [`note-${i}`],
        url: `/zh-TW/notes/note-${i}`,
        data: {
          title: `Featured Note ${i}`,
          description: `Description ${i}`,
          date: "2025-01-01",
          featured: true,
        },
      }));

      (notesSource.getPages as jest.Mock).mockReturnValue(mockNotes as unknown);

      const result = await getFeaturedNotes("zh-TW");

      expect(result).toHaveLength(5);
    });

    it("should return empty array when no featured notes", async () => {
      (notesSource.getPages as jest.Mock).mockReturnValue([
        {
          slugs: ["note-1"],
          url: "/zh-TW/notes/note-1",
          data: {
            title: "Regular Note",
            description: "Description",
            date: "2025-01-01",
            featured: false,
          },
        },
      ] as unknown);

      const result = await getFeaturedNotes("zh-TW");

      expect(result).toHaveLength(0);
    });

    it("should include all NoteMetadata fields", async () => {
      (notesSource.getPages as jest.Mock).mockReturnValue([
        {
          slugs: ["note-1"],
          url: "/zh-TW/notes/note-1",
          data: {
            title: "Featured Note",
            description: "Description",
            imageType: "generated" as const,
            ogImage: {
              icon: "/images/test.png",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
            date: "2025-01-01",
            featured: true,
            tags: ["tag1", "tag2"],
            category: "frontend" as const,
          },
        },
      ] as unknown);

      const result = await getFeaturedNotes("zh-TW");

      expect(result[0]).toMatchObject({
        title: "Featured Note",
        description: "Description",
        slug: "note-1",
        locale: "zh-TW",
        url: "/zh-TW/notes/note-1",
        imageType: "generated",
        ogImage: {
          icon: "/images/test.png",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        date: "2025-01-01",
        featured: true,
        tags: ["tag1", "tag2"],
        category: "frontend",
      });
    });
  });

  describe("T033: getNote()", () => {
    it("should return note page data when note exists", async () => {
      const MockContent = () => null;

      (notesSource.getPage as jest.Mock).mockReturnValue({
        slugs: ["test-note"],
        url: "/zh-TW/notes/test-note",
        data: {
          title: "Test Note",
          description: "Test Description",
          date: "2025-01-01",
          featured: true,
          tags: ["react", "typescript"],
          category: "frontend" as const,
          body: MockContent,
        },
      } as unknown);

      const result = await getNote("zh-TW", "test-note");

      expect(result).not.toBeNull();
      expect(result?.title).toBe("Test Note");
      expect(result?.slug).toBe("test-note");
      expect(result?.locale).toBe("zh-TW");
      expect(result?.content).toBe(MockContent);
      expect(result?.tags).toEqual(["react", "typescript"]);
      expect(result?.category).toBe("frontend");
    });

    it("should return null when note does not exist", async () => {
      (notesSource.getPage as jest.Mock).mockReturnValue(undefined);

      const result = await getNote("zh-TW", "non-existent");

      expect(result).toBeNull();
    });

    it("should handle notes with minimal frontmatter", async () => {
      const MockContent = () => null;

      (notesSource.getPage as jest.Mock).mockReturnValue({
        slugs: ["minimal-note"],
        url: "/en/notes/minimal-note",
        data: {
          title: "Minimal Note",
          description: "Minimal Description",
          date: "2025-01-01",
          body: MockContent,
        },
      } as unknown);

      const result = await getNote("en", "minimal-note");

      expect(result).not.toBeNull();
      expect(result?.title).toBe("Minimal Note");
      expect(result?.tags).toBeUndefined();
      expect(result?.category).toBeUndefined();
      expect(result?.featured).toBeUndefined();
    });

    it("should handle notes with OG image configuration", async () => {
      const MockContent = () => null;

      (notesSource.getPage as jest.Mock).mockReturnValue({
        slugs: ["og-note"],
        url: "/ja/notes/og-note",
        data: {
          title: "OG Note",
          description: "OG Description",
          date: "2025-01-01",
          imageType: "generated" as const,
          ogImage: {
            icon: "/images/test.png",
            background: "#667eea",
            className: "custom-class",
          },
          body: MockContent,
        },
      } as unknown);

      const result = await getNote("ja", "og-note");

      expect(result?.imageType).toBe("generated");
      expect(result?.ogImage).toEqual({
        icon: "/images/test.png",
        background: "#667eea",
        className: "custom-class",
      });
    });
  });

  describe("T034: getAllNotes()", () => {
    it("should return all notes for given locale", async () => {
      (notesSource.getPages as jest.Mock).mockReturnValue([
        {
          slugs: ["note-1"],
          url: "/zh-TW/notes/note-1",
          data: {
            title: "Note 1",
            description: "Description 1",
            date: "2025-01-01",
          },
        },
        {
          slugs: ["note-2"],
          url: "/zh-TW/notes/note-2",
          data: {
            title: "Note 2",
            description: "Description 2",
            date: "2025-01-02",
          },
        },
        {
          slugs: ["note-3"],
          url: "/zh-TW/notes/note-3",
          data: {
            title: "Note 3",
            description: "Description 3",
            date: "2025-01-03",
          },
        },
      ] as unknown);

      const result = await getAllNotes("zh-TW");

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe("Note 1");
      expect(result[1].title).toBe("Note 2");
      expect(result[2].title).toBe("Note 3");
    });

    it("should return empty array when no notes exist", async () => {
      (notesSource.getPages as jest.Mock).mockReturnValue([]);

      const result = await getAllNotes("en");

      expect(result).toHaveLength(0);
    });

    it("should include all metadata fields", async () => {
      (notesSource.getPages as jest.Mock).mockReturnValue([
        {
          slugs: ["complete-note"],
          url: "/ja/notes/complete-note",
          data: {
            title: "Complete Note",
            description: "Complete Description",
            imageType: "static" as const,
            image: "/images/note.jpg",
            date: "2025-01-01",
            featured: true,
            tags: ["tag1", "tag2", "tag3"],
            category: "testing" as const,
          },
        },
      ] as unknown);

      const result = await getAllNotes("ja");

      expect(result[0]).toMatchObject({
        title: "Complete Note",
        description: "Complete Description",
        slug: "complete-note",
        locale: "ja",
        url: "/ja/notes/complete-note",
        imageType: "static",
        image: "/images/note.jpg",
        date: "2025-01-01",
        featured: true,
        tags: ["tag1", "tag2", "tag3"],
        category: "testing",
      });
    });

    it("should maintain order from fumadocs source", async () => {
      (notesSource.getPages as jest.Mock).mockReturnValue([
        {
          slugs: ["first"],
          url: "/en/notes/first",
          data: { title: "First", description: "Desc", date: "2025-01-01" },
        },
        {
          slugs: ["second"],
          url: "/en/notes/second",
          data: { title: "Second", description: "Desc", date: "2025-01-02" },
        },
        {
          slugs: ["third"],
          url: "/en/notes/third",
          data: { title: "Third", description: "Desc", date: "2025-01-03" },
        },
      ] as unknown);

      const result = await getAllNotes("en");

      expect(result.map((n) => n.slug)).toEqual(["first", "second", "third"]);
    });
  });
});
