import {
  CacheType,
  ChatInputCommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { AlbumSelectionType } from "../data/albumSelectionType";
import { AlbumSelectionData } from "../data/finalAlbumSelection";
import { getCreateAlbumModal } from "./getCreateAlbumModal";
import { showAlbumDropdown } from "./showAlbumDropdown";

/**
 * Deals with user interactions with the album dropdown. If the user wants to
 * create a new album, this opens a modal where the user can fill in the album's
 * details. Otherwise, this sets the album this channel is linked to to the newly
 * specified album.
 * @param interaction the ongoing command interaction
 * @param message the message shown above the dropdown
 * @param onSelectionComplete a callback function that is called when the user
 *        finishes selecting/creating the desired album
 */
export const startAlbumDropdownInteraction = async (
  interaction: ChatInputCommandInteraction,
  message: string,
  onSelectionComplete: (
    albumData: AlbumSelectionData,
    interaction: StringSelectMenuInteraction<CacheType> | ModalSubmitInteraction<CacheType>,
  ) => void,
) => {
  await showAlbumDropdown(message, interaction, async (selection, interaction) => {
    // If the user wants to create a new album
    if (selection.type === AlbumSelectionType.CREATE_NEW) {
      // Show a modal for the user to enter the details of the album
      const title = "Create & Link Album";
      const modal: ModalBuilder = getCreateAlbumModal(title);
      await interaction.showModal(modal);

      // eslint-disable-next-line jsdoc/require-jsdoc
      const filter = (interaction: ModalSubmitInteraction) =>
        interaction.customId === "createAlbumModal";

      interaction.awaitModalSubmit({ filter, time: 60_000 }).then((interaction) => {
        const albumName: string = interaction.fields.getTextInputValue("albumNameField");
        const albumDesc: string = interaction.fields.getTextInputValue("albumDescField");
        const albumData: AlbumSelectionData = {
          type: AlbumSelectionType.CREATE_NEW,
          albumName,
          albumDesc,
        };
        onSelectionComplete(albumData, interaction);
      });
    } else {
      // If the user wants to use an existing album
      const albumData: AlbumSelectionData = {
        type: AlbumSelectionType.EXISTING,
        albumName: selection.albumName,
      };
      onSelectionComplete(albumData, interaction);
    }
  });
};
