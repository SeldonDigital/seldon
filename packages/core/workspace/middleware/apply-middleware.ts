import { Action, Middleware, Workspace } from "../types"

/**
 * Composes middleware functions around a reducer using right-to-left function composition.
 * @param reducer - The base reducer function to wrap
 * @param middlewares - Middleware functions to apply in reverse order
 * @returns A new reducer function with all middleware applied
 */
export function applyMiddleware<T extends Action = Action>(
  reducer: (workspace: Workspace, action: T) => Workspace,
  ...middlewares: Middleware[]
) {
  return middlewares.reduceRight(
    (prevReducer, middleware) => middleware(prevReducer),
    reducer as (workspace: Workspace, action: Action) => Workspace,
  )
}
