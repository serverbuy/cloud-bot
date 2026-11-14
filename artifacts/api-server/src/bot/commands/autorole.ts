import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";

export const autoRoleSettings = new Map<string, string>();

export const autoRoleCommand = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Automatische Rolle für neue Mitglieder")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Rolle setzen, die neue Mitglieder beim Beitreten bekommen")
        .addRoleOption((o) =>
          o.setName("role").setDescription("Rolle").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Auto-Role deaktivieren")
    )
    .addSubcommand((sub) =>
      sub
        .setName("status")
        .setDescription("Aktuell gesetzte Auto-Role anzeigen")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;

    if (sub === "set") {
      const role = interaction.options.getRole("role")!;
      const botMember = interaction.guild?.members.me;
      if (!botMember || botMember.roles.highest.position <= (role as any).position) {
        await interaction.reply({
          content: "❌ Die Rolle ist höher als meine eigene Rolle. Bitte wähle eine niedrigere Rolle.",
          ephemeral: true,
        });
        return;
      }
      autoRoleSettings.set(guildId, role.id);
      const embed = new EmbedBuilder()
        .setTitle("✅ Auto-Role gesetzt")
        .setDescription(`Neue Mitglieder erhalten automatisch die Rolle ${role} beim Beitreten.`)
        .setColor(0x57f287)
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (sub === "remove") {
      autoRoleSettings.delete(guildId);
      await interaction.reply({ content: "✅ Auto-Role wurde deaktiviert.", ephemeral: true });
      return;
    }

    if (sub === "status") {
      const roleId = autoRoleSettings.get(guildId);
      if (!roleId) {
        await interaction.reply({ content: "❌ Keine Auto-Role konfiguriert.", ephemeral: true });
        return;
      }
      const role = interaction.guild?.roles.cache.get(roleId);
      await interaction.reply({
        content: `🎭 Aktuelle Auto-Role: ${role ?? `<@&${roleId}>`}`,
        ephemeral: true,
      });
    }
  },
};
