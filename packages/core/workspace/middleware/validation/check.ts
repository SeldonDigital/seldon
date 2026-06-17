/**
 * Assertion function that throws an error if condition is falsy.
 * Unlike invariant, doesn't prefix messages or omit them in production.
 */
export function check(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
