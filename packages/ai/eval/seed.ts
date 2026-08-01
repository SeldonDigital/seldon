/**
 * Seeded workspaces the eval cases run against.
 *
 * The button board is the original single-node seed: one component, no
 * repeated siblings, which is all the intent/property-key cases need. The
 * chip-row board exists for the cardinality grid -- a class-intent query
 * ("all the chips") can only be scored against a board that actually holds
 * several interchangeable siblings, and a single button cannot produce one.
 */
import { ComponentId } from "@seldon/core/components/constants"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/** How many chips the chip-row seed puts on the board. */
export const CHIP_COUNT = 4

/** The board key the chip row is built on. */
export const CHIP_ROW_BOARD = ComponentId.LIST

export interface SeededWorkspace {
  workspace: Workspace
  boardKey: string
  /** Every node on the board whose catalog id is `chip`, in tree order. */
  chipIds: string[]
}

/** The original single-button seed, unchanged from the first eval run. */
export function seedButtonWorkspace(): Workspace {
  return addComponent(
    { boardKey: ComponentId.BUTTON } as never,
    createEmptyWorkspace(),
  )
}

/** The text child of the button board's first variant, or undefined. */
export function findTextChild(workspace: Workspace): string | undefined {
  const board = workspace.boards[ComponentId.BUTTON]
  if (!board || !isComponentBoard(board)) return undefined
  let found: string | undefined
  walkBoardTreeRefs([board.variants[0]!], (ref) => {
    const node = workspace.nodes[ref.id]
    if (node && getNodeCatalogId(node, workspace) === "text") {
      found = ref.id
      return true
    }
  })
  return found
}

/** Every node id on a board whose catalog id matches, in tree order. */
export function nodeIdsByCatalogId(
  workspace: Workspace,
  boardKey: string,
  catalogId: string,
): string[] {
  const board = workspace.boards[boardKey]
  if (!board || !isComponentBoard(board)) return []
  const ids: string[] = []
  walkBoardTreeRefs(board.variants, (ref) => {
    const node = workspace.nodes[ref.id]
    if (node && getNodeCatalogId(node, workspace) === catalogId) ids.push(ref.id)
  })
  return ids
}

/**
 * A list board holding {@link CHIP_COUNT} sibling chips. Built by inserting
 * default chip instances under the list's first variant root, so the chips are
 * genuine interchangeable siblings rather than hand-written nodes.
 */
export function seedChipRowWorkspace(): SeededWorkspace {
  let workspace = addComponent(
    { boardKey: CHIP_ROW_BOARD } as never,
    createEmptyWorkspace(),
  )

  // The default catalog variant rejects inserts, so the chips go into a user
  // variant added on top of it.
  workspace = applyActions(workspace, [
    { type: "add_variant", payload: { boardKey: CHIP_ROW_BOARD } },
  ] as WorkspaceAction[])

  const board = workspace.boards[CHIP_ROW_BOARD]
  if (!board || !isComponentBoard(board))
    throw new Error(`seed: ${CHIP_ROW_BOARD} board was not created`)
  const userVariant = board.variants[board.variants.length - 1]
  if (!userVariant) throw new Error("seed: no user variant to insert into")
  const parentId = userVariant.id

  for (let index = 0; index < CHIP_COUNT; index++) {
    const alreadyOnWorkspace = Boolean(workspace.boards[ComponentId.CHIP])
    const action: WorkspaceAction = alreadyOnWorkspace
      ? ({
          type: "insert_default_instance",
          payload: { boardKey: ComponentId.CHIP, parentId },
        } as WorkspaceAction)
      : ({
          type: "add_component_and_insert_default_instance",
          payload: { boardKey: ComponentId.CHIP, target: { parentId } },
        } as WorkspaceAction)
    workspace = applyActions(workspace, [action])
  }

  const chipIds = nodeIdsByCatalogId(workspace, CHIP_ROW_BOARD, "chip")
  if (chipIds.length !== CHIP_COUNT)
    throw new Error(
      `seed: expected ${CHIP_COUNT} chips on ${CHIP_ROW_BOARD}, got ${chipIds.length}`,
    )

  return { workspace, boardKey: CHIP_ROW_BOARD, chipIds }
}

/** The board key the text-list seed is built on. */
export const TEXT_LIST_BOARD = ComponentId.LIST

/**
 * Distinct topical text content, in the order the seed inserts them
 * (top to bottom). Three of the five entries share a "cars" topic, so a
 * semantic query ("the two texts about cars") and a spatial query ("the top
 * two texts") each have one unambiguous correct answer to score against.
 */
export const TEXT_LIST_TOPICS = [
  "The new sedan gets 40 miles per gallon on the highway.",
  "Our latest smartphone features a faster processor and better camera.",
  "This SUV comes standard with all-wheel drive and a V6 engine.",
  "The recipe calls for two cups of flour and a pinch of salt.",
  "Electric vehicles are becoming more affordable every year.",
] as const

export interface TextListSeed {
  workspace: Workspace
  boardKey: string
  /** Text node ids in top-to-bottom order, matching {@link TEXT_LIST_TOPICS}. */
  textNodeIds: string[]
}

/**
 * A list board holding several text nodes with distinct topical content, in
 * a fixed vertical order -- built the same way {@link seedChipRowWorkspace}
 * is, but with content set per node so a semantic query ("the two about
 * cars") has real distinguishing signal to rank against, not just
 * interchangeable siblings.
 */
export function seedTextListWorkspace(): TextListSeed {
  let workspace = addComponent(
    { boardKey: TEXT_LIST_BOARD } as never,
    createEmptyWorkspace(),
  )

  workspace = applyActions(workspace, [
    { type: "add_variant", payload: { boardKey: TEXT_LIST_BOARD } },
  ] as WorkspaceAction[])

  const board = workspace.boards[TEXT_LIST_BOARD]
  if (!board || !isComponentBoard(board))
    throw new Error(`seed: ${TEXT_LIST_BOARD} board was not created`)
  const userVariant = board.variants[board.variants.length - 1]
  if (!userVariant) throw new Error("seed: no user variant to insert into")
  const parentId = userVariant.id

  for (let index = 0; index < TEXT_LIST_TOPICS.length; index++) {
    const alreadyOnWorkspace = Boolean(workspace.boards[ComponentId.TEXT])
    const insertAction: WorkspaceAction = alreadyOnWorkspace
      ? ({
          type: "insert_default_instance",
          payload: { boardKey: ComponentId.TEXT, parentId },
        } as WorkspaceAction)
      : ({
          type: "add_component_and_insert_default_instance",
          payload: { boardKey: ComponentId.TEXT, target: { parentId } },
        } as WorkspaceAction)
    workspace = applyActions(workspace, [insertAction])
  }

  const textNodeIds = nodeIdsByCatalogId(workspace, TEXT_LIST_BOARD, "text")
  if (textNodeIds.length !== TEXT_LIST_TOPICS.length)
    throw new Error(
      `seed: expected ${TEXT_LIST_TOPICS.length} texts on ${TEXT_LIST_BOARD}, got ${textNodeIds.length}`,
    )

  for (let index = 0; index < textNodeIds.length; index++) {
    workspace = applyActions(workspace, [
      {
        type: "set_node_properties",
        payload: {
          nodeId: textNodeIds[index],
          properties: {
            content: { type: "exact", value: TEXT_LIST_TOPICS[index] },
          },
        },
      } as unknown as WorkspaceAction,
    ])
  }

  return { workspace, boardKey: TEXT_LIST_BOARD, textNodeIds }
}
