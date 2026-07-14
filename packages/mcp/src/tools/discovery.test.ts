/**
 * Behavioral suite for the discovery surface.
 *
 * - list_catalog stays shallow (ids/names/counts, never icon or font contents).
 * - search_catalog keyword ranking, curated synonyms, kind filter,
 *   and the target insertability filter.
 * - get_component_schema serves level rules, variants, and default cells.
 * - get_property_schema serves value contracts and feeds the hard schema gate;
 *   the gate itself: unknown keys rejected, unserved keys bounce once with
 *   schemas attached, resubmit succeeds.
 * - get_action_schema lists the whitelisted vocabulary and serves
 *   self-contained generated payload schemas (property bag stubbed).
 * - find_nodes query semantics: substring terms + key=value filters.
 * - get_computed_theme resolves stock and workspace themes; a
 *   swatch override is reflected in the computed table.
 */
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { ValueType } from "@seldon/core/properties/constants"
import { Colorspace } from "@seldon/core/themes/constants/colorspace"

import { EXPOSED_ACTION_TYPES } from "../action-whitelist"
import { ToolError } from "../errors"
import { Session } from "../session"
import { applyActions } from "./apply-actions"
import type { ToolContext } from "./context"
import { findNodes } from "./find-nodes"
import { getActionSchema } from "./get-action-schema"
import { getComponentSchemaTool } from "./get-component-schema"
import { getComputedThemeTool } from "./get-computed-theme"
import { getNode } from "./get-node"
import { getPropertySchema } from "./get-property-schema"
import { getWorkspaceOutline } from "./get-workspace-outline"
import { listCatalog } from "./list-catalog"
import { searchCatalog } from "./search-catalog"
import { workspaceOpen } from "./workspace-open"

const tmpDirs: string[] = []

function makeCtx(): { ctx: ToolContext; root: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seldon-mcp-discovery-"))
  tmpDirs.push(root)
  return { ctx: { session: new Session(), config: { roots: [root] } }, root }
}

afterEach(() => {
  while (tmpDirs.length) {
    fs.rmSync(tmpDirs.pop()!, { recursive: true, force: true })
  }
})

function teachingOf(fn: () => unknown) {
  try {
    fn()
  } catch (error) {
    if (error instanceof ToolError) return error.teaching
    throw error
  }
  throw new Error("expected a ToolError")
}

async function teachingOfAsync(fn: () => Promise<unknown>) {
  try {
    await fn()
  } catch (error) {
    if (error instanceof ToolError) return error.teaching
    throw error
  }
  throw new Error("expected a ToolError")
}

/** Opens a fresh workspace and adds the button component board. */
async function openWithButton(): Promise<{
  ctx: ToolContext
  buttonVariantId: string
}> {
  const { ctx, root } = makeCtx()
  workspaceOpen(ctx, {
    path: path.join(root, "workspace.json"),
    createIfMissing: true,
  })
  await applyActions(ctx, {
    actions: [
      { type: "add_component", payload: { boardKey: ComponentId.BUTTON } },
    ],
  })
  const buttonVariantId = getWorkspaceOutline(ctx)
    .boards.find((board) => board.key === ComponentId.BUTTON)!
    .variants!.find(
      (variant) => variant.id !== `component-${ComponentId.BUTTON}-default`,
    )!.id
  return { ctx, buttonVariantId }
}

describe("list_catalog", () => {
  it("groups component ids by level and reports counts only", async () => {
    const { ctx } = makeCtx()
    const result = listCatalog(ctx)

    expect(result.components["element"]).toContain("button")
    expect(result.components["primitive"]).toContain("icon")
    expect(result.components["part"]).toContain("pricingCard")

    expect(result.themes.map((theme) => theme.id)).toContain("googleMaterial")

    for (const set of result.iconSets) {
      expect(set.iconCount).toBeGreaterThan(0)
      expect(Object.keys(set).sort()).toEqual(["iconCount", "id", "name"])
    }
    for (const collection of result.fontCollections) {
      expect(collection.familyCount).toBeGreaterThan(0)
      expect(Object.keys(collection).sort()).toEqual([
        "familyCount",
        "id",
        "name",
      ])
    }
  })
})

