import { expect, test } from "./fixtures";

test.describe("Focus Trap", () => {
  test("should focus the input when the page traps focus", async ({ page, loadFixture }) => {
    await loadFixture("focus-trap.fixture.html");

    await page.locator("#trapped:focus").waitFor();

    await page.keyboard.press("ControlOrMeta+f");

    const findBar = page.getByRole("search");
    await expect(findBar).toBeVisible();
    await expect(findBar.getByLabel("Search")).toBeFocused();
  });

  test("should not let the page handle Escape when closing", async ({ page, loadFixture }) => {
    await loadFixture("focus-trap.fixture.html");

    await page.keyboard.press("ControlOrMeta+f");

    const findBar = page.getByRole("search");
    await findBar.waitFor();

    await page.keyboard.press("Escape");

    await expect(findBar).toBeHidden();
    await expect(page.getByRole("combobox", { name: "Trapped" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByRole("listbox", { name: "Dropdown" })).toBeVisible();
  });
});
