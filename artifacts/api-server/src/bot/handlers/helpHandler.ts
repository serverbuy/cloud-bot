import {
  Message, ButtonBuilder, ButtonStyle, ActionRowBuilder,
  EmbedBuilder, Interaction,
} from "discord.js";
import { PREFIX } from "../prefix/handler";
import { getLang, getLangCode } from "../lib/i18n";
import { help, type HelpPage, type HelpStrings } from "../lib/locales/extra/help";

function buildNavRow(H: HelpStrings, pageIndex: number, userId: string): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`help_nav_p_${pageIndex}_${userId}`)
      .setLabel(H.back)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0),
    new ButtonBuilder()
      .setCustomId(`help_nav_n_${pageIndex}_${userId}`)
      .setLabel(H.next)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(pageIndex === H.pages.length - 1),
  );
}

function buildPageEmbed(H: HelpStrings, page: HelpPage, pageIndex: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`${page.emoji} ${page.name}`)
    .setDescription(page.commands.map((c) => `\`${PREFIX}${c.name}\`\n↳ ${c.desc}`).join("\n\n"))
    .setColor(0x5865f2)
    .setFooter({ text: H.pageLabel(pageIndex + 1, H.pages.length) })
    .setTimestamp();
}

export async function sendHelpMessage(message: Message) {
  const guildId = message.guildId!;
  const L = getLang(guildId);
  const H = help[getLangCode(guildId)];
  const page = H.pages[0]!;
  const embed = buildPageEmbed(H, page, 0);
  embed
    .setTitle(`${page.emoji} ${page.name}`)
    .setAuthor({ name: `${message.client.user?.username ?? "Cloud"} — Help`, iconURL: message.client.user?.displayAvatarURL() })
    .setDescription(
      `${L.info.helpDesc(PREFIX)}\n\n` +
      `${H.totalCommands(H.pages.length)}\n\n` +
      page.commands.map((c) => `\`${PREFIX}${c.name}\`\n↳ ${c.desc}`).join("\n\n"),
    )
    .setFooter({ text: `${H.footerNav}  •  ${L.info.helpFooter(PREFIX)}` });

  await (message.channel as any).send({
    embeds: [embed],
    components: [buildNavRow(H, 0, message.author.id)],
  });
}

export async function handleHelpButton(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("help_nav_")) return;

  const H = help[getLangCode(interaction.guildId ?? "")];

  const parts = interaction.customId.split("_");
  const dir = parts[2]!;
  const currentIndex = parseInt(parts[3]!);
  const ownerId = parts[4]!;

  const newIndex = dir === "n" ? currentIndex + 1 : currentIndex - 1;
  if (newIndex < 0 || newIndex >= H.pages.length) {
    await interaction.reply({ content: H.noMorePages, ephemeral: true });
    return;
  }

  const page = H.pages[newIndex]!;
  try {
    await interaction.update({
      embeds: [buildPageEmbed(H, page, newIndex)],
      components: [buildNavRow(H, newIndex, ownerId)],
    });
  } catch {
    // Interaction may have expired; silently ignore
  }
}
