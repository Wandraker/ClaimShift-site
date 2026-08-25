export const SITE_LINKS = {
  pluginRepository: "https://github.com/Wandraker/ClaimShift",
  websiteRepository: "https://github.com/Wandraker/ClaimShift-site",
  modrinth: "https://modrinth.com/plugin/claimshift",
  issues: "https://github.com/Wandraker/ClaimShift/issues",
} as const;

const envPluginId = import.meta.env.VITE_BSTATS_PLUGIN_ID?.trim();

export const BSTATS_PLUGIN_ID = envPluginId || "";
