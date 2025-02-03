import { z } from "zod";

export const FSResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.any(),
  }),
  z.object({
    success: z.literal(false),
    error: z.object({
      code: z.number(),
    }),
  }),
]);

export type FSResponse = z.infer<typeof FSResponseSchema>;
