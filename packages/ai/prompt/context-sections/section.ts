/**
 * The context is one flat text block the model reads top to bottom, and each
 * context section builder returns its own complete block through this helper. A
 * section only earns its title when it has content, so centralizing that rule
 * here keeps every builder free of blank-line and empty-title bookkeeping and
 * lets a section drop out cleanly when it has nothing to say.
 */
export function section(title: string, body: readonly string[]): string[] {
  return body.length > 0 ? ["", title, ...body] : []
}
