import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("ai-image-enhancer/sharpen-image/");
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
    /Sharpen Image & Clear Pics Online with the Image Sharpener/,
  );
  await expect(page.getByText("Sharpen images online to make")).toBeVisible();
});

test("has demo image", async ({ page }) => {
  await expect(
    page.getByRole("img", { name: "sharpen images online" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "sharpen images online" }),
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

  await expect(page.getByTestId("EnhancedImage")).toBeVisible();
  await Promise.all([
    expect(page.locator("#onetrust-banner-sdk")).not.toBeVisible({
      timeout: 100_000,
    }),
    expect(page.getByText("Processing your image...")).not.toBeVisible({
      timeout: 150_000,
    }),
  ]);
  await expect(page.getByTestId("EnhancedImage")).toBeVisible();
  await expect(page.getByTestId("EnhancedImage")).toHaveScreenshot();
  await page
    .getByTestId("EnhancedImage")
    .getByRole("button", { name: "Download" })
    .click();
  await expect(page.getByTestId("download-popup")).toBeVisible();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Low-res image1024 x 1024px" })
    .getByTestId("input-controller")
    .check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("download-popup").getByTestId("button").click();
  await downloadPromise;
  await expect(page.getByTestId("cell").getByTestId("content")).toBeVisible();
  await expect(
    page.getByTestId("cell").getByTestId("content"),
  ).toHaveScreenshot();
});
