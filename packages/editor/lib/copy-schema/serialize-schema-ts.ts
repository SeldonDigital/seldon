import * as Sdn from "@seldon/core/properties"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers"
import * as Seldon from "@seldon/core/components/constants"
import type { SchemaSnippet } from "./build-schema-snippet"

const INDENT = "  "
const IDENTIFIER_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/

function isStringEnumObject(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const entries = Object.entries(value)
  return (
    entries.length > 0 &&
    entries.every(
      ([key, member]) =>
        typeof member === "string" && IDENTIFIER_KEY.test(key),
    )
  )
}

/** `ValueType` string -> `Sdn.ValueType.{MEMBER}` reference. */
const valueTypeRefByValue = new Map<string, string>(
  Object.entries(Sdn.ValueType).map(([member, value]) => [
    value,
    `Sdn.ValueType.${member}`,
  ]),
)

/** `ComponentId` string -> `Seldon.ComponentId.{MEMBER}` reference. */
const componentIdRefByValue = new Map<string, string>(
  Object.entries(Seldon.ComponentId).map(([member, value]) => [
    value,
    `Seldon.ComponentId.${member}`,
  ]),
)

/** `ComputedFunction` string -> `Sdn.ComputedFunction.{MEMBER}` reference. */
const computedFunctionRefByValue = new Map<string, string>(
  Object.entries(Sdn.ComputedFunction).map(([member, value]) => [
    value,
    `Sdn.ComputedFunction.${member}`,
  ]),
)

/** `Unit` string -> `Sdn.Unit.{MEMBER}` reference. */
const unitRefByValue = new Map<string, string>(
  Object.entries(Sdn.Unit).map(([member, value]) => [
    value,
    `Sdn.Unit.${member}`,
  ]),
)

type EnumCandidate = {
  ref: string
  values: ReadonlySet<string>
}

/**
 * Option value string -> candidate `Sdn.{Enum}.{MEMBER}` references, built from
 * every string-enum export in the properties barrel. Values claimed by more
 * than one enum get disambiguated against the property's preset options.
 */
const optionCandidatesByValue: Map<string, EnumCandidate[]> = (() => {
  const candidates = new Map<string, EnumCandidate[]>()
  for (const [exportName, exported] of Object.entries(Sdn)) {
    if (exportName === "ValueType" || !isStringEnumObject(exported)) continue
    const values = new Set(Object.values(exported))
    for (const [member, value] of Object.entries(exported)) {
      const list = candidates.get(value) ?? []
      list.push({ ref: `Sdn.${exportName}.${member}`, values })
      candidates.set(value, list)
    }
  }
  return candidates
})()

function pascalCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Allowed option values for the property at `path`, looked up by flattened
 * schema name. A facet path like `["border", "style"]` tries `borderStyle`
 * before `style`.
 */
function getOptionValuesForPath(path: string[]): Set<string> | null {
  if (!path.length) return null
  const last = path[path.length - 1]
  const parent = path.length > 1 ? path[path.length - 2] : null
  const flattenedNames = parent ? [parent + pascalCase(last), last] : [last]

  for (const name of flattenedNames) {
    const options = getPresetOptions(name).filter(
      (option): option is string => typeof option === "string",
    )
    if (options.length) return new Set(options)
  }
  return null
}

/** Enum reference for an OPTION value, or null to fall back to a string literal. */
function resolveOptionRef(value: string, path: string[]): string | null {
  const candidates = optionCandidatesByValue.get(value)
  if (!candidates?.length) return null
  if (candidates.length === 1) return candidates[0].ref

  const allowed = getOptionValuesForPath(path)
  if (allowed) {
    const exact = candidates.find(
      (candidate) =>
        candidate.values.size === allowed.size &&
        [...allowed].every((option) => candidate.values.has(option)),
    )
    if (exact) return exact.ref
    const superset = candidates.find((candidate) =>
      [...allowed].every((option) => candidate.values.has(option)),
    )
    if (superset) return superset.ref
  }
  return null
}

