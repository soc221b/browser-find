import { expect, test } from "./fixtures";

test.describe("Minimap", () => {
  test("should show minimap when matches are found on a non-scrollable page", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("minimap-non-scrollable.fixture.html");
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    const input = page.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    await expect(minimap).toBeVisible();

    const ticks = minimap.getByLabel("Match location");
    // "target" appears twice, and each character gets a tick (6 chars * 2 = 12)
    await expect(ticks).toHaveCount(12);
  });

  test("should be stable during scroll on a scrollable page", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("minimap-scrollable.fixture.html");
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    const input = page.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    await expect(minimap).toBeVisible();

    const initialBoundingBox = await minimap.boundingBox();
    expect(initialBoundingBox).not.toBeNull();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);

    const afterScrollBoundingBox = await minimap.boundingBox();
    expect(afterScrollBoundingBox).toEqual(initialBoundingBox);

    const ticks = minimap.getByLabel("Match location");
    // "target" appears twice in this fixture as well
    await expect(ticks).toHaveCount(12);

    // Verify tick position is stable
    const tick = ticks.first();
    const initialTickBox = await tick.boundingBox();

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(200);

    const afterSecondScrollTickBox = await tick.boundingBox();
    expect(afterSecondScrollTickBox).toEqual(initialTickBox);
  });

  test("should update when dynamic content is added", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("minimap-dynamic.fixture.html");
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    const input = page.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = page.getByRole("status");
    await expect(result).toHaveText(/1\/\d+/);

    const minimap = page.getByRole("complementary", { name: "Minimap" });
    const ticks = minimap.getByLabel("Match location");
    // "Target" in button and "target" in p (6 * 2 = 12)
    await expect(ticks).toHaveCount(12);

    // Add dynamic content
    await page.getByRole("button", { name: "Add Target" }).click();

    // Should now have another "target" (12 + 6 = 18)
    await expect(ticks).toHaveCount(18);
  });

  test("should update positions when window is resized", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("minimap-scrollable.fixture.html");
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    const input = page.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = page.getByRole("status");
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

    await page.waitForTimeout(500); // Give it more time for resize observer and animation frame

    const afterResizeBox = await tick.boundingBox();
    expect(afterResizeBox).not.toBeNull();
    // In a minimap, if height is halved, the tick position (which is percentage-based) should also roughly halve its Y position relative to top 0.
    expect(afterResizeBox!.y).toBeLessThan(initialBox!.y);
  });

  test("should update match positions when content is inserted between matches", async ({
    page,
    loadFixture,
    getModifier,
  }) => {
    await loadFixture("minimap-insert.fixture.html");
    const modifier = await getModifier();
    await page.keyboard.press(`${modifier}+f`);

    const input = page.getByLabel("Search");
    await input.fill("target");

    // Wait for search results to be ready
    const result = page.getByRole("status");
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
    // The relative position (%) might change, and the viewport height is constant.
    // Wait for ResizeObserver and RAF
    await page.waitForTimeout(200);

    const afterInsertionBox = await lastTick.boundingBox();
    expect(afterInsertionBox).not.toBeNull();

    // Since we added 500px of content, the second target is pushed down.
    // In the minimap, its absolute position (top) should change.
    // Because document height increased, the percentage might change too.
    // Most importantly, it should NOT be the same as before if it correctly updated.
    expect(afterInsertionBox!.y).not.toBe(initialBox!.y);
  });
});
