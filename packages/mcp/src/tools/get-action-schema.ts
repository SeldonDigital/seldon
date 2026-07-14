import fs from "node:fs"

import { z } from "zod"

import { EXPOSED_ACTION_TYPES, explainExposure } from "../action-whitelist"
import { ToolError } from "../errors"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const getActionSchemaInputSchema = {
  actionType: z
    .string()
    .optional()
    .describe(
      "Omit to list all whitelisted action types by category with one-line " +
        "summaries; pass one type for its full generated payload schema.",
    ),
}

/**
 * One-line summaries for the whitelisted actions, by category. The
 * payload schemas themselves are generated from Core's action union — the MCP
 * layer never restates what it can derive (guiding principle); only these
 * summaries are authored here.
 */
const ACTION_SUMMARIES: Record<string, Record<string, string>> = {
  structure: {
    add_component:
      "Add a component board (plus its dependency boards) from the catalog.",
    add_component_and_insert_default_instance:
      "Add a component board if missing and insert its default instance into a target node.",
    remove_component: "Remove a component board and its variant trees.",
    add_variant:
      "Add a user variant to a component board (a copy of the default to build on).",
    insert_default_instance:
      "Insert an instance of a component's default variant into a target node.",
    insert_variant_instance:
      "Insert an instance of a specific variant into a target node.",
    remove_instance: "Remove an instance node from its parent.",
    move_instance: "Move an instance to a different parent or position.",
    reorder_instance_in_parent:
      "Change an instance's position among its siblings.",
    duplicate_node: "Duplicate a variant or instance node in place.",
  },
  styling: {
    set_node_properties:
      "Set property cells on a node. Gated: each top-level key's schema must have been served this session via get_property_schema.",
    reset_node_property: "Remove one property override from a node.",
    set_node_label: "Rename a node.",
    add_node_layer:
      "Append a layer to a node's background or shadow paint stack.",
    set_node_state_properties:
      "Set property cells for an interaction state (hover, focus, …) on a node.",
  },
  theming: {
    add_theme:
      "Add a stock theme board to the workspace (boardKey is the stock theme id).",
    set_theme_override:
      "Write a value into a theme entry's overrides at a dot-separated token path (null removes it).",
    "add_theme_custom_*":
      "Add a custom token to one theme section; one concrete action per section (see variants).",
    set_component_theme: "Set the theme a component board renders under.",
    set_node_theme: "Set or clear the theme on a single node.",
  },
  recovery: {
    reset_node: "Clear a node's overrides back to its template.",
    reset_instance_to_source:
      "Reset an instance subtree to its source variant.",
    reset_component_to_catalog:
      "Reset a component board and its nodes to the catalog schema.",
  },
  workflow: {
    add_sandbox: "Add a sandbox composition to a playground board.",
  },
}

const CUSTOM_TOKEN_PREFIX = "add_theme_custom_"

interface SchemaBranch {
  properties?: {
    type?: { const?: string }
    payload?: unknown
  }
  [key: string]: unknown
}

/**
 * Core's generated action schema, read from the monorepo checkout
 * (@seldon/core is a file: link to ../../core; v1 runs from the
 * repo). Read with fs instead of an ESM JSON import: the core package's
 * `./*` wildcard export maps *.json to *.json.ts, which vitest's resolver
 * forgives but a plain `node --import tsx` launch from an arbitrary cwd
 * does not.
 */
