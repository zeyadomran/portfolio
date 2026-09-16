import { test, expect } from "@playwright/test";

for (const width of [320, 390, 540, 768, 1024, 1440, 1824, 2560]) {
  test(`hero cards leave content and controls clear at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    for (const name of ["01 People", "02 Interface", "03 System"]) {
      const control = page.getByRole("button", { name, exact: true });
      await control.click();
      await expect(control).toHaveAttribute("aria-pressed", "true");
      const stage = await page.locator(".layer-stage").boundingBox();
      await page.mouse.move(
        stage!.x + stage!.width - 8,
        stage!.y + stage!.height - 8,
      );
      await expect
        .poll(async () =>
          page.evaluate(() => {
            const stage = document.querySelector<HTMLElement>(".layer-stage")!;
            const controls = document
              .querySelector(".layer-controls")!
              .getBoundingClientRect();
            const cards = Array.from(
              document.querySelectorAll<HTMLElement>(
                ".system-plane,.interface-plane,.people-plane",
              ),
            );
            const selected = stage.dataset.layer;
            const active = document.querySelector<HTMLElement>(
              selected === "0"
                ? ".people-plane"
                : selected === "1"
                  ? ".interface-plane"
                  : ".system-plane",
            )!;
            return {
              clear: cards.every(
                (card) =>
                  card.getBoundingClientRect().bottom <= controls.top - 16,
              ),
              selectedAboveOthers: cards
                .filter((card) => card !== active)
                .every(
                  (card) =>
                    Number(getComputedStyle(card).zIndex) <
                    Number(getComputedStyle(active).zIndex),
                ),
              pageFits: document.documentElement.scrollWidth <= innerWidth,
            };
          }),
        )
        .toEqual({ clear: true, selectedAboveOthers: true, pageFits: true });
    }
  });
}
