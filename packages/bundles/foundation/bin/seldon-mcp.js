#!/usr/bin/env node
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)
const aiRoot = path.dirname(require.resolve("@seldon/ai/package.json"))
const bin = path.join(aiRoot, "dist/bin/seldon-mcp.js")

await import(pathToFileURL(bin).href)
