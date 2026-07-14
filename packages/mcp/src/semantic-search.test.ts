/**
 * Behavioral suite for the semantic search layer.
 *
 * - Hybrid blending: semantic scores surface paraphrase matches in
 *   the ≤1 band, never outrank keyword hits, and are hard-capped below an
 *   exact keyword word match.
 * - Optional dependency: missing runtime or missing index
 *   falls back to keyword-only SILENTLY and byte-identically.
 * - Index/model coupling: format-version or shape mismatches fail
 *   LOUDLY and fall back to keyword.
 * - Zero-result logging: logged to the workspace-adjacent JSONL.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, describe, expect, it } from "vitest"

import {
  SEMANTIC_SCORE_CEILING,
  getCatalogEntries,
  searchCatalogIndex,
  selectTopResults,
} from "./catalog-search"
import { LOG_DIR_NAME, LOG_FILE_NAME } from "./observability"
import { SEARCH_EVAL_SET } from "./search-eval-set"
import {
  SEARCH_INDEX_FILE,
  SEARCH_INDEX_FORMAT_VERSION,
  type SearchIndexFile,
  createSemanticSearchProvider,
  loadSearchIndex,
  scoreAgainstIndex,
} from "./semantic-search"
import { Session } from "./session"
import type { ToolContext } from "./tools/context"
import { searchCatalog } from "./tools/search-catalog"
import { workspaceOpen } from "./tools/workspace-open"

const tmpDirs: string[] = []

function tmpDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix))
  tmpDirs.push(dir)
  return dir
}

afterEach(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

function makeCtx(overrides: Partial<ToolContext> = {}): {
  ctx: ToolContext
  root: string
} {
  const root = tmpDir("seldon-mcp-semantic-")
  return {
    ctx: { session: new Session(), config: { roots: [root] }, ...overrides },
    root,
  }
}

/** Writes a structurally valid 2-entry index into `dir`. */
function writeFakeIndex(
  dir: string,
  overrides: Partial<SearchIndexFile> = {},
  vectors: number[][] = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
  ],
): SearchIndexFile {
  const meta: SearchIndexFile = {
    formatVersion: SEARCH_INDEX_FORMAT_VERSION,
    model: {
      id: "fake/model",
      dtype: "q8",
      dimensions: 4,
      queryPrefix: "",
      passagePrefix: "",
    },
    calibration: { simFloor: 0.5, semCeiling: 0.9 },
    builtAt: "2026-07-08T00:00:00.000Z",
    entryIds: ["carbon-trashCan", "button"],
    entryKinds: ["icon", "component"],
    vectorsFile: "catalog-index.vectors.bin",
    ...overrides,
  }
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, SEARCH_INDEX_FILE), JSON.stringify(meta))
  fs.writeFileSync(
    path.join(dir, meta.vectorsFile),
    Buffer.from(Float32Array.from(vectors.flat()).buffer),
  )
  return meta
}

/** A transformers stub whose pipeline embeds every text to `vector`. */
function fakeTransformers(vector: number[]) {
  return async () => ({
    env: { allowRemoteModels: true, cacheDir: "", localModelPath: "" },
    pipeline: async () => async () => ({ data: Float32Array.from(vector) }),
  })
}

