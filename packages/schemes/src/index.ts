import { Schema } from "effect";

export const Post = Schema.Struct({
  userId: Schema.Number,
  id: Schema.Number,
  title: Schema.String,
  body: Schema.String,
});

export type Post = Schema.Schema.Type<typeof Post>;
