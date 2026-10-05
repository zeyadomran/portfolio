// A single choice controls page and figure colors. Alternate palettes are not a public setting.
export const palettes = {
  midnight: ["#0b0f1a", "#111827", "#243049", "#e6e9f2", "#7aa2ff"],
  forest: ["#0d1712", "#101c16", "#24372d", "#e4ebe3", "#b4e37a"],
  graphite: ["#121212", "#191919", "#2c2c2c", "#ececec", "#f2b545"],
  plum: ["#160f17", "#1e1520", "#392a3b", "#f0e7ee", "#f08aa8"],
  paper: ["#f1f3ef", "#e7ebe4", "#cbd2c9", "#183d2b", "#24563c"],
  bone: ["#f3f0e9", "#e9e5db", "#d4cfc2", "#1c1b18", "#d9541e"],
} as const;
export const theme: keyof typeof palettes = "midnight";
export const themeColors = palettes[theme];
