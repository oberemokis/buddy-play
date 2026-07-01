import { Effect, Option } from "effect";
import { PostsRepository } from "./repository";
import { PostNotFound } from "./errors";

const orNotFound = (id: number) =>
  Option.match({
    onNone: () => new PostNotFound({ id }),
    onSome: Effect.succeed,
  });

export class PostsService extends Effect.Service<PostsService>()(
  "PostsService",
  {
    accessors: true,
    dependencies: [PostsRepository.Default],
    effect: Effect.gen(function* () {
      const repository = yield* PostsRepository;

      return {
        list: () => repository.findAll(),
        getById: (id: number) =>
          repository.findById(id).pipe(Effect.flatMap(orNotFound(id))),
      };
    }),
  },
) {}
