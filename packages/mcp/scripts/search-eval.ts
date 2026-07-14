/**
 * Search quality eval harness (quality gate and model selection).
 *
 * For every candidate embedding model (scripts/embedding-models.ts) this
 * embeds the catalog corpus and the authored eval queries
 * (src/search-eval-set.ts), grid-searches the cosine noise floor, and
 * reports recall@8 for:
 *   - keyword-only ranking (the fallback floor, model-independent)
 *   - hybrid ranking through the REAL search path (searchCatalogIndex with
 *     calibrated semantic scores — exactly what search_catalog serves)
 *
 * Gate: hybrid recall@8 ≥ 90% on ≥40 pairs (≥25 icons, ≥15 components).
 * Results are documented in SEARCH-EVAL.md.
 *
 * Usage:
 *   npm run eval:search [-- --model <hf-repo-id>]   (default: all candidates)
 *
 * Downloads models into packages/mcp/.cache/models (build-time only;
 * the server runtime never downloads).
 */
import { register } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

register(new URL("../src/runtime/hooks.mjs", import.meta.url))

const { EMBEDDING_MODELS, SEM_CEILING } = await import("./embedding-models")
const { loadEmbedder } = await import("./embedding-runtime")
const { searchCatalogIndex, selectTopResults } =
  await import("../src/catalog-search")
const { getEmbeddingCorpus, scoreAgainstIndex } =
  await import("../src/semantic-search")
const { SEARCH_EVAL_SET } = await import("../src/search-eval-set")
type LoadedSearchIndex = import("../src/semantic-search").LoadedSearchIndex
type SearchEvalPair = import("../src/search-eval-set").SearchEvalPair

const RECALL_AT = 8
// Coarse sweep everywhere, fine steps through 0.45–0.70 where the small-
// model peaks sit — recall is floor-sensitive there (different pairs win on
// either side of the peak, so the crossover needs 0.0125 resolution).
const FLOOR_GRID = [
  ...Array.from({ length: 5 }, (_, i) => 0.2 + i * 0.05),
  ...Array.from({ length: 21 }, (_, i) => 0.45 + i * 0.0125),
  ...Array.from({ length: 3 }, (_, i) => 0.75 + i * 0.05),
].map((floor) => Number(floor.toFixed(4)))
const CACHE_DIR = fileURLToPath(new URL("../.cache/models", import.meta.url))

// ---- Sanity: every expected id must exist in the corpus -------------------
const corpus = getEmbeddingCorpus()
const corpusIds = new Set(corpus.map((entry) => entry.id))
const unknown = SEARCH_EVAL_SET.flatMap((pair) =>
  pair.expected.filter((id) => !corpusIds.has(id)),
)
if (unknown.length > 0) {
  console.error(
    `Eval set references ids not in the catalog:\n  ${unknown.join("\n  ")}`,
  )
  process.exit(1)
}

const kindOf = (pair: SearchEvalPair) =>
  pair.kind ??
  (pair.expected.some((id) => id.includes("-")) ? "icon" : "component")
const iconPairs = SEARCH_EVAL_SET.filter((p) => kindOf(p) === "icon").length
console.log(
  `Eval set: ${SEARCH_EVAL_SET.length} pairs ` +
    `(${iconPairs} icon, ${SEARCH_EVAL_SET.length - iconPairs} other; ` +
    `gate needs ≥40 total, ≥25 icons, ≥15 components)`,
)

// ---- Scoring helpers -------------------------------------------------------
function hits(
  pair: SearchEvalPair,
  semanticScores?: ReadonlyMap<string, number> | undefined,
): boolean {
  const results = searchCatalogIndex(pair.query, pair.kind, semanticScores)
  // Mirror the tool exactly, including the kind-diversity slot.
  const top = selectTopResults(results, RECALL_AT, !pair.kind)
  return top.some((result) => pair.expected.includes(result.id))
}

function recall(
  scoresPerPair: Array<ReadonlyMap<string, number> | undefined>,
): { rate: number; failures: SearchEvalPair[] } {
  const failures: SearchEvalPair[] = []
  SEARCH_EVAL_SET.forEach((pair, i) => {
    if (!hits(pair, scoresPerPair[i])) failures.push(pair)
  })
  return {
    rate: (SEARCH_EVAL_SET.length - failures.length) / SEARCH_EVAL_SET.length,
    failures,
  }
}

