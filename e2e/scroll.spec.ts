import { expect, test } from "./fixtures";

test.describe("Scroll Behavior", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("scroll.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    await page.setViewportSize({
      width: 800,
      height: 600,
    });
  });

  test("should not scroll when the first match is already visible", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("target");

    await expect(page.getByRole("status")).toHaveText("1/3");

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test("should scroll when navigating to a non-visible match (Next)", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("target");

    await expect(page.getByRole("status")).toHaveText("1/3");

    // Press Enter to go to the middle match
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText("2/3");

    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThanOrEqual(500);
      expect(scrollY).toBeLessThanOrEqual(1000);
    }).toPass();
  });

  test("should scroll when navigating to a non-visible match (Previous)", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("target");

    await expect(page.getByRole("status")).toHaveText("1/3");

    // Go to the bottom match first
    await page.keyboard.press("Shift+Enter");
    await expect(page.getByRole("status")).toHaveText("3/3");

    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(1500);
    }).toPass();

    // Press Find Previous button to go back to the middle match
    await page.getByRole("button", { name: "Find Previous" }).click();
    await expect(page.getByRole("status")).toHaveText("2/3");

    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThanOrEqual(500);
      expect(scrollY).toBeLessThanOrEqual(1000);
    }).toPass();
  });

  test("should not scroll when navigating between visible matches", async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector(".spacer")?.remove();
    });

    const input = page.getByLabel("Search");
    await input.fill("target");

    await expect(page.getByRole("status")).toHaveText("1/3");

    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // Press Enter to go to second match (top2), which is also visible
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText("2/3");

    // Should still be at 0
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(0);
  });

  test("should scroll to 0 when wrapping around from bottom to top (Next)", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("target");

    await expect(page.getByRole("status")).toHaveText("1/3");

    // Go to the bottom match first
    await page.keyboard.press("Shift+Enter");
    await expect(page.getByRole("status")).toHaveText("3/3");

    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(1500);
    }).toPass();

    // Wrap around to top
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText("1/3");

    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(0);
    }).toPass();
  });
});
