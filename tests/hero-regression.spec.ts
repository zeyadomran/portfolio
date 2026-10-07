import { test, expect } from "@playwright/test";

test("a touch holds the clarity lens before wandering resumes", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.clock.install({ time: new Date("2026-10-05T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-05T12:00:01Z"));
    await page.goto("/");
    const stage = page.locator(".lens-stage");
    await stage.scrollIntoViewIfNeeded();
    await page.clock.runFor(500);
    const box = (await stage.boundingBox())!;
    const point = { x: box.x + 55, y: box.y + 65 };
    await page.touchscreen.tap(point.x, point.y);
    await page.clock.runFor(500);
    const ring = page.locator(".lens-ring");
    const held = (await ring.boundingBox())!;
    expect(Math.abs(held.x + held.width / 2 - point.x)).toBeLessThan(2);
    expect(Math.abs(held.y + held.height / 2 - point.y)).toBeLessThan(2);
    await page.clock.runFor(1500);
    const stillHeld = (await ring.boundingBox())!;
    expect(Math.abs(stillHeld.x + stillHeld.width / 2 - point.x)).toBeLessThan(
      2,
    );
    expect(Math.abs(stillHeld.y + stillHeld.height / 2 - point.y)).toBeLessThan(
      2,
    );
    await page.clock.runFor(2500);
    const wandering = (await ring.boundingBox())!;
    expect(
      Math.hypot(
        wandering.x + wandering.width / 2 - point.x,
        wandering.y + wandering.height / 2 - point.y,
      ),
    ).toBeGreaterThan(20);
  } finally {
    await context.close();
  }
});

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
