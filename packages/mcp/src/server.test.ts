/**
 * MCP wiring integration test: drives the real server surface over an
 * in-memory transport pair, verifying the tool registry, the resources,
 * JSON result envelopes, and the isError teaching-error path.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { afterAll, describe, expect, it } from "vitest"

import { createSeldonMcpServer } from "./server"

const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-server-"))

afterAll(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

async function connect() {
  const { server, session } = createSeldonMcpServer({ roots: [root] })
  const client = new Client({ name: "phase1-test", version: "0.0.0" })
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ])
  return { client, session }
}

function payloadOf(result: unknown): Record<string, unknown> {
  const content = (result as { content: Array<{ type: string; text: string }> })
    .content
  expect(content).toHaveLength(1)
  expect(content[0]!.type).toBe("text")
  return JSON.parse(content[0]!.text)
}

describe("Seldon MCP server (stdio surface)", () => {
  it("registers exactly the 15 v1 tools", async () => {
    const { client } = await connect()
    const { tools } = await client.listTools()
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "apply_actions",
      "checkpoint",
      "find_nodes",
      "get_action_schema",
      "get_component_schema",
      "get_computed_theme",
      "get_node",
      "get_property_schema",
      "get_workspace_outline",
      "list_catalog",
      "search_catalog",
      "view_node",
      "workspace_export",
      "workspace_info",
      "workspace_open",
    ])
    for (const tool of tools) {
      expect(tool.description).toBeTruthy()
    }
  })

  it("serves the glossary and workspace-format resources", async () => {
    const { client } = await connect()
    const { resources } = await client.listResources()
    expect(resources.map((resource) => resource.uri).sort()).toEqual([
      "seldon://glossary",
      "seldon://workspace-format",
    ])

    const textOf = (result: { contents: unknown[] }) =>
      (result.contents[0] as { text: string }).text

    const glossary = await client.readResource({ uri: "seldon://glossary" })
    expect(textOf(glossary)).toContain("Workspace")

    const format = await client.readResource({
      uri: "seldon://workspace-format",
    })
    expect(textOf(format)).toContain("property")
  })

  it("round-trips open → apply → outline through the protocol", async () => {
    const { client } = await connect()
    const wsPath = path.join(root, "roundtrip.json")

    const opened = payloadOf(
      await client.callTool({
        name: "workspace_open",
        arguments: { path: wsPath, createIfMissing: true },
      }),
    )
    expect(opened.created).toBe(true)

    const applied = payloadOf(
      await client.callTool({
        name: "apply_actions",
        arguments: {
          actions: [{ type: "add_component", payload: { boardKey: "button" } }],
        },
      }),
    )
    const receipt = applied.receipt as {
      createdIds: { boards: string[] }
    }
    expect(receipt.createdIds.boards).toContain("button")

    const outline = payloadOf(
      await client.callTool({ name: "get_workspace_outline", arguments: {} }),
    )
    const boards = outline.boards as Array<{ key: string }>
    expect(boards.some((board) => board.key === "button")).toBe(true)
  })

  it("returns teaching errors as isError results", async () => {
    const { client } = await connect()

    const result = await client.callTool({
      name: "workspace_info",
      arguments: {},
    })
    expect(result.isError).toBe(true)
    const payload = payloadOf(result) as {
      error: { code: string; recovery: string }
    }
    expect(payload.error.code).toBe("no_workspace_open")
    expect(payload.error.recovery).toContain("workspace_open")
  })
})
