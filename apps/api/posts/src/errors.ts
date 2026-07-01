import { Data } from "effect";

export class PostNotFound extends Data.TaggedError("PostNotFound")<{
  readonly id: number;
}> {}
