import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  TextChannel,
} from "discord.js";

export const ticketCommand = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket-System verwalten")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((sub) =>
      sub
        .setName("setup")
        .setDescription("Ticket-Panel in diesem Kanal erstellen")
        .addStringOption((o) =>
          o
            .setName("title")
            .setDescription("Titel des Ticket-Panels")
            .setRequired(false)
        )
        .addChannelOption((o) =>
          o
            .setName("category")
            .setDescription("Kategorie für Tickets")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("close")
        .setDescription("Aktuelles Ticket schließen")
    )
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Mitglied zum Ticket hinzufügen")
        .addUserOption((o) =>
          o.setName("user").setDescription("Mitglied").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Mitglied aus Ticket entfernen")
        .addUserOption((o) =>
          o.setName("user").setDescription("Mitglied").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "setup") {
      const title = interaction.options.getString("title") ?? "Support Ticket";
      const embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(
          "Klicke auf den Button unten, um ein Ticket zu öffnen.\nUnser Team wird sich so schnell wie möglich um dein Anliegen kümmern."
        )
        .setColor(0x5865f2)
        .setFooter({ text: "Ticket System" })
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket_create")
          .setLabel("Ticket erstellen")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
      return;
    }

    if (sub === "close") {
      const channel = interaction.channel as TextChannel;
      if (!channel.name.startsWith("ticket-")) {
        await interaction.reply({ content: "Das ist kein Ticket-Kanal.", ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Ticket wird geschlossen")
        .setDescription("Dieses Ticket wird in 5 Sekunden gelöscht.")
        .setColor(0xff0000);

      await interaction.reply({ embeds: [embed] });
      setTimeout(() => channel.delete("Ticket geschlossen").catch(() => {}), 5000);
      return;
    }

    if (sub === "add") {
      const user = interaction.options.getUser("user")!;
      const channel = interaction.channel as TextChannel;
      await channel.permissionOverwrites.create(user, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });
      await interaction.reply({ content: `${user} wurde zum Ticket hinzugefügt.`, ephemeral: true });
      return;
    }

    if (sub === "remove") {
      const user = interaction.options.getUser("user")!;
      const channel = interaction.channel as TextChannel;
      await channel.permissionOverwrites.delete(user);
      await interaction.reply({ content: `${user} wurde aus dem Ticket entfernt.`, ephemeral: true });
      return;
    }
  },
};