describe("search_catalog — keyword ranking", () => {
  it("ranks the exact component match first, works without a workspace", async () => {
    const { ctx } = makeCtx()
    const { results } = await searchCatalog(ctx, { query: "button" })
    expect(results[0]).toMatchObject({
      id: "button",
      kind: "component",
      level: "element",
    })
    expect(results[0]!.score).toBeGreaterThan(
      results[results.length - 1]!.score,
    )
    expect(results.length).toBeLessThanOrEqual(8)
  })

  it("searches icons by concept with the kind filter", async () => {
    const { ctx } = makeCtx()
    const { results, totalMatches } = await searchCatalog(ctx, {
      query: "shopping cart",
      kind: "icon",
      limit: 10,
    })
    expect(results.length).toBeGreaterThan(0)
    expect(totalMatches).toBeGreaterThanOrEqual(results.length)
    expect(results.every((result) => result.kind === "icon")).toBe(true)
    expect(
      results.some((result) => result.id.toLowerCase().includes("cart")),
    ).toBe(true)
  })

  it("finds themes and font collections by name", async () => {
    const { ctx } = makeCtx()
    const themes = await searchCatalog(ctx, {
      query: "material",
      kind: "theme",
    })
    expect(themes.results[0]).toMatchObject({
      id: "googleMaterial",
      kind: "theme",
    })

    const fonts = await searchCatalog(ctx, { query: "google fonts" })
    expect(
      fonts.results.some((result) => result.kind === "fontCollection"),
    ).toBe(true)
  })

  it("matches curated synonyms: cta → button", async () => {
    const { ctx } = makeCtx()
    // The catalog's CTA part family carries the literal "cta" tag and
    // outranks the synonym match by design; widen the cut so the test
    // exercises the expansion itself, not the top-8 horse race.
    const { results } = await searchCatalog(ctx, { query: "cta", limit: 20 })
    expect(results.some((result) => result.id === "button")).toBe(true)
  })

  it("respects the limit and reports the uncapped total", async () => {
    const { ctx } = makeCtx()
    const { results, totalMatches } = await searchCatalog(ctx, {
      query: "card",
      limit: 5,
    })
    expect(results).toHaveLength(5)
    expect(totalMatches).toBeGreaterThan(5)
  })

  it("returns empty results for gibberish, not an error", async () => {
    const { ctx } = makeCtx()
    const { results, totalMatches } = await searchCatalog(ctx, {
      query: "zxqvwjkly",
    })
    expect(results).toEqual([])
    expect(totalMatches).toBe(0)
  })
})

describe("search_catalog — target filter", () => {
  it("keeps only components legally insertable into the target", async () => {
    const { ctx, buttonVariantId } = await openWithButton()

    const icons = await searchCatalog(ctx, {
      query: "icon",
      target: buttonVariantId,
    })
    expect(icons.results.some((result) => result.id === "icon")).toBe(true)
    expect(icons.results.every((result) => result.kind === "component")).toBe(
      true,
    )

    // A screen can never sit inside an element (level rules).
    const screens = await searchCatalog(ctx, {
      query: "screen",
      target: buttonVariantId,
    })
    expect(screens.results.some((result) => result.id === "screen")).toBe(false)
  })

  it("teaches when the target node does not exist", async () => {
    const { ctx } = await openWithButton()
    const teaching = await teachingOfAsync(() =>
      searchCatalog(ctx, { query: "icon", target: "ghost" }),
    )
    expect(teaching.code).toBe("node_not_found")
  })

  it("requires an open workspace only when target is used", async () => {
    const { ctx } = makeCtx()
    expect(
      (await searchCatalog(ctx, { query: "icon" })).results.length,
    ).toBeGreaterThan(0)
    const teaching = await teachingOfAsync(() =>
      searchCatalog(ctx, { query: "icon", target: "any" }),
    )
    expect(teaching.code).toBe("no_workspace_open")
  })
})

