import type { PromptStage } from "./shared"

const REORDER_SCHEMA = {
  type: "object",
  properties: {
    position: { type: "string", enum: ["first", "last", "up", "down"] },
  },
  required: ["position"],
}

/** Where among its siblings the element should go; index/count are 1-based. */
export function buildReorderStage(inputs: {
  message: string
  index: number
  count: number
}): PromptStage {
  const prompt = [
    "Where does the user want to move this element among its siblings?",
    `It is currently at position ${inputs.index} of ${inputs.count}.`,
    `Message: ${JSON.stringify(inputs.message)}`,
    '"first" = to the start, "last" = to the end, "up" = one position earlier, "down" = one position later.',
  ].join("\n")
  return { prompt, schema: REORDER_SCHEMA }
}

const MOVE_SCHEMA = {
  type: "object",
  properties: {
    item: { type: "string" },
    destination: { type: "string", minLength: 1 },
  },
  required: ["item", "destination"],
}

/** Extracts the item and destination phrases of a move in one shallow call. */
export function buildMoveStage(inputs: { message: string }): PromptStage {
  const prompt = [
    "A user wants to move one element into another container.",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Extract the shortest phrase naming what to move ("item" -- empty string when the message means the current selection) and the shortest phrase naming where it goes ("destination").',
  ].join("\n")
  return { prompt, schema: MOVE_SCHEMA }
}
