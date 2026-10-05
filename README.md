# Zeyad Omran’s portfolio

**Hard things, made easy to use.**

[Visit the website](https://zeyadomran.com)

A personal portfolio about making complex software easier to use, with selected frontend work at IBM, independent projects, and a background in human-computer interaction.

## Design and experience

The Instrument design uses a dark Midnight palette, a twelve-column hairline grid, local PP Neue Montreal and IBM Plex Mono typography, and four interactive figures:

- **Clarity lens:** move or tap over a dense sample screen to reveal its simpler counterpart, or choose “Simplify all.”
- **Answer, then action:** ask a scripted question and open a sample form beside the conversation. On phones, the form becomes a bottom sheet. Edits and saved draft state survive closing and reopening it.
- **One table, many pages:** compare three separate tables with a shared component. Selection, column picker, compact rows and status options update all three sample pages together. Phones show one page at a time.
- **Same table, two runs:** play or scrub a schematic of the reported eight-to-three-second result on one shared eight-second scale.

The page includes native expandable stories, text-only project cards for Behind the Interface and Promptly, experience and education, and contact links. A sticky header tracks the active section and reading progress; phones get a keyboard-accessible Index dialog. Reduced motion disables idle animation and immediately completes scripted demonstrations.

Core content, section navigation, native story disclosures, contact destinations and the resume download work without JavaScript. Figures prerender in a stable resting state; motion activates near the viewport or in response to input. The site uses React, TypeScript, Vite, Tailwind CSS and authored CSS.

<details>
<summary>Maintenance notes</summary>

### Editing the story

Content lives in `src/components/editorial/portfolio.tsx`. The four figures each have their own `fig-*.tsx` component; navigation, story disclosures, copy-email feedback, icons and motion preferences are separate modules. Styling lives in `src/styles.css`. Keep the authored reset; Tailwind Preflight is intentionally omitted. Font provenance is documented in [src/fonts/README.md](src/fonts/README.md).

The active theme is the single `theme` constant in `src/lib/theme.ts`. Ship Midnight; the other palettes are available for development. The responsive breakpoint is 760px. Preserve the twelve-column alignment, square geometry, local typography, accent-colored controls, native disclosures and reduced-motion support. The prototype’s small buttons have at least 44px interactive targets in production.

Preserve the `#assistant`, `#systems` and `#optimization` anchors. `#home`, `#writing` and `#links` remain aliases for the new `#top`, `#projects` and `#contact` destinations. Keep prerendered markup and hydration consistent. Use CSS for responsive layout so hydration does not swap the static figure structure.

The assistant workspace stays on the left of the chat on desktop and becomes a sheet on phones. Never overwrite a visitor’s edits with its scripted autofill. Preserve form state across toggles, validate both fields on save and reflect the form in the checklist. Return focus to the opener on close. The shared-table figure retains its configuration across modes and page tabs. All three sample tables receive the same options. The timing figure uses one eight-second clock and cancels playback when scrubbed; reduced motion jumps playback to the final result. The lens uses one animation loop only while nearby, with no idle movement under reduced motion.

Keep public IBM claims within confirmed frontend scope, use generic names, and label all illustrative content. The assistant’s preview release covers documentation help, feedback and conversation history; workspace forms and embedded reports were built internally and the copy must not imply they shipped. Keep the 50+ page table adoption and 100+ page parser reach as separate facts, and keep the 62% result tied to the 50-row scenario. The parser optimization is separate from the shared-table migration.

Sections are numbered 01 to 04, stories 1.1 to 1.3, and figures FIG. 01 to FIG. 04. Draw symbols as inline SVG, not Unicode glyphs. The downloadable resume is `public/Zeyad_Omran_Resume.pdf`; the older `/Zeyad_Omran_Resume_SWE_AI.pdf` path redirects to it.

### Validation

Use Node.js 22.22.1 or newer and the checked-in Yarn Classic release. Build before static-output tests and Playwright:

```sh
node .yarn/releases/yarn-1.22.22.cjs lint
node .yarn/releases/yarn-1.22.22.cjs typecheck
node .yarn/releases/yarn-1.22.22.cjs build
node .yarn/releases/yarn-1.22.22.cjs test
node .yarn/releases/yarn-1.22.22.cjs test:e2e
```

Run `node .yarn/releases/yarn-1.22.22.cjs install --frozen-lockfile` to install dependencies and activate the local Husky hook. Before each commit, staged files are formatted, then lint (including warnings), type checks, a fresh build, and static-output tests must pass. During a merge, only files that differ from both parents count as staged, so a merge that takes every file unchanged from one side skips these checks; required CI still validates the merged branch. Unstaged tracked edits are temporarily hidden and restored afterward; untracked and ignored local files remain visible to tools. Run `node .yarn/releases/yarn-1.22.22.cjs precommit` to check staged changes manually. Hook installation is skipped in CI, Vercel, and production-only installs. The full browser suite runs in required CI.

Playwright uses installed Chrome and the production preview on port 4173. Ensure any reused preview serves the current build.

GitHub Actions runs lint and type checks, then builds and checks both production and preview output. The production job runs the complete browser suite; the preview job checks indexing and metadata in the browser. CI uses Google Chrome preinstalled on the Ubuntu 24.04 runner and invokes the checked-in Yarn release. Browser failure traces and screenshots are retained for seven days.

The stable `portfolio-ci` check succeeds only when all validation jobs succeed. Pull requests also run `portfolio-dependencies`, which rejects newly introduced dependencies with high or critical known vulnerabilities, and CodeQL scans JavaScript/TypeScript and workflow code. Dependabot proposes weekly package and action updates; updates are not automatically merged.

The active [main-required-checks ruleset](https://github.com/zeyadomran/portfolio/rules/23731339) requires pull requests, an up-to-date branch, resolved review conversations, and all ten current checks: `portfolio-ci`, `portfolio-quality`, both `portfolio-site` jobs, `portfolio-dependencies`, both `portfolio-codeql` jobs, `CodeQL`, `Vercel`, and `Vercel Preview Comments`. Each check is restricted to its expected GitHub App. Direct changes must go through a pull request; force pushes and deletion are blocked. The bypass list is empty, including for administrators, and required approvals remain at zero for solo maintenance. When adding or renaming checks, update the ruleset as well. These protections are configured in GitHub separately from the workflow files.

The repository uses squash merges. Dependabot pull requests must pass the same required checks before merging.

### Security

Report vulnerabilities through the private route in [SECURITY.md](SECURITY.md). Dependency graph, Dependabot alerts and security updates, secret scanning, push protection, and private vulnerability reporting are enabled. Dependabot version updates follow the weekly schedule in `.github/dependabot.yml`; dependency changes still require the protected-branch checks.

GitHub Actions requires full commit-SHA pins and allows GitHub-owned external actions. Workflows from all external contributors require maintainer approval before running. Default workflow tokens remain read-only, and workflow approval of pull requests is disabled.

### Deployment and search

Vercel publishes `dist/` using `vercel.json`. Canonical identity lives in `src/lib/seo.ts`; metadata and crawler files are generated by `scripts/site-metadata.ts`. Preserve the canonical domain, social metadata, structured data, and `/opengraph-image` redirect. Update the static 1200×630 social image when its copy or identity changes.

`/llms.txt` is a concise portfolio guide for language models, maintained in `public/llms.txt` and linked from the page metadata. `/robots.txt` is generated alongside `/sitemap.xml`; it allows crawling and includes the canonical sitemap link in production.

`VERCEL_ENV=preview` or `development` produces `noindex, follow` and an empty sitemap. Other environments list only the canonical homepage. Optional search-verification variables are documented in `.env.example` and read at build time.

</details>