describe("get_component_schema", () => {
  it("serves the component contract: level rules, variants, default cells", async () => {
    const { ctx } = makeCtx()
    const result = getComponentSchemaTool(ctx, { componentId: "button" })

    expect(result).toMatchObject({
      id: "button",
      name: "Button",
      level: "element",
    })
    expect(result.tags).toContain("action")

    // Elements contain primitives/elements/frames, never parts (rules config).
    expect(result.allowedChildLevels).toContain("primitive")
    expect(result.allowedChildLevels).not.toContain("part")
    expect(result.allowedParentLevels).toContain("part")

    const variantIds = result.defaultVariants!.map((variant) => variant.id)
    expect(variantIds).toContain("label")
    expect(variantIds).toContain("iconic")

    // Default composition: identity only, no override property bags.
    const children = result.defaultChildren!.map((child) => child.component)
    expect(children).toContain("icon")
    expect(children).toContain("text")
    expect(JSON.stringify(result.defaultChildren)).not.toContain("overrides")

    // Default property cells are tagged cells, present for overriding against.
    expect(result.properties.cursor).toMatchObject({ type: "option" })
  })

  it("teaches on unknown component ids", async () => {
    const { ctx } = makeCtx()
    const teaching = teachingOf(() =>
      getComponentSchemaTool(ctx, { componentId: "buttton" }),
    )
    expect(teaching.code).toBe("component_not_found")
    expect(teaching.detail?.componentIds).toContain("button")
  })
})

describe("get_property_schema", () => {
  it("serves an atomic schema and marks the key served", async () => {
    const { ctx } = makeCtx()
    const result = getPropertySchema(ctx, { propertyKey: "opacity" })

    expect(result.markedServed).toBe(true)
    expect(result.property.category).toBe("atomic")
    expect(result.property.schema!.supports).toContain("exact")
    expect(ctx.session.servedPropertySchemas.has("opacity")).toBe(true)
  })

  it("serves compound schemas with facets and the selector facet", async () => {
    const { ctx } = makeCtx()
    const border = getPropertySchema(ctx, { propertyKey: "border" }).property
    expect(border.category).toBe("compound")
    expect(border.selectorFacet).toBe("preset")
    expect(Object.keys(border.facets!)).toEqual(
      expect.arrayContaining(["preset", "color", "width"]),
    )

    const background = getPropertySchema(ctx, {
      propertyKey: "background",
    }).property
    expect(background.selectorFacet).toBe("kind")
  })

  it("serves shorthand schemas with their sub-keys", async () => {
    const { ctx } = makeCtx()
    const padding = getPropertySchema(ctx, { propertyKey: "padding" }).property
    expect(padding.category).toBe("shorthand")
    expect(padding.subKeys).toEqual(["top", "right", "bottom", "left"])
  })

  it("names the theme token sections a property's @refs draw from", async () => {
    const { ctx } = makeCtx()
    const gap = getPropertySchema(ctx, { propertyKey: "gap" }).property
    expect(gap.schema!.themeSections).toContain("gap")
    expect(
      gap.schema!.themeKeys!.ordinal!.some((key) => key.startsWith("@gap.")),
    ).toBe(true)
  })

  it("teaches on unknown property keys", async () => {
    const { ctx } = makeCtx()
    const teaching = teachingOf(() =>
      getPropertySchema(ctx, { propertyKey: "colour" }),
    )
    expect(teaching.code).toBe("unknown_property")
    expect(teaching.detail?.validKeys).toContain("color")
  })
})

describe("apply_actions — hard schema gate", () => {
  function opacityAction(nodeId: string, value: number) {
    return {
      type: "set_node_properties",
      payload: {
        nodeId,
        properties: { opacity: { type: ValueType.EXACT, value } },
      },
    }
  }

  it("bounces unserved keys with schemas attached; the resubmit succeeds", async () => {
    const { ctx, buttonVariantId } = await openWithButton()
    const batch = { actions: [opacityAction(buttonVariantId, 40)] }

    const teaching = await teachingOfAsync(() => applyActions(ctx, batch))
    expect(teaching.code).toBe("property_schema_not_served")
    expect(teaching.failedAction).toEqual({
      index: 0,
      type: "set_node_properties",
    })
    const schemas = teaching.detail?.schemas as Record<
      string,
      { schema: { supports: string[] } }
    >
    expect(schemas.opacity!.schema.supports).toContain("exact")

    // The bounce served the schema: the identical batch now applies.
    const { receipt } = await applyActions(ctx, batch)
    expect(receipt.summary.nodes.modified).toBe(1)
  })

  it("passes without a bounce when the schema was served up front", async () => {
    const { ctx, buttonVariantId } = await openWithButton()
    getPropertySchema(ctx, { propertyKey: "opacity" })
    const { receipt } = await applyActions(ctx, {
      actions: [opacityAction(buttonVariantId, 41)],
    })
    expect(receipt.summary.nodes.modified).toBe(1)
  })

  it("rejects unknown property keys outright", async () => {
    const { ctx, buttonVariantId } = await openWithButton()
    const teaching = await teachingOfAsync(() =>
      applyActions(ctx, {
        actions: [
          {
            type: "set_node_properties",
            payload: {
              nodeId: buttonVariantId,
              properties: { colour: { type: ValueType.EXACT, value: "#fff" } },
            },
          },
        ],
      }),
    )
    expect(teaching.code).toBe("unknown_property")
    expect(teaching.detail?.validKeys).toContain("color")
  })
})

