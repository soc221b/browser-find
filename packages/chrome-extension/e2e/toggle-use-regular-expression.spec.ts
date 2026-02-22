import { expect, test } from "./fixtures";

test.describe("Toggle Regular Expression", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("toggle-use-regular-expression.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should toggle regex and update results", async ({ page, getHighlightCounts }) => {
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
    // In fixture: abc123 abc4567 abc89 should match abc\d+
    await expect(result).toHaveText("1/3");

    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(6); // abc123
      expect(highlights.theOthersCount).toBe(12); // abc4567 (7) + abc89 (5)
    }).toPass();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(result).toHaveText("0/0");

    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(0);
      expect(highlights.theOthersCount).toBe(0);
    }).toPass();
  });
});