const schemaDoc = JSON.parse(
  fs.readFileSync(
    new URL(
      "../../../core/workspace/reducers/workspace-action-schema.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as { anyOf: SchemaBranch[]; definitions: Record<string, unknown> }

function branchFor(actionType: string): SchemaBranch | undefined {
  return schemaDoc.anyOf.find(
    (branch) => branch.properties?.type?.const === actionType,
  )
}

/**
 * The generated definition name for the full node property bag — a ~80 kB
 * schema that would dwarf every response it rides in. It is stubbed out of
 * served schemas; get_property_schema serves the same information per key,
 * and the hard schema gate requires that call anyway.
 */
const propertyBagRef = (() => {
  const branch = branchFor("set_node_properties")
  const properties = (
    branch?.properties?.payload as
      | { properties?: { properties?: { $ref?: string } } }
      | undefined
  )?.properties?.properties
  return properties?.$ref ?? null
})()

const PROPERTY_BAG_STUB = {
  type: "object",
  description:
    "Property cells keyed by top-level property key. Per-key cell shapes are " +
    "served by get_property_schema — which set_node_properties requires this " +
    "session for every key it touches.",
}

/** Deep-copies a schema fragment, replacing property-bag refs with the stub. */
function withStubbedPropertyBag(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withStubbedPropertyBag)
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>
    if (propertyBagRef && record["$ref"] === propertyBagRef) {
      return { ...PROPERTY_BAG_STUB }
    }
    return Object.fromEntries(
      Object.entries(record).map(([key, entry]) => [
        key,
        withStubbedPropertyBag(entry),
      ]),
    )
  }
  return value
}

function collectRefNames(value: unknown, into: Set<string>): void {
  if (Array.isArray(value)) {
    for (const entry of value) collectRefNames(entry, into)
    return
  }
  if (value !== null && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (key === "$ref" && typeof entry === "string") {
        const name = entry.replace(/^#\/definitions\//, "")
        if (name !== entry) into.add(name)
      } else {
        collectRefNames(entry, into)
      }
    }
  }
}

export interface ActionCategoryListing {
  category: string
  actions: Array<{ type: string; summary: string; variants?: string[] }>
}

export type GetActionSchemaResult =
  | { categories: ActionCategoryListing[]; note: string }
  | { actionType: string; schema: Record<string, unknown> }

/**
 * The get_action_schema tool. Without an argument: the whitelisted action
 * vocabulary by category (the 18 custom-token actions grouped as one entry).
 * With one: that action's payload schema from Core's generated
 * workspace-action-schema.json, made self-contained by attaching every
 * definition it references.
 */
export function getActionSchema(
  _ctx: ToolContext,
  input: { actionType?: string },
): GetActionSchemaResult {
  if (!input.actionType) {
    const customTokenVariants = EXPOSED_ACTION_TYPES.filter((type) =>
      type.startsWith(CUSTOM_TOKEN_PREFIX),
    )
    const categories = Object.entries(ACTION_SUMMARIES).map(
      ([category, actions]): ActionCategoryListing => ({
        category,
        actions: Object.entries(actions).map(([type, summary]) => ({
          type,
          summary,
          ...(type === "add_theme_custom_*"
            ? { variants: customTokenVariants }
            : {}),
        })),
      }),
    )
    return redactValue({
      categories,
      note:
        "Call get_action_schema with an actionType for its full payload " +
        "schema. These are the only types apply_actions accepts.",
    })
  }

  const verdict = explainExposure(input.actionType)
  if (!verdict.exposed) {
    throw new ToolError({
      code: "action_not_exposed",
      message: verdict.message,
      recovery:
        "Call get_action_schema without arguments for the exposed vocabulary.",
      detail: {
        classification: verdict.classification,
        exposedActionTypes: EXPOSED_ACTION_TYPES,
      },
    })
  }

  const branch = branchFor(input.actionType)
  if (!branch) {
    // Whitelisted but missing from the generated schema: a stale
    // workspace-action-schema.json, which the whitelist test catches in
    // CI. Surface it truthfully rather than serving nothing.
    throw new ToolError({
      code: "internal_error",
      message:
        `No generated schema exists for "${input.actionType}". ` +
        "Core's workspace-action-schema.json is stale.",
      recovery:
        "Report this to the user: `npm run generate:action-schema` in " +
        "packages/core regenerates the file.",
    })
  }

  const stubbed = withStubbedPropertyBag(branch) as Record<string, unknown>

  const needed = new Set<string>()
  collectRefNames(stubbed, needed)
  const definitions: Record<string, unknown> = {}
  const queue = [...needed]
  while (queue.length > 0) {
    const name = queue.pop()!
    if (name in definitions) continue
    const definition = withStubbedPropertyBag(schemaDoc.definitions[name])
    definitions[name] = definition
    const nested = new Set<string>()
    collectRefNames(definition, nested)
    for (const entry of nested) {
      if (!(entry in definitions)) queue.push(entry)
    }
  }

  return redactValue({
    actionType: input.actionType,
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      ...stubbed,
      ...(Object.keys(definitions).length > 0 ? { definitions } : {}),
    },
  })
}
