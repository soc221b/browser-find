import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  loadFixture: (filename: string) => Promise<void>;
  getModifier: () => Promise<string>;
}>({
  context: async ({}, use, workerInfo) => {
    const pathToExtension = path.join(__dirname, "../dist/v3");
    const userDataDir = path.join(
      __dirname,
      `../node_modules/.playwright/user-data-${workerInfo.workerIndex}`,
    );
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false, // Extensions only work in headful mode for now in some scenarios, or with specific flags.
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
      await page.goto(`file://${fixturePath}`);
    });
  },
  getModifier: async ({ page }, use) => {
    await use(async () => {
      const isMac = await page.evaluate(() => {
        return /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
      });
      return isMac ? "Meta" : "Control";
    });
  },
});
export const expect = test.expect;
