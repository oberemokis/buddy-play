import { expect, test } from "@playwright/test";

const API_URL = "http://localhost:3001";

test.describe("health", () => {
  test("GET /health reports ok", async ({ request }) => {
    const res = await request.get(`${API_URL}/health`);

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
