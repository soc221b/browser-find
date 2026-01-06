import { expect, test } from "./fixtures";

test.describe("Find Next", () => {
  test.beforeEach(async ({ page, loadFixture, getModifier }) => {
    await loadFixture("find-next.fixture.html");
    await page.waitForTimeout(500);
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);
  });

  test("should cycle through matches using Enter", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("test");

    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    await page.keyboard.press("Enter");
    await expect(result).toHaveText(/2\/\d+/);

    await page.keyboard.press("Enter");
    await expect(result).toHaveText(/3\/\d+/);
  });

  test("should cycle through matches using the Next button", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("test");

    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const nextButton = page.getByRole("button", { name: "Find Next" });
    await nextButton.click();
    await expect(result).toHaveText(/2\/\d+/);
  });

  test("should highlight matches with correct colors after Next", async ({
    page,
    getHighlightCounts,
  }) => {
    const input = page.getByLabel("Search");
    await input.fill("test");

    const nextButton = page.getByRole("button", { name: "Find Next" });
    await nextButton.click();

    // Wait for highlights to be applied
    await page.waitForTimeout(500);

    const highlights = await getHighlightCounts();

    expect(highlights.thisCount).toBe(4); // Match 2 is 4 characters
    expect(highlights.theOthersCount).toBe(8); // Matches 1 and 3 are 4+4=8 characters
  });
});
