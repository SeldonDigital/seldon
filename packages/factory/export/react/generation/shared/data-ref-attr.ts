/**
 * JSX attribute string that emits a node's reference as `data-seldon-ref`.
 * Returns an empty string when the node has no ref. Placed before `{...props}`
 * at a call site so a caller-passed instance ref overrides this default.
 */
export function dataSeldonRefAttr(ref: string | undefined): string {
  return ref ? ` data-seldon-ref={${JSON.stringify(ref)}}` : ""
}
