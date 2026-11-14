import {
  ChannelType,
  Guild,
  PermissionFlagsBits,
  type CategoryChannel,
  type ColorResolvable,
  type Role,
} from "discord.js";

export interface RoleTemplate {
  name: string;
  category: string;
  color: ColorResolvable;
}

const staff = 0x5865f2;
const prestige = 0xf1c40f;
const identity = 0xe91e63;
const country = 0x57f287;
const community = 0x2ecc71;
const interests = 0x9b59b6;

export const ROLE_PACK: RoleTemplate[] = [
  { name: "Founder", category: "Team", color: staff },
  { name: "Co-Founder", category: "Team", color: staff },
  { name: "Owner", category: "Team", color: staff },
  { name: "CEO", category: "Team", color: staff },
  { name: "COO", category: "Team", color: staff },
  { name: "CTO", category: "Team", color: staff },
  { name: "Admin", category: "Team", color: staff },
  { name: "Head Admin", category: "Team", color: staff },
  { name: "Senior Moderator", category: "Team", color: staff },
  { name: "Moderator", category: "Team", color: staff },
  { name: "Junior Moderator", category: "Team", color: staff },
  { name: "Supporter", category: "Team", color: staff },
  { name: "Senior Supporter", category: "Team", color: staff },
  { name: "Trial Supporter", category: "Team", color: staff },
  { name: "Helper", category: "Team", color: staff },
  { name: "Developer", category: "Team", color: staff },
  { name: "Designer", category: "Team", color: staff },
  { name: "Event Manager", category: "Team", color: staff },
  { name: "Community Manager", category: "Team", color: staff },
  { name: "Test Supporter", category: "Team", color: staff },

  { name: "King", category: "Prestige", color: prestige },
  { name: "Queen", category: "Prestige", color: prestige },
  { name: "Boss", category: "Prestige", color: prestige },
  { name: "VIP", category: "Prestige", color: prestige },
  { name: "MVP", category: "Prestige", color: prestige },
  { name: "OG", category: "Prestige", color: prestige },
  { name: "Legend", category: "Prestige", color: prestige },
  { name: "Elite", category: "Prestige", color: prestige },
  { name: "Champion", category: "Prestige", color: prestige },
  { name: "Verified", category: "Prestige", color: prestige },
  { name: "Booster", category: "Prestige", color: prestige },
  { name: "Donator", category: "Prestige", color: prestige },
  { name: "Partner", category: "Prestige", color: prestige },
  { name: "Content Creator", category: "Prestige", color: prestige },
  { name: "Streamer", category: "Prestige", color: prestige },

  { name: "E-Sex", category: "Identity", color: identity },
  { name: "E-Girl", category: "Identity", color: identity },
  { name: "E-Boy", category: "Identity", color: identity },
  { name: "Girl", category: "Identity", color: identity },
  { name: "Boy", category: "Identity", color: identity },
  { name: "Non-binary", category: "Identity", color: identity },
  { name: "LGBTQ+", category: "Identity", color: identity },
  { name: "Ally", category: "Identity", color: identity },
  { name: "She/Her", category: "Identity", color: identity },
  { name: "He/Him", category: "Identity", color: identity },
  { name: "They/Them", category: "Identity", color: identity },
  { name: "Gamer", category: "Identity", color: identity },
  { name: "Anime Fan", category: "Identity", color: identity },
  { name: "Music Lover", category: "Identity", color: identity },
  { name: "Artist", category: "Identity", color: identity },

  { name: "Germany", category: "Countries", color: country },
  { name: "Austria", category: "Countries", color: country },
  { name: "Switzerland", category: "Countries", color: country },
  { name: "Netherlands", category: "Countries", color: country },
  { name: "Belgium", category: "Countries", color: country },
  { name: "France", category: "Countries", color: country },
  { name: "Spain", category: "Countries", color: country },
  { name: "Italy", category: "Countries", color: country },
  { name: "Portugal", category: "Countries", color: country },
  { name: "Poland", category: "Countries", color: country },
  { name: "Sweden", category: "Countries", color: country },
  { name: "Norway", category: "Countries", color: country },
  { name: "Denmark", category: "Countries", color: country },
  { name: "Finland", category: "Countries", color: country },
  { name: "United Kingdom", category: "Countries", color: country },
  { name: "Ireland", category: "Countries", color: country },
  { name: "USA", category: "Countries", color: country },
  { name: "Canada", category: "Countries", color: country },
  { name: "Brazil", category: "Countries", color: country },
  { name: "Turkey", category: "Countries", color: country },

  { name: "Community Member", category: "Community", color: community },
  { name: "New Member", category: "Community", color: community },
  { name: "Active Member", category: "Community", color: community },
  { name: "Very Active", category: "Community", color: community },
  { name: "Friendly", category: "Community", color: community },
  { name: "Social", category: "Community", color: community },
  { name: "Chill", category: "Community", color: community },
  { name: "Night Owl", category: "Community", color: community },
  { name: "Early Bird", category: "Community", color: community },
  { name: "Looking for Friends", category: "Community", color: community },
  { name: "Single", category: "Community", color: community },
  { name: "Taken", category: "Community", color: community },
  { name: "AFK", category: "Community", color: community },
  { name: "Online", category: "Community", color: community },
  { name: "Offline", category: "Community", color: community },

  { name: "Minecraft", category: "Interests", color: interests },
  { name: "Fortnite", category: "Interests", color: interests },
  { name: "Valorant", category: "Interests", color: interests },
  { name: "CS2", category: "Interests", color: interests },
  { name: "Roblox", category: "Interests", color: interests },
  { name: "League of Legends", category: "Interests", color: interests },
  { name: "GTA", category: "Interests", color: interests },
  { name: "Rocket League", category: "Interests", color: interests },
  { name: "PlayStation", category: "Interests", color: interests },
  { name: "Xbox", category: "Interests", color: interests },
  { name: "PC", category: "Interests", color: interests },
  { name: "Mobile", category: "Interests", color: interests },
  { name: "Coding", category: "Interests", color: interests },
  { name: "Art", category: "Interests", color: interests },
  { name: "Sports", category: "Interests", color: interests },
];