describe("hybrid blending", () => {
  it("surfaces a semantic-only paraphrase match into the results", () => {
    const semantic = new Map([["carbon-trashCan", 0.8]])
    const results = searchCatalogIndex("garbage bin", "icon", semantic)
    const hit = results.find((result) => result.id === "carbon-trashCan")
    expect(hit).toBeDefined()
    expect(hit!.score).toBe(0.8)
  })

  it("takes the max of keyword and semantic, never the sum", () => {
    // "button" keyword-matches the button component exactly (1.0 + identity
    // bonus). A semantic score on top must not change that.
    const semantic = new Map([["button", 0.9]])
    const withSem = searchCatalogIndex("button", "component", semantic)
    const withoutSem = searchCatalogIndex("button", "component")
    expect(withSem.find((r) => r.id === "button")!.score).toBe(
      withoutSem.find((r) => r.id === "button")!.score,
    )
  })

  it("caps semantic scores strictly below an exact keyword word match", () => {
    // Even an absurd out-of-calibration score clamps to the ceiling — the
    // query shares no keyword with the entry, so the cap is what survives.
    const semantic = new Map([["carbon-trashCan", 5]])
    const results = searchCatalogIndex("garbage bin", "icon", semantic)
    const semanticHit = results.find((r) => r.id === "carbon-trashCan")!
    expect(semanticHit.score).toBe(SEMANTIC_SCORE_CEILING)
    expect(SEMANTIC_SCORE_CEILING).toBeLessThan(1)
  })

  it("keeps exact whole-query identity above every semantic score", () => {
    // Give every component the max semantic score; the identity match still
    // wins from its >1 band (exact matches rank first).
    const semantic = new Map(
      getCatalogEntries()
        .filter((entry) => entry.kind === "component")
        .map((entry) => [entry.id, 1] as const),
    )
    const results = searchCatalogIndex("button", "component", semantic)
    expect(results[0]!.id).toBe("button")
    expect(results[0]!.score).toBeGreaterThan(1)
  })
})

describe("icon tag overrides (eval review findings)", () => {
  it("merges hand-curated tags on top of the vendored ones", () => {
    // carbon-search's own upstream aliases are function-only ([find,
    // investigate, explore, look]) — the override adds the glyph words a
    // "magnifying glass" query needs, without replacing the vendored tags.
    const entry = getCatalogEntries().find((e) => e.id === "carbon-search")!
    expect(entry.tagWords).toEqual(
      expect.arrayContaining(["find", "investigate", "magnifying", "glass"]),
    )
  })

  it("makes a previously-unfindable icon rank via keyword match", () => {
    const results = searchCatalogIndex("magnifying glass", "icon")
    const hit = results.find((r) => r.id === "carbon-search")
    expect(hit).toBeDefined()
    expect(hit!.score).toBeGreaterThanOrEqual(0.7)
  })
})

describe("selectTopResults kind diversity", () => {
  const icon = (id: string, score: number) =>
    ({ id, kind: "icon", intent: "", score }) as const
  const results = [
    ...Array.from({ length: 8 }, (_, i) => icon(`icon-${i}`, 0.9 - i * 0.01)),
    { id: "avatar", kind: "component", intent: "", score: 0.7 },
    icon("icon-tail", 0.5),
    { id: "profileCard", kind: "component", intent: "", score: 0.4 },
  ] as Parameters<typeof selectTopResults>[0]

  it("at quota 1, gives an absent kind's BEST match the seat, not its worst", () => {
    const top = selectTopResults(results, 8, true, 1)
    expect(top).toHaveLength(8)
    expect(top.map((r) => r.id)).toContain("avatar")
    expect(top.map((r) => r.id)).not.toContain("profileCard")
  })

  it("at quota 2 (the default), a second relevant entry of the same kind also gets a seat", () => {
    const top = selectTopResults(results, 8, true)
    expect(top).toHaveLength(8)
    expect(top.map((r) => r.id)).toContain("avatar")
    expect(top.map((r) => r.id)).toContain("profileCard")
  })

  it("fills a kind already at 1/2 with its next-best candidate, not just absent kinds", () => {
    // "component" already has one seat (avatar) inside the raw top 8;
    // quota-1 logic would stop there. Quota 2 should still pull the second
    // component in from outside the top 8.
    const withOneComponentAlreadyIn = [
      ...Array.from({ length: 7 }, (_, i) =>
        icon(`icon-${i}`, 0.95 - i * 0.01),
      ),
      { id: "avatar", kind: "component", intent: "", score: 0.85 },
      icon("icon-tail", 0.5),
      { id: "profileCard", kind: "component", intent: "", score: 0.4 },
    ] as Parameters<typeof selectTopResults>[0]
    const top = selectTopResults(withOneComponentAlreadyIn, 8, true)
    expect(top.map((r) => r.id)).toContain("avatar")
    expect(top.map((r) => r.id)).toContain("profileCard")
  })

  it("changes nothing when every kind already met its quota", () => {
    const results = [
      { id: "a", kind: "component", intent: "", score: 1 },
      { id: "b", kind: "icon", intent: "", score: 0.9 },
    ] as Parameters<typeof selectTopResults>[0]
    expect(selectTopResults(results, 8, true)).toEqual(results)
  })
})

