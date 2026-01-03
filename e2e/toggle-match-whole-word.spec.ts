import { expect, test } from "./fixtures";

test.describe("Toggle Match Whole Word", () => {
  test.beforeEach(async ({ page, loadFixture, getModifier }) => {
    await loadFixture("toggle-match-whole-word.fixture.html");
    await page.waitForTimeout(500);
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);
  });

  test("should toggle match whole word and update results", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("find");

    const result = page.getByRole("status");
    // Should find: find, finding (undefined does NOT contain find)
    await expect(result).toHaveText("1/2");

    const toggle = page.getByRole("button", { name: "Match Whole Word" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(result).toHaveText("1/1");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(result).toHaveText("1/2");
  });
});
