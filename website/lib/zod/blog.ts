import { z } from "zod";

// MongoDB ObjectId is a 24-character hex string
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, hyphenated, and URL-safe"
    ),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url("Featured image must be a valid URL").optional(),
  published: z.boolean().optional().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  categoryId: objectIdSchema.optional(),
  authorId: objectIdSchema.optional(),
});

export const updateBlogPostSchema = createBlogPostSchema
  .partial()
  .omit({ authorId: true })
  .extend({
    authorId: objectIdSchema.optional(),
  });

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
