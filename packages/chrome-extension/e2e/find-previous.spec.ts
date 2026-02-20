import { expect, test } from "./fixtures";

test.describe("Find Previous", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("find-previous.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should cycle backwards through matches using Shift+Enter", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    await page.keyboard.press("Shift+Enter");
    await expect(result).toHaveText("3/3");

    await page.keyboard.press("Shift+Enter");
    await expect(result).toHaveText("2/3");
  });

  test("should cycle backwards through matches using the Previous button", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    const prevButton = page.getByRole("button", { name: "Find Previous" });
    await prevButton.click();
    await expect(result).toHaveText("3/3");
  });

  test("should highlight matches with correct colors after Previous", async ({
    page,
    getHighlightCounts,
  }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    await expect(page.getByRole("status")).toHaveText("1/3");

    const prevButton = page.getByRole("button", { name: "Find Previous" });
    await prevButton.click();

    // Match 3 is "aaaa" (4 chars)
    // Match 1 is "a" (1 char), Match 2 is "aa" (2 chars). Others = 1+2=3
    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(4);
      expect(highlights.theOthersCount).toBe(3);
    }).toPass();
  });

  test.describe("Recovery", () => {
    test.beforeEach(async ({ loadFixture, page }) => {
      await loadFixture("find-previous-recovery.fixture.html");
      await page.keyboard.press("ControlOrMeta+f");
    });

    test("should recover when the target match is removed", async ({ page }) => {
      const input = page.getByLabel("Search");
      await input.fill("match");
      const result = page.getByRole("status");
      await expect(result).toHaveText("1/3");

      await page.getByRole("button", { name: "Find Next" }).click();
      await expect(result).toHaveText("2/3");

      await page.evaluate(() => {
        document.getElementById("match-1")?.remove();
      });

      await page.getByRole("button", { name: "Find Previous" }).click();

      await expect(result).toHaveText("2/2");
    });

    test("should recover when all matches are removed", async ({ page }) => {
      const input = page.getByLabel("Search");
      await input.fill("match");
      const result = page.getByRole("status");
      await expect(result).toHaveText("1/3");

      await page.evaluate(() => {
        document.querySelectorAll("div[id^='match-']").forEach((el) => el.remove());
      });

      await page.getByRole("button", { name: "Find Previous" }).click();
      await expect(result).toHaveText("0/0");
    });

    test("should recover and find new matches when content is replaced", async ({ page }) => {
      const input = page.getByLabel("Search");
      await input.fill("match");
      const result = page.getByRole("status");
      await expect(result).toHaveText("1/3");

      await page.evaluate(() => {
        document.querySelectorAll("div[id^='match-']").forEach((el) => el.remove());
        const div1 = document.createElement("div");
        div1.id = "new-1";
        div1.textContent = "match";
        const div2 = document.createElement("div");
        div2.id = "new-2";
        div2.textContent = "match";
        document.body.appendChild(div1);
        document.body.appendChild(div2);
      });

      await page.getByRole("button", { name: "Find Previous" }).click();
      await expect(result).toHaveText("2/2");
    });
  });

  test.describe("New Matches Discovery", () => {
    test.beforeEach(async ({ loadFixture, page }) => {
      await loadFixture("find-previous-new-matches.fixture.html");
      await page.keyboard.press("ControlOrMeta+f");
    });

    test("should discover matches from 0", async ({ page }) => {
      const input = page.getByLabel("Search");
      await input.fill("nomatch");
      const result = page.getByRole("status");
      await expect(result).toHaveText("0/0");

      await page.evaluate(() => {
        const div = document.createElement("div");
        div.textContent = "nomatch";
        document.getElementById("container")?.appendChild(div);
      });

      await page.getByRole("button", { name: "Find Previous" }).click();
      await expect(result).toHaveText("1/1");
    });

    test("should discover new matches from 1", async ({ page }) => {
      const input = page.getByLabel("Search");
      await input.fill("match");
      const result = page.getByRole("status");
      await expect(result).toHaveText("1/1");

      await page.evaluate(() => {
        const div = document.createElement("div");
        div.textContent = "match";
        document.getElementById("container")?.appendChild(div);
      });

      await page.getByRole("button", { name: "Find Previous" }).click();
      await expect(result).toHaveText("2/2");
    });

    test("should discover new matches on wrap around", async ({ page }) => {
      await page.evaluate(() => {
        const div = document.createElement("div");
        div.id = "match-2";
        div.textContent = "match";
        document.getElementById("container")?.appendChild(div);
      });

      const input = page.getByLabel("Search");
      await input.fill("match");
      const result = page.getByRole("status");
      await expect(result).toHaveText("1/2");

      // Add a third match
      await page.evaluate(() => {
        const div = document.createElement("div");
        div.id = "match-3";
        div.textContent = "match";
        document.getElementById("container")?.appendChild(div);
      });

      // Click previous should wrap around AND find the new match
      await page.getByRole("button", { name: "Find Previous" }).click();
      await expect(result).toHaveText("3/3");
    });
  });
});
