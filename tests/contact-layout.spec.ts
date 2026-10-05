import { test, expect } from "@playwright/test";

test("contact destinations fit phone and desktop viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 600, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#contact");
    const email = page.getByRole("link", {
      name: "ziomran@gmail.com",
      exact: true,
    });
    await expect(email).toBeVisible();
    const box = await email.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/zeyadomran",
    );
    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/zeyadomran",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("copy email reports success and retains a usable fallback on rejection", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          document.body.dataset.copiedEmail = value;
        },
      },
    });
  });
  await page.goto("/#contact");
  const contact = page.locator("#contact");
  await contact
    .getByRole("button", { name: "Copy email address", exact: true })
    .click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-copied-email",
    "ziomran@gmail.com",
  );
  await expect(contact.getByRole("status")).toHaveText("Email copied.");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Clipboard permission denied");
        },
      },
    });
  });
  await contact
    .getByRole("button", { name: "Copied email address", exact: true })
    .click();
  await expect(contact.getByRole("status")).toContainText(
    "Couldn’t copy. Select the email address",
  );
  await expect(
    contact.getByRole("link", { name: "ziomran@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:ziomran@gmail.com");
});
