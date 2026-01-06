import { expect, test } from "./fixtures";

test.describe("Find Previous", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("find-previous.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should cycle backwards through matches using Shift+Enter", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    await page.keyboard.press("Shift+Enter");
    await expect(result).toHaveText("3/3");

    await page.keyboard.press("Shift+Enter");
    await expect(result).toHaveText("2/3");
  });

  test("should cycle backwards through matches using the Previous button", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    const prevButton = page.getByRole("button", { name: "Find Previous" });
    await prevButton.click();
    await expect(result).toHaveText("3/3");
  });

  test("should highlight matches with correct colors after Previous", async ({
    page,
    getHighlightCounts,
  }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const prevButton = page.getByRole("button", { name: "Find Previous" });
    await prevButton.click();

    // Match 3 is "aaaa" (4 chars)
    // Match 1 is "a" (1 char), Match 2 is "aa" (2 chars). Others = 1+2=3
    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(4);
      expect(highlights.theOthersCount).toBe(3);
    }).toPass();
  });
});
