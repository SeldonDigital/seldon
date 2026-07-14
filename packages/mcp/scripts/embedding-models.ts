/**
 * Candidate embedding models for search_catalog.
 *
 * All are ONNX exports runnable by transformers.js fully locally, in the
 * bge-small class (~30–130 MB, 384-dim). The eval harness
 * (scripts/search-eval.ts) scores every candidate on the authored eval set
 * (src/search-eval-set.ts) and picks `simFloor` per model by grid search;
 * the winner and its calibration become DEFAULT_MODEL and are stamped into
 * the index by scripts/build-search-index.ts.
 */
export interface EmbeddingModelSpec {
  /** Hugging Face repo id of the ONNX export. */
  id: string
  /** ONNX weights variant to download and run. */
  dtype: string
  /** Model-specific retrieval instruction for queries ("" when none). */
  queryPrefix: string
  /** Model-specific instruction for indexed passages ("" when none). */
  passagePrefix: string
  /**
   * Cosine noise floor: similarity at/below this scores 0 in the hybrid
   * blend. Chosen by the eval harness grid search, recorded here so index
   * builds are reproducible without re-running the eval.
   */
  simFloor: number
}

export const EMBEDDING_MODELS: EmbeddingModelSpec[] = [
  {
    // Selected model: hybrid recall@8 91.2% on the eval set (SEARCH-EVAL.md).
    id: "Xenova/bge-small-en-v1.5",
    dtype: "q8",
    queryPrefix: "Represent this sentence for searching relevant passages: ",
    passagePrefix: "",
    simFloor: 0.55,
  },
  {
    // Same model, unquantized weights — evaluated because q8 noise
    // measurably reshuffles tight top-8 bands; ended up BELOW q8 (89.5%).
    id: "Xenova/bge-small-en-v1.5",
    dtype: "fp32",
    queryPrefix: "Represent this sentence for searching relevant passages: ",
    passagePrefix: "",
    simFloor: 0.54,
  },
  {
    id: "Xenova/bge-base-en-v1.5",
    dtype: "q8",
    queryPrefix: "Represent this sentence for searching relevant passages: ",
    passagePrefix: "",
    simFloor: 0.55,
  },
  {
    id: "Xenova/all-MiniLM-L6-v2",
    dtype: "q8",
    queryPrefix: "",
    passagePrefix: "",
    simFloor: 0.4,
  },
  {
    id: "Xenova/gte-small",
    dtype: "q8",
    queryPrefix: "",
    passagePrefix: "",
    simFloor: 0.85,
  },
  {
    id: "Xenova/e5-small-v2",
    dtype: "q8",
    queryPrefix: "query: ",
    passagePrefix: "passage: ",
    simFloor: 0.8,
  },
]

/**
 * The model the shipped index is built with — chosen by the
 * eval run documented in SEARCH-EVAL.md.
 */
export const DEFAULT_MODEL_ID = "Xenova/bge-small-en-v1.5"

/** Semantic score at cosine 1 (must stay under catalog-search's 0.95 cap). */
export const SEM_CEILING = 0.9

export function getModelSpec(
  modelId: string,
  dtype?: string,
): EmbeddingModelSpec {
  const spec = EMBEDDING_MODELS.find(
    (model) => model.id === modelId && (!dtype || model.dtype === dtype),
  )
  if (!spec) {
    throw new Error(
      `Unknown embedding model "${modelId}"${dtype ? ` (dtype ${dtype})` : ""}. Known: ` +
        EMBEDDING_MODELS.map((model) => `${model.id}[${model.dtype}]`).join(
          ", ",
        ),
    )
  }
  return spec
}
