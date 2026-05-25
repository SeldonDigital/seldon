export type InvariantErrorContext = Record<string, unknown>

/**
 * Custom error class for invariant violations with optional context data.
 */
export class InvariantError extends Error {
  context?: InvariantErrorContext

  constructor(message: string, context?: InvariantErrorContext) {
    super(message)
    this.context = context
  }
}

/**
 * Throws an error if the condition is false, with Sentry integration in production.
 *
 * @param condition - The condition to check
 * @param message - The error message to throw if condition is false
 * @param context - Optional context data to include with the error
 */
export function invariant(
  condition: unknown,
  message: string,
  context?: InvariantErrorContext,
): asserts condition {
  if (!condition) {
    throw new InvariantError(message, context)
  }
}
