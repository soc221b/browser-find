import { expect, test } from "./fixtures";

test.describe("Navigation", () => {
  test.skip(
    process.platform === "win32",
    "The content script is injected into the page on Windows, where chrome.runtime is unavailable.",
  );

  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("navigation.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
    await page.getByLabel("Search").fill("Apple");
    await page.getByRole("status").filter({ hasText: "1/2" }).waitFor();
  });

  test("should hide the find bar and keep the other states after navigating in the same tab", async ({
    page,
    fixtureBaseUrl,
  }) => {
    await page.goto(
      `${fixtureBaseUrl.replace("127.0.0.1", "localhost")}/navigation.fixture.html?page=2`,
    );
    await page.locator("#browser-find-top-layer").waitFor({ state: "attached" });

    await expect(page.getByRole("search")).toBeHidden();

    await page.keyboard.press("ControlOrMeta+f");

    await expect(page.getByLabel("Search")).toHaveValue("Apple");
    await expect(page.getByRole("status")).toHaveText("0/3");
  });

  test("should hide the find bar and keep the other states after navigating back and forward in the same tab", async ({
    page,
    fixtureBaseUrl,
  }) => {
    await page.goto(
      `${fixtureBaseUrl.replace("127.0.0.1", "localhost")}/navigation.fixture.html?page=2`,
    );
    await page.locator("#browser-find-top-layer").waitFor({ state: "attached" });
    await page.keyboard.press("ControlOrMeta+f");
    await page.getByLabel("Search").fill("APPLE");
    await page.getByRole("status").filter({ hasText: "1/3" }).waitFor();

    await page.goBack();
    await page.locator("#browser-find-top-layer").waitFor({ state: "attached" });

    await expect(page.getByRole("search")).toBeHidden();

    await page.keyboard.press("ControlOrMeta+f");

    await expect(page.getByLabel("Search")).toHaveValue("APPLE");

    await page.goForward();
    await page.locator("#browser-find-top-layer").waitFor({ state: "attached" });

    await expect(page.getByRole("search")).toBeHidden();
  });

  test("should hide the find bar and keep the other states after restoring the page from the back/forward cache", async ({
    page,
  }) => {
    await page.evaluate(() =>
      window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })),
    );

    await expect(page.getByRole("search")).toBeHidden();

    await page.keyboard.press("ControlOrMeta+f");

    await expect(page.getByLabel("Search")).toHaveValue("Apple");
    await expect(page.getByRole("status")).toHaveText("0/2");
  });

  test("should keep the find bar open after navigating within an SPA", async ({ page }) => {
    await page.getByRole("link", { name: "Page 2" }).click();
    await page.getByRole("main").filter({ hasText: "apple Apple APPLE" }).waitFor();

    await expect(page.getByRole("search")).toBeVisible();
    await expect(page.getByLabel("Search")).toHaveValue("Apple");

    await page.goBack();
    await page
      .getByRole("main")
      .filter({ hasText: /^apple Apple$/ })
      .waitFor();

    await expect(page.getByRole("search")).toBeVisible();
    await expect(page.getByLabel("Search")).toHaveValue("Apple");
  });

  test("should not share the states with another tab", async ({ context, fixtureBaseUrl }) => {
    const page = await context.newPage();
    await page.goto(`${fixtureBaseUrl}/navigation.fixture.html`);
    await page.locator("#browser-find-top-layer").waitFor({ state: "attached" });

    await page.keyboard.press("ControlOrMeta+f");

    await expect(page.getByLabel("Search")).toHaveValue("");
  });
});
