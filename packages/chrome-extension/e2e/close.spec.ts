import { expect, test } from "./fixtures";

test.describe("Close Find Bar", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("close.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    await expect(page.getByRole("search")).toBeVisible();
  });

  test("should close the find bar when pressing Escape", async ({ page }) => {
    await page.keyboard.press("Escape");
    await expect(page.getByRole("search")).toBeHidden();
  });

  test("should close the find bar when clicking the close button", async ({ page }) => {
    // Find the close button by its role and name
    const closeButton = page.getByRole("button", { name: "Close" });
    await closeButton.click();
    await expect(page.getByRole("search")).toBeHidden();
  });
});
