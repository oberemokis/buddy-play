import { Hono } from "hono";
import { PostsService } from "./service";
import { respond } from "./runtime";
import { paths } from "./paths";

export function postsRoutes(): Hono {
  return new Hono()
    .get(paths.posts, (context) => respond(context, PostsService.list()))
    .get(paths.postById, (context) =>
      respond(context, PostsService.getById(Number(context.req.param("id")))),
    );
}
