import type { FamilyOutcome, TurnContext } from "../turn-context"

/**
 * STUB -- component composition/assembly is scoped out of v1 while its design
 * is unresolved (bounded deterministic chain vs. open-ended exploration with a
 * bigger model, pending Andrei's read on how the composition workflow is
 * actually used). The intent stays in the vocabulary so the classifier routes
 * these requests here instead of mislabeling them, and this handler terminates
 * cleanly. Replace this file once the design lands.
 */
export async function executeComposition(
  _context: TurnContext,
): Promise<FamilyOutcome> {
  return {
    kind: "message",
    text: "Assembling or restructuring components isn't available yet. I can add a catalog component, add a variant, or edit properties -- tell me which.",
  }
}
