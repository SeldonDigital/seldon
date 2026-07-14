import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import type { SearchKind } from "./catalog-search"
import { SEMANTIC_SCORE_CEILING, getCatalogEntries } from "./catalog-search"

/**
 * Optional semantic search runtime.
 *
 * The build-time script (scripts/build-search-index.ts) embeds the catalog
 * corpus with a local ONNX model and writes an index (metadata JSON + raw
 * Float32 vectors) plus the vendored model files under search-index/. At
 * runtime this module embeds only the query — locally, never over the
 * network — and returns calibrated per-entry scores for the hybrid blend in
 * catalog-search.ts.
 *
 * Fallback ladder (every rung degrades to keyword-only search):
 * - `@huggingface/transformers` not installed, or no index built → SILENT
 *   (expected states, not faults).
 * - Index present but unreadable, wrong format version, vector/entry-count
 *   mismatch, model files missing or of the wrong shape → LOUD one-time
 *   stderr report (the index and model are a coupled artifact; a
 *   mismatch means a broken build, and someone should hear about it).
 */

export const SEARCH_INDEX_FORMAT_VERSION = 1
export const SEARCH_INDEX_FILE = "catalog-index.json"
export const SEARCH_INDEX_MODELS_SUBDIR = "models"

/** Default index location: packages/mcp/search-index/ (gitignored artifact). */
export const DEFAULT_SEARCH_INDEX_DIR = fileURLToPath(
  new URL("../search-index/", import.meta.url),
)

export interface SearchIndexModel {
  /** Hugging Face repo id of the embedding model, e.g. "Xenova/bge-small-en-v1.5". */
  id: string
  /** ONNX weights dtype the index was built with ("q8", "fp32", …). */
  dtype: string
  dimensions: number
  /** Model-specific instruction prepended to queries ("" when none). */
  queryPrefix: string
  /** Instruction prepended to passages at build time ("" when none). */
  passagePrefix: string
}

export interface SearchIndexCalibration {
  /** Cosine at/below this scores 0 — the model's unrelated-pair noise floor. */
  simFloor: number
  /** Score at cosine 1 after mapping; must stay ≤ SEMANTIC_SCORE_CEILING. */
  semCeiling: number
}

export interface SearchIndexFile {
  formatVersion: number
  model: SearchIndexModel
  calibration: SearchIndexCalibration
  builtAt: string
  /** Ids in vector order; consumers key by id, never by catalog position. */
  entryIds: string[]
  /**
   * Catalog kind per row (parallel to entryIds). Kind-filtered searches
   * normalize semantic scores within the searched kind — its own best match
   * is the reference point, not some icon the filter excludes anyway.
   */
  entryKinds: SearchKind[]
  /** Sibling file of little-endian Float32s, entryIds.length × dimensions. */
  vectorsFile: string
}

export interface LoadedSearchIndex {
  meta: SearchIndexFile
  /** L2-normalized, row-major: entryIds.length × dimensions. */
  vectors: Float32Array
}

export type LoadIndexResult =
  | { status: "ok"; index: LoadedSearchIndex }
  | { status: "missing" }
  | { status: "invalid"; reason: string }

/** Reads and structurally validates the index pair from `dir`. */
export function loadSearchIndex(dir: string): LoadIndexResult {
  const metaPath = path.join(dir, SEARCH_INDEX_FILE)
  if (!fs.existsSync(metaPath)) return { status: "missing" }

  let meta: SearchIndexFile
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
  } catch (error) {
    return {
      status: "invalid",
      reason: `unreadable ${SEARCH_INDEX_FILE}: ${(error as Error).message}`,
    }
  }

  if (meta.formatVersion !== SEARCH_INDEX_FORMAT_VERSION) {
    return {
      status: "invalid",
      reason:
        `index format version ${meta.formatVersion} does not match this ` +
        `server's version ${SEARCH_INDEX_FORMAT_VERSION}`,
    }
  }
  if (
    !meta.model?.id ||
    !Number.isInteger(meta.model.dimensions) ||
    meta.model.dimensions <= 0 ||
    !Array.isArray(meta.entryIds) ||
    !Array.isArray(meta.entryKinds) ||
    meta.entryKinds.length !== meta.entryIds.length ||
    typeof meta.vectorsFile !== "string"
  ) {
    return { status: "invalid", reason: "index metadata is malformed" }
  }

  const vectorsPath = path.join(dir, meta.vectorsFile)
  let bytes: Buffer
  try {
    bytes = fs.readFileSync(vectorsPath)
  } catch (error) {
    return {
      status: "invalid",
      reason: `unreadable vectors file ${meta.vectorsFile}: ${(error as Error).message}`,
    }
  }

  const expectedBytes = meta.entryIds.length * meta.model.dimensions * 4
  if (bytes.byteLength !== expectedBytes) {
    return {
      status: "invalid",
      reason:
        `vectors file is ${bytes.byteLength} bytes but ` +
        `${meta.entryIds.length} entries × ${meta.model.dimensions} dims ` +
        `require ${expectedBytes} — index and vectors are out of sync`,
    }
  }

  const vectors = new Float32Array(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  )
  return { status: "ok", index: { meta, vectors } }
}

