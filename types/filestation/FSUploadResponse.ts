import { z } from "zod";

// The shape of the response from FileStation
export const FSUploadResponseSchema = z.discriminatedUnion("success", [
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

export type FSUploadResponse = z.infer<typeof FSUploadResponseSchema>;
