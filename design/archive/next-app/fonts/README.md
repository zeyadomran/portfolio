# Local portfolio typography

The personal portfolio uses these user-supplied font files:

- `PPNeueMontreal-Regular.otf` — display regular, weight 400
- `PPNeueMontreal-Semibold.otf` — display semibold, weight 600
- `PPNeueMontrealText-Book.otf` — reading text, weight 375

Place them in this directory before starting or building a fresh checkout. `src/app/layout.tsx` loads them through `next/font/local`; the social image also reads the Regular file. Font binaries are ignored by Git to avoid redistributing the supplied font package through the public source repository. A fresh clone or remote build therefore needs these files provisioned separately.

Original local source: the `otf` folder inside the user-supplied PP Neue Montreal Free for Personal Use v3.0 download.

Pangram Pangram's [official FAQ](https://pangrampangram.com/pages/faq), checked September 16, 2026, lists personal portfolios in PDF, print, and web as personal-use examples. The older bundled May 2021 document prompted an overly broad initial restriction during this task; the current FAQ clarified that the intended personal web portfolio is included. Retain the supplied license materials and consult the foundry's current terms if the project's use changes.
