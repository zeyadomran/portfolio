import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const lintStaged = fileURLToPath(import.meta.resolve("lint-staged/bin"));
const temporaryRoot = realpathSync(tmpdir());
const fixturePrefix = join(temporaryRoot, "portfolio-merge-hook-");

function createFixture(t) {
  const directory = mkdtempSync(fixturePrefix);
  t.after(() => {
    assert.ok(directory.startsWith(fixturePrefix));
    rmSync(directory, { recursive: true, force: true });
  });
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_")),
  );
  function git(args, expectedStatus = 0) {
    const result = spawnSync(
      "git",
      [
        "-c",
        "core.hooksPath=.git/hooks",
        "-c",
        "commit.gpgsign=false",
        "-c",
        "user.name=Hook regression fixture",
        "-c",
        "user.email=hook-fixture@example.invalid",
        ...args,
      ],
      { cwd: directory, env, encoding: "utf8" },
    );
    assert.equal(
      result.status,
      expectedStatus,
      `git ${args.join(" ")}\n${result.stdout}\n${result.stderr}`,
    );
    return result.stdout;
  }
  const write = (name, content) =>
    writeFileSync(join(directory, name), content);
  const read = (name) => readFileSync(join(directory, name), "utf8");
  // lint-staged checks only merge files that differ from both parents, so
  // both branches edit separate lines of the story.
  const story = (local, incoming) => `${local}\nshared\n${incoming}\n`;

  git(["init", "--initial-branch=main"]);
  git(["config", "core.autocrlf", "false"]);
  write("story.txt", story("base", "base"));
  write("draft.txt", "baseline draft\n");
  write(
    "validate.mjs",
    'import { readFileSync, writeFileSync } from "node:fs";\n' +
      'writeFileSync("validation-ran", "yes");\n' +
      'if (readFileSync("story.txt", "utf8").includes("invalid")) process.exit(1);\n' +
      'if (readFileSync("draft.txt", "utf8") !== "baseline draft\\n") process.exit(1);\n',
  );
  write(".lintstagedrc.json", JSON.stringify({ "*": "node validate.mjs" }));
  git(["add", "."]);
  git(["commit", "-m", "Base"]);
  git(["switch", "--create", "incoming"]);
  write("story.txt", story("base", "incoming"));
  git(["add", "story.txt"]);
  git(["commit", "-m", "Incoming"]);
  git(["switch", "main"]);
  write("story.txt", story("local", "base"));
  git(["add", "story.txt"]);
  git(["commit", "-m", "Local"]);
  git(["merge", "--no-commit", "incoming"]);

  // Exercise the installed package through an actual Git pre-commit hook.
  write(
    "hook-runner.cjs",
    'const { spawnSync } = require("node:child_process");\n' +
      `const result = spawnSync(process.execPath, ${JSON.stringify([
        lintStaged,
        "--config",
        ".lintstagedrc.json",
        "--hide-unstaged",
        "--diff-filter=ACMRD",
        "--concurrent",
        "false",
      ])}, { stdio: "inherit" });\n` +
      "process.exit(result.status ?? 1);\n",
  );
  write(".git/hooks/pre-commit", "#!/bin/sh\nnode hook-runner.cjs\n");
  chmodSync(join(directory, ".git/hooks/pre-commit"), 0o755);
  return { git, read, write };
}

test("a successful staged check preserves merge state until Git commits", (t) => {
  const { git, read, write } = createFixture(t);
  const mergeParent = read(".git/MERGE_HEAD").trim();
  write("draft.txt", "unstaged draft\n");

  git(["commit", "-m", "Merge incoming"]);

  assert.equal(read("validation-ran"), "yes");
  const parents = git(["show", "--format=%P", "--no-patch", "HEAD"])
    .trim()
    .split(" ");
  assert.equal(parents.length, 2);
  assert.equal(parents[1], mergeParent);
  assert.equal(read("draft.txt"), "unstaged draft\n");
});

test("a failed staged check restores merge metadata, index, and unstaged edits", (t) => {
  const { git, read, write } = createFixture(t);
  const metadata = ["MERGE_HEAD", "MERGE_MODE", "MERGE_MSG"].map((name) => [
    name,
    read(`.git/${name}`),
  ]);
  write("story.txt", "invalid\n");
  git(["add", "story.txt"]);
  write("draft.txt", "unstaged draft\n");
  const stagedBefore = git(["diff", "--cached", "--binary"]);
  const headBefore = git(["rev-parse", "HEAD"]);

  git(["commit", "-m", "Reject invalid merge"], 1);

  assert.equal(read("validation-ran"), "yes");
  assert.equal(git(["rev-parse", "HEAD"]), headBefore);
  assert.equal(git(["diff", "--cached", "--binary"]), stagedBefore);
  assert.equal(read("story.txt"), "invalid\n");
  assert.equal(read("draft.txt"), "unstaged draft\n");
  for (const [name, content] of metadata)
    assert.equal(read(`.git/${name}`), content);
});
