import merge from "lodash/merge"
import { STOCK_ICON_SETS_BY_ID } from "../../../icon-sets/catalog"
import { instantiateIconSet } from "../../../icon-sets/compute"
import { getIncludedIcons } from "../../../icon-sets/helpers"
import type { IconInclusion } from "../../../icon-sets/helpers/icon-selection"
import type {
  ComputedIconSet,
  IconSetTemplateId,
} from "../../../icon-sets/types"
import type { IconId } from "../../../icon-sets"
import { isIconSetBoard } from "../../model/components"
import type { EntryIconSet } from "../../model/entry-icon-set"
import {
  getIconSetTemplateCatalogId,
  getIconSetTemplateIconSetId,
} from "../../model/template-ref"
import type { Workspace } from "../../types"

export class WorkspaceIconSetService {
  /**
   * Resolves an `icon-sets` entry to a computed icon set.
   * Follows `catalog:{id}` directly and walks `icon-set:{parentId}` links.
   */
  public getIconSet(
    iconSetId: string,
    workspace: Workspace,
  ): ComputedIconSet | null {
    const entry = workspace["icon-sets"][iconSetId] as EntryIconSet | undefined
    if (!entry) return null

    const catalogId = getIconSetTemplateCatalogId(entry.template)
    if (catalogId) {
      if (!(catalogId in STOCK_ICON_SETS_BY_ID)) return null
      return instantiateIconSet(
        catalogId as IconSetTemplateId,
        entry.overrides,
        STOCK_ICON_SETS_BY_ID,
      )
    }

    const parentId = getIconSetTemplateIconSetId(entry.template)
    if (parentId) {
      const parent = this.getIconSet(parentId, workspace)
      if (!parent) return null
      return merge({}, parent, entry.overrides) as ComputedIconSet
    }

    return null
  }

  /** Reads the per-icon inclusion stored on an `icon-sets` entry. */
  public getInclusion(
    iconSetId: string,
    workspace: Workspace,
  ): IconInclusion {
    const entry = workspace["icon-sets"][iconSetId] as EntryIconSet | undefined
    const inclusion = entry?.overrides?.["includedIcons"]
    if (
      typeof inclusion !== "object" ||
      inclusion === null ||
      Array.isArray(inclusion)
    ) {
      return {}
    }
    return inclusion as IconInclusion
  }

  /** Resolves the on icons for an `icon-sets` entry, applying overrides on the set defaults. */
  public getIncludedIcons(iconSetId: string, workspace: Workspace): IconId[] {
    const set = this.getIconSet(iconSetId, workspace)
    if (!set) return []
    return getIncludedIcons(set, this.getInclusion(iconSetId, workspace))
  }

  /** Resolves the icon set for a board through its default (first) variant entry. */
  public getBoardIconSet(
    boardKey: string,
    workspace: Workspace,
  ): ComputedIconSet | null {
    const board = workspace.boards[boardKey]
    if (!board || !isIconSetBoard(board)) return null
    const defaultEntryId = board.variants[0]?.id
    if (!defaultEntryId) return null
    return this.getIconSet(defaultEntryId, workspace)
  }
}

export const workspaceIconSetService = new WorkspaceIconSetService()
