/**
 * @seldon/foundation - the full Seldon platform.
 *
 * Re-exports the workspace engine (`@seldon/core`), the export factory
 * (`@seldon/factory`), the local AI orchestration (`@seldon/ai`), and the
 * embeddable editor library (`@seldon/editor`). Choose this bundle when a
 * consumer app embeds the editor UI, not just the headless engine. It ships as
 * source and is compiled by the consumer's bundler.
 */
export * from "@seldon/core"
export * from "@seldon/factory"
export * from "@seldon/ai"
export * from "@seldon/editor"
