import { expect, test } from "@playwright/test";

test.describe("post list", () => {
  test("renders the header and the federated post list", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Sync", level: 1 })).toBeVisible();

    // Remote posts загружается через Module Federation и получает данные из API.
    await expect(page.getByRole("heading", { name: "First post" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Second post" })).toBeVisible();
  });

  test("reloads the list when the Reload button is pressed", async ({ page }) => {
    await page.goto("/");

    const reload = page.getByRole("button", { name: "Reload" });
    await expect(reload).toBeVisible();

    await reload.click();

    await expect(page.getByRole("heading", { name: "First post" })).toBeVisible();
  });
});
