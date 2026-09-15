import z from "../../util/zod.config.js";

const sanityImageSchema = z.object({
  asset: z.object({
    url: z.url().openapi({ example: "https://cdn.sanity.io/.../image.jpg" }),
  }),
});

const speakerSchema = z
  .object({
    name: z.string().openapi({ example: "Alice Johnson" }),
    title: z.string().openapi({ example: "Senior Engineer" }),
    photo: sanityImageSchema.optional(),
  })
  .openapi("Speaker");

const venueDetailsSchema = z
  .object({
    mapLink: z.url().optional().openapi({
      example: "https://maps.google.com/?q=Faculty+of+Engineering",
    }),
    note: z.string().max(255).optional().openapi({
      example: "Enter from Gate 3, Room B201",
    }),
  })
  .openapi("VenueDetails");

export const sanityEventSummarySchema = z
  .object({
    _id: z.uuid().openapi({ example: "189bc292-e41b-42a0-91b5-bfaa33a34af2" }),
    title: z.string().openapi({ example: "Introduction to Cloud Computing" }),
    slug: z.object({
      current: z.string().openapi({ example: "intro-to-cloud-computing" }),
    }),
    startDate: z.string().openapi({ example: "2026-07-05T10:00:00Z" }),
    endDate: z.string().openapi({ example: "2026-07-05T12:00:00Z" }),
    location: z
      .enum(["online", "offline", "hybrid"])
      .optional()
      .openapi({ example: "offline" }),
    venueDetails: venueDetailsSchema
      .optional()
      .nullable()
      .openapi({ description: "Physical venue details (offline/hybrid events only)" }),
    subtitle: z
      .string()
      .optional()
      .openapi({ example: "A beginner friendly session." }),
    registrationLink: z
      .url()
      .optional()
      .openapi({ example: "https://forms.gle/..." }),
    formSlug: z
      .string()
      .optional()
      .openapi({ example: "ieee-spring-2026" }),
    orderNum: z.number().optional().openapi({ example: 1 }),
    coverImage: sanityImageSchema.optional(),
  })
  .openapi("SanityEventSummary");

export const sanityEventSchema = sanityEventSummarySchema
  .extend({
    speakers: z.array(speakerSchema).optional(),
    memories: z.array(z.object({ photo: sanityImageSchema })).optional(),
  })
  .openapi("SanityEvent");

/**
 * Validates the :id path parameter for GET /events/:id.
 */
export const eventIdSchema = z.object({
  id: z.uuid().openapi({
    description: "Sanity document _id (UUID format)",
    example: "189bc292-e41b-42a0-91b5-bfaa33a34af2",
  }),
});

export type EventId = z.infer<typeof eventIdSchema>;

/**
 * Validates the :slug path parameter for GET /events/slug/:slug.
 * Matches Sanity `slug.current` (kebab-case, e.g. "intro-to-robotics").
 */
export const eventSlugSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(200).openapi({
    description: "Sanity event slug (slug.current)",
    example: "intro-to-robotics",
  }),
});

export type EventSlug = z.infer<typeof eventSlugSchema>;
