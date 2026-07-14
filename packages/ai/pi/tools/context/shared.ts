/** Wraps a plain string in the tool result shape Pi expects. */
export function textResult(text: string) {
  return { content: [{ type: "text" as const, text }], details: {} }
}

/**
 * Joins section lines, or returns the fallback when the section is empty. A
 * section returns blank spacer lines even when it has no real content, so this
 * filters those out before deciding whether to show the fallback.
 */
export function joinOrEmpty(lines: string[], empty: string): string {
  const body = lines.filter((line) => line !== "")
  return body.length > 0 ? lines.join("\n").trim() : empty
}
