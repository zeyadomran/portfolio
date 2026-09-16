import { test, expect } from "@playwright/test";

test("contact destinations fit phone and desktop viewports", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 600, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#links");
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
