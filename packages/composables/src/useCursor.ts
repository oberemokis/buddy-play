import { onMounted, onUnmounted, ref } from "vue";

/**
 * Отслеживает координаты курсора мыши.
 * Возвращает реактивные `x` и `y`.
 *
 * @example
 * ```ts
 * const { x, y } = useCursor();
 * ```
 */
export function useCursor() {
  const x = ref(0);
  const y = ref(0);

  function onMouseMove(event: MouseEvent): void {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  onMounted(() => window.addEventListener("mousemove", onMouseMove));
  onUnmounted(() => window.removeEventListener("mousemove", onMouseMove));

  return { x, y };
}
