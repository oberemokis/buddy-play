import { expect, test } from "@playwright/test";

const API_URL = "http://localhost:3001";

test.describe("posts", () => {
  test("GET /posts returns the seeded posts", async ({ request }) => {
    const res = await request.get(`${API_URL}/posts`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0]).toMatchObject({ id: 1, title: "First post" });
  });

  test("GET /posts/:id returns a single post", async ({ request }) => {
    const res = await request.get(`${API_URL}/posts/2`);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ id: 2, title: "Second post" });
  });

  test("GET /posts/:id returns 404 for an unknown post", async ({ request }) => {
    const res = await request.get(`${API_URL}/posts/999`);

    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: "Post 999 not found" });
  });
});
