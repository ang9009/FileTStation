import { z } from "zod";
const AlbumNameQueryParamSchema = z.object({
    albumName: z.string({
        invalid_type_error: "albumName must be a string",
        required_error: "albumName is required",
    }),
});
export { AlbumNameQueryParamSchema };
