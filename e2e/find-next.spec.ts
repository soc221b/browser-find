import { expect, test } from "./fixtures";

test.describe("Find Next", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("find-next.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should cycle through matches using Enter", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    await page.keyboard.press("Enter");
    await expect(result).toHaveText("2/3");

    await page.keyboard.press("Enter");
    await expect(result).toHaveText("3/3");
  });

  test("should cycle through matches using the Next button", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    const nextButton = page.getByRole("button", { name: "Find Next" });
    await nextButton.click();
    await expect(result).toHaveText("2/3");
  });

  test("should highlight matches with correct colors after Next", async ({
    page,
    getHighlightCounts,
  }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const nextButton = page.getByRole("button", { name: "Find Next" });
    await nextButton.click();

    // Match 2 is "aa" (2 chars)
    // Match 1 is "a" (1 char), Match 3 is "aaaa" (4 chars). Others = 1+4=5
    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(2);
      expect(highlights.theOthersCount).toBe(5);
    }).toPass();
  });
});
