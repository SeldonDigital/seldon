import merge from "lodash/merge"

import { STOCK_FONT_COLLECTIONS_BY_ID } from "../../../font-collections/catalog"
import { instantiateFontCollection } from "../../../font-collections/compute"
import {
  deriveVariantPreset,
  getEnabledVariants,
} from "../../../font-collections/helpers"
import type { VariantSelection } from "../../../font-collections/helpers"
import type {
  ComputedFontCollection,
  FontCollectionTemplateId,
  FontFamilyEntry,
} from "../../../font-collections/types"
import { sortFontVariants } from "../../../helpers/utils/font-variant"
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

/** An enabled remote family plus the variants to self-host. */
export interface EnabledRemoteFamily {
  name: string
  /** Family slot id, which matches the self-hosted woff2 directory. */
  slot: string
  /** Enabled variant strings, such as `"400"`, `"700italic"`. */
  variants: string[]
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
      return merge({}, parent, entry.overrides) as ComputedFontCollection
    }

    return null
  }

  /**
   * Reads the per-family variant selection stored on a `font-collections` entry.
   * Returns an empty map when the entry or its selection is missing.
   */
  public getVariantSelection(
    fontCollectionId: string,
    workspace: Workspace,
  ): VariantSelection {
    const entry = workspace["font-collections"][fontCollectionId] as
      | EntryFontCollection
      | undefined
    const selection = entry?.overrides?.["variantSelection"]
    if (
      typeof selection !== "object" ||
      selection === null ||
      Array.isArray(selection)
    ) {
      return {}
    }
    return selection as VariantSelection
  }

  /**
   * Lists the enabled variants for every remote family across the workspace's
   * font collection boards, keyed by family name. Iterates every entry of each
   * board (default and custom variants) and unions the enabled weights, so a
   * weight enabled in any variant is requested once. Used by font loading and
   * export.
   */
  public getEnabledVariantsByFamily(
    workspace: Workspace,
  ): Record<string, string[]> {
    const byFamily: Record<string, Set<string>> = {}
    for (const board of Object.values(workspace.boards)) {
      if (!board || !isFontCollectionBoard(board)) continue
      for (const variant of board.variants ?? []) {
        const collection = this.getFontCollection(variant.id, workspace)
        if (!collection) continue
        const selection = this.getVariantSelection(variant.id, workspace)
        for (const [slot, family] of Object.entries(collection.families)) {
          if (!family || family.origin !== "remote" || !family.variants)
            continue
          const enabled = (byFamily[family.name] ??= new Set<string>())
          for (const weight of getEnabledVariants(
            selection[slot],
            family.variants,
          )) {
            enabled.add(weight)
          }
        }
      }
    }
    const result: Record<string, string[]> = {}
    for (const [name, weights] of Object.entries(byFamily)) {
      result[name] = sortFontVariants([...weights])
    }
    return result
  }

  /**
   * Lists enabled remote families across the workspace's font collection
   * boards, each with its slot and enabled-variant subset. Iterates every entry
   * of each board (default and custom variants), unions the enabled weights per
   * family, and dedupes by name. Families with zero enabled variants across all
   * entries are skipped. Used to self-host fonts for the canvas.
   */
  public getEnabledRemoteFamilies(workspace: Workspace): EnabledRemoteFamily[] {
    const byName = new Map<string, { slot: string; variants: Set<string> }>()
    const order: string[] = []
    for (const board of Object.values(workspace.boards)) {
      if (!board || !isFontCollectionBoard(board)) continue
      for (const variant of board.variants ?? []) {
        const collection = this.getFontCollection(variant.id, workspace)
        if (!collection) continue
        const selection = this.getVariantSelection(variant.id, workspace)
        for (const [slot, family] of Object.entries(collection.families)) {
          if (!family || family.origin !== "remote" || !family.variants)
            continue
          const enabled = getEnabledVariants(selection[slot], family.variants)
          if (enabled.length === 0) continue
          let record = byName.get(family.name)
          if (!record) {
            record = { slot, variants: new Set<string>() }
            byName.set(family.name, record)
            order.push(family.name)
          }
          for (const weight of enabled) record.variants.add(weight)
        }
      }
    }
    return order.map((name) => {
      const record = byName.get(name)!
      return {
        name,
        slot: record.slot,
        variants: sortFontVariants([...record.variants]),
      }
    })
  }

  /**
   * Lists enabled families across the workspace's font collection boards,
   * grouped by collection in board order. Each group is one collection's
   * families, unioned across every entry of the board (default and custom
   * variants). A remote family is included when at least one of its variants is
   * enabled (preset `All` or `Custom`) in any entry; families without variants
   * always show. Families are deduped by name across all groups.
   */
  public collectWorkspaceFamilyGroups(
    workspace: Workspace,
  ): WorkspaceFontFamily[][] {
    const seen = new Set<string>()
    const groups: WorkspaceFontFamily[][] = []

    for (const board of Object.values(workspace.boards)) {
      if (!board || !isFontCollectionBoard(board)) continue
      const group: WorkspaceFontFamily[] = []
      const groupSeen = new Set<string>()
      for (const variant of board.variants ?? []) {
        const collection = this.getFontCollection(variant.id, workspace)
        if (!collection) continue
        const selection = this.getVariantSelection(variant.id, workspace)
        for (const [slot, family] of Object.entries(collection.families)) {
          if (!family || seen.has(family.name) || groupSeen.has(family.name)) {
            continue
          }
          const variants = family.variants ?? []
          if (
            variants.length > 0 &&
            deriveVariantPreset(selection[slot], variants) === "none"
          ) {
            continue
          }
          groupSeen.add(family.name)
          group.push({ ...family, collectionId: collection.id, slot })
        }
      }
      for (const family of group) seen.add(family.name)
      if (group.length > 0) groups.push(group)
    }

    return groups
  }

  /**
   * Flattens {@link collectWorkspaceFamilyGroups} into one deduped list of
   * enabled families.
   */
  public collectWorkspaceFamilies(workspace: Workspace): WorkspaceFontFamily[] {
    return this.collectWorkspaceFamilyGroups(workspace).flat()
  }

  /** Catalog ids of font collections present in the workspace. */
  public collectUsedFontCollections(workspace: Workspace): Set<string> {
    const used = new Set<string>()
    for (const board of Object.values(workspace.boards)) {
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

export const workspaceFontCollectionService =
  new WorkspaceFontCollectionService()
