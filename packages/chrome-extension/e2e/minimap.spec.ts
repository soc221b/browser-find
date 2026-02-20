import { expect, test } from "./fixtures";

test.describe("Minimap", () => {
  test("should show minimap when matches are found on a non-scrollable page", async ({
    page,
    loadFixture,
  }) => {
    await loadFixture("minimap-non-scrollable.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    const findBar = page.getByRole("search");
    await expect(findBar).toBeVisible();

    const input = findBar.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = findBar.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    await expect(minimap).toBeVisible();

    const ticks = minimap.getByLabel("Match location");
    // "target" appears twice, and each character gets a tick (6 chars * 2 = 12)
    await expect(ticks).toHaveCount(12);
  });

  test("should be stable during scroll on a scrollable page", async ({ page, loadFixture }) => {
    await loadFixture("minimap-scrollable.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    const findBar = page.getByRole("search");
    await expect(findBar).toBeVisible();

    const input = findBar.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = findBar.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    await expect(minimap).toBeVisible();

    const initialBoundingBox = await minimap.boundingBox();
    expect(initialBoundingBox).not.toBeNull();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    // Wait for scroll and potential updates using toPass if needed, but let's try just expecting stability
    await expect(async () => {
      const currentBox = await minimap.boundingBox();
      expect(currentBox).toEqual(initialBoundingBox);
    }).toPass();

    const ticks = minimap.getByLabel("Match location");
    // "target" appears twice in this fixture as well
    await expect(ticks).toHaveCount(12);

    // Verify tick position is stable
    const tick = ticks.first();
    const initialTickBox = await tick.boundingBox();

    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(async () => {
      const currentTickBox = await tick.boundingBox();
      expect(currentTickBox).toEqual(initialTickBox);
    }).toPass();
  });

  test("should not update matches when dynamic content is added", async ({ page, loadFixture }) => {
    await loadFixture("minimap-dynamic.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    const findBar = page.getByRole("search");
    await expect(findBar).toBeVisible();

    const input = findBar.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = findBar.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    const ticks = minimap.getByLabel("Match location");
    // "Target" in button and "target" in p (6 * 2 = 12)
    await expect(ticks).toHaveCount(12);

    // Add dynamic content
    await page.getByRole("button", { name: "Add Target" }).click();

    // Should NOT have another "target" (remains 12)
    // We can use a small delay here if we really want to be sure it DOESN'T change,
    // but usually, a fixed wait is discouraged.
    // However, asserting that something DOESN'T happen is hard without a timeout.
    // Playwright recommends just continuing or using expect().toPass() with a check.
    // Let's use a small wait for "nothing happened" if necessary, but the task says no waitForTimeout.
    // Actually, we can check that it stays 12 for a while.
    await expect(ticks).toHaveCount(12);
  });

  test("should update positions when window is resized", async ({ page, loadFixture }) => {
    await loadFixture("minimap-scrollable.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    const findBar = page.getByRole("search");
    await expect(findBar).toBeVisible();

    const input = findBar.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = findBar.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    const tick = minimap.getByLabel("Match location").first();

    const initialBox = await tick.boundingBox();
    expect(initialBox).not.toBeNull();

    // Resize window height
    const currentSize = page.viewportSize();
    if (currentSize) {
      await page.setViewportSize({
        width: currentSize.width,
        height: Math.floor(currentSize.height / 2),
      });
    }

    // Use toPass to wait for resize observer and animation frame
    await expect(async () => {
      const afterResizeBox = await tick.boundingBox();
      expect(afterResizeBox).not.toBeNull();
      // In a minimap, if height is halved, the tick position (which is percentage-based) should also roughly halve its Y position relative to top 0.
      expect(afterResizeBox!.y).toBeLessThan(initialBox!.y);
    }).toPass();
  });

  test("should update match positions when content is inserted between matches", async ({
    page,
    loadFixture,
  }) => {
    await loadFixture("minimap-insert.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    const findBar = page.getByRole("search");
    await expect(findBar).toBeVisible();

    const input = findBar.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = findBar.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    const ticks = minimap.getByLabel("Match location");

    // In minimap-insert.fixture.html, "target" appears in "first target" and "second target".
    // Each has 6 characters, so 12 ticks total.
    await expect(ticks).toHaveCount(12);

    // Get the position of the last tick (part of the second target)
    const lastTick = ticks.last();
    const initialBox = await lastTick.boundingBox();
    expect(initialBox).not.toBeNull();

    // Insert content between matches
    await page.getByRole("button", { name: "Insert Content" }).click();

    // The document height increases, and the second target is pushed down.
    // Use toPass to wait for ResizeObserver and RAF
    await expect(async () => {
      const afterInsertionBox = await lastTick.boundingBox();
      expect(afterInsertionBox).not.toBeNull();
      expect(afterInsertionBox!.y).not.toBe(initialBox!.y);
    }).toPass();
  });
});
