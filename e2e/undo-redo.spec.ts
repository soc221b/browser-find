import { expect, test } from "./fixtures";

test.describe("Undo and Redo", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("input.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should undo text input", async ({ page }) => {
    const input = page.getByLabel("Search");

    await input.focus();
    await page.keyboard.type("hello");
    await page.waitForTimeout(100);
    await page.keyboard.type(" ");
    await page.waitForTimeout(100);
    await page.keyboard.type("world");
    await page.waitForTimeout(1000); // Wait for debounced commit

    await expect(input).toHaveValue("hello world");

    // Undo "world" (back to "hello ")
    await page.keyboard.press("ControlOrMeta+z");
    await expect(input).toHaveValue("hello ");

    // Undo "hello " (back to "")
    await page.keyboard.press("ControlOrMeta+z");
    await expect(input).toHaveValue("");

    // Redo
    await page.keyboard.press("ControlOrMeta+Shift+z");
    await expect(input).toHaveValue("hello ");

    await page.keyboard.press("ControlOrMeta+Shift+z");
    await expect(input).toHaveValue("hello world");
  });

  test("should persist history across close and reopen", async ({ page }) => {
    const input = page.getByLabel("Search");

    await input.focus();
    await page.keyboard.type("persist");
    await page.waitForTimeout(1000); // Commit

    await page.keyboard.press("Escape");
    await expect(input).not.toBeVisible();

    await page.keyboard.press("ControlOrMeta+f");
    await expect(input).toBeVisible();
    await expect(input).toHaveValue("persist");

    await page.keyboard.press("ControlOrMeta+z");
    await expect(input).toHaveValue("");
  });

  test("should clear future history on new input", async ({ page }) => {
    const input = page.getByLabel("Search");

    await input.focus();
    await page.keyboard.type("first");
    await page.waitForTimeout(1000); // Commit

    await page.keyboard.press("ControlOrMeta+z");
    await expect(input).toHaveValue("");

    await page.keyboard.type("second");
    await page.waitForTimeout(1000); // Commit

    // Redo should do nothing now
    await page.keyboard.press("ControlOrMeta+Shift+z");
    await expect(input).toHaveValue("second");
  });
});
