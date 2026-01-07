import { expect, test } from "./fixtures";

test.describe("Find Next", () => {
  test.beforeEach(async ({ page, loadFixture }) => {
    await loadFixture("find-next.fixture.html");
    await page.keyboard.press("ControlOrMeta+f");
  });

  test("should cycle through matches using Enter", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    await page.keyboard.press("Enter");
    await expect(result).toHaveText("2/3");

    await page.keyboard.press("Enter");
    await expect(result).toHaveText("3/3");
  });

  test("should cycle through matches using the Next button", async ({ page }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const result = page.getByRole("status");
    await expect(result).toHaveText("1/3");

    const nextButton = page.getByRole("button", { name: "Find Next" });
    await nextButton.click();
    await expect(result).toHaveText("2/3");
  });

  test("should highlight matches with correct colors after Next", async ({
    page,
    getHighlightCounts,
  }) => {
    await page.getByRole("button", { name: "Use Regular Expression" }).click();
    const input = page.getByLabel("Search");
    await input.fill("a+");

    const nextButton = page.getByRole("button", { name: "Find Next" });
    await nextButton.click();

    // Match 2 is "aa" (2 chars)
    // Match 1 is "a" (1 char), Match 3 is "aaaa" (4 chars). Others = 1+4=5
    await expect(async () => {
      const highlights = await getHighlightCounts();
      expect(highlights.thisCount).toBe(2);
      expect(highlights.theOthersCount).toBe(5);
    }).toPass();
  });

  test.describe("Recovery", () => {
    test.beforeEach(async ({ loadFixture, page }) => {
      await loadFixture("find-next-recovery.fixture.html");
      await page.keyboard.press("ControlOrMeta+f");
    });

    test("should recover when the target match is removed", async ({ page }) => {
      const input = page.getByLabel("Search");
      await input.fill("match");
      const result = page.getByRole("status");
      await expect(result).toHaveText("1/3");

      await page.evaluate(() => {
        document.getElementById("match-2")?.remove();
      });

      await page.getByRole("button", { name: "Find Next" }).click();

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

      await page.getByRole("button", { name: "Find Next" }).click();
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

      await page.getByRole("button", { name: "Find Next" }).click();
      await expect(result).toHaveText("1/2");
    });
  });
});