/** The subset of @huggingface/transformers this module touches. */
interface TransformersModule {
  env: {
    allowRemoteModels: boolean
    cacheDir: string
    localModelPath: string
  }
  pipeline: (
    task: "feature-extraction",
    model: string,
    options: { dtype: string },
  ) => Promise<
    (
      text: string,
      options: { pooling: "mean"; normalize: boolean },
    ) => Promise<{ data: Float32Array | number[] }>
  >
}

/**
 * Points transformers.js at the vendored model files and forbids network
 * access. Shared with the build script, which flips
 * `allowRemoteModels` back on — downloading belongs to build time only.
 */
export function configureTransformersEnv(
  transformers: Pick<TransformersModule, "env">,
  indexDir: string,
): void {
  const modelsDir = path.join(indexDir, SEARCH_INDEX_MODELS_SUBDIR)
  transformers.env.allowRemoteModels = false
  transformers.env.cacheDir = modelsDir
  transformers.env.localModelPath = modelsDir
}

export interface SemanticSearchProvider {
  /**
   * Calibrated semantic scores (entry id → 0..<1) for one query, or null when
   * semantic search is unavailable for any reason. Never throws and never
   * touches the network; a failed initialization latches to null. With
   * `kind`, scores are computed and normalized within that kind only.
   */
  scoreQuery(
    query: string,
    kind?: SearchKind,
  ): Promise<ReadonlyMap<string, number> | null>
}

export interface SemanticProviderOptions {
  /** Index directory override (tests, SELDON_MCP_SEARCH_INDEX_DIR). */
  indexDir?: string
  /** Injection point so tests can simulate a missing/broken dependency. */
  importTransformers?: () => Promise<TransformersModule>
  /** Loud-failure sink; defaults to stderr (stdout is the MCP channel). */
  reportError?: (message: string) => void
}

interface ReadyState {
  index: LoadedSearchIndex
  embedQuery: (text: string) => Promise<Float32Array>
}

/**
 * Creates the lazy semantic runtime. Nothing loads until the first
 * `scoreQuery` call, so servers on keyword-only installs pay zero cost.
 */
