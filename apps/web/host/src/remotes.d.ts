// АВТОГЕНЕРАЦИЯ через scripts/gen-remotes.ts — не редактировать.
// Запустите `pnpm gen:remotes` после изменения манифеста ремоутов в @buddy-play/config.
// В рантайме они загружаются через Module Federation; типы берутся из исходного
// кода каждого ремоута (только типы — стирается при сборке, без связи в рантайме).

declare module "posts/PostList" {
  export { default } from "../../posts/src/components/widgets/PostContainer.vue";
}