export interface RolePackResult {
  created: string[];
  skipped: string[];
  secured: string[];
}

export interface RoleEnsureResult extends RolePackResult {
  roles: Map<string, Role>;
}

export class RolePackCreationError extends Error {
  constructor(
    message: string,
    public readonly createdCount: number,
  ) {
    super(message);
    this.name = "RolePackCreationError";
  }
}

export async function ensureRoleTemplates(
  guild: Guild,
  templates: RoleTemplate[],
  reason: string,
): Promise<RoleEnsureResult> {
  const botMember = guild.members.me;
  if (!botMember?.permissions.has(PermissionFlagsBits.ManageRoles)) {
    throw new Error("BOT_MISSING_MANAGE_ROLES");
  }

  const existingRoles = new Map(
    templates
      .map((template) => [
        template.name,
        guild.roles.cache.find((role) => role.name === template.name),
      ] as const)
      .filter((entry): entry is readonly [string, Role] => Boolean(entry[1])),
  );
  const missing = templates.filter((template) => !existingRoles.has(template.name));

  if (guild.roles.cache.size + missing.length > 250) {
    throw new Error("ROLE_LIMIT");
  }

  const created: string[] = [];
  const skipped: string[] = [];
  const secured: string[] = [];
  const roles = new Map<string, Role>();

  for (const template of templates) {
    const existingRole = existingRoles.get(template.name);
    if (existingRole) {
      skipped.push(template.name);
      if (!existingRole.managed && existingRole.permissions.toArray().length > 0) {
        await existingRole.setPermissions([], `${reason} (remove role permissions)`);
        secured.push(template.name);
      }
      roles.set(template.name, existingRole);
      continue;
    }

    try {
      const role = await guild.roles.create({
        name: template.name,
        color: template.color,
        permissions: [],
        reason,
      });
      roles.set(template.name, role);
      created.push(template.name);
    } catch (error) {
      throw new RolePackCreationError(
        error instanceof Error ? error.message : "Unknown Discord error",
        created.length,
      );
    }
  }

  return { created, skipped, secured, roles };
}

export async function createRolePack(guild: Guild): Promise<RolePackResult> {
  const result = await ensureRoleTemplates(
    guild,
    ROLE_PACK,
    "Creating the standard 100-role community pack",
  );
  return {
    created: result.created,
    skipped: result.skipped,
    secured: result.secured,
  };
}

export interface TeamCategoryResult extends RolePackResult {
  categoryCreated: boolean;
  categoryId: string;
}

export async function createTeamCategory(
  guild: Guild,
): Promise<TeamCategoryResult> {
  const botMember = guild.members.me;
  if (!botMember?.permissions.has(PermissionFlagsBits.ManageChannels)) {
    throw new Error("BOT_MISSING_MANAGE_CHANNELS");
  }

  const teamTemplates = ROLE_PACK.filter(
    (template) => template.category === "Team",
  );
  const roleResult = await ensureRoleTemplates(
    guild,
    teamTemplates,
    "Creating the Team role pack",
  );

  const existingCategory = guild.channels.cache.find(
    (channel): channel is CategoryChannel =>
      channel.type === ChannelType.GuildCategory &&
      channel.name.toLowerCase() === "team",
  );
  const category =
    existingCategory ??
    (await guild.channels.create({
      name: "Team",
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
      reason: "Creating the private Team category",
    }));

  await category.permissionOverwrites.edit(guild.roles.everyone, {
    ViewChannel: false,
  });

  for (const role of roleResult.roles.values()) {
    await category.permissionOverwrites.edit(role, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: false,
      EmbedLinks: false,
    });
  }

  return {
    created: roleResult.created,
    skipped: roleResult.skipped,
    secured: roleResult.secured,
    categoryCreated: !existingCategory,
    categoryId: category.id,
  };
}