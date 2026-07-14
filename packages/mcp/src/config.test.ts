import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterAll, describe, expect, it } from "vitest"

import { parseServerConfig, resolvePathWithinRoots } from "./config"
import { ToolError } from "./errors"

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-config-"))
const root = path.join(tmp, "root")
const outside = path.join(tmp, "outside")
fs.mkdirSync(root, { recursive: true })
fs.mkdirSync(outside, { recursive: true })

afterAll(() => {
  fs.rmSync(tmp, { recursive: true, force: true })
})

describe("parseServerConfig", () => {
  it("collects repeatable --root flags", () => {
    const config = parseServerConfig(["--root", "/a", "--root=/b"], {}, "/cwd")
    expect(config.roots).toEqual(["/a", "/b"])
  })

  it("falls back to SELDON_MCP_ROOTS, then to cwd", () => {
    const fromEnv = parseServerConfig(
      [],
      { SELDON_MCP_ROOTS: `/x${path.delimiter}/y` },
      "/cwd",
    )
    expect(fromEnv.roots).toEqual(["/x", "/y"])

    const fromCwd = parseServerConfig([], {}, "/cwd")
    expect(fromCwd.roots).toEqual(["/cwd"])
  })

  it("resolves relative roots against cwd", () => {
    const config = parseServerConfig(["--root", "sub"], {}, "/cwd")
    expect(config.roots).toEqual(["/cwd/sub"])
  })

  it("rejects --root without a value", () => {
    expect(() => parseServerConfig(["--root"], {}, "/cwd")).toThrow()
  })
})

describe("resolvePathWithinRoots", () => {
  it("accepts a path inside a root, existing or not", () => {
    const existing = path.join(root, "ws.json")
    fs.writeFileSync(existing, "{}")
    expect(resolvePathWithinRoots(existing, [root])).toBe(existing)

    const missing = path.join(root, "deep", "new", "ws.json")
    expect(resolvePathWithinRoots(missing, [root])).toBe(missing)
  })

  it("rejects ../ traversal escaping the root", () => {
    const escape = path.join(root, "..", "outside", "ws.json")
    expect(() => resolvePathWithinRoots(escape, [root])).toThrow(ToolError)
  })

  it("rejects an absolute path outside every root", () => {
    expect(() =>
      resolvePathWithinRoots(path.join(outside, "ws.json"), [root]),
    ).toThrow(ToolError)
  })

  it("rejects a symlinked directory that points outside the root", () => {
    const link = path.join(root, "sneaky")
    fs.symlinkSync(outside, link)
    expect(() =>
      resolvePathWithinRoots(path.join(link, "ws.json"), [root]),
    ).toThrow(ToolError)
  })

  it("carries the teaching-error shape", () => {
    try {
      resolvePathWithinRoots(path.join(outside, "ws.json"), [root])
      expect.unreachable()
    } catch (error) {
      const teaching = (error as ToolError).teaching
      expect(teaching.code).toBe("path_outside_roots")
      expect(teaching.recovery).toContain(root)
    }
  })
})
