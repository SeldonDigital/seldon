/**
 * Runtime embedding + cosine ranking for find_node, over the small,
 * per-request candidate set. Unlike packages/mcp's semantic search (a
 * build-time static index over the fixed catalog corpus), workspace nodes
 * change per request, so both query and candidates embed live -- locally,
 * never over the network for inference (the model weights download once and
 * cache on first use).
 *
 * Degrades gracefully: when @huggingface/transformers can't load (not
 * installed, blocked postinstall, unsupported platform), ranking returns
 * null and the caller escalates to its LLM tie-break path instead. find_node
 * must never take the whole harness down over an optional accelerator.
 */

const MODEL_ID = "Xenova/bge-small-en-v1.5"

type Embedder = (
  texts: string[],
  options: { pooling: "mean"; normalize: true },
) => Promise<{ tolist(): number[][] }>

let embedderPromise: Promise<Embedder | null> | undefined

/** One-time embedder load; a failure is remembered and reported once. */
function getEmbedder(): Promise<Embedder | null> {
  embedderPromise ??= (async () => {
    try {
      const { pipeline } = await import("@huggingface/transformers")
      const extractor = await pipeline("feature-extraction", MODEL_ID, {
        dtype: "q8",
      })
      return extractor as unknown as Embedder
    } catch (cause) {
      console.warn(
        `[find-node] Embedding model unavailable (${cause instanceof Error ? cause.message : "load failed"}); falling back to LLM candidate picking.`,
      )
      return null
    }
  })()
  return embedderPromise
}

export interface RankedCandidate {
  id: string
  /** Cosine similarity against the query, in [-1, 1]. */
  score: number
}

/**
 * Ranks candidates by cosine similarity of their text against the query.
 * Returns null when embeddings are unavailable, so the caller can fall back.
 * Vectors are mean-pooled and L2-normalized, so the dot product IS the
 * cosine similarity.
 */
export async function rankBySimilarity(
  query: string,
  candidates: readonly { id: string; text: string }[],
): Promise<RankedCandidate[] | null> {
  if (candidates.length === 0) return []
  const embedder = await getEmbedder()
  if (!embedder) return null

  const output = await embedder([query, ...candidates.map((c) => c.text)], {
    pooling: "mean",
    normalize: true,
  })
  const vectors = output.tolist()
  const queryVector = vectors[0]!

  const ranked = candidates.map((candidate, index) => {
    const vector = vectors[index + 1]!
    let dot = 0
    for (let i = 0; i < queryVector.length; i++)
      dot += queryVector[i]! * vector[i]!
    return { id: candidate.id, score: dot }
  })
  ranked.sort((a, b) => b.score - a.score)
  return ranked
}
