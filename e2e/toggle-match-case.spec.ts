import { expect, test } from "./fixtures";

test.describe("Toggle Match Case", () => {
  test.beforeEach(async ({ page, loadFixture, getModifier }) => {
    await loadFixture("toggle-match-case.fixture.html");
    await page.waitForTimeout(500);
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);
  });

  test("should toggle match case and update results", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("apple");

    const result = page.getByRole("status");
    // Initially case-insensitive? Let's check.
    // If it finds apple, Apple, APPLE, then it's 3 matches.
    await expect(result).toHaveText("1/3");

    const toggle = page.getByRole("button", { name: "Match Case" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(result).toHaveText("1/1");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(result).toHaveText("1/3");
  });
});
