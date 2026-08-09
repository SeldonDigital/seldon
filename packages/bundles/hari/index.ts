/**
 * @seldon/hari - the headless Seldon engine with AI.
 *
 * Re-exports the workspace engine (`@seldon/core`), the export factory
 * (`@seldon/factory`), and the local AI orchestration (`@seldon/ai`) as one
 * install. Use it to turn chat into workspace actions, then adopt the returned
 * workspace and export it. A local model host is required; see the package
 * README.
 *
 * Also ships the `seldon-mcp` bin, which wires the headless MCP host from
 * `@seldon/ai` (`HeadlessHost`, re-exported below) to a stdio or HTTP transport.
 */
export * from "@seldon/core"
export * from "@seldon/factory"
export * from "@seldon/ai"
