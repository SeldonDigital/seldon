import { camelCase } from "change-case"

import { ComponentLevel } from "@seldon/core/components/constants"

import { describeTree } from "./structure"
import type {
  ClassifyOptions,
  DedupedPiece,
  PieceClassification,
} from "./types"

const DEFAULT_HOST = "http://127.0.0.1:11434"
const DEFAULT_MODEL = "gpt-oss:20b"
const REQUEST_TIMEOUT_MS = 45000

const LEVEL_VALUES = new Set<string>(Object.values(ComponentLevel))

const SYSTEM_PROMPT = [
  "You are a design-system analyst. You are given a repeated DOM fragment from a website.",
  "Identify the UI component it represents and return a single JSON object with these fields:",
  '- "name": a short human name, such as "Product Card" or "Search Field".',
  '- "id": a camelCase identifier, such as "productCard".',
  '- "level": one of "screen", "module", "part", "element", "primitive". A leaf control is a primitive; a small labelled control is an element; a composite of elements is a part; a section of parts is a module; a full page is a screen.',
  '- "intent": one sentence on when to use it.',
  '- "tags": 3 to 6 lowercase keywords.',
  '- "properties": an object of likely settable properties and example values, or {} if unsure.',
  "Answer only with the JSON object.",
].join("\n")

/** Builds the user prompt describing one piece for the model. */
function buildPrompt(piece: DedupedPiece): string {
  const { sample } = piece
  const lines = [
    `This fragment appears ${piece.count} time(s) on the page.`,
    `Root element: <${sample.tag}>${sample.role ? ` role="${sample.role}"` : ""}.`,
  ]
  if (sample.evidence.classes?.length) {
    lines.push(`Root classes: ${sample.evidence.classes.join(" ")}`)
  }
  if (sample.evidence.attrs) {
    lines.push(`Root attributes: ${JSON.stringify(sample.evidence.attrs)}`)
  }
  lines.push("Structure:", describeTree(sample, 3))
  return lines.join("\n")
}

interface OllamaChatResponse {
  message?: { content?: string }
}

/** Coerces a raw model level string to a valid level, else null. */
function toLevel(value: unknown): ComponentLevel | null {
  return typeof value === "string" && LEVEL_VALUES.has(value)
    ? (value as ComponentLevel)
    : null
}

/** Validates and normalizes the model's JSON into a classification. */
function parseClassification(
  content: string,
  piece: DedupedPiece,
): PieceClassification | null {
  let raw: Record<string, unknown>
  try {
    raw = JSON.parse(content) as Record<string, unknown>
  } catch {
    return null
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : ""
  if (name === "") return null

  const id =
    typeof raw.id === "string" && raw.id.trim() !== ""
      ? camelCase(raw.id)
      : camelCase(name)
  const level = toLevel(raw.level) ?? piece.sample.level
  const intent =
    typeof raw.intent === "string" && raw.intent.trim() !== ""
      ? raw.intent.trim()
      : `Imported ${level} component.`
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((tag): tag is string => typeof tag === "string")
    : []
  const properties =
    raw.properties && typeof raw.properties === "object"
      ? (raw.properties as Record<string, unknown>)
      : {}

  return { name, id: id || "component", level, intent, tags, properties }
}

/**
 * Asks the local model to classify one piece. Returns null on any failure, such
 * as an unreachable server, a timeout, or unparseable output, so the caller
 * falls back to the deterministic description.
 */
export async function classifyPiece(
  piece: DedupedPiece,
  options: ClassifyOptions = {},
): Promise<PieceClassification | null> {
  const host = options.host ?? DEFAULT_HOST
  const model = options.model ?? DEFAULT_MODEL
  try {
    const response = await fetch(`${host}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        options: { temperature: 0 },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(piece) },
        ],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) return null
    const data = (await response.json()) as OllamaChatResponse
    const content = data.message?.content
    if (!content) return null
    return parseClassification(content, piece)
  } catch {
    return null
  }
}

/**
 * Classifies pieces in sequence. Runs one model call per piece and tolerates
 * per-piece failures, returning null for any it could not classify. Sequential
 * on purpose: the local model serves one request at a time.
 */
export async function classifyPieces(
  pieces: DedupedPiece[],
  options: ClassifyOptions = {},
): Promise<Array<PieceClassification | null>> {
  const results: Array<PieceClassification | null> = []
  for (const piece of pieces) {
    results.push(await classifyPiece(piece, options))
  }
  return results
}
