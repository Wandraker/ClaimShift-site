export const SITE_LINKS = {
  pluginRepository: "https://github.com/Wandraker/ClaimShift",
  websiteRepository: "https://github.com/Wandraker/ClaimShift-site",
  modrinth: "https://modrinth.com/plugin/claimshift",
  issues: "https://github.com/Wandraker/ClaimShift/issues",
  bstats: "https://bstats.org/plugin/bukkit/ClaimShift/33671",
} as const;

const base = import.meta.env.BASE_URL;

export const SITE_PATHS = {
  home: base,
  wiki: `${base}wiki/`,
} as const;

const envPluginId = import.meta.env.VITE_BSTATS_PLUGIN_ID?.trim();
export const BSTATS_PLUGIN_ID = envPluginId || "33671";
