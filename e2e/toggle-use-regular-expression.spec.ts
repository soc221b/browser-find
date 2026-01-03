import { expect, test } from "./fixtures";

test.describe("Toggle Regular Expression", () => {
  test.beforeEach(async ({ page, loadFixture, getModifier }) => {
    await loadFixture("toggle-use-regular-expression.fixture.html");
    await page.waitForTimeout(500);
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);
  });

  test("should toggle regex and update results", async ({ page }) => {
    const input = page.getByLabel("Search");
    // Search for "abc\d+"
    await input.fill("abc\\d+");

    const result = page.getByRole("status");
    // Initially literal search, should be 0/0
    await expect(result).toHaveText("0/0");

    const toggle = page.getByRole("button", { name: "Use Regular Expression" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    // In regex.html: abc123 should match abc\d+
    await expect(result).toHaveText("1/1");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(result).toHaveText("0/0");
  });
});
