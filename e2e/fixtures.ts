import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { readFile } from "fs/promises";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const test = base.extend<
  {
    context: BrowserContext;
    extensionId: string;
    loadFixture: (filename: string) => Promise<void>;
    getHighlightCounts: () => Promise<{ thisCount: number; theOthersCount: number }>;
  },
  {
    fixtureBaseUrl: string;
  }
>({
  fixtureBaseUrl: [
    async ({}, use) => {
      const fixturesRoot = __dirname;
      const server = http.createServer(async (req, res) => {
        try {
          const requestUrl = new URL(req.url ?? "/", "http://127.0.0.1");
          const rawPath = decodeURIComponent(requestUrl.pathname.replace(/^\/+/, ""));
          const requestedPath = rawPath || "show.fixture.html";
          const filePath = path.resolve(fixturesRoot, requestedPath);
          const rootWithSep = `${fixturesRoot}${path.sep}`;

          if (!(filePath === fixturesRoot || filePath.startsWith(rootWithSep))) {
            res.writeHead(403).end("Forbidden");
            return;
          }

          const body = await readFile(filePath);
          const ext = path.extname(filePath).toLowerCase();
          const contentType =
            ext === ".html" ? "text/html; charset=utf-8" : "text/plain; charset=utf-8";
          res.writeHead(200, { "Content-Type": contentType }).end(body);
        } catch {
          res.writeHead(404).end("Not found");
        }
      });

      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => resolve());
      });

      const address = server.address();
      if (!address || typeof address === "string") {
        await new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
        throw new Error("Failed to get fixture server address");
      }

      await use(`http://127.0.0.1:${address.port}`);
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
    { scope: "worker" },
  ],
  context: async ({}, use, workerInfo) => {
    const pathToExtension = path.join(__dirname, "../dist/v3");
    const userDataDir = path.join(
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
  loadFixture: async ({ page, fixtureBaseUrl }, use) => {
    await use(async (filename: string) => {
      const fixtureUrl = new URL(encodeURIComponent(filename), `${fixtureBaseUrl}/`).toString();
      await page.goto(fixtureUrl);
      const topLayerSelector = "#browser-find-top-layer";

      // Windows CI can intermittently miss extension auto-injection for local fixture pages.
      // Fall back to directly injecting the built content script to keep E2E behavior deterministic.
      try {
        await page.waitForSelector(topLayerSelector, { state: "attached", timeout: 3000 });
      } catch {
        await page.addScriptTag({
          path: path.join(__dirname, "../dist/v3/content/index.js"),
        });
        await page.waitForSelector(topLayerSelector, { state: "attached", timeout: 10000 });
      }
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
