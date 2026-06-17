import type { BoardKey, PlaygroundBoard } from "./components"

/** Key for a playground container row in `workspace.playgrounds`. */
export type PlaygroundKey = BoardKey

/**
 * A playground container groups independent Sandbox roots placed directly on the
 * shared canvas. It mirrors the playground board shape but lives in
 * `workspace.playgrounds` and is never read by the factory. Its `variants` list
 * holds the Sandbox root refs, which behave like unconstrained custom variants
 * with no default.
 */
export type PlaygroundContainer = PlaygroundBoard

export { isPlaygroundBoard as isPlaygroundContainer } from "./components"
