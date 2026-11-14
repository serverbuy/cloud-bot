import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

export const roleCommand = {
  data: new SlashCommandBuilder()
    .setName("r")
    .setDescription("Rolle einem Mitglied geben oder entfernen")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Rolle geben")
        .addUserOption((o) =>
          o.setName("user").setDescription("Mitglied").setRequired(true)
        )
        .addRoleOption((o) =>
          o.setName("role").setDescription("Rolle").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Rolle entfernen")
        .addUserOption((o) =>
          o.setName("user").setDescription("Mitglied").setRequired(true)
        )
        .addRoleOption((o) =>
          o.setName("role").setDescription("Rolle").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("Alle Rollen eines Mitglieds anzeigen")
        .addUserOption((o) =>
          o.setName("user").setDescription("Mitglied").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getMember("user") as GuildMember | null;
    const role = interaction.options.getRole("role");

    if (!target) {
      await interaction.reply({ content: "❌ Mitglied nicht gefunden.", ephemeral: true });
      return;
    }

    if (sub === "list") {
      const roles = target.roles.cache
        .filter((r) => r.id !== interaction.guildId)
        .sort((a, b) => b.position - a.position)
        .map((r) => r.toString())
        .join(", ") || "Keine Rollen";
      await interaction.reply({
        content: `📋 Rollen von ${target}: ${roles}`,
        ephemeral: true,
      });
      return;
    }

    if (!role) {
      await interaction.reply({ content: "❌ Rolle nicht gefunden.", ephemeral: true });
      return;
    }

    const botMember = interaction.guild?.members.me;
    if (!botMember || botMember.roles.highest.position <= (role as any).position) {
      await interaction.reply({
        content: "❌ Die Rolle ist höher als meine eigene Rolle.",
        ephemeral: true,
      });
      return;
    }

    if (sub === "add") {
      await target.roles.add(role as any);
      await interaction.reply({
        content: `✅ Rolle ${role} wurde ${target} gegeben.`,
        ephemeral: true,
      });
    } else if (sub === "remove") {
      await target.roles.remove(role as any);
      await interaction.reply({
        content: `✅ Rolle ${role} wurde ${target} entfernt.`,
        ephemeral: true,
      });
    }
  },
};
