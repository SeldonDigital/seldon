const DEFAULT_MODEL = "gpt-oss:20b"

/**
 * The thinking level a caller may request. `"off"` disables reasoning
 * entirely; the others are graded effort levels for models that support them.
 * Self-contained (no longer derived from a third-party SDK type) so this
 * package has no dependency on any agent-framework package.
 */
export type ThinkingLevelOption = "off" | "low" | "medium" | "high"

/** Resolves the model id from an explicit value, env, or the local default. */
export function resolveModelId(model?: string): string {
  return model ?? process.env.SELDON_AI_MODEL ?? DEFAULT_MODEL
}

/**
 * Name-based check for whether a model can run a thinking pass. Used when
 * Ollama does not report `capabilities` for the model (older Ollama, or an
 * imported GGUF with an incomplete Modelfile). The primary signal is the
 * `thinking` capability from `/api/show`, resolved by {@link deriveModelThinking}.
 */
export function supportsThinking(model?: string): boolean {
  const id = resolveModelId(model).toLowerCase()
  return id.includes("qwen3") || id.includes("gpt-oss")
}

/**
 * True when the model takes a graded reasoning effort rather than a binary
 * on/off. gpt-oss is the graded family shipped by default; every other
 * thinking model is treated as binary.
 */
export function supportsReasoningEffort(model?: string): boolean {
  return resolveModelId(model).toLowerCase().includes("gpt-oss")
}

/**
 * The thinking level this harness requests for a model. Every narrow resolver
 * call in v1 wants the least reasoning a model supports: a graded model
 * cannot turn reasoning off, so this drops it to the lowest effort; every
 * other model turns off, which is a real disable for a binary model and a
 * no-op for a non-thinking one.
 */
export function clampedThinkingLevel(model?: string): ThinkingLevelOption {
  return supportsReasoningEffort(model) ? "low" : "off"
}

/** One entry in a model's thinking menu: the value sent to the turn and its label. */
export interface ThinkingMenuOption {
  value: ThinkingLevelOption
  label: string
}

/**
 * A model's thinking menu, resolved from its capabilities:
 *
 * - `graded`: a reasoning-effort model, so the menu offers low, medium, high.
 * - `binary`: an on/off thinking model, so the menu offers Off and On.
 * - `none`: no thinking pass, so the menu is empty and the level stays off.
 */
export interface ModelThinking {
  mode: "graded" | "binary" | "none"
  options: ThinkingMenuOption[]
  default: ThinkingLevelOption
}

const GRADED_OPTIONS: ThinkingMenuOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

// A binary model only distinguishes thinking on from off. "On" carries a valid
// level so the turn enables reasoning; a binary model ignores the grade.
const BINARY_OPTIONS: ThinkingMenuOption[] = [
  { value: "off", label: "Off" },
  { value: "medium", label: "On" },
]

/**
 * Resolves a model's thinking menu. `capabilities` is the `capabilities` array
 * from Ollama's `/api/show`, which lists `thinking` for a reasoning model.
 * When it is missing, falls back to the {@link supportsThinking} name check so
 * an older Ollama or an imported GGUF still behaves. The graded-versus-binary
 * split comes from {@link supportsReasoningEffort}.
 */
export function deriveModelThinking(
  model: string,
  capabilities?: string[],
): ModelThinking {
  const thinks = capabilities
    ? capabilities.includes("thinking")
    : supportsThinking(model)
  if (!thinks) return { mode: "none", options: [], default: "off" }
  if (supportsReasoningEffort(model)) {
    return { mode: "graded", options: GRADED_OPTIONS, default: "medium" }
  }
  return { mode: "binary", options: BINARY_OPTIONS, default: "medium" }
}
