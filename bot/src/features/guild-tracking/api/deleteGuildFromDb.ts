import axios from "axios";
import { DbApiRoutes } from "../../../data/dbApiRoutes";
import { getDbApiUrl } from "../../../utils/getDbApiUrl";

/**
 * Deletes the given guild id from the database.
 * @param guildId the guild id to be deleted
 */
export const deleteGuildFromDb = async (guildId: string) => {
  const url = getDbApiUrl(DbApiRoutes.GUILDS);

  try {
    await axios.delete(`${url}/${guildId}`);
  } catch (err) {
    console.log("Failed to delete guildId");
  }
};
