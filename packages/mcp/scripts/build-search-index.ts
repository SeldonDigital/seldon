/**
 * Build-time semantic index builder.
 *
 * Embeds the full catalog corpus (components, icons, themes, font
 * collections — the same entries keyword search ranks) with a local ONNX
 * model and writes, under packages/mcp/search-index/:
 *
 *   catalog-index.json          metadata: format version, model identity,
 *                               calibration, entry ids (model↔index coupling)
 *   catalog-index.vectors.bin   raw little-endian Float32 rows
 *   models/<model files>        the vendored model, downloaded HERE so the
 *                               server runtime never touches the network
 *
 * Usage:
 *   npm run build:search-index [-- --model <hf-repo-id>] [--out <dir>]
 *
 * The model defaults to DEFAULT_MODEL_ID — the winner picked by
 * scripts/search-eval.ts and documented in SEARCH-EVAL.md.
 */
import fs from "node:fs"
import { register } from "node:module"
import path from "node:path"

// Core resolves bundler-style; bridge the gaps before anything imports it
// (same pattern as src/main.ts — see src/runtime/hooks.mjs).
register(new URL("../src/runtime/hooks.mjs", import.meta.url))

const { DEFAULT_MODEL_ID, SEM_CEILING, getModelSpec } =
  await import("./embedding-models")
const { loadEmbedder } = await import("./embedding-runtime")
const { getEmbeddingCorpus } = await import("../src/semantic-search")
const {
  DEFAULT_SEARCH_INDEX_DIR,
  SEARCH_INDEX_FILE,
  SEARCH_INDEX_FORMAT_VERSION,
  SEARCH_INDEX_MODELS_SUBDIR,
} = await import("../src/semantic-search")
type SearchIndexFile = import("../src/semantic-search").SearchIndexFile

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  return index === -1 ? undefined : process.argv[index + 1]
}

const modelId = argValue("--model") ?? DEFAULT_MODEL_ID
const outDir = path.resolve(argValue("--out") ?? DEFAULT_SEARCH_INDEX_DIR)
const spec = getModelSpec(modelId, argValue("--dtype"))

console.log(`Building semantic search index`)
console.log(`  model:  ${spec.id} (dtype ${spec.dtype})`)
console.log(`  out:    ${outDir}`)

const corpus = getEmbeddingCorpus()
console.log(`  corpus: ${corpus.length} catalog entries`)

fs.mkdirSync(path.join(outDir, SEARCH_INDEX_MODELS_SUBDIR), { recursive: true })

const embedder = await loadEmbedder(
  spec.id,
  spec.dtype,
  path.join(outDir, SEARCH_INDEX_MODELS_SUBDIR),
  { allowRemote: true }, // downloads are a build-time act only
)

const vectors = await embedder.embed(
  corpus.map((entry) => spec.passagePrefix + entry.text),
)

const dimensions = embedder.dimensions
const flat = new Float32Array(corpus.length * dimensions)
vectors.forEach((vector, row) => {
  if (vector.length !== dimensions) {
    throw new Error(
      `row ${row} has ${vector.length} dims, expected ${dimensions}`,
    )
  }
  flat.set(vector, row * dimensions)
})

const vectorsFile = "catalog-index.vectors.bin"
const meta: SearchIndexFile = {
  formatVersion: SEARCH_INDEX_FORMAT_VERSION,
  model: {
    id: spec.id,
    dtype: spec.dtype,
    dimensions,
    queryPrefix: spec.queryPrefix,
    passagePrefix: spec.passagePrefix,
  },
  calibration: { simFloor: spec.simFloor, semCeiling: SEM_CEILING },
  builtAt: new Date().toISOString(),
  entryIds: corpus.map((entry) => entry.id),
  entryKinds: corpus.map((entry) => entry.kind),
  vectorsFile,
}

fs.writeFileSync(path.join(outDir, vectorsFile), Buffer.from(flat.buffer))
fs.writeFileSync(
  path.join(outDir, SEARCH_INDEX_FILE),
  JSON.stringify(meta, null, 2) + "\n",
)

const mb = (flat.byteLength / 1024 / 1024).toFixed(1)
console.log(
  `Wrote ${SEARCH_INDEX_FILE} (${corpus.length} × ${dimensions} dims) ` +
    `and ${vectorsFile} (${mb} MB).`,
)
