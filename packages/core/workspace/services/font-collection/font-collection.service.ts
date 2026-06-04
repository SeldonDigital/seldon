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
      return merge(
        {},
        parent,
        entry.overrides,
      ) as ComputedFontCollection
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
   * font collection boards, keyed by family name. Used by font loading and
   * export to request only the selected weights.
   */
  public getEnabledVariantsByFamily(
    workspace: Workspace,
  ): Record<string, string[]> {
    const byFamily: Record<string, string[]> = {}
    for (const board of Object.values(workspace.components)) {
      if (!board || !isFontCollectionBoard(board)) continue
      const defaultEntryId = board.variants[0]?.id
      if (!defaultEntryId) continue
      const collection = this.getFontCollection(defaultEntryId, workspace)
      if (!collection) continue
      const selection = this.getVariantSelection(defaultEntryId, workspace)
      for (const [slot, family] of Object.entries(collection.families)) {
        if (!family || family.origin !== "remote" || !family.variants) continue
        // An empty array means preset None (no weights requested); an absent key
        // means no explicit selection, which callers treat as all weights.
        byFamily[family.name] = getEnabledVariants(
          selection[slot],
          family.variants,
        )
      }
    }
    return byFamily
  }

  /**
   * Lists enabled remote families across the workspace's font collection
   * boards, each with its slot and enabled-variant subset. Families with zero
   * enabled variants are skipped. Deduped by name. Used to self-host fonts for
   * the canvas.
   */
  public getEnabledRemoteFamilies(workspace: Workspace): EnabledRemoteFamily[] {
    const seen = new Set<string>()
    const families: EnabledRemoteFamily[] = []
    for (const board of Object.values(workspace.components)) {
      if (!board || !isFontCollectionBoard(board)) continue
      const defaultEntryId = board.variants[0]?.id
      if (!defaultEntryId) continue
      const collection = this.getFontCollection(defaultEntryId, workspace)
      if (!collection) continue
      const selection = this.getVariantSelection(defaultEntryId, workspace)
      for (const [slot, family] of Object.entries(collection.families)) {
        if (!family || family.origin !== "remote" || !family.variants) continue
        if (seen.has(family.name)) continue
        const enabled = getEnabledVariants(selection[slot], family.variants)
        if (enabled.length === 0) continue
        seen.add(family.name)
        families.push({ name: family.name, slot, variants: enabled })
      }
    }
    return families
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
   * Lists enabled families across the workspace's font collection boards,
   * grouped by collection in board order. Each group is one collection's
   * families. A remote family is included only when at least one of its variants
   * is enabled (preset `All` or `Custom`); families without variants always
   * show. Families are deduped by name across all groups.
   */
  public collectWorkspaceFamilyGroups(
    workspace: Workspace,
  ): WorkspaceFontFamily[][] {
    const seen = new Set<string>()
    const groups: WorkspaceFontFamily[][] = []

    for (const [componentKey, board] of Object.entries(workspace.components)) {
      if (!board || !isFontCollectionBoard(board)) continue
      const collection = this.getBoardFontCollection(componentKey, workspace)
      if (!collection) continue
      const defaultEntryId = board.variants[0]?.id
      const selection = defaultEntryId
        ? this.getVariantSelection(defaultEntryId, workspace)
        : {}
      const group: WorkspaceFontFamily[] = []
      for (const [slot, family] of Object.entries(collection.families)) {
        if (!family || seen.has(family.name)) continue
        const variants = family.variants ?? []
        if (
          variants.length > 0 &&
          deriveVariantPreset(selection[slot], variants) === "none"
        ) {
          continue
        }
        seen.add(family.name)
        group.push({ ...family, collectionId: collection.id, slot })
      }
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
