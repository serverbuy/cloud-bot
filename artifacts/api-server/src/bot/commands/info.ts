import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  ActivityType,
} from "discord.js";

const userinfo = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Informationen über einen Nutzer")
    .addUserOption((o) =>
      o.setName("user").setDescription("Mitglied (leer = du selbst)").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const target =
      (interaction.options.getMember("user") as GuildMember | null) ??
      (interaction.member as GuildMember);
    const user = target.user;
    const roles = target.roles.cache
      .filter((r) => r.id !== interaction.guildId)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString())
      .slice(0, 10)
      .join(", ") || "Keine";

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "🆔 User-ID", value: user.id, inline: true },
        { name: "🤖 Bot", value: user.bot ? "Ja" : "Nein", inline: true },
        {
          name: "📅 Account erstellt",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "📥 Server beigetreten",
          value: target.joinedTimestamp
            ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`
            : "Unbekannt",
          inline: true,
        },
        { name: "🎭 Rollen", value: roles }
      )
      .setColor(0x5865f2)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

const serverinfo = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Informationen über diesen Server"),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild!;
    await guild.fetch();

    const embed = new EmbedBuilder()
      .setTitle(`🏠 ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "🆔 Server-ID", value: guild.id, inline: true },
        { name: "👑 Besitzer", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Mitglieder", value: guild.memberCount.toString(), inline: true },
        { name: "📢 Kanäle", value: guild.channels.cache.size.toString(), inline: true },
        { name: "🎭 Rollen", value: guild.roles.cache.size.toString(), inline: true },
        { name: "😀 Emojis", value: guild.emojis.cache.size.toString(), inline: true },
        {
          name: "📅 Erstellt",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "🔒 Verifizierungsstufe",
          value: ["Keine", "Niedrig", "Mittel", "Hoch", "Sehr hoch"][guild.verificationLevel],
          inline: true,
        }
      )
      .setColor(0x5865f2)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

const avatar = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Avatar eines Mitglieds anzeigen")
    .addUserOption((o) =>
      o.setName("user").setDescription("Mitglied").setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar von ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 512 }))
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
};

const botinfo = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Informationen über diesen Bot"),
  async execute(interaction: ChatInputCommandInteraction) {
    const { client } = interaction;
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setTitle(`🤖 ${client.user?.tag}`)
      .setThumbnail(client.user?.displayAvatarURL() ?? null)
      .addFields(
        { name: "📡 Ping", value: `${client.ws.ping}ms`, inline: true },
        { name: "⏱️ Uptime", value: `${h}h ${m}m ${s}s`, inline: true },
        { name: "🏠 Server", value: client.guilds.cache.size.toString(), inline: true },
        { name: "👥 Nutzer", value: client.users.cache.size.toString(), inline: true },
        {
          name: "📦 discord.js",
          value: "v14",
          inline: true,
        }
      )
      .setColor(0x5865f2)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Zeigt die Bot-Latenz"),
  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: "🏓 Pong!", fetchReply: true });
    const latency = (sent as any).createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(
      `🏓 Pong! Latenz: **${latency}ms** | API: **${interaction.client.ws.ping}ms**`
    );
  },
};

export const infoCommands = [userinfo, serverinfo, avatar, botinfo, ping];
