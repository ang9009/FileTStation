import { z } from "zod";

export const IsSubscribedQueryParamsSchema = z.object({
  channelId: z.string({
    invalid_type_error: "channelId must be a string",
    required_error: "channelId is required",
  }),
});

export type IsSubscribedQueryParams = z.infer<typeof IsSubscribedQueryParamsSchema>;
