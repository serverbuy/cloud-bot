import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";

const kick = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Mitglied kicken")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((o) =>
      o.setName("user").setDescription("Mitglied").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("reason").setDescription("Grund").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("user") as GuildMember | null;
    const reason = interaction.options.getString("reason") ?? "Kein Grund angegeben";
    if (!target) {
      await interaction.reply({ content: "Mitglied nicht gefunden.", ephemeral: true });
      return;
    }
    if (!target.kickable) {
      await interaction.reply({ content: "Ich kann dieses Mitglied nicht kicken.", ephemeral: true });
      return;
    }
    await target.kick(reason);
    const embed = new EmbedBuilder()
      .setTitle("Mitglied gekickt")
      .addFields(
        { name: "Mitglied", value: target.user.tag, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Grund", value: reason }
      )
      .setColor(0xfee75c)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};

const ban = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Mitglied bannen")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((o) =>
      o.setName("user").setDescription("Mitglied").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("reason").setDescription("Grund").setRequired(false)
    )
    .addIntegerOption((o) =>
      o
        .setName("delete_days")
        .setDescription("Nachrichten der letzten X Tage löschen (0-7)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("user") as GuildMember | null;
    const reason = interaction.options.getString("reason") ?? "Kein Grund angegeben";
    const deleteDays = interaction.options.getInteger("delete_days") ?? 0;
    if (!target) {
      await interaction.reply({ content: "Mitglied nicht gefunden.", ephemeral: true });
      return;
    }
    if (!target.bannable) {
      await interaction.reply({ content: "Ich kann dieses Mitglied nicht bannen.", ephemeral: true });
      return;
    }
    await target.ban({ reason, deleteMessageSeconds: deleteDays * 86400 });
    const embed = new EmbedBuilder()
      .setTitle("Mitglied gebannt")
      .addFields(
        { name: "Mitglied", value: target.user.tag, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Grund", value: reason }
      )
      .setColor(0xed4245)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};

const unban = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Mitglied entbannen")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((o) =>
      o.setName("user_id").setDescription("Discord User-ID").setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.options.getString("user_id")!;
    try {
      await interaction.guild!.members.unban(userId);
      await interaction.reply({ content: `Nutzer \`${userId}\` wurde entbannt.` });
    } catch {
      await interaction.reply({ content: "Nutzer nicht gefunden oder nicht gebannt.", ephemeral: true });
    }
  },
};

const timeout = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Mitglied timeoutten (stumm schalten)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) =>
      o.setName("user").setDescription("Mitglied").setRequired(true)
    )
    .addIntegerOption((o) =>
      o
        .setName("minutes")
        .setDescription("Dauer in Minuten (0 = aufheben)")
        .setMinValue(0)
        .setMaxValue(40320)
        .setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("reason").setDescription("Grund").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("user") as GuildMember | null;
    const minutes = interaction.options.getInteger("minutes")!;
    const reason = interaction.options.getString("reason") ?? "Kein Grund angegeben";
    if (!target) {
      await interaction.reply({ content: "Mitglied nicht gefunden.", ephemeral: true });
      return;
    }
    if (minutes === 0) {
      await target.timeout(null);
      await interaction.reply({ content: `Timeout von ${target} aufgehoben.` });
    } else {
      await target.timeout(minutes * 60 * 1000, reason);
      const embed = new EmbedBuilder()
        .setTitle("Mitglied getimeouted")
        .addFields(
          { name: "Mitglied", value: target.user.tag, inline: true },
          { name: "Dauer", value: `${minutes} Minuten`, inline: true },
          { name: "Grund", value: reason }
        )
        .setColor(0xffa500)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    }
  },
};

const purge = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Nachrichten löschen")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((o) =>
      o
        .setName("amount")
        .setDescription("Anzahl der zu löschenden Nachrichten (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((o) =>
      o.setName("user").setDescription("Nur Nachrichten von diesem Nutzer").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger("amount")!;
    const targetUser = interaction.options.getUser("user");

    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel!.messages.fetch({ limit: amount });
    const toDelete = targetUser
      ? messages.filter((m) => m.author.id === targetUser.id)
      : messages;

    const channel = interaction.channel as any;
    const deleted = await channel.bulkDelete(toDelete, true);
    await interaction.editReply({
      content: `${deleted.size} Nachrichten gelöscht.`,
    });
  },
};

const warn = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Mitglied verwarnen")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) =>
      o.setName("user").setDescription("Mitglied").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("reason").setDescription("Grund").setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("user")!;
    const reason = interaction.options.getString("reason")!;
    const embed = new EmbedBuilder()
      .setTitle("Mitglied verwarnt")
      .addFields(
        { name: "Mitglied", value: target.tag, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Grund", value: reason }
      )
      .setColor(0xfee75c)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    try {
      await target.send(
        `Du wurdest auf **${interaction.guild?.name}** verwarnt.\n**Grund:** ${reason}`
      );
    } catch {
      // DM disabled
    }
  },
};

export const moderationCommands = [kick, ban, unban, timeout, purge, warn];
