import { AllowedMimeType } from "./allowedMimeType.ts";

export const mimetypeToExtension: Record<AllowedMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
