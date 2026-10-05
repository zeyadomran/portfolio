# Local portfolio typography

The personal portfolio includes these tracked, user-supplied font files:

- `PPNeueMontreal-Regular.otf` — display regular, weight 400
- `PPNeueMontreal-Semibold.otf` — display semibold, weight 600
- `PPNeueMontrealText-Book.otf` — reading text, weight 375

`src/styles.css` loads them through `@font-face`; Vite emits the font assets during the build. A fresh checkout includes the files and needs no separate font provisioning. The social image is a static PNG in `public/opengraph-image.png`.

Original local source: the `otf` folder inside the user-supplied PP Neue Montreal Free for Personal Use v3.0 download.

Pangram Pangram's [official FAQ](https://pangrampangram.com/pages/faq), checked September 16, 2026, lists personal portfolios in PDF, print, and web as personal-use examples. Retain the supplied license materials and consult the foundry's current terms if the project's use changes.

## IBM Plex Mono

IBM Plex Mono Regular (400) and Medium (500) are self-hosted alongside the existing typography. Downloaded from Google Fonts on October 5, 2026; licensed under the SIL Open Font License 1.1 in `IBMPlexMono-OFL.txt`. Source: https://github.com/google/fonts/tree/main/ofl/ibmplexmono. No remote font requests are required at runtime.
