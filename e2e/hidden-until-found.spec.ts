import { expect, test } from "./fixtures";

test.describe("Hidden Until Found", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("hidden-until-found.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should not match content hidden by the hidden attribute", async ({ page }) => {
    await page.getByLabel("Search").fill("target");

    await expect(page.getByRole("status")).toHaveText("1/2");
    await expect(page.locator("#hidden")).toHaveAttribute("hidden", "");
  });

  test("should reveal a hidden until-found element when its content is the current match", async ({
    page,
  }) => {
    await page.getByLabel("Search").fill("target");

    await expect(page.getByRole("status")).toHaveText("1/2");
    await expect(page.locator("#first")).not.toHaveAttribute("hidden");
    await expect(page.locator("#outer")).toHaveAttribute("hidden", "until-found");
    await expect(page.locator("#inner")).toHaveAttribute("hidden", "until-found");
  });

  test("should fire a bubbling beforematch event before removing the hidden attribute", async ({
    page,
  }) => {
    await page.getByLabel("Search").fill("target");

    await expect(page.getByRole("status")).toHaveText("1/2");
    await expect(page.locator("#first")).toHaveAttribute(
      "data-hidden-on-beforematch",
      "until-found",
    );
    await expect(page.locator("#outer")).not.toHaveAttribute("data-hidden-on-beforematch");
  });

  test("should reveal every hidden until-found ancestor of the current match", async ({ page }) => {
    await page.getByLabel("Search").fill("target");
    await expect(page.getByRole("status")).toHaveText("1/2");

    await page.keyboard.press("Enter");

    await expect(page.getByRole("status")).toHaveText("2/2");
    for (const id of [
      "#outer",
      "#inner",
    ]) {
      await expect(page.locator(id)).not.toHaveAttribute("hidden");
      await expect(page.locator(id)).toHaveAttribute("data-hidden-on-beforematch", "until-found");
    }
  });
});
