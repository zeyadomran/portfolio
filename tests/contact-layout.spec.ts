import { test, expect } from "@playwright/test";

test("phone contact cards share full-width edges and aligned labels and arrows", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 320, 360, 430, 480, 599]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#links");
    await page.evaluate(() => document.fonts.ready);
    const boxes = await page.locator(".contact-link").evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        const label = card
          .querySelector(".link-label")!
          .getBoundingClientRect();
        const arrow = card
          .querySelector(".link-arrow")!
          .getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          labelX: label.x,
          labelRight: label.right,
          labelCenter: label.y + label.height / 2,
          arrowX: arrow.x,
          arrowRight: arrow.right,
          arrowCenter: arrow.y + arrow.height / 2,
        };
      }),
    );
    const container = await page.locator(".contact-links").boundingBox();
    expect(boxes).toHaveLength(3);
    for (const [index, box] of boxes.entries()) {
      expect(box.x, `card ${index} left edge at ${width}px`).toBeCloseTo(
        container!.x,
        1,
      );
      expect(box.width, `card ${index} width at ${width}px`).toBeCloseTo(
        container!.width,
        1,
      );
      expect(box.height).toBeCloseTo(boxes[0].height, 1);
      expect(box.labelX).toBeCloseTo(boxes[0].labelX, 1);
      expect(box.arrowRight).toBeCloseTo(boxes[0].arrowRight, 1);
      expect(box.labelCenter).toBeCloseTo(box.arrowCenter, 1);
      expect(box.labelRight).toBeLessThan(box.arrowX);
      if (index > 0)
        expect(
          box.y - boxes[index - 1].y - boxes[index - 1].height,
        ).toBeCloseTo(16, 1);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("wider contact cards retain their equal square columns", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [600, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#links");
    await page.evaluate(() => document.fonts.ready);
    const boxes = await page.locator(".contact-link").evaluateAll((cards) =>
      cards.map((card) => {
        const { y, width, height } = card.getBoundingClientRect();
        return { y, width, height };
      }),
    );
    for (const box of boxes) {
      expect(box.y).toBeCloseTo(boxes[0].y, 1);
      expect(box.width).toBeCloseTo(boxes[0].width, 1);
      expect(box.height).toBeCloseTo(box.width, 1);
    }
  }
});
