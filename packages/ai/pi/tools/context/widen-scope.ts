import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"

import {
  activeBoardSection,
  nodeSubtreeSection,
  workspaceShallowSection,
} from "../../../prompt/context-sections/active-board"
import {
  findResourceBoardForEntry,
  resourceBoardEntriesSection,
} from "../../../prompt/context-sections/resource-board"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

/**
 * Climbs exactly one level up from the selection and returns that view. A node
 * rises to its parent, then variant, then board, then a shallow workspace. A
 * resource entry rises to its board's entry list, then the workspace. One step
 * per call keeps each widening cheap and lets the model stop as soon as it sees
 * the target.
 */
export function createWidenScopeTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const {
    workspace,
    resolvedKey,
    activeBoard,
    selectedNodeId,
    selectedBoardId,
    scope,
    resourceTargetId,
  } = resolved
  return defineTool({
    name: "widen_scope",
    label: "Widen Scope",
    description:
      "Climb exactly one level up. For a node: parent, then variant, then board, then a shallow workspace view. For a theme, font collection, or icon set: the board's other entries, then the workspace. Call it when the target is not in the current scope. Defaults to the selection.",
    parameters: Type.Object({
      nodeId: Type.Optional(
        Type.String({
          description: "Node to widen from. Omit to use the selection.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const emptyWorkspace = "No workspace boards available."
      const workspaceResult = () =>
        textResult(
          joinOrEmpty(workspaceShallowSection(workspace).lines, emptyWorkspace),
        )

      // Resource scopes climb the same way: a variant entry rises to its board's
      // entry list, and a board rises to the workspace.
      if (
        scope === "theme" ||
        scope === "fontCollection" ||
        scope === "iconSet"
      ) {
        if (selectedBoardId !== undefined) return workspaceResult()
        const entryId = params.nodeId ?? resourceTargetId
        const owner = entryId
          ? findResourceBoardForEntry(workspace, entryId)
          : undefined
        if (!owner) return workspaceResult()
        return textResult(
          joinOrEmpty(
            resourceBoardEntriesSection(owner.board, owner.boardKey),
            emptyWorkspace,
          ),
        )
      }

      if (
        !activeBoard ||
        activeBoard.type !== "component" ||
        resolvedKey === undefined
      ) {
        return workspaceResult()
      }
      const fromId = params.nodeId ?? selectedNodeId
      if (fromId === undefined) return workspaceResult()
      const parentId = getImmediateParentIdInWorkspace(workspace, fromId)
      if (parentId) {
        return textResult(
          joinOrEmpty(
            nodeSubtreeSection(workspace, resolvedKey, activeBoard, parentId)
              .lines,
            `No node found for id "${parentId}".`,
          ),
        )
      }
      const isVariantRoot = activeBoard.variants.some(
        (ref) => ref.id === fromId,
      )
      if (isVariantRoot) {
        return textResult(
          joinOrEmpty(
            activeBoardSection(workspace, resolvedKey, activeBoard).lines,
            "No board available.",
          ),
        )
      }
      return workspaceResult()
    },
  })
}
