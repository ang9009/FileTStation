import { AllowedMimeType } from "../data/allowedMimeType.ts";
import { mimetypeToExtension } from "../data/mimetypeToExtension";

/**
 * Returns the associated extension of the given MIME type.
 * @param mimeType the MIME type in question
 * @returns the corresponding extension
 */
export const getExtensionFromMimetype = (mimeType: AllowedMimeType) => {
  if (mimetypeToExtension[mimeType]) {
    return mimetypeToExtension[mimeType];
  }
  throw Error("Unrecognized MIME type " + mimeType);
};
