/**
 * Stdio entry point. Run from the repo with a TypeScript
 * runtime and the `development` export condition so @seldon/core resolves to
 * source (Factory ships source only):
 *
 *   node --import tsx --conditions=development src/main.ts --root /path/to/project
 *
 * `--root` is repeatable and bounds every workspace path the model may open;
 * it defaults to the working directory.
 *
 * The CJS-interop hooks (see runtime/hooks.mjs) must be registered before any
 * Core module loads, so the server is imported dynamically below.
 */
import { register } from "node:module"

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { parseServerConfig } from "./config"

if (!process.versions.bun) {
  register(new URL("./runtime/hooks.mjs", import.meta.url))
}

const { createSeldonMcpServer } = await import("./server")

const config = parseServerConfig(process.argv.slice(2))
const { server } = createSeldonMcpServer(config)

await server.connect(new StdioServerTransport())

// stdout is the protocol channel; operator logging goes to stderr.
console.error(`Seldon MCP server ready (roots: ${config.roots.join(", ")})`)