describe("index loading and model/index coupling", () => {
  it("loads a valid index", () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir)
    const loaded = loadSearchIndex(dir)
    expect(loaded.status).toBe("ok")
    if (loaded.status !== "ok") return
    expect(loaded.index.meta.model.id).toBe("fake/model")
    expect(loaded.index.vectors).toHaveLength(8)
  })

  it("reports missing (not invalid) when no index was built", () => {
    expect(loadSearchIndex(tmpDir("seldon-index-")).status).toBe("missing")
  })

  it("rejects a format-version mismatch", () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir, { formatVersion: 99 })
    const loaded = loadSearchIndex(dir)
    expect(loaded.status).toBe("invalid")
    if (loaded.status !== "invalid") return
    expect(loaded.reason).toContain("format version")
  })

  it("rejects vectors that do not match the recorded shape", () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir, {}, [[1, 0, 0, 0]]) // one row missing
    const loaded = loadSearchIndex(dir)
    expect(loaded.status).toBe("invalid")
    if (loaded.status !== "invalid") return
    expect(loaded.reason).toContain("out of sync")
  })

  it("maps cosine through the calibration into the sub-keyword band", () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir) // simFloor 0.5, semCeiling 0.9
    const loaded = loadSearchIndex(dir)
    if (loaded.status !== "ok") throw new Error("expected ok")

    // Query = first entry's vector: cosine 1 with row 0, 0 with row 1. The
    // best match above the floor always lands at the ceiling; entries at or
    // below the absolute floor are omitted.
    const scores = scoreAgainstIndex(
      Float32Array.from([1, 0, 0, 0]),
      loaded.index,
    )
    expect(scores.get("carbon-trashCan")).toBeCloseTo(0.9, 5)
    expect(scores.has("button")).toBe(false) // at/below the noise floor

    // Between floor and the query's max, scores scale relative to the max:
    // cosines 0.8 (row 0) and 0.65 (row 1) → 0.9 and 0.9·(0.15/0.3) = 0.45.
    const spread = scoreAgainstIndex(
      Float32Array.from([0.8, 0.65, 0, 0]),
      loaded.index,
    )
    expect(spread.get("carbon-trashCan")).toBeCloseTo(0.9, 5)
    expect(spread.get("button")).toBeCloseTo(0.45, 5)

    // A query with nothing above the floor scores nothing (feeds the
    // zero-result log).
    const nothing = scoreAgainstIndex(
      Float32Array.from([0.3, 0.3, 0, 0]),
      loaded.index,
    )
    expect(nothing.size).toBe(0)
  })

  it("normalizes within the searched kind when one is given", () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir) // entry 0 is an icon, entry 1 a component
    const loaded = loadSearchIndex(dir)
    if (loaded.status !== "ok") throw new Error("expected ok")

    // Unscoped: the component (cos 0.7) is the global max; the icon (0.65)
    // scales relative to it. Scoped to icons: the icon becomes its kind's
    // best match and lands at the ceiling; the component never scores.
    const query = Float32Array.from([0.65, 0.7, 0, 0])
    const global = scoreAgainstIndex(query, loaded.index)
    expect(global.get("button")).toBeCloseTo(0.9, 5)
    expect(global.get("carbon-trashCan")).toBeCloseTo(0.675, 5)

    const iconsOnly = scoreAgainstIndex(query, loaded.index, "icon")
    expect(iconsOnly.get("carbon-trashCan")).toBeCloseTo(0.9, 5)
    expect(iconsOnly.has("button")).toBe(false)
  })
})

