/**
 * @seldon/hari - the headless Seldon engine with AI.
 *
 * Re-exports everything in `@seldon/terminus` plus the local AI orchestration
 * (`@seldon/ai`). Use it to turn chat into workspace actions, then adopt the
 * returned workspace and export it. A local model host is required; see the
 * package README.
 */
export * from "@seldon/terminus"
export * from "@seldon/ai"
