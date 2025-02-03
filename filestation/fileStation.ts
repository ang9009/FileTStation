import axios from "axios";
import { z } from "zod";
import { BufferFile } from "../types/data/bufferFile";
import { FSUploadResponse, FSUploadResponseSchema } from "../types/filestation/FSUploadResponse";
import { FSShareLinkResponseSchema } from "../types/response-schemas/FSShareLinkResponse";
import { getApiClient } from "./axios";
import { FileStationCredentials } from "./fileStationCredentials";
import { getExtensionFromMimetype } from "./getExtensionFromMimetype";

/**
 * An API for interacting with FileStation.
 */
export class FileStation {
  /**
   * Uploads the given files to FileStation.
   * @param files the files to be uploaded
   * @param rootFolderPath the path to the folder where the file should be uploaded
   * from the root
   */
  public static uploadFilesToFS = async (files: BufferFile[], rootFolderPath: string) => {
    for (const file of files) {
      const res = await this.uploadFile(file, rootFolderPath);
      if (!res.success) {
        throw Error("Failed to upload file to FileStation: " + res);
      }
    }
  };

  /**
   * Uploads a singular file to FileStation.
   * @param file the file to be uploaded
   * @param rootFolderPath the path to the folder where the file should be uploaded
   * from the root
   * @returns FileStation's response to the upload
   */
  private static async uploadFile(
    file: BufferFile,
    rootFolderPath: string
  ): Promise<FSUploadResponse> {
    const { FS_API_URL } = process.env;
    const { sessionId, synoToken } = await FileStationCredentials.getInstance();

    // Set up url and headers
    const url = `${FS_API_URL}/webman/modules/FileBrowser/webfm/webUI/html5_upload.cgi`;
    const headers = {
      Cookie: `stay-login=1; id=${sessionId}`,
      "X-SYNO-TOKEN": synoToken,
    };

    // Set up form data
    const form = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    form.append("overwrite", "false");
    form.append("path", rootFolderPath);
    const extension = getExtensionFromMimetype(file.mimetype);
    form.append("file", blob, `${file.discordId}.${extension}`);

    const res = await axios.post(url, form, { headers: headers });
    const parsedRes = FSUploadResponseSchema.safeParse(res.data);
    if (!parsedRes.success) {
      throw Error("Got unexpected response from file upload: " + JSON.stringify(res.data));
    }

    return parsedRes.data;
  }

  /**
   * Retrieves a file from FileStation. The name of the file must follow the
   * format discordId.extension.
   * @param fileName the name of the file
   * @param rootFolderPath the path to the folder where the file should be uploaded
   * from the root. This path must be formatted like so: /folder/subfolder.
   * @returns the desired file
   */
  public static getFileFromFS = async (
    fileName: string,
    rootFolderPath: string
  ): Promise<Buffer> => {
    const apiClient = await getApiClient();

    const url = await FileStation.getFSFileSharingLink(fileName, rootFolderPath);
    const res = await apiClient.get(url, { responseType: "arraybuffer" });
    const parseRes = z.instanceof(Buffer).safeParse(res.data);
    if (!parseRes.success) {
      throw Error("Unexpected response from FileStation: " + res.data);
    }
    return parseRes.data;
  };

  /**
   * Retrieves a temporary file sharing link for the file with the given name
   * from FileStation.
   * @param fileName the name of the file (must follow the format discordId.extension.)
   * @param rootFolderPath the path to the folder where the file should be uploaded
   * from the root. This path must be formatted like so: /folder/subfolder.
   * @returns the file sharing link for the specified file
   */
  private static getFSFileSharingLink = async (fileName: string, rootFolderPath: string) => {
    const { FS_API_URL } = process.env;
    const url = `${FS_API_URL}/webapi/FileStation/file_sharing.cgi`;
    const data = new URLSearchParams({
      path: `${rootFolderPath}/${fileName}`,
      api: "SYNO.FileStation.Sharing",
      method: "create",
      version: "1",
    });

    const apiClient = await getApiClient();
    const res = await apiClient.post(url, data.toString());
    const parseRes = FSShareLinkResponseSchema.safeParse(res.data);
    if (!parseRes.success) {
      throw Error(
        "Failed to parse response to file sharing link request: " + JSON.stringify(res.data)
      );
    }

    const { links } = parseRes.data.data;
    return links[0].url;
  };
}
