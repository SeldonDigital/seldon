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
  const nothingToRank = candidates.length === 0
  if (nothingToRank) return []
  const embedder = await getEmbedder()
  const embeddingsAreUnavailable = embedder === null
  if (embeddingsAreUnavailable) return null

  // The query occupies row 0; each candidate follows in input order.
  const embedderOutput = await embedder(
    [query, ...candidates.map((candidate) => candidate.text)],
    {
      pooling: "mean",
      normalize: true,
    },
  )
  const vectors = embedderOutput.tolist()
  const queryVector = vectors[0]!

  const rankedCandidates = candidates.map((candidate, candidateIndex) => {
    const candidateVector = vectors[candidateIndex + 1]!
    let cosineSimilarity = 0
    for (let dimension = 0; dimension < queryVector.length; dimension++)
      cosineSimilarity += queryVector[dimension]! * candidateVector[dimension]!
    return { id: candidate.id, score: cosineSimilarity }
  })
  rankedCandidates.sort(
    (candidateA, candidateB) => candidateB.score - candidateA.score,
  )
  return rankedCandidates
}
