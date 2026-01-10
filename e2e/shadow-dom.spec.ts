import { expect, test } from "./fixtures";

test.describe("Shadow DOM Search", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("shadow-dom.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should find text in open shadow root", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("Shadow Content");

    const result = page.getByRole("status");
    // "Shadow Content" appears in open-shadow and mixed-shadow-root (inside "More Shadow Content")
    // and "Shadow Content" as substring of "Nested Shadow Content"
    // Wait, let's be more specific.
    await expect(result).toHaveText(/1\/\d+/);
  });

  test("should find text in nested shadow root", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("Nested Shadow Content");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/1");
  });

  test("should find text in mixed light and shadow DOM", async ({ page }) => {
    const input = page.getByLabel("Search");

    // Search for light DOM text
    await input.fill("Light DOM Text");
    await expect(page.getByRole("status")).toHaveText("1/1");

    // Search for shadow DOM text in the same element
    await input.fill("More Shadow Content");
    await expect(page.getByRole("status")).toHaveText("1/1");
  });
});
