import axios from "axios";
import { getValidatedPSData } from "../../api/photostation/session/getValidatedPSData.js";
import { getPSApiUrlForRoute } from "../../api/photostation/utils/getPSApiUrlForRoute.js";
import { PSApiRoutes } from "../api/PSApiRoutes.js";
import { AttachmentUploadData } from "./attachmentUploadData.js";
import { People } from "./people.js";
import { SupportedPhotoType } from "./supportedPhotoType.js";

/**
 * Data for a photo to be uploaded.
 */
export class PhotoUploadData extends AttachmentUploadData {
  /**
   * Constructor for a PhotoUploadData object.
   * @param file the file to be uploaded. This file's name should be the
   * Attachment object's id and its file extension
   * @param id the id of the attachment
   * @param people the people in the photo
   * @param contentType the type of the content
   */
  public constructor(file: File, id: string, people: People[], contentType: SupportedPhotoType) {
    super(file, id, people, contentType);
  }

  /**
   * Uploads this photo to PhotoStation.
   * @param folderPath the folder the photo will be saved to
   */
  public upload = async (folderPath: string) => {
    // !Warning: this does not check if the session ID is stale. Figure out a more
    // elegant way to check.
    const sessionId = global.localStorage.getItem("sessionId");
    if (!sessionId) {
      throw new Error("Failed to upload photo: session ID is null");
    }

    const headers = {
      Cookie: `PHPSESSID=${sessionId}`,
    };
    const params = {
      method: "uploadphoto",
      version: "1",
      dest_folder_path: folderPath,
      mtime: Date.now(),
      filename: this.file.name,
      duplicate: "overwrite",
    };
    const url = getPSApiUrlForRoute(PSApiRoutes.File);

    // The PhotoStation6 API requires data to be sent as forms
    const photoFormData = new FormData();
    photoFormData.append("original", this.file);
    try {
      const res = await axios.post(url, photoFormData, { withCredentials: true, headers, params });

      const data = getValidatedPSData(res);
      console.log(res);
    } catch (error) {
      throw new Error(`An error occurred while trying to upload a photo to PhotoStation: ${error}`);
    }
  };
}
