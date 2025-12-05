/**
 * Mock for fumadocs-mdx/config
 * 根據 fumadocs-mdx 14.x 的 frontmatterSchema 定義
 * 加入 title 和 description 的驗證規則以符合測試需求
 */
import { z } from "zod";

export const frontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200).optional(),
  icon: z.string().optional(),
  full: z.boolean().optional(),
  _openapi: z.any().optional(),
});
