import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  loadFixture: (filename: string) => Promise<void>;
  getHighlightCounts: () => Promise<{ thisCount: number; theOthersCount: number }>;
}>({
  context: async ({}, use, workerInfo) => {
    const pathToExtension = path.resolve(__dirname, "../dist/v3");
    const userDataDir = path.resolve(
      __dirname,
      `../node_modules/.playwright/user-data-${workerInfo.workerIndex}`,
    );
    const isMac = process.platform === "darwin";
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false, // Extensions only work in headful mode for now in some scenarios, or with specific flags.
      userAgent: isMac
        ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.4 Safari/537.36"
        : undefined,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // for manifest v3:
    let [
      background,
    ] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
  loadFixture: async ({ page }, use) => {
    await use(async (filename: string) => {
      const fixturePath = path.resolve(__dirname, filename);
      await page.goto(pathToFileURL(fixturePath).href);
      // Wait for extension to inject its container
      await page.waitForSelector("#browser-find-top-layer", { state: "attached" });
    });
  },
  getHighlightCounts: async ({ page }, use) => {
    await use(async () => {
      return await page.evaluate(() => {
        const thisKey = "browser-find-found-this";
        const theOthersKey = "browser-find-found-these-too";
        return {
          thisCount: window.CSS.highlights.get(thisKey)?.size ?? NaN,
          theOthersCount: window.CSS.highlights.get(theOthersKey)?.size ?? NaN,
        };
      });
    });
  },
});
export const expect = test.expect;