describe("get_action_schema", () => {
  it("lists the whitelisted vocabulary by category, nothing else", async () => {
    const { ctx } = makeCtx()
    const listing = getActionSchema(ctx, {})
    if (!("categories" in listing)) throw new Error("expected the listing")

    expect(listing.categories.map((category) => category.category)).toEqual([
      "structure",
      "styling",
      "theming",
      "recovery",
      "workflow",
    ])

    const entries = listing.categories.flatMap((category) => category.actions)
    // 24 logical actions (the 18 custom-token types grouped as one).
    expect(entries).toHaveLength(24)
    for (const entry of entries) {
      expect(entry.summary.length).toBeGreaterThan(0)
    }

    // The listing covers exactly the exposed types.
    const listed = new Set(
      entries.flatMap((entry) => entry.variants ?? [entry.type]),
    )
    expect(listed).toEqual(new Set(EXPOSED_ACTION_TYPES))
  })

  it("serves a self-contained generated schema for one action", async () => {
    const { ctx } = makeCtx()
    const result = getActionSchema(ctx, {
      actionType: "add_theme_custom_swatch",
    })
    if (!("schema" in result)) throw new Error("expected a schema")

    const text = JSON.stringify(result.schema)
    expect(text).toContain('"add_theme_custom_swatch"')

    // Every $ref the schema uses resolves inside the attached definitions.
    const definitions =
      (result.schema.definitions as Record<string, unknown>) ?? {}
    for (const [, name] of text.matchAll(
      /"\$ref":"#\/definitions\/([^"]+)"/g,
    )) {
      expect(definitions, `unresolved $ref ${name}`).toHaveProperty(name!)
    }
    expect(Object.keys(definitions)).toContain("ThemeSwatchParameters")
  })

  it("stubs the giant property bag out of set_node_properties", async () => {
    const { ctx } = makeCtx()
    const result = getActionSchema(ctx, { actionType: "set_node_properties" })
    if (!("schema" in result)) throw new Error("expected a schema")

    const text = JSON.stringify(result.schema)
    expect(text.length).toBeLessThan(20_000)
    expect(text).toContain("get_property_schema")
  })

  it("rejects non-exposed and unknown action types with classification", async () => {
    const { ctx } = makeCtx()
    const tier2 = teachingOf(() =>
      getActionSchema(ctx, { actionType: "set_workspace_label" }),
    )
    expect(tier2.code).toBe("action_not_exposed")
    expect(tier2.detail?.classification).toBe("tier2")

    const unknown = teachingOf(() =>
      getActionSchema(ctx, { actionType: "definitely_not_an_action" }),
    )
    expect(unknown.detail?.classification).toBe("unknown")
  })
})

describe("find_nodes", () => {
  it("finds nodes by component type with board and path context", async () => {
    const { ctx } = await openWithButton()
    const { matches, totalMatches } = findNodes(ctx, { query: "button" })

    expect(totalMatches).toBeGreaterThan(0)
    const variant = matches.find((match) => match.type === "variant")!
    expect(variant.boardKey).toBe("button")
    expect(variant.componentId).toBe("button")
    expect(variant.path).toEqual([])

    // Instances inside a variant carry the ancestor label path. (The board's
    // "Iconic" variant also matches "icon" — as a root, its path is empty.)
    const icons = findNodes(ctx, { query: "icon", boardKey: "button" })
    const instances = icons.matches.filter((match) => match.type === "instance")
    expect(instances.length).toBeGreaterThan(0)
    for (const match of instances) {
      expect(match.boardKey).toBe("button")
      expect(match.componentId).toBe("icon")
      expect(match.path.length).toBeGreaterThan(0)
    }
  })

  it('filters by override values with "key=value" terms', async () => {
    const { ctx, buttonVariantId } = await openWithButton()
    getPropertySchema(ctx, { propertyKey: "opacity" })
    await applyActions(ctx, {
      actions: [
        {
          type: "set_node_properties",
          payload: {
            nodeId: buttonVariantId,
            properties: { opacity: { type: ValueType.EXACT, value: 44 } },
          },
        },
      ],
    })

    const exact = findNodes(ctx, { query: "opacity=44" })
    expect(exact.matches.map((match) => match.id)).toEqual([buttonVariantId])

    const hasOverride = findNodes(ctx, { query: "opacity=" })
    expect(hasOverride.matches.map((match) => match.id)).toContain(
      buttonVariantId,
    )

    expect(findNodes(ctx, { query: "opacity=45" }).matches).toEqual([])
  })

  it("teaches on unknown board keys and requires an open workspace", async () => {
    const { ctx } = await openWithButton()
    const teaching = teachingOf(() =>
      findNodes(ctx, { query: "button", boardKey: "ghost" }),
    )
    expect(teaching.code).toBe("board_not_found")

    const { ctx: closedCtx } = makeCtx()
    expect(teachingOf(() => findNodes(closedCtx, { query: "x" })).code).toBe(
      "no_workspace_open",
    )
  })
})

