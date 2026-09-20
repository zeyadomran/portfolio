# Security policy

## Supported code

Security fixes are maintained on the current `main` branch and deployed to [zeyadomran.com](https://zeyadomran.com). Older commits, release snapshots, and closed pull-request previews are not maintained as separate supported versions.

This policy covers this portfolio's source, build workflows, dependencies, and deployed website. Links to other websites and descriptions of work for other organizations do not extend this policy to those organizations or services.

## Report a vulnerability privately

Use [GitHub's private vulnerability reporting form](https://github.com/zeyadomran/portfolio/security/advisories/new). Do not publish vulnerability details in public issues or pull requests before coordinating disclosure.

Include the affected URL or file, the relevant commit when known, a description of the impact, and minimal steps to reproduce. Screenshots or a small proof of concept can help; remove personal data and active credentials first. For an exposed secret, report its location without copying its value, and revoke or rotate it immediately if you control it.

Keep reproduction limited to the smallest demonstration needed. Do not access other people's data, disrupt the website, or test linked third-party services. Follow-up and disclosure coordination should stay in the private advisory until a fix and publication plan have been discussed.

## Contributing security fixes

Propose changes through a pull request. The protected `main` branch requires all configured CI, code-scanning, dependency-review, and preview checks to pass. Local pre-commit checks catch formatting, lint, type, build, and static-output failures; the required GitHub checks enforce validation before merging.

Keep credentials out of source, test fixtures, screenshots, and logs. Environment variables included in a frontend bundle or prerendered HTML are public. Use the hosting platform's scoped settings for deployment credentials, and rotate any credential that was exposed rather than relying on deleting it from Git history.
