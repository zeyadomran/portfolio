const yarn = "node .yarn/releases/yarn-1.22.22.cjs";

export default {
  "*": [
    "node scripts/format-staged.mjs",
    () => `${yarn} lint`,
    () => `${yarn} typecheck`,
    () => `${yarn} build`,
    () => `${yarn} test`,
  ],
};