const pct = (rate: number) => `${(rate * 100).toFixed(1)}%`

// ---- Keyword-only floor (model-independent) --------------------------------
const keyword = recall(SEARCH_EVAL_SET.map(() => undefined))
console.log(`\nKeyword-only recall@${RECALL_AT}: ${pct(keyword.rate)}`)
for (const pair of keyword.failures) {
  console.log(`  miss: "${pair.query}" → ${pair.expected[0]}`)
}

// ---- Per-model hybrid ------------------------------------------------------
const onlyModel = (() => {
  const index = process.argv.indexOf("--model")
  return index === -1 ? undefined : process.argv[index + 1]
})()
const candidates = EMBEDDING_MODELS.filter(
  (model) => !onlyModel || model.id === onlyModel,
)
if (candidates.length === 0) {
  console.error(`No candidate matches --model ${onlyModel}`)
  process.exit(1)
}

interface ModelReport {
  id: string
  bestFloor: number
  hybrid: number
  failures: SearchEvalPair[]
}
const reports: ModelReport[] = []

for (const spec of candidates) {
  console.log(`\n=== ${spec.id} (dtype ${spec.dtype}) ===`)
  const embedder = await loadEmbedder(spec.id, spec.dtype, CACHE_DIR, {
    allowRemote: true,
  })

  console.log(`embedding ${corpus.length} passages…`)
  const passageVectors = await embedder.embed(
    corpus.map((entry) => spec.passagePrefix + entry.text),
  )
  const dimensions = embedder.dimensions
  const flat = new Float32Array(corpus.length * dimensions)
  passageVectors.forEach((vector, row) => flat.set(vector, row * dimensions))

  // Queries embed ONE AT A TIME — the server's runtime shape. Batching them
  // pads short queries and perturbs the vectors enough to reshuffle top-8s.
  const queryVectors: Float32Array[] = []
  for (const pair of SEARCH_EVAL_SET) {
    queryVectors.push(
      ...(await embedder.embed([spec.queryPrefix + pair.query])),
    )
  }

  const indexFor = (simFloor: number): LoadedSearchIndex => ({
    meta: {
      formatVersion: 1,
      model: {
        id: spec.id,
        dtype: spec.dtype,
        dimensions,
        queryPrefix: spec.queryPrefix,
        passagePrefix: spec.passagePrefix,
      },
      calibration: { simFloor, semCeiling: SEM_CEILING },
      builtAt: "",
      entryIds: corpus.map((entry) => entry.id),
      entryKinds: corpus.map((entry) => entry.kind),
      vectorsFile: "",
    },
    vectors: flat,
  })

  let best: ModelReport = {
    id: `${spec.id}[${spec.dtype}]`,
    bestFloor: 0,
    hybrid: -1,
    failures: [],
  }
  for (const simFloor of FLOOR_GRID) {
    const index = indexFor(simFloor)
    // Kind-filtered pairs score within their kind, mirroring the tool.
    const scores = queryVectors.map((vector, i) =>
      scoreAgainstIndex(vector, index, SEARCH_EVAL_SET[i]!.kind),
    )
    const { rate, failures } = recall(scores)
    const marker = rate > best.hybrid ? " *" : ""
    console.log(`  floor ${simFloor.toFixed(2)}: hybrid ${pct(rate)}${marker}`)
    // Ties prefer the higher floor: same recall with less semantic noise.
    if (rate >= best.hybrid) {
      best = { ...best, bestFloor: simFloor, hybrid: rate, failures }
    }
  }

  console.log(
    `best: floor ${best.bestFloor.toFixed(2)} → hybrid recall@${RECALL_AT} ${pct(best.hybrid)}`,
  )
  for (const pair of best.failures) {
    console.log(`  miss: "${pair.query}" → ${pair.expected[0]}`)
  }
  reports.push(best)
}

// ---- Summary ----------------------------------------------------------------
console.log(`\n================ SUMMARY ================`)
console.log(`pairs: ${SEARCH_EVAL_SET.length} · recall@${RECALL_AT}`)
console.log(`keyword-only floor: ${pct(keyword.rate)}`)
for (const report of reports.sort((a, b) => b.hybrid - a.hybrid)) {
  const gate = report.hybrid >= 0.9 ? "PASS" : "fail"
  console.log(
    `${gate}  ${report.id}: ${pct(report.hybrid)} (simFloor ${report.bestFloor.toFixed(2)})`,
  )
}
