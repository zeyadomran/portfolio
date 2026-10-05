import { test, expect } from "@playwright/test";

for (const width of [320, 390, 540, 768, 1024, 1440, 1824, 2560]) {
  test(`the clarity lens and its controls fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const simplify = page.getByRole("button", {
      name: "Simplify all",
      exact: true,
    });
    await simplify.click();
    await expect(
      page.getByRole("button", { name: "Show the mess" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".lens-status")).toHaveText(
      "Same data. One decision at a time.",
    );
    await expect(page.locator(".lens-clear")).toContainText(
      "3 orders need you.",
    );
    const stage = await page.locator(".lens-stage").boundingBox();
    const controls = await page.locator(".lens-controls").boundingBox();
    expect(stage!.y + stage!.height).toBeLessThanOrEqual(controls!.y);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Show the mess" }).click();
    await expect(simplify).toHaveAttribute("aria-pressed", "false");
  });
}
