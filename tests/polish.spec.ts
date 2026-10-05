import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`narrative, navigation and disclosures remain usable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Hard things,made easy to use.",
    );
    await expect(page.locator("article.story")).toHaveCount(3);
    await expect(page.locator(".project-card")).toHaveCount(2);
    const index = page.getByRole("list", { name: "Case studies" });
    for (const id of ["assistant", "systems", "optimization"]) {
      await index.locator(`a[href='#${id}']`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id} .case-header`)).toBeInViewport();
      const detail = page.locator(`#${id} details`);
      await detail.locator("summary").click();
      await expect(detail).toHaveAttribute("open", "");
      await expect(detail.locator("summary")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await expect(detail.locator("h4").first()).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 760) {
      const intro = await page.locator("#assistant .case-intro").boundingBox();
      const figure = await page
        .locator("#assistant .case-figure")
        .boundingBox();
      expect(intro!.y + intro!.height).toBeLessThanOrEqual(figure!.y);
    } else {
      await page
        .locator(".desktop-nav")
        .getByRole("link", { name: "03 About", exact: true })
        .click();
      await expect(
        page.locator(".desktop-nav a[href='#about']"),
      ).toHaveAttribute("aria-current", "location");
      await page.locator("#systems").scrollIntoViewIfNeeded();
      await expect(
        page.locator(".desktop-nav a[href='#work']"),
      ).toHaveAttribute("aria-current", "location");
    }
    await expect(
      page.locator(".case-figure :is(h1,h2,h3,h4,h5,h6)"),
    ).toHaveCount(0);
  });
}

test("mobile Index traps focus, dismisses, restores focus and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const index = page.getByRole("button", { name: "Index", exact: true });
  await index.click();
  const sheet = page.getByRole("dialog", { name: "Page index" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(sheet.getByRole("link", { name: "Resume" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(sheet.getByRole("button", { name: "Close" })).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Escape");
  await expect(sheet).not.toBeVisible();
  await expect(index).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await index.click();
  await sheet.getByRole("link", { name: "1.2 Shared components" }).click();
  await expect(sheet).not.toBeVisible();
  await expect(page).toHaveURL(/#systems$/);
  await expect(page.locator("#systems .case-header")).toBeInViewport();
});

test("assistant streaming and autofill do not overwrite the reader’s edits", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#assistant");
  const figure = page.locator("#assistant figure");
  await figure
    .getByRole("button", { name: "Help me make one", exact: true })
    .click();
  await expect(figure.getByRole("log")).toHaveAttribute("aria-busy", "true");
  await expect(
    figure.getByRole("button", { name: "What’s an overview?" }),
  ).toBeDisabled();
  await page.clock.runFor(2500);
  await expect(figure.getByRole("log")).toHaveAttribute("aria-busy", "false");
  await figure.getByRole("button", { name: /Open the form/ }).click();
  await figure
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("My own overview");
  await page.clock.runFor(1600);
  await expect(
    figure.getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("My own overview");
  await expect(
    figure.getByRole("combobox", { name: "Period", exact: true }),
  ).toHaveValue("Last month");
});

test("the resume download is a PDF", async ({ page, request }) => {
  await page.goto("/");
  const href = await page
    .locator("#contact")
    .getByRole("link", { name: /Resume/ })
    .getAttribute("href");
  const response = await request.get(href!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("the core story, section navigation and contact work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("article.story")).toHaveCount(3);
  await page
    .getByRole("navigation", { name: "Section navigation" })
    .getByRole("link", { name: "Work" })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await page.locator("#assistant .story-detail summary").click();
  await expect(page.locator("#assistant .story-detail")).toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator("#assistant .story-detail")).toContainText(
    "have not been released",
  );
  await expect(
    page
      .locator("#contact")
      .getByRole("link", { name: "ziomran@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:ziomran@gmail.com");
  await context.close();
});

test("skip link takes keyboard readers to the main content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
