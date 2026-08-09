/**
 * @seldon/hari - the headless Seldon engine with AI.
 *
 * Re-exports everything in `@seldon/terminus` plus the local AI orchestration
 * (`@seldon/ai`). Use it to turn chat into workspace actions, then adopt the
 * returned workspace and export it. A local model host is required; see the
 * package README.
 *
 * Also ships the headless MCP host. `HeadlessHost` runs the shared MCP tools
 * over a file-backed workspace store, wired to a transport by the `seldon-mcp`
 * bin. Pair it with `createSeldonMcpServer` from `@seldon/ai`.
 */
export * from "@seldon/terminus"
export * from "@seldon/ai"
export { HeadlessHost } from "./mcp/headless-host.js"
export { WorkspaceStore } from "./mcp/store.js"

export type { HeadlessHostOptions } from "./mcp/headless-host.js"
export type { StoreEntry } from "./mcp/store.js"
