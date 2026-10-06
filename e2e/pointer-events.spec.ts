import { expect, test } from "./fixtures";

test.describe("Pointer Events", () => {
  test("should focus the input by clicking when the page disables pointer events", async ({
    page,
    loadFixture,
  }) => {
    await loadFixture("pointer-events.fixture.html");

    await page.keyboard.press("ControlOrMeta+f");

    const input = page.getByRole("search").getByLabel("Search");
    await expect(input).toBeFocused();

    await page.locator("#outside").focus();
    await expect(input).not.toBeFocused();

    await input.click({ timeout: 3000 });
    await expect(input).toBeFocused();
  });
});
