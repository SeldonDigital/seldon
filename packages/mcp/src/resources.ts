import fs from "node:fs"

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

/**
 * MCP resources: the domain glossary and the workspace-format
 * primer. Server instructions and teaching errors reference these URIs, so
 * the names are contract, not decoration.
 */
export const GLOSSARY_URI = "seldon://glossary"
export const WORKSPACE_FORMAT_URI = "seldon://workspace-format"

/** Repo-root GLOSSARY.md — Core's vocabulary, maintained next to the code. */
const GLOSSARY_PATH = new URL("../../../GLOSSARY.md", import.meta.url)
/** Authored for agents in this package. */
const WORKSPACE_FORMAT_PATH = new URL(
  "../resources/workspace-format.md",
  import.meta.url,
)

function readDoc(url: URL): string {
  return fs.readFileSync(url, "utf8")
}

export function registerResources(server: McpServer): void {
  server.registerResource(
    "glossary",
    GLOSSARY_URI,
    {
      title: "Seldon glossary",
      description:
        "Definitions of the domain vocabulary used across tools, schemas, " +
        "and errors: boards, variants, instances, levels, property cells, " +
        "tokens, propagation, …",
      mimeType: "text/markdown",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: readDoc(GLOSSARY_PATH),
        },
      ],
    }),
  )

  server.registerResource(
    "workspace-format",
    WORKSPACE_FORMAT_URI,
    {
      title: "Workspace file format primer",
      description:
        "How a Seldon workspace file is shaped and how values resolve: " +
        "boards/variants, node inheritance via templates and sparse " +
        "overrides, tagged property cells, and theme token references.",
      mimeType: "text/markdown",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: readDoc(WORKSPACE_FORMAT_PATH),
        },
      ],
    }),
  )
}