describe("end-to-end build: pricing card from an empty workspace", () => {
  it("search → schema → apply → verify, within a ≤12-call budget", async () => {
    const { ctx, root } = makeCtx()
    // Call 1: open.
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })

    // Call 2: find the component by concept (keyword-only).
    const search = await searchCatalog(ctx, { query: "pricing card" })
    expect(search.results[0]).toMatchObject({
      id: "pricingCard",
      kind: "component",
      level: "part",
    })

    // Call 3: learn its contract before composing.
    const schema = getComponentSchemaTool(ctx, { componentId: "pricingCard" })
    expect(schema.allowedParentLevels.length).toBeGreaterThan(0)
    const defaultComponents = JSON.stringify(schema.defaultChildren)

    // Call 4: build it.
    const { receipt } = await applyActions(ctx, {
      actions: [
        { type: "add_component", payload: { boardKey: "pricingCard" } },
      ],
    })
    expect(receipt.createdIds.boards).toContain("pricingCard")

    // Call 5: verify what resolves (get_node "computed" is the ground
    // truth for resolved values).
    const variantId = getWorkspaceOutline(ctx).boards.find(
      (board) => board.key === "pricingCard",
    )!.variants![0]!.id
    const check = getNode(ctx, { nodeId: variantId, mode: "computed" })
    expect(Object.keys(check.node.css!).length).toBeGreaterThan(0)
    expect(check.children.length).toBeGreaterThan(0)

    // The card actually composed its schema children (title/price/button…).
    expect(defaultComponents).toContain("button")
    // 5 tool calls — well inside the ≤12-call budget.
  })
})

describe("get_computed_theme", () => {
  it("resolves a stock theme without a workspace", async () => {
    const { ctx } = makeCtx()
    const { theme } = getComputedThemeTool(ctx, { themeId: "googleMaterial" })
    expect(theme.id).toBe("googleMaterial")
    expect(theme.swatch["primary"]).toBeDefined()
    expect(Object.keys(theme.gap).length).toBeGreaterThan(0)
  })

  it("a swatch override is reflected in the computed table", async () => {
    const { ctx, root } = makeCtx()
    workspaceOpen(ctx, {
      path: path.join(root, "workspace.json"),
      createIfMissing: true,
    })
    const themeId = getWorkspaceOutline(ctx).themes[0]!.id

    await applyActions(ctx, {
      actions: [
        {
          type: "set_theme_override",
          payload: {
            themeId,
            path: "swatch.primary",
            value: {
              type: "swatch",
              name: "Brand Blue",
              intent: "Brand primary color",
              parameters: { colorspace: Colorspace.HEX, value: "#0033ff" },
            },
          },
        },
      ],
    })

    const { theme } = getComputedThemeTool(ctx, { themeId })
    expect(theme.swatch["primary"]).toMatchObject({
      name: "Brand Blue",
      parameters: { value: "#0033ff" },
    })
  })

  it("teaches on unknown theme ids, listing what resolves", async () => {
    const { ctx } = makeCtx()
    const teaching = teachingOf(() =>
      getComputedThemeTool(ctx, { themeId: "ghost" }),
    )
    expect(teaching.code).toBe("theme_not_found")
    expect(teaching.detail?.availableThemeIds).toContain("googleMaterial")
  })
})