function writeKey(key: string): string {
  return IDENTIFIER_KEY.test(key) ? key : JSON.stringify(key)
}

function isTaggedValue(value: object): boolean {
  return (
    "type" in value &&
    typeof (value as { type: unknown }).type === "string" &&
    valueTypeRefByValue.has((value as { type: string }).type)
  )
}

type ValueContext = {
  key?: string
  /** The value sits in the `value` slot of an OPTION-typed tagged value. */
  isOptionValue?: boolean
}

function writeString(
  value: string,
  path: string[],
  context: ValueContext,
): string {
  if (context.key === "component") {
    const ref = componentIdRefByValue.get(value)
    if (ref) return ref
  }
  if (context.key === "function") {
    const ref = computedFunctionRefByValue.get(value)
    if (ref) return ref
  }
  if (context.key === "unit") {
    const ref = unitRefByValue.get(value)
    if (ref) return ref
  }
  if (context.isOptionValue) {
    const ref = resolveOptionRef(value, path)
    if (ref) return ref
  }
  return JSON.stringify(value)
}

function writeValue(
  value: unknown,
  depth: number,
  path: string[],
  context: ValueContext = {},
): string {
  if (value === null || value === undefined) return "null"
  if (typeof value === "string") return writeString(value, path, context)
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  if (Array.isArray(value)) return writeArray(value, depth, path)
  if (typeof value === "object") {
    return writeObject(value as Record<string, unknown>, depth, path)
  }
  return JSON.stringify(value)
}

function writeArray(values: unknown[], depth: number, path: string[]): string {
  if (!values.length) return "[]"
  const inner = INDENT.repeat(depth + 1)
  const lines = values.map(
    (value) => `${inner}${writeValue(value, depth + 1, path)},`,
  )
  return `[\n${lines.join("\n")}\n${INDENT.repeat(depth)}]`
}

function writeObject(
  value: Record<string, unknown>,
  depth: number,
  path: string[],
): string {
  const entries = Object.entries(value).filter(
    ([, entryValue]) => entryValue !== undefined,
  )
  if (!entries.length) return "{}"

  const tagged = isTaggedValue(value)
  const isOption =
    tagged && (value as { type: string }).type === Sdn.ValueType.OPTION
  const inner = INDENT.repeat(depth + 1)

  const lines = entries.map(([entryKey, entryValue]) => {
    let written: string
    if (tagged && entryKey === "type") {
      written = valueTypeRefByValue.get(entryValue as string)!
    } else if (tagged && entryKey === "value") {
      written = writeValue(entryValue, depth + 1, path, {
        key: entryKey,
        isOptionValue: isOption,
      })
    } else {
      written = writeValue(entryValue, depth + 1, [...path, entryKey], {
        key: entryKey,
      })
    }
    return `${inner}${writeKey(entryKey)}: ${written},`
  })

  return `{\n${lines.join("\n")}\n${INDENT.repeat(depth)}}`
}

/**
 * Serializes a snippet to TS object-literal source using `Sdn.*` and
 * `Seldon.*` enum references, ready to paste into a `*.schema.ts` file. A
 * default snippet becomes `properties` and `default` schema fields. A variant
 * snippet becomes one entry for the schema `variants` array.
 */
export function serializeSchemaSnippet(snippet: SchemaSnippet): string {
  if (snippet.kind === "default") {
    const lines = [`properties: ${writeObject(snippet.properties, 0, [])},`]
    if (snippet.default) {
      lines.push(`default: ${writeObject(snippet.default, 0, [])},`)
    }
    return lines.join("\n")
  }

  const variant: Record<string, unknown> = {
    id: snippet.id,
    label: snippet.label,
    intent: snippet.intent,
  }
  if (snippet.overrides) variant.overrides = snippet.overrides
  if (snippet.children) variant.children = snippet.children
  return `${writeObject(variant, 0, [])},`
}
