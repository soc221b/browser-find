import { expect, test } from "./fixtures";

test.describe("Toggle Match Whole Word", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("toggle-match-whole-word.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should toggle match whole word and update results", async ({
    page,
    getHighlightCounts,
  }) => {
    const input = page.getByLabel("Search");
    await input.fill("find");

    const result = page.getByRole("status");
    // Should find: find, finding, refind
    await expect(result).toHaveText("1/3");

    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(4);
      expect(highlights.theOthersCount).toBe(8);
    }).toPass();

    const toggle = page.getByRole("button", { name: "Match Whole Word" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(result).toHaveText("1/1");

    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(4);
      expect(highlights.theOthersCount).toBe(0);
    }).toPass();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(result).toHaveText("1/3");
  });
});
