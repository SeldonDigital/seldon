import merge from "lodash/merge"
import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../font-collections/collections"
import { instantiateFontCollection } from "../../../font-collections/compute"
import type {
  ComputedFontCollection,
  FontCollectionTemplateId,
  FontFamilyEntry,
} from "../../../font-collections/types"
import { isFontCollectionBoard } from "../../model/components"
import type { EntryFontCollection } from "../../model/entry-font-collection"
import {
  getFontCollectionTemplateCatalogId,
  getFontCollectionTemplateFontCollectionId,
} from "../../model/template-ref"
import type { Workspace } from "../../types"

/** One resolved family plus the collection it came from. */
export interface WorkspaceFontFamily extends FontFamilyEntry {
  /** Catalog id of the owning collection, such as `system` or `googleFonts`. */
  collectionId: string
  /** Family slot id within the collection. */
  slot: string
}

export class WorkspaceFontCollectionService {
  /**
   * Resolves a `font-collections` entry to a computed collection.
   * Follows `catalog:{id}` directly and walks `font-collection:{parentId}` links.
   */
  public getFontCollection(
    fontCollectionId: string,
    workspace: Workspace,
  ): ComputedFontCollection | null {
    const entry = workspace["font-collections"][fontCollectionId] as
      | EntryFontCollection
      | undefined
    if (!entry) return null

    const catalogId = getFontCollectionTemplateCatalogId(entry.template)
    if (catalogId) {
      if (!(catalogId in STOCK_FONT_COLLECTIONS_BY_ID)) return null
      return instantiateFontCollection(
        catalogId as FontCollectionTemplateId,
        entry.overrides,
        STOCK_FONT_COLLECTIONS_BY_ID,
      )
    }

    const parentId = getFontCollectionTemplateFontCollectionId(entry.template)
    if (parentId) {
      const parent = this.getFontCollection(parentId, workspace)
      if (!parent) return null
      return merge(
        {},
        parent,
        entry.overrides,
      ) as ComputedFontCollection
    }

    return null
  }

  /** Resolves the collection for a board through its default (first) variant entry. */
  public getBoardFontCollection(
    componentKey: string,
    workspace: Workspace,
  ): ComputedFontCollection | null {
    const board = workspace.components[componentKey]
    if (!board || !isFontCollectionBoard(board)) return null
    const defaultEntryId = board.variants[0]?.id
    if (!defaultEntryId) return null
    return this.getFontCollection(defaultEntryId, workspace)
  }

  /**
   * Lists every family across the workspace's font collection boards.
   * Reads each board's default collection and dedupes families by name.
   */
  public collectWorkspaceFamilies(workspace: Workspace): WorkspaceFontFamily[] {
    const seen = new Set<string>()
    const families: WorkspaceFontFamily[] = []

    for (const [componentKey, board] of Object.entries(workspace.components)) {
      if (!board || !isFontCollectionBoard(board)) continue
      const collection = this.getBoardFontCollection(componentKey, workspace)
      if (!collection) continue
      for (const [slot, family] of Object.entries(collection.families)) {
        if (!family || seen.has(family.name)) continue
        seen.add(family.name)
        families.push({ ...family, collectionId: collection.id, slot })
      }
    }

    return families
  }

  /** Catalog ids of font collections present in the workspace. */
  public collectUsedFontCollections(workspace: Workspace): Set<string> {
    const used = new Set<string>()
    for (const board of Object.values(workspace.components)) {
      if (board && isFontCollectionBoard(board)) {
        used.add(board.catalogId)
      }
    }
    return used
  }

  /** Returns the next free `familyNN` slot id for a `font-collections` entry, starting at `family01`. */
  public getNextCustomFamilyId(
    workspace: Workspace,
    fontCollectionId: string,
  ): string {
    const entry = workspace["font-collections"][fontCollectionId] as
      | EntryFontCollection
      | undefined
    const bag = (entry?.overrides?.families ?? {}) as Record<string, unknown>
    const familyIds = Object.keys(bag).filter((id) => id.startsWith("family"))
    const highest = familyIds
      .map((id) => parseInt(id.replace("family", ""), 10))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b)
      .at(-1)
    const next = (highest ?? 0) + 1
    return `family${next < 10 ? `0${next}` : next}`
  }
}

export const workspaceFontCollectionService = new WorkspaceFontCollectionService()
