import type { Lang } from "../../i18n";

const en = {
  formatHint:
    "❌ Format: `,reactionrole Colors | 🎨 @Blue | 🎮 @Red | ⭐ @Green`\n" +
    "Between 1 and 5 roles, separated by `|`.",
  maxRoles: "❌ At least 1, maximum 5 roles per panel.",
  noRoles: "❌ No roles found. Mention roles with @RoleName.",
  noValidRoles: "❌ No valid roles found. Mention them with @Role.",
  clickHint: "\n\n*Click a button to get or remove the role.*",
  memberNotFound: "❌ Member not found.",
  roleGone: "❌ This role no longer exists.",
  roleRemoved: (name: string) => `❌ Role **${name}** has been removed.`,
  roleAdded: (name: string) => `✅ Role **${name}** has been added.`,
  updateError: "❌ Error updating roles. (Check permissions)",
};

type Strings = typeof en;

const de: Strings = {
  formatHint:
    "❌ Format: `,reactionrole Farben | 🎨 @Blau | 🎮 @Rot | ⭐ @Grün`\n" +
    "Zwischen 1 und 5 Rollen, getrennt durch `|`.",
  maxRoles: "❌ Mindestens 1, maximal 5 Rollen pro Panel.",
  noRoles: "❌ Keine Rollen gefunden. Markiere Rollen mit @Rollenname.",
  noValidRoles: "❌ Keine gültigen Rollen gefunden. Markiere sie mit @Rolle.",
  clickHint: "\n\n*Klicke einen Button um die Rolle zu bekommen oder zu entfernen.*",
  memberNotFound: "❌ Mitglied nicht gefunden.",
  roleGone: "❌ Diese Rolle existiert nicht mehr.",
  roleRemoved: (name: string) => `❌ Rolle **${name}** wurde entfernt.`,
  roleAdded: (name: string) => `✅ Rolle **${name}** wurde hinzugefügt.`,
  updateError: "❌ Fehler beim Rollen-Update. (Berechtigungen prüfen)",
};

const sv: Strings = {
  formatHint:
    "❌ Format: `,reactionrole Färger | 🎨 @Blå | 🎮 @Röd | ⭐ @Grön`\n" +
    "Mellan 1 och 5 roller, separerade med `|`.",
  maxRoles: "❌ Minst 1, högst 5 roller per panel.",
  noRoles: "❌ Inga roller hittades. Nämn roller med @Rollnamn.",
  noValidRoles: "❌ Inga giltiga roller hittades. Nämn dem med @Roll.",
  clickHint: "\n\n*Klicka på en knapp för att få eller ta bort rollen.*",
  memberNotFound: "❌ Medlemmen hittades inte.",
  roleGone: "❌ Den här rollen finns inte längre.",
  roleRemoved: (name: string) => `❌ Rollen **${name}** har tagits bort.`,
  roleAdded: (name: string) => `✅ Rollen **${name}** har lagts till.`,
  updateError: "❌ Fel vid uppdatering av roller. (Kontrollera behörigheter)",
};

const nl: Strings = {
  formatHint:
    "❌ Formaat: `,reactionrole Kleuren | 🎨 @Blauw | 🎮 @Rood | ⭐ @Groen`\n" +
    "Tussen 1 en 5 rollen, gescheiden door `|`.",
  maxRoles: "❌ Minimaal 1, maximaal 5 rollen per paneel.",
  noRoles: "❌ Geen rollen gevonden. Vermeld rollen met @Rolnaam.",
  noValidRoles: "❌ Geen geldige rollen gevonden. Vermeld ze met @Rol.",
  clickHint: "\n\n*Klik op een knop om de rol te krijgen of te verwijderen.*",
  memberNotFound: "❌ Lid niet gevonden.",
  roleGone: "❌ Deze rol bestaat niet meer.",
  roleRemoved: (name: string) => `❌ Rol **${name}** is verwijderd.`,
  roleAdded: (name: string) => `✅ Rol **${name}** is toegevoegd.`,
  updateError: "❌ Fout bij het bijwerken van rollen. (Controleer rechten)",
};

const ar: Strings = {
  formatHint:
    "❌ التنسيق: `,reactionrole الألوان | 🎨 @أزرق | 🎮 @أحمر | ⭐ @أخضر`\n" +
    "بين 1 و5 أدوار، مفصولة بـ `|`.",
  maxRoles: "❌ دور واحد على الأقل، وخمسة أدوار كحد أقصى لكل لوحة.",
  noRoles: "❌ لم يتم العثور على أدوار. أشِر إلى الأدوار باستخدام @اسم_الدور.",
  noValidRoles: "❌ لم يتم العثور على أدوار صالحة. أشِر إليها باستخدام @دور.",
  clickHint: "\n\n*اضغط على زر للحصول على الدور أو إزالته.*",
  memberNotFound: "❌ لم يتم العثور على العضو.",
  roleGone: "❌ هذا الدور لم يعد موجودًا.",
  roleRemoved: (name: string) => `❌ تمت إزالة الدور **${name}**.`,
  roleAdded: (name: string) => `✅ تمت إضافة الدور **${name}**.`,
  updateError: "❌ خطأ في تحديث الأدوار. (تحقق من الصلاحيات)",
};

export const reactionrole: Record<Lang, Strings> = { en, de, sv, nl, ar };
