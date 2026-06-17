/**
 * Compile-time exhaustiveness guard for discriminated unions. Calling it forces
 * a type error when a `switch` or `if` chain leaves a case unhandled, and throws
 * if the unreachable branch is somehow hit at runtime.
 *
 * @param value - The value that should have been narrowed to `never`
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}
