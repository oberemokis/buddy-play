import { HttpClient, HttpClientResponse } from "@effect/platform";
import { Effect, Schema } from "effect";
import { Post } from "@sync/schemes";
import { clientConfig } from "@sync/config/client";

const PostArray = Schema.Array(Post);

const BASE_URL = clientConfig.apiUrl;

function getJson<A, I>(url: string, schema: Schema.Schema<A, I>) {
  return HttpClient.HttpClient.pipe(
    Effect.flatMap((client) => client.get(url)),
    Effect.flatMap(HttpClientResponse.schemaBodyJson(schema)),
    Effect.scoped,
  );
}

export const fetchPosts = getJson(`${BASE_URL}/posts`, PostArray);

export const fetchPostById = (id: number) =>
  getJson(`${BASE_URL}/posts/${id}`, Post);
