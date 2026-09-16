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