export function createSemanticSearchProvider(
  options: SemanticProviderOptions = {},
): SemanticSearchProvider {
  const indexDir =
    options.indexDir ??
    process.env.SELDON_MCP_SEARCH_INDEX_DIR ??
    DEFAULT_SEARCH_INDEX_DIR
  const importTransformers =
    options.importTransformers ??
    (() =>
      import("@huggingface/transformers") as unknown as Promise<TransformersModule>)
  const reportError =
    options.reportError ??
    ((message: string) => console.error(`[seldon-mcp] ${message}`))

  let initPromise: Promise<ReadyState | null> | null = null

  async function initialize(): Promise<ReadyState | null> {
    const loaded = loadSearchIndex(indexDir)
    if (loaded.status === "missing") return null // no index built — silent
    if (loaded.status === "invalid") {
      reportError(
        `Semantic search index at ${indexDir} is unusable (${loaded.reason}). ` +
          `Falling back to keyword-only search. Rebuild with ` +
          `"npm run build:search-index".`,
      )
      return null
    }

    let transformers: TransformersModule
    try {
      transformers = await importTransformers()
    } catch {
      // Optional dependency not installed — the documented silent fallback.
      return null
    }

    const { meta } = loaded.index
    try {
      configureTransformersEnv(transformers, indexDir)
      const extractor = await transformers.pipeline(
        "feature-extraction",
        meta.model.id,
        { dtype: meta.model.dtype },
      )
      const embedQuery = async (text: string) => {
        const output = await extractor(text, {
          pooling: "mean",
          normalize: true,
        })
        return Float32Array.from(output.data)
      }

      // Model↔index coupling: prove the vendored model actually is the
      // one the index records, by shape. A swapped or half-downloaded model
      // either failed above or produces the wrong dimensionality here.
      const probe = await embedQuery(meta.model.queryPrefix + "probe")
      if (probe.length !== meta.model.dimensions) {
        reportError(
          `Semantic search model "${meta.model.id}" produced ` +
            `${probe.length}-dim vectors but the index at ${indexDir} was ` +
            `built with ${meta.model.dimensions} dims — model and index do ` +
            `not match. Falling back to keyword-only search. Rebuild with ` +
            `"npm run build:search-index".`,
        )
        return null
      }

      return { index: loaded.index, embedQuery }
    } catch (error) {
      reportError(
        `Semantic search model "${meta.model.id}" recorded in the index at ` +
          `${indexDir} failed to load locally: ${(error as Error).message}. ` +
          `Falling back to keyword-only search. Rebuild with ` +
          `"npm run build:search-index".`,
      )
      return null
    }
  }

  return {
    async scoreQuery(query, kind) {
      initPromise ??= initialize().catch((error) => {
        reportError(
          `Semantic search initialization failed unexpectedly: ` +
            `${(error as Error).message}. Falling back to keyword-only search.`,
        )
        return null
      })
      const ready = await initPromise
      if (!ready) return null

      try {
        const { meta } = ready.index
        const queryVector = await ready.embedQuery(
          meta.model.queryPrefix + query,
        )
        return scoreAgainstIndex(queryVector, ready.index, kind)
      } catch (error) {
        reportError(
          `Semantic query embedding failed: ${(error as Error).message}. ` +
            `Serving keyword-only results for this query.`,
        )
        return null
      }
    },
  }
}

/**
 * Cosine scores (vectors are normalized, so plain dot products) mapped into
 * the sub-keyword band. Two-stage calibration:
 *
 * 1. Absolute gate: entries at/below the model's noise floor (`simFloor`)
 *    are omitted entirely — a query about nothing in the catalog stays a
 *    zero-result search.
 * 2. Per-query relative scaling: surviving cosines are normalized against
 *    the query's own best match, which lands at `semCeiling`. Embedding
 *    models compress cosines into narrow, query-dependent ranges; absolute
 *    mapping left correct paraphrase hits scored below partial keyword
 *    noise (measured in the model eval), while the per-query max is a stable
 *    reference point across models.
 */
export function scoreAgainstIndex(
  queryVector: Float32Array,
  index: LoadedSearchIndex,
  kind?: SearchKind,
): Map<string, number> {
  const { meta, vectors } = index
  const dims = meta.model.dimensions
  const { simFloor } = meta.calibration
  const semCeiling = Math.min(
    meta.calibration.semCeiling,
    SEMANTIC_SCORE_CEILING,
  )

  const count = meta.entryIds.length
  const cosines = new Float32Array(count)
  let maxCos = -1
  for (let row = 0; row < count; row++) {
    if (kind && meta.entryKinds[row] !== kind) continue
    const offset = row * dims
    let dot = 0
    for (let d = 0; d < dims; d++) {
      dot += queryVector[d]! * vectors[offset + d]!
    }
    cosines[row] = dot
    if (dot > maxCos) maxCos = dot
  }

  const scores = new Map<string, number>()
  if (maxCos <= simFloor) return scores

  const scale = semCeiling / (maxCos - simFloor)
  for (let row = 0; row < count; row++) {
    if (kind && meta.entryKinds[row] !== kind) continue
    const cos = cosines[row]!
    if (cos <= simFloor) continue
    scores.set(meta.entryIds[row]!, (cos - simFloor) * scale)
  }
  return scores
}

/**
 * The passages the index encodes, in a stable order. Lives here (not in the
 * build script) so the runtime, the build, and the eval harness agree on the
 * corpus by construction.
 */
export function getEmbeddingCorpus(): Array<{
  id: string
  kind: SearchKind
  text: string
}> {
  return getCatalogEntries().map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    text: entry.embeddingText,
  }))
}
