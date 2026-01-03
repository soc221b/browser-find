import { expect, test } from "./fixtures";

test("should show find bar when pressing Meta+F / Ctrl+F", async ({ page }) => {
  await page.goto("https://example.com");

  // Trigger the find bar
  const isMac = process.platform === "darwin";
  const modifier = isMac ? "Meta" : "Control";
  await page.keyboard.press(`${modifier}+f`);

  // Check if the container exists
  const container = page.locator("#browser-find-top-layer");
  await expect(container).toBeAttached();
});
