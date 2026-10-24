import { expect, test } from "./fixtures";

test.describe("Details Element", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("details.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should open a closed details element when its content is the current match", async ({
    page,
  }) => {
    await page.getByLabel("Search").fill("target");

    await expect(page.getByRole("status")).toHaveText("1/2");
    await expect(page.locator("#closed")).toHaveAttribute("open");
  });

  test("should not open a details element when the match is in its summary", async ({ page }) => {
    await page.getByLabel("Search").fill("target");
    await expect(page.getByRole("status")).toHaveText("1/2");

    await page.keyboard.press("Enter");

    await expect(page.getByRole("status")).toHaveText("2/2");
    await expect(page.locator("#summary-only")).not.toHaveAttribute("open");
  });
});
