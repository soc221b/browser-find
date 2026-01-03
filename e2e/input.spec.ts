import { expect, test } from "./fixtures";

test.describe("Input and Search", () => {
  test.beforeEach(async ({ page, loadFixture, getModifier }) => {
    await loadFixture("input.fixture.html");
    await page.waitForTimeout(500);
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);
  });

  test("should find multiple matches", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("test");

    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/); // Should find some matches
    const text = await result.textContent();
    const total = parseInt(text!.split("/")[1]);
    expect(total).toBeGreaterThan(1);
  });

  test("should find a unique match", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("unique");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/1");
  });

  test("should show 0/0 when no matches are found", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("nonexistent");

    const result = page.getByRole("status");
    await expect(result).toHaveText("0/0");
  });
});
