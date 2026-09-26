import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`narrative and navigation remain usable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Complexity,made human.",
    );
    await expect(page.getByRole("article")).toHaveCount(3);
    await page
      .getByRole("link", { name: "Explore my work", exact: true })
      .click();
    await expect(page).toHaveURL(/#work$/);
    await page.locator("#assistant").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", { name: "An answer is only the beginning." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 768) {
      const intro = await page.locator("#assistant .case-intro").boundingBox();
      const figure = await page
        .locator("#assistant .case-figure")
        .boundingBox();
      expect(intro!.y + intro!.height).toBeLessThanOrEqual(figure!.y);
    }
  });
}

test("workspace fills the left side while the assistant stays fixed on the right", async ({
  page,
}) => {
  await page.goto("/#assistant");
  const before = await page.locator(".right-assistant").boundingBox();
  await page
    .getByRole("button", { name: "Open workspace", exact: true })
    .click();
  const after = await page.locator(".right-assistant").boundingBox();
  const workspace = await page.locator(".side-workspace").boundingBox();
  expect(after!.x).toBeCloseTo(before!.x, 0);
  expect(after!.width).toBeCloseTo(before!.width, 0);
  expect(after!.height).toBeCloseTo(before!.height, 0);
  await expect(page.locator(".side-workspace")).toBeVisible();
  expect(workspace!.x).toBeLessThan(after!.x);
  const name = page.getByRole("textbox", {
    name: "Illustrative overview name",
  });
  await name.fill("Quarterly overview");
  await page
    .getByRole("combobox", { name: "Illustrative reporting period" })
    .selectOption("Last month");
  await page.locator(".workspace-heading button").click();
  await page
    .getByRole("button", { name: "Open workspace", exact: true })
    .click();
  await expect(name).toHaveValue("Quarterly overview");
  await expect(
    page.getByRole("combobox", { name: "Illustrative reporting period" }),
  ).toHaveValue("Last month");
  await page.getByRole("button", { name: "Prepare draft" }).click();
  await expect(page.locator(".workspace-content [role=status]")).toHaveText(
    "Your draft is ready. Your conversation stays in view.",
  );
  await expect(page).toHaveURL(/#assistant$/);
});

test("configuration and rendered components stay in sync", async ({ page }) => {
  await page.goto("/#systems");
  const configuration = page.locator(".configuration pre");
  await page.getByRole("checkbox", { name: "Chart", exact: true }).uncheck();
  await expect(page.locator(".chart-widget")).toHaveCount(0);
  await expect(configuration).toBeVisible();
  await expect(configuration).not.toContainText('"chart"');
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: "Chart", exact: true }),
  ).toBeChecked();
  await expect(page.locator(".chart-widget")).toBeVisible();
  await expect(configuration).toContainText('"chart"');
});

test("migrating to the shared table changes one configuration value", async ({
  page,
}) => {
  await page.goto("/#systems");
  const configuration = page.locator(".configuration pre");
  const before = (await configuration.textContent())!.split("\n");
  await page.getByRole("radio", { name: "Shared" }).check();
  await expect(page.locator(".table-widget")).toHaveClass(/is-shared/);
  const after = (await configuration.textContent())!.split("\n");
  const changed = after.filter((line, i) => line !== before[i]);
  expect(changed).toEqual(['    { "type": "shared-table" }']);
  await page.getByRole("checkbox", { name: "Table", exact: true }).uncheck();
  await expect(page.getByRole("radio", { name: "Shared" })).toBeDisabled();
});

test("the assistant's steps follow the workspace form", async ({ page }) => {
  await page.goto("/#assistant");
  const steps = page.getByRole("list", { name: "Steps" }).getByRole("listitem");
  await page
    .getByRole("button", { name: "Open workspace", exact: true })
    .click();
  await page.getByRole("button", { name: "Prepare draft" }).click();
  await expect(page.locator(".workspace-content [role=status]")).toHaveText(
    "Add a name and a period to prepare the draft.",
  );
  await expect(
    page.getByRole("textbox", { name: "Illustrative overview name" }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(steps.filter({ hasText: "(done)" })).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Illustrative overview name" })
    .fill("Quarterly overview");
  await expect(steps.nth(0)).toContainText("(done)");
  await page
    .getByRole("combobox", { name: "Illustrative reporting period" })
    .selectOption("This month");
  await page.getByRole("button", { name: "Prepare draft" }).click();
  await expect(steps.filter({ hasText: "(done)" })).toHaveCount(3);
});

test("the timing schematic can be scrubbed and replayed", async ({ page }) => {
  await page.goto("/#optimization");
  const elapsed = page.getByRole("slider", { name: "Elapsed" });
  await expect(elapsed).toHaveValue("8");
  await elapsed.fill("3.2");
  await expect(elapsed).toHaveAttribute(
    "aria-valuetext",
    "3.2 seconds. After: finished at 3 seconds. Before: 40% done.",
  );
  await page
    .getByRole("button", { name: "Replay comparison", exact: true })
    .click();
  await expect(page.locator(".timing-tracks")).toHaveClass(/is-playing/);
  await elapsed.fill("5");
  await expect(page.locator(".timing-tracks")).not.toHaveClass(/is-playing/);
  await expect(elapsed).toHaveValue("5");
});

test("tabs, buttons and chips share one size and type", async ({ page }) => {
  await page.goto("/");
  const styles = await page.$$eval(
    [
      ".layer-controls button",
      ".figure-step-controls button",
      ".builder-tabs button",
      ".table-version label",
      ".builder-options label",
      ".launch-workspace",
      ".replay-button",
      ".copy-email button",
      ".resume-download",
    ].join(","),
    (controls) => [
      ...new Set(
        controls.map((control) => {
          const style = getComputedStyle(control);
          return `${style.fontSize} ${style.minHeight}`;
        }),
      ),
    ],
  );
  expect(styles).toEqual(["13px 44px"]);
});

test("the header names the chapter being read", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("#systems").scrollIntoViewIfNeeded();
  await expect(page.locator(".header-context")).toHaveText("1.2 Modularity");
});

test("work stays current when returning from About to a work chapter", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await page.locator("#systems").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("link", { name: "Work", exact: true }),
  ).toHaveAttribute("aria-current", "location");
});

test("reduced motion retains the complete narrative and disclosures", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const id of ["assistant", "systems", "optimization"]) {
    await page.locator(`#${id} .story-detail summary`).click();
    await expect(page.locator(`#${id} .story-detail`)).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator(`#${id} .story-detail h4`).first()).toBeVisible();
  }
  await page
    .getByRole("button", { name: "Replay comparison", exact: true })
    .click();
  await expect(page.locator(".timing-tracks")).not.toHaveClass(/is-playing/);
});

test("the core story and contact remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.locator("#assistant .story-detail summary").click();
  await expect(page.locator("#assistant .story-detail")).toHaveAttribute(
    "open",
    "",
  );
  await expect(
    page.getByRole("link", { name: "ziomran@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:ziomran@gmail.com");
  await context.close();
});

test("skip link is available to a keyboard reader", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
