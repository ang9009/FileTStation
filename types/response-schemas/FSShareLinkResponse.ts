import { z } from "zod";

// The shape of the response when requesting a temoprary file share link from FileStation.
export const FSShareLinkResponseSchema = z.object({
  data: z.object({
    links: z.array(
      z.object({
        url: z.string(),
      })
    ),
  }),
});

export type FSShareLinkResponse = z.infer<typeof FSShareLinkResponseSchema>;
