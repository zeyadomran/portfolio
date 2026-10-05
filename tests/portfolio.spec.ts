import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`assistant answers, opens work, validates and preserves a draft at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#assistant");
    const figure = page.locator("#assistant figure");
    await figure
      .getByRole("button", { name: "What’s an overview?", exact: true })
      .click();
    await expect(figure.getByRole("log")).toContainText(
      "An overview is a summary of your data",
    );
    await expect(
      figure.getByRole("button", { name: /Open the form/ }),
    ).toHaveCount(0);
    await figure
      .getByRole("button", { name: "Help me make one", exact: true })
      .click();
    const launch = figure.getByRole("button", { name: /Open the form/ });
    const chatBefore = await figure.locator(".ask-chat").boundingBox();
    await launch.click();
    const workspace = figure.getByRole("region", { name: "New overview" });
    await expect(workspace).toBeFocused();
    const name = workspace.getByRole("textbox", { name: "Name", exact: true });
    const period = workspace.getByRole("combobox", {
      name: "Period",
      exact: true,
    });
    await expect(name).toHaveValue("September overview");
    await expect(period).toHaveValue("Last month");
    if (width > 759) {
      const chat = await figure.locator(".ask-chat").boundingBox();
      const box = await workspace.boundingBox();
      expect(chat!.x).toBeCloseTo(chatBefore!.x, 0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(chat!.x + 1);
    }
    await name.fill("");
    await period.selectOption("");
    await workspace.getByRole("button", { name: "Save draft" }).click();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(period).toHaveAttribute("aria-invalid", "true");
    await expect(
      figure.getByRole("list", { name: "Steps" }).getByText("(done)"),
    ).toHaveCount(0);
    await name.fill("Quarterly overview");
    await period.selectOption("This month");
    await page.keyboard.press("Escape");
    await expect(launch).toBeFocused();
    await launch.click();
    await expect(name).toHaveValue("Quarterly overview");
    await expect(period).toHaveValue("This month");
    await workspace.getByRole("button", { name: "Save draft" }).click();
    await expect(workspace.getByRole("status")).toHaveText(
      "Done, and the conversation never left the screen.",
    );
    await expect(
      figure.getByRole("list", { name: "Steps" }).getByText("(done)"),
    ).toHaveCount(3);
    await workspace.getByRole("button", { name: "Close workspace" }).click();
    await figure.getByRole("button", { name: "Start over" }).click();
    await expect(figure.getByRole("log")).toContainText(
      "Pick a question below.",
    );
  });
}

for (const width of [390, 768, 1440]) {
  test(`shared options update every sample page and survive mode changes at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#systems");
    const figure = page.locator("#systems figure");
    await expect(
      figure.getByRole("button", { name: "Row selection", exact: true }),
    ).toBeDisabled();
    await figure
      .getByRole("button", { name: "After · 1 shared", exact: true })
      .click();
    await expect(figure.locator(".shared-config")).toContainText(
      '"type": "shared-table"',
    );
    await figure
      .getByRole("button", { name: "Row selection", exact: true })
      .click();
    for (const slug of ["sites", "suppliers", "orders"]) {
      if (width < 760)
        await figure
          .getByRole("tab", { name: `/${slug}`, exact: true })
          .click();
      const sample = figure.locator(`#page-${slug}`);
      const card = (await sample.boundingBox())!;
      const table = (await sample.getByRole("table").boundingBox())!;
      expect(table.x).toBeGreaterThanOrEqual(card.x);
      expect(table.x + table.width).toBeLessThanOrEqual(card.x + card.width);
      for (const status of await sample.locator(".sample-status").all()) {
        const box = (await status.boundingBox())!;
        expect(box.x + box.width).toBeLessThanOrEqual(card.x + card.width);
      }
    }
    await figure
      .getByRole("button", { name: "Status column", exact: true })
      .click();
    for (const slug of ["sites", "suppliers", "orders"]) {
      if (width < 760)
        await figure
          .getByRole("tab", { name: `/${slug}`, exact: true })
          .click();
      const table = figure.getByRole("table", {
        name: `${slug} sample table`,
        exact: true,
      });
      await expect(
        table.getByRole("columnheader", { name: "Selection" }),
      ).toBeVisible();
      await expect(
        table.getByRole("columnheader", { name: "Status", exact: true }),
      ).toHaveCount(0);
    }
    await expect(figure.getByRole("status")).toContainText("2 changes");
    await figure
      .getByRole("button", { name: "Before · 3 copies", exact: true })
      .click();
    await expect(figure.locator(".shared-config")).toContainText(
      '"type": "data-grid"',
    );
    await figure
      .getByRole("button", { name: "After · 1 shared", exact: true })
      .click();
    await expect(
      figure.getByRole("button", { name: "Row selection", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      figure.getByRole("button", { name: "Status column", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  });
}

test("the timing schematic scrubs, runs on one clock and respects reduced motion", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#optimization");
  const figure = page.locator("#optimization figure");
  const slider = figure.getByRole("slider", { name: "Elapsed" });
  await expect(slider).toHaveValue("8");
  await slider.fill("3.2");
  await expect(figure.locator(".race-before .race-state")).toHaveText(
    "Waiting…",
  );
  await expect(figure.locator(".race-after .race-state")).toHaveText(
    "Rendered",
  );
  await expect(slider).toHaveAttribute(
    "aria-valuetext",
    "3.2 seconds. After: finished at 3 seconds. Before: 40% done.",
  );
  await figure.getByRole("button", { name: "Run both" }).click();
  await page.clock.runFor(3200);
  await expect(figure.locator(".race-after .race-timer")).toHaveText("3.0s");
  await expect(figure.locator(".race-before .race-state")).toHaveText(
    "Waiting…",
  );
  await slider.fill("5");
  await page.clock.runFor(1000);
  await expect(slider).toHaveValue("5");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await figure.getByRole("button", { name: "Run both" }).click();
  await expect(slider).toHaveValue("8");
  await expect(figure.locator(".race-state")).toHaveText([
    "Rendered",
    "Rendered",
  ]);
});
