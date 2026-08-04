import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Workspace } from "@seldon/core/workspace/types"

import { nodeAuthoredContent } from "../prompt/context-sections/node-strings"

/**
 * Node ids are minted as `component-{boardKey}-{suffix}` (core's
 * entry-node-ids). Either segment may itself carry hyphens, so this matches
 * greedily and {@link replaceNodeIdsWithWords} trims back to the longest
 * prefix that names a node the workspace actually knows.
 */
const NODE_ID_PATTERN = /component-[A-Za-z0-9_-]+/g

/**
 * How to name a node in a sentence the user reads. An internal id is debug
 * output to them -- they see the element on the canvas, not its key -- so
 * every user-facing mention goes through here. Authored content identifies a
 * node best ("the text \"Sedan\""), then a label that says more than the
 * catalog word ("the Assist chip"), then the catalog word alone.
 */
export function describeNodeInWords(
  workspace: Workspace,
  nodeId: string,
): string {
  const node = workspace.nodes[nodeId]
  if (!node) return "that element"

  const catalogWord = getNodeCatalogId(node, workspace)
  const authoredContent = nodeAuthoredContent(workspace, nodeId)
  if (authoredContent !== undefined) {
    return catalogWord
      ? `the ${catalogWord} "${authoredContent}"`
      : `the element "${authoredContent}"`
  }

  const label = node.label
  const labelSaysMoreThanTheCatalogWord =
    label !== undefined && label !== "" && label.toLowerCase() !== catalogWord
  if (labelSaysMoreThanTheCatalogWord) {
    return catalogWord ? `the ${label} ${catalogWord}` : `the ${label}`
  }
  if (catalogWord) return `the ${catalogWord}`
  return "that element"
}

/**
 * Swaps every internal node id in a sentence for plain words. Resolver
 * messages are written with ids in them because their first reader was a
 * machine; when such a message reaches the user verbatim, the id has to go.
 * Doing it in code rather than asking the reply model to omit ids is what
 * lets a failure message be forwarded WITHOUT a rephrasing call -- which is
 * the only way to guarantee the failure survives into the reply intact.
 *
 * A token that names no node is left alone: inventing a description for an id
 * this workspace never had would be a guess.
 */
export function replaceNodeIdsWithWords(
  workspace: Workspace,
  text: string,
): string {
  return text.replace(NODE_ID_PATTERN, (matchedToken) => {
    let candidateId = matchedToken
    for (;;) {
      if (workspace.nodes[candidateId] !== undefined) {
        const unconsumedTail = matchedToken.slice(candidateId.length)
        return describeNodeInWords(workspace, candidateId) + unconsumedTail
      }
      const lastHyphenIndex = candidateId.lastIndexOf("-")
      const nothingLeftToTrim = lastHyphenIndex <= 0
      if (nothingLeftToTrim) return matchedToken
      candidateId = candidateId.slice(0, lastHyphenIndex)
    }
  })
}
