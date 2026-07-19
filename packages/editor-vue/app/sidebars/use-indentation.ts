import { inject, provide } from "vue"

/**
 * Vue provide/inject port of the React indentation context. Tree rows read the
 * current depth and provide depth + 1 to their children. Defaults to 0 at the
 * root when no provider is present.
 */
const INDENTATION_KEY = Symbol("seldon-indentation")

export function provideIndentation(level: number): void {
  provide(INDENTATION_KEY, level)
}

export function useIndentation(): number {
  return inject<number>(INDENTATION_KEY, 0)
}

/** Provides the next indentation level for nested rows. */
export function provideNextIndentation(): number {
  const next = useIndentation() + 1
  provide(INDENTATION_KEY, next)
  return next
}
