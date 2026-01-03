import { expect, test } from "./fixtures";

test.describe("Find Previous", () => {
  test.beforeEach(async ({ page, loadFixture, getModifier }) => {
    await loadFixture("find-previous.fixture.html");
    await page.waitForTimeout(500);
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);
  });

  test("should cycle backwards through matches using Shift+Enter", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("test");

    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);
    const text = await result.textContent();
    const total = text!.split("/")[1];

    await page.keyboard.press("Shift+Enter");
    await expect(result).toHaveText(`${total}/${total}`);

    await page.keyboard.press("Shift+Enter");
    await expect(result).toHaveText(`${parseInt(total) - 1}/${total}`);
  });

  test("should cycle backwards through matches using the Previous button", async ({ page }) => {
    const input = page.getByLabel("Search");
    await input.fill("test");

    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);
    const text = await result.textContent();
    const total = text!.split("/")[1];

    const prevButton = page.getByRole("button", { name: "Find Previous" });
    await prevButton.click();
    await expect(result).toHaveText(`${total}/${total}`);
  });
});
