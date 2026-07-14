/**
 * Shared embedding plumbing for the build-time scripts (build-search-index,
 * search-eval). This file may download models (build time only — the server
 * runtime never does) and therefore never ships into src/.
 */

export interface Embedder {
  dimensions: number
  /** Mean-pooled, L2-normalized embeddings, one Float32Array per text. */
  embed(texts: string[]): Promise<Float32Array[]>
}

const BATCH_SIZE = 32

/**
 * Loads a feature-extraction pipeline with transformers.js pointed at
 * `modelsDir`. With `allowRemote`, missing files download into that dir —
 * the same layout src/semantic-search.ts later reads with downloads
 * forbidden, which is what makes build-time vendoring work.
 */
export async function loadEmbedder(
  modelId: string,
  dtype: string,
  modelsDir: string,
  { allowRemote }: { allowRemote: boolean },
): Promise<Embedder> {
  const transformers = await import("@huggingface/transformers")
  const env = transformers.env as unknown as Record<string, unknown>
  env.allowRemoteModels = allowRemote
  env.cacheDir = modelsDir
  env.localModelPath = modelsDir

  const extractor = await transformers.pipeline("feature-extraction", modelId, {
    dtype,
  } as never)

  let dimensions = 0

  async function embedBatch(texts: string[]): Promise<Float32Array[]> {
    const output = (await extractor(texts, {
      pooling: "mean",
      normalize: true,
    })) as { dims: number[]; data: Float32Array | number[] }
    const [rows, dims] = [output.dims[0]!, output.dims[output.dims.length - 1]!]
    if (rows !== texts.length) {
      throw new Error(
        `embedding batch returned ${rows} rows for ${texts.length} texts`,
      )
    }
    dimensions = dims
    const data = Float32Array.from(output.data as ArrayLike<number>)
    return texts.map((_, i) => data.slice(i * dims, (i + 1) * dims))
  }

  // Probe once so `dimensions` is always populated for callers.
  await embedBatch(["probe"])

  return {
    get dimensions() {
      return dimensions
    },
    async embed(texts) {
      // Padding inside a batch measurably perturbs the pooled vectors
      // (~0.007 cosine on q8 models — enough to reshuffle a tight top-8).
      // Embedding length-sorted batches keeps padding minimal; order is
      // restored afterwards. Single-text calls (the server's runtime shape)
      // are exact by construction.
      const order = texts
        .map((text, index) => ({ text, index }))
        .sort((a, b) => a.text.length - b.text.length)
      const vectors: Float32Array[] = new Array(texts.length)
      for (let start = 0; start < order.length; start += BATCH_SIZE) {
        const slice = order.slice(start, start + BATCH_SIZE)
        const batch = await embedBatch(slice.map((item) => item.text))
        slice.forEach((item, i) => {
          vectors[item.index] = batch[i]!
        })
        if (texts.length > BATCH_SIZE) {
          const done = Math.min(start + BATCH_SIZE, texts.length)
          if (done % 1024 < BATCH_SIZE || done === texts.length) {
            process.stderr.write(`\r  embedded ${done}/${texts.length}`)
            if (done === texts.length) process.stderr.write("\n")
          }
        }
      }
      return vectors
    },
  }
}
