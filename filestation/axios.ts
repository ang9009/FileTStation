import axios from "axios";
import { FileStationCredentials } from "./fileStationCredentials";

/**
 * Returns an Axios client that has the cookie and syno token headers.
 * @returns the Axios client
 */
export const getApiClient = async () => {
  const { sessionId, synoToken } = await FileStationCredentials.getInstance();
  const { FS_API_URL } = process.env;

  const headers = {
    Cookie: `stay-login=1; id=${sessionId}`,
    "X-SYNO-TOKEN": synoToken,
    Origin: FS_API_URL,
  };
  return axios.create({ headers });
};
