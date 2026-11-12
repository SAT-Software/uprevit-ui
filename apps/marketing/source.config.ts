import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.iso.date(),
    author: z.string(),
    category: z.string(),
    cover: z.string(),
  }),
});

export default defineConfig();