describe("semantic provider fallback ladder", () => {
  it("is silent when no index exists (fresh checkout)", async () => {
    const errors: string[] = []
    const provider = createSemanticSearchProvider({
      indexDir: tmpDir("seldon-index-"),
      reportError: (message) => errors.push(message),
    })
    expect(await provider.scoreQuery("garbage bin")).toBeNull()
    expect(errors).toEqual([])
  })

  it("is silent when the optional dependency is not installed", async () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir)
    const errors: string[] = []
    const provider = createSemanticSearchProvider({
      indexDir: dir,
      importTransformers: () =>
        Promise.reject(
          new Error("Cannot find module '@huggingface/transformers'"),
        ),
      reportError: (message) => errors.push(message),
    })
    expect(await provider.scoreQuery("garbage bin")).toBeNull()
    expect(errors).toEqual([])
  })

  it("is loud on an index/format mismatch and falls back", async () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir, { formatVersion: 99 })
    const errors: string[] = []
    const provider = createSemanticSearchProvider({
      indexDir: dir,
      importTransformers: fakeTransformers([1, 0, 0, 0]),
      reportError: (message) => errors.push(message),
    })
    expect(await provider.scoreQuery("garbage bin")).toBeNull()
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain("keyword-only")
  })

  it("is loud when the model's dimensions contradict the index", async () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir) // records 4 dims
    const errors: string[] = []
    const provider = createSemanticSearchProvider({
      indexDir: dir,
      importTransformers: fakeTransformers([1, 0]), // model emits 2 dims
      reportError: (message) => errors.push(message),
    })
    expect(await provider.scoreQuery("garbage bin")).toBeNull()
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain("do not match")
  })

  it("scores queries through a working stack, once initialized", async () => {
    const dir = tmpDir("seldon-index-")
    writeFakeIndex(dir)
    const provider = createSemanticSearchProvider({
      indexDir: dir,
      importTransformers: fakeTransformers([1, 0, 0, 0]),
      reportError: () => {},
    })
    const scores = await provider.scoreQuery("anything")
    expect(scores).not.toBeNull()
    expect(scores!.get("carbon-trashCan")).toBeCloseTo(0.9, 5)
  })
})

describe("search_catalog keyword parity without the optional stack", () => {
  it("returns byte-identical results with no provider and with a dead provider", async () => {
    const { ctx: bare } = makeCtx()
    const { ctx: dead } = makeCtx({
      semantic: createSemanticSearchProvider({
        indexDir: tmpDir("seldon-index-"),
        reportError: () => {},
      }),
    })

    for (const query of ["button", "shopping cart", "cta", "zxqvwjkly"]) {
      const a = await searchCatalog(bare, { query })
      const b = await searchCatalog(dead, { query })
      expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    }
  })

  it("keyword-only still finds every exact-vocabulary eval expectation", () => {
    // Regression tripwire for the documented floor: pairs whose queries use
    // catalog vocabulary directly must keep passing without embeddings.
    const results = searchCatalogIndex("rating star", "icon")
    expect(
      results
        .slice(0, 8)
        .some((result) =>
          SEARCH_EVAL_SET.find(
            (p) => p.query === "rating star",
          )!.expected.includes(result.id),
        ),
    ).toBe(true)
  })
})

describe("zero-result logging", () => {
  it("appends a JSONL event next to the open workspace", async () => {
    const { ctx, root } = makeCtx()
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })

    const { results } = await searchCatalog(ctx, { query: "zxqvwjkly" })
    expect(results).toEqual([])

    const logPath = path.join(root, LOG_DIR_NAME, LOG_FILE_NAME)
    const lines = fs
      .readFileSync(logPath, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))
    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatchObject({
      event: "search_zero_results",
      query: "zxqvwjkly",
      matchesBeforeTargetFilter: 0,
      semantic: false,
    })
    expect(typeof lines[0].ts).toBe("string")
  })

  it("does not log when results exist", async () => {
    const { ctx, root } = makeCtx()
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })
    await searchCatalog(ctx, { query: "button" })
    expect(fs.existsSync(path.join(root, LOG_DIR_NAME, LOG_FILE_NAME))).toBe(
      false,
    )
  })
})
