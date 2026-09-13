import { test, expect } from "@playwright/test";

const viewports = [
  [360, 800],
  [390, 844],
  [430, 932],
  [600, 960],
  [820, 1180],
  [1024, 768],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
];

for (const [width, height] of viewports) {
  test(`content and responsive layout at ${width}x${height}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      /ZEYAD\s*OMRAN/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 768) {
      await expect(page.locator(".is-pinned")).toHaveCount(0);
      await expect(page.locator("[data-stage][hidden]")).toHaveCount(0);
    }
    await page.getByRole("link", { name: "Work", exact: true }).click();
    await expect(page.locator(".company-logo")).toBeInViewport();
    await expect
      .poll(() =>
        page
          .locator(".company-logo")
          .evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    await page.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/#links$/);
    await expect(page.locator("#links")).toBeInViewport();
    await expect(page.locator("a.contact-link")).toHaveCount(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("skills selection, announcements, and native horizontal scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "AI Tools", exact: true }).click();
  await expect(page.locator("#skills-ai")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("AI Tools / 5 tools");
  await expect(
    page.getByRole("button", { name: "AI Tools", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#skills-frontend")).toBeHidden();
  await page.getByRole("button", { name: "Front-End", exact: true }).click();
  const rail = page.locator("#skills-frontend ul");
  await rail.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
});

test("desktop stories select and reverse while preserving button focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("[data-story=about]")).toHaveClass(/is-pinned/);
  const story = page.locator("[data-story=about]");
  const buttons = story.locator("[data-stage-button]");
  await buttons.nth(2).click();
  await expect(buttons.nth(2)).toHaveAttribute("aria-current", "step");
  await expect(story.locator("[data-stage]").nth(2)).toBeVisible();
  await expect(buttons.nth(2)).toBeFocused();
  await buttons.nth(0).click();
  await expect(buttons.nth(0)).toHaveAttribute("aria-current", "step");
  await expect(story.locator("[data-stage]").nth(0)).toBeVisible();
});

test("mobile chapter links focus the heading and browser history restores navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Show HCI", exact: true }).click();
  await expect(page).toHaveURL(/#interest-hci$/);
  await expect(page.locator("#interest-hci")).toBeFocused();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/#interest-hci$/);
  await expect(page.locator("#interest-hci")).toBeInViewport();
});

test("reduced motion exposes every chapter and keeps skill controls working", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".skills-explorer")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator(".is-pinned")).toHaveCount(0);
  await expect(page.locator("[data-stage]:visible")).toHaveCount(5);
  await page.getByRole("button", { name: "Back-End", exact: true }).click();
  await expect(page.locator("#skills-backend")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-stage]:visible")).toHaveCount(5);
});

test("without JavaScript every chapter, category, and contact destination is available", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000");
  await expect(page.locator("[data-stage]:visible")).toHaveCount(5);
  await expect(page.locator("[data-skill-group]:visible")).toHaveCount(5);
  await expect(
    page.locator("a[href='mailto:ziomran@gmail.com'].contact-link"),
  ).toBeVisible();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/#links$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("keyboard skip link and contact destinations", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await expect(
    page.locator(".contact-link[href='https://linkedin.com/in/zeyadomran']"),
  ).toHaveAttribute("rel", /noopener/);
  await expect(
    page.locator(".contact-link[href='https://github.com/zeyadomran']"),
  ).toHaveAttribute("target", "_blank");
});
