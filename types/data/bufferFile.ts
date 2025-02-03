import { AllowedMimeType } from "../../data/allowedMimeType";

export interface BufferFile {
  buffer: ArrayBuffer;
  discordId: string;
  mimetype: AllowedMimeType;
  fileLink?: string;
}
