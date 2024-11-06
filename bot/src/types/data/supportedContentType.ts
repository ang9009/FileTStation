import { FileExtension } from "./fileExtension";
import { MimeType } from "./mimeType";

/**
 * Represents the content types that polaroids recognizes. For further extension,
 * look up common MIME types, and cross reference them with FileStation
 * supported types.
 */
export abstract class SupportedContentType {
  public readonly extension: FileExtension;
  public readonly mimeType: MimeType;

  /**
   * The constructor for a SupportedContentType.
   * @param extension the content type's extension
   * @param mimeType the MIME type of the content type
   */
  protected constructor(extension: FileExtension, mimeType: MimeType) {
    this.extension = extension;
    this.mimeType = mimeType;
  }
}
