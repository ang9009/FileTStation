import { z } from "zod";

const GuildQueryParamsSchema = z.object({
  guildId: z.string({
    invalid_type_error: "guildId must be a string",
    required_error: "guildId is required",
  }),
});

type GuildQueryParams = z.infer<typeof GuildQueryParamsSchema>;

export { GuildQueryParams, GuildQueryParamsSchema };
