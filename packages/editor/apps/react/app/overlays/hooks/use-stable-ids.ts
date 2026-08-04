import { useRef } from "react"

/**
 * Returns a referentially stable array while its contents are unchanged.
 *
 * The visible-node walk builds a fresh array whenever the active board entry
 * changes, even when the set of ids is identical (for example a board-level
 * property edit). Callers that key an effect on the array, such as the
 * node-rects tracker, would otherwise tear down and rebuild an observer per
 * node on every such edit. This holds the previous array until the joined id
 * signature actually changes.
 */
export function useStableIds(ids: string[]): string[] {
  const idsRef = useRef(ids)
  const signatureRef = useRef(ids.join("|"))
  const signature = ids.join("|")

  if (signature !== signatureRef.current) {
    signatureRef.current = signature
    idsRef.current = ids
  }

  return idsRef.current
}
