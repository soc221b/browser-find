import { expect, test } from "./fixtures";

test.describe("Show Find Bar", () => {
  test("should show the find bar when pressing the shortcut", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("show.fixture.html");
    await page.waitForTimeout(500);

    const findBar = page.getByRole("search");
    // Initially hidden (popover is not shown)
    await expect(findBar).toBeHidden();

    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    await expect(findBar).toBeVisible();
    const input = findBar.getByLabel("Search");
    await expect(input).toBeFocused();
  });

  test("should populate find bar with selected text", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("show.fixture.html");
    await page.waitForTimeout(500);

    // Select some text
    await page.evaluate(() => {
      const p = document.querySelector("p");
      if (p) {
        const range = document.createRange();
        range.selectNodeContents(p);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });

    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    const input = page.getByLabel("Search");
    await expect(input).toBeVisible();
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
    expect(value).toBe("This is a simple test page for Browser Find.");
  });
});
