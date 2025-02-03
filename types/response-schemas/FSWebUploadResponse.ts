import { z } from "zod";

// The shape of the response when uploading via FileStation's webman route.
export const FSWebUploadResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    errno: z.object({
      key: z.string(),
    }),
  }),
]);
export type FSWebUploadResponse = z.infer<typeof FSWebUploadResponseSchema>;
