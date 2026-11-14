import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import { vcCreateChannels } from "../handlers/vcCreate";

export const vcSetupCommand = {
  data: new SlashCommandBuilder()
    .setName("vcsetup")
    .setDescription("Voice-Create System einrichten")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Einen Voice-Kanal als Join-to-Create setzen")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Der Kanal, den Nutzer joinen, um einen eigenen VC zu erstellen")
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("status")
        .setDescription("Aktuellen VC-Create Kanal anzeigen")
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("VC-Create System deaktivieren")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;

    if (sub === "set") {
      const channel = interaction.options.getChannel("channel")!;
      vcCreateChannels.set(guildId, channel.id);

      const embed = new EmbedBuilder()
        .setTitle("VC-Create System eingerichtet")
        .setDescription(
          `Wenn ein Mitglied ${channel} joined, wird automatisch ein temporärer Voice-Kanal erstellt.`
        )
        .setColor(0x57f287)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (sub === "status") {
      const channelId = vcCreateChannels.get(guildId);
      if (!channelId) {
        await interaction.reply({ content: "Kein VC-Create Kanal konfiguriert.", ephemeral: true });
        return;
      }
      const channel = interaction.guild?.channels.cache.get(channelId);
      await interaction.reply({
        content: `Aktueller Join-to-Create Kanal: ${channel ?? `<#${channelId}>`}`,
        ephemeral: true,
      });
      return;
    }

    if (sub === "remove") {
      vcCreateChannels.delete(guildId);
      await interaction.reply({ content: "VC-Create System wurde deaktiviert.", ephemeral: true });
    }
  },
};
