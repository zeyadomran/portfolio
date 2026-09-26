import { test, expect } from "@playwright/test";

test("workspace keyboard flow enters its fields and returns to the launcher", async ({
  page,
}) => {
  await page.goto("/#assistant");
  const launcher = page.getByRole("button", {
    name: "Open workspace",
    exact: true,
  });
  await launcher.focus();
  await page.keyboard.press("Enter");

  const workspace = page.getByRole("region", {
    name: "Illustrative workspace",
  });
  await expect(workspace).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    workspace.getByRole("button", { name: "Close workspace", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    workspace.getByRole("textbox", { name: "Illustrative overview name" }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(workspace).toHaveCount(0);
  await expect(launcher).toBeFocused();
});

test("case index jumps to each chapter", async ({ page }) => {
  await page.goto("/");
  const index = page.getByRole("list", { name: "Case studies" });
  for (const [name, id] of [
    ["AI assistant", "assistant"],
    ["Modularity", "systems"],
    ["Optimization", "optimization"],
  ]) {
    await index.getByRole("link", { name: new RegExp(name) }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id} .case-header`)).toBeInViewport();
  }
});

test("illustrations stay out of the heading outline", async ({ page }) => {
  await page.goto("/#assistant");
  await page
    .getByRole("button", { name: "Open workspace", exact: true })
    .click();
  await expect(page.locator(".case-figure :is(h1,h2,h3,h4,h5,h6)")).toHaveCount(
    0,
  );
});

test("the resume download is a PDF", async ({ page, request }) => {
  await page.goto("/");
  const href = await page
    .getByRole("link", { name: /Resume/ })
    .getAttribute("href");
  const response = await request.get(href!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("workspace remembers which control opened it", async ({ page }) => {
  await page.goto("/#assistant");
  const controls = page.getByRole("group", {
    name: "Explore the workspace layout",
  });
  const opener = controls.getByRole("button", { name: /Workspace/ });
  await opener.focus();
  await page.keyboard.press("Enter");
  const workspace = page.getByRole("region", {
    name: "Illustrative workspace",
  });
  await expect(workspace).toBeFocused();
  await workspace
    .getByRole("button", { name: "Close workspace", exact: true })
    .click();
  await expect(opener).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(workspace).toBeFocused();
  const conversation = controls.getByRole("button", { name: /Conversation/ });
  await conversation.click();
  await expect(workspace).toHaveCount(0);
  await expect(conversation).toBeFocused();
});
