import { describe, expect, it } from "vitest";
import { createApp } from "./app";

const app = createApp();

describe("posts API routes", () => {
  it("GET /health reports ok", async () => {
    const res = await app.request("/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("GET /posts returns the list", async () => {
    const res = await app.request("/posts");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);
  });

  it("GET /posts/:id returns a single post", async () => {
    const res = await app.request("/posts/1");

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: 1, title: "First post" });
  });

  it("GET /posts/:id returns 404 for an unknown post", async () => {
    const res = await app.request("/posts/999");

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Post 999 not found" });
  });
});
