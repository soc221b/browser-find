import { expect, test } from "./fixtures";

test.describe("Toggle Match Case", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("toggle-match-case.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should toggle match case and update results", async ({ page, getHighlightCounts }) => {
    const input = page.getByLabel("Search");
    await input.fill("Apple");

    const result = page.getByRole("status");
    // Initially case-insensitive
    // apple, Apple, APPLE, pineApple
    await expect(result).toHaveText("1/4");

    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(5);
      expect(highlights.theOthersCount).toBe(15);
    }).toPass();

    const toggle = page.getByRole("button", { name: "Match Case" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(result).toHaveText("1/2");

    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(5);
      expect(highlights.theOthersCount).toBe(5);
    }).toPass();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(result).toHaveText("1/4");
  });
});
