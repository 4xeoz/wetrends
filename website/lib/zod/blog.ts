import { z } from "zod";

// MongoDB ObjectId is a 24-character hex string
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const httpsUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), "URL must use HTTPS");

const generatedHtmlSchema = z
  .string()
  .min(200, "Content is too short")
  .max(120_000, "Content is too long")
  .superRefine((value, context) => {
    const forbidden = [
      /<\/?(?:script|style|iframe|object|embed|form|input|button|svg|math|img|video|audio|source)\b/i,
      /\son[a-z]+\s*=/i,
      /\s(?:style|srcdoc)\s*=/i,
      /(?:href|src)\s*=\s*["']\s*(?:javascript|data|vbscript):/i,
    ];
    if (forbidden.some((pattern) => pattern.test(value))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Content contains unsafe HTML",
      });
    }
  });

export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(80),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, hyphenated, and URL-safe"
    ),
  excerpt: z.string().min(1, "Excerpt is required").max(200),
  content: generatedHtmlSchema,
  featuredImage: httpsUrlSchema.optional(),
  featuredImageAlt: z.string().trim().min(5).max(200).optional(),
  featuredImageKind: z.enum(["ai_supporting", "portfolio", "editorial"]).optional(),
  featuredImageCredit: z.string().trim().max(200).optional(),
  published: z.boolean().optional().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(155).optional(),
  keywords: z.array(z.string().trim().min(1).max(80)).max(10).optional(),
  campaign: z.enum(["events", "photoshoots", "agency"]).optional(),
  contentType: z.enum(["commercial", "case_study", "guide", "comparison", "answer"]).optional(),
  primaryServiceUrl: httpsUrlSchema
    .refine((value) => value.startsWith("https://wetrends.co.uk/"), "Service URL must be on wetrends.co.uk")
    .optional(),
  sourceUrls: z.array(httpsUrlSchema).max(12).optional(),
  automationStatus: z
    .enum(["drafted", "quality_blocked", "review_ready", "approved", "rejected", "published"])
    .optional(),
  automationRunId: z.string().trim().max(100).optional(),
  qualityScore: z.number().int().min(0).max(100).optional(),
  categoryId: objectIdSchema.optional(),
  authorId: objectIdSchema.optional(),
});

export const updateBlogPostSchema = createBlogPostSchema
  .partial()
  .omit({ authorId: true })
  .extend({
    authorId: objectIdSchema.optional(),
    published: z.boolean().optional(),
  });

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
