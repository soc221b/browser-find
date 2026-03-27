import path from "path";
import { fileURLToPath } from "url";
import { expect, test } from "./fixtures";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe("Extension toggle re-initialisation", () => {
  test("should open the find bar after re-initialisation when a stale DOM element exists", async ({
    page,
    fixtureBaseUrl,
  }) => {
    // Navigate to a page that already has a bare #browser-find-top-layer in the DOM,
    // simulating the orphaned element left behind when Chrome disables an extension
    // (the JS context is destroyed but DOM mutations persist).
    const fixtureUrl = new URL(
      encodeURIComponent("extension-toggle.fixture.html"),
      `${fixtureBaseUrl}/`,
    ).toString();
    await page.goto(fixtureUrl);

    // On Windows the extension content script is not auto-injected in the test context;
    // simulate re-injection by adding the script manually (as loadFixture does).
    if (process.platform === "win32") {
      await page.addScriptTag({
        path: path.join(__dirname, "../dist/v3/content/index.js"),
      });
    }

    // After init() the React app must be mounted and [role="search"] must be in the DOM.
    // Bug: init() finds the pre-existing element and returns early without mounting React,
    // so this assertion times out and the test fails.
    const findBar = page.getByRole("search");
    await expect(findBar).toBeAttached({ timeout: 3000 });

    // The keyboard shortcut must open the find bar.
    await page.keyboard.press("ControlOrMeta+f");
    await expect(findBar).toBeVisible();
  });
});
