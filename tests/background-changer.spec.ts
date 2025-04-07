import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("background-changer/");
  /**
   * Desabled for US github runner
   */
  // await expect(page.getByRole("button", { name: "Accept All Cookies" })).toBeVisible({
  //   timeout: 150_000,
  // });
  // await page.getByRole("button", { name: "Accept All Cookies" }).click();
  // await expect(
  //   page.getByRole("button", { name: "Accept All Cookies" }),
  // ).not.toBeVisible();
});

test.afterEach(async ({ context }) => {
  await context.clearCookies();
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle(
    /Change Photo Background - Background Changer | Picsart/,
  );
});

test("hes demo image", async ({ page }) => {
  await expect(
    page.getByRole("img", { name: "Picsart's background remover" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Picsart's background remover" }),
  ).toHaveScreenshot();
});

test("has editor", async ({ page }) => {
  await page.getByTestId("start-screen").getByTestId("button").click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/files") &&
        response.request().method() === "POST" &&
        response.status() === 200,
      { timeout: 150_000 },
    ),
    page.getByTestId("input").setInputFiles("fixtures/dog_avatar.png"),
  ]);
  const backgroundRemover = page.getByTestId("BackgroundChanger");
  await expect(backgroundRemover).toBeVisible({
    timeout: 120_000,
  });
  await Promise.all([
    expect(page.locator("#onetrust-banner-sdk")).not.toBeVisible({
      timeout: 100_000,
    }),
    expect(page.getByText("Processing your image...")).not.toBeVisible({
      timeout: 150_000,
    }),
  ]);

  await expect(backgroundRemover).toBeVisible();
  await expect(backgroundRemover).toHaveScreenshot({
    timeout: 50_000,
    maxDiffPixelRatio: 0.01,
  });
  await page.locator("button:nth-child(8)").first().click();
  await expect(backgroundRemover).toHaveScreenshot({
    timeout: 50_000,
    maxDiffPixelRatio: 0.01,
  });
});
