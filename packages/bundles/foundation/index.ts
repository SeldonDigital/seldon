/**
 * @seldon/foundation - the full Seldon platform.
 *
 * Re-exports everything in `@seldon/hari` (engine plus AI) and the embeddable
 * editor library (`@seldon/editor`). Choose this bundle when a consumer app
 * embeds the editor UI, not just the headless engine. It ships as source and is
 * compiled by the consumer's bundler.
 */
export * from "@seldon/hari"
export * from "@seldon/editor"
