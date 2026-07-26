/** Per-echo override values for a repeated child's text/icon descendants. */
export function buildEchoOverrides(
  data: Record<string, string[]> | undefined,
  echoIndex: number,
): Record<string, string> {
  const result: Record<string, string> = {}
  if (!data) return result
  for (const [descendantId, values] of Object.entries(data)) {
    const value = values[echoIndex - 1]
    // An empty slot (including the "" padding written for earlier-index edits)
    // means "use the node's own value", not "override with an empty string".
    if (value != null && value !== "") result[descendantId] = value
  }
  return result
}
