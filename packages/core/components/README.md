# Seldon · Components

Components are the catalog of design building blocks Seldon ships out of the box. Each component is described by a **schema** that pairs an identity (id, name, intent, icon, tags) with a typed `Properties` block and an optional recursive `children` tree.

Schemas are blueprints. They list the properties a component understands, the default values for those properties, and any children the component instantiates. Workspaces, the editor, and the factory export pipeline all consume these schemas as the canonical source of truth for what a component is and how it composes.

---

## What Are Components

A **component schema** is a static, typed record. It does not hold instance state, layout coordinates, or workspace edits. It only declares:

- **Identity** — `id`, `name`, `intent`, `tags`, `icon`.
- **Place in the hierarchy** — `level`, one of six levels (Section *Component Hierarchy*).
- **Defaults** — `properties`, the schema-level default values for every property the component exposes. Properties not listed here cannot be set on this component.
- **Composition** — `children`, an optional tree of nested component references with their own `overrides`.

When a designer places a button on a screen, that placed button is a *variant* of the `Button` schema. A schema is the recipe — the list of properties, the defaults, the children it brings along — and a variant is the actual thing sitting in a design, carrying whatever values that particular placement needs. Two buttons on the same screen share one schema and live, but live as two independent instances with their own values.

Every placed variant and every customisation a user has made are managed by the workspace. This directory only describes the catalog the workspace draws from.

---

## Component Hierarchy

Seven levels are defined in the catalog. Six are used in composition trees. **Frame** is the cross-level wildcard and may appear anywhere. **Board** is an editor-only shell and is not placed in composition trees.

| Level | Source | May contain |
| --- | --- | --- |
| `screen` | `screens/*.schema.ts` | Any level, including frames |
| `module` | `modules/*.schema.ts` | Modules, parts, elements, primitives, frames |
| `part` | `parts/*.schema.ts` | Parts, elements, primitives, frames |
| `element` | `elements/*.schema.ts` | Elements, primitives, frames |
| `primitive` | `primitives/*.schema.ts` | Primitives, frames |
| `frame` | `frames/*.schema.ts` | Anything, at any level |

Frames sit outside the hierarchy on purpose. They are not really a "kind" of component the way a button, a list, or a screen is -- they are a container, a grouping mechanism. A frame's job is to wrap and arrange other components, and because grouping is useful at every level, frames are allowed to live at any level and to hold any kind of child.

---

## Component Schemas

The components in the catalog use two schema shapes that share a common base:

```typescript
interface BaseComponentSchema {
  id: ComponentId
  name: string
  intent: string
  icon: ComponentIcon
  properties: Properties
  tags: string[]
}

interface PrimitiveComponentSchema extends BaseComponentSchema {
  level: ComponentLevel.PRIMITIVE
}

interface ComplexComponentSchema extends BaseComponentSchema {
  level: Exclude<ComponentLevel, "primitive">
  default: SchemaTree
  variants?: SchemaVariant[]
}

interface SchemaTree {
  children?: SchemaChild[]
}

interface SchemaVariant extends SchemaTree {
  id: string
  label: string
  intent: string
}

interface SchemaChild {
  component: ComponentId
  variant?: string
  overrides?: Properties
  children?: SchemaChild[]
}

type ComponentSchema = PrimitiveComponentSchema | ComplexComponentSchema
```

The split exists because primitives are leaves. A `Text`, an `Icon`, or an `Image` component cannot hold anything inside it, so its schema has no `default` or `variants` field. Every other component declares a `default` composition tree (the canonical shape of the component) and may declare alternate `variants` of itself.

A complex schema's first level mirrors how the workspace stores nodes: a board has one default variant plus zero or more user variants ([`workspace/model/entry-node.ts`](../workspace/model/entry-node.ts) — `EntryNodeType = "default" | "variant" | "instance"`). The schema bakes the same split in at authoring time: `default` is the canonical tree, each `variants[]` entry is an alternate complete tree of the same component (e.g. `Button` ships a default tree plus a `social` variant tree).

Composition trees are **fully flattened**: a parent declares the entire descendant tree it owns. An intermediate schema is only kept in the catalog when it is genuinely reusable across multiple parents; single-parent intermediates are dissolved into the parent.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `ComponentId` | Stable enum identifier emitted by the generator. Used by every workspace, export target, and consumer to refer to this schema. |
| `name` | `string` | Human-readable label (e.g. `"Button"`, `"Button Bar"`). Free-form. |
| `intent` | `string` | One-sentence description of when to use the component. Surfaced by editor and AI helpers. |
| `tags` | `string[]` | Search/discovery keywords. Free-form. |
| `level` | `ComponentLevel` | Position in the hierarchy. A primitive schema is locked to `PRIMITIVE`. |
| `icon` | `ComponentIcon` | Icon shown in editor catalog panels. |
| `properties` | `Properties` | Default values for every catalog property this component exposes. A property absent from this block cannot be set on instances of this component. |
| `default` | `SchemaTree` | Only on complex schemas. The canonical composition tree for the component. |
| `variants` | `SchemaVariant[]?` | Only on complex schemas. Optional alternate composition trees of the same component, each with its own `id`, `label`, and `intent`. |

```typescript
export const schema = {
  name: "Icon",
  id: Seldon.ComponentId.ICON,
  intent:
    "Displays a vector or symbolic icon representing an action or concept.",
  tags: ["icon", "symbol", "graphic", "primitive", "UI", "decoration"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.ICON,
  properties: {
    display: {
      type: Sdn.ValueType.EMPTY,
      value: null,
    },
    symbol: {
      type: Sdn.ValueType.OPTION,
      value: "__default__",
    },
    /* … */
  },
} as const satisfies ComponentSchema
```

`as const satisfies ComponentSchema` is the standard authoring pattern — it locks the shape while preserving literal types for property keys and option values.

---

## Properties in schemas

Every property a schema declares uses the same tagged shape — a `type` tag drawn from `ValueType` and a `value` payload that fits that tag. The tag tells the system how to read the value; the payload changes shape from one tag to the next.

A few examples:

```typescript
// Not set — resolved by inheritance or platform default
display: { type: Sdn.ValueType.EMPTY, value: null }

// Take the value from the parent
cursor: { type: Sdn.ValueType.INHERIT, value: null }

// A literal value
content: { type: Sdn.ValueType.EXACT, value: "Cell" }
ariaHidden: { type: Sdn.ValueType.EXACT, value: false }

// One of a fixed set of choices
orientation: { type: Sdn.ValueType.OPTION, value: Sdn.Orientation.HORIZONTAL }
cursor: { type: Sdn.ValueType.OPTION, value: Sdn.Cursor.POINTER }

// An ordered theme token (sizes, spacing, type scales)
size: { type: Sdn.ValueType.THEME_ORDINAL, value: "@size.medium" }

// A categorical theme token (swatches, font families)
color: { type: Sdn.ValueType.THEME_CATEGORICAL, value: "@swatch.black" }

// Derived from another property at compute time
size: {
  type: Sdn.ValueType.COMPUTED,
  value: {
    function: Sdn.ComputedFunction.AUTO_FIT,
    input: { basedOn: "#parent.buttonSize", factor: 0.8 },
  },
}
```

---

### Value Types used in schemas

A default property value isn't always a literal value. Sometimes the schema wants to say "use the parent's value", or "use whatever the active theme calls primary", or "work it out from another property". The value type on each default tells the system which of those things the schema actually means:

| Value type | What the default is saying |
| --- | --- |
| `EMPTY` | "I expose this property, but I have no opinion about it." The value gets filled in elsewhere — usually by inheritance from a parent or a sensible platform default. |
| `INHERIT` | "Whatever my parent has, use that." A direct hand-off, every time. |
| `EXACT` | A plain literal value baked into the schema — a piece of text, a boolean, a dimension. |
| `OPTION` | A choice picked from a fixed list of allowed options (e.g. an alignment, a cursor style, an icon symbol). |
| `THEME_CATEGORICAL` | A pointer to a theme token chosen from a named set, like a swatch or a font family. Whatever theme is active supplies the real value. |
| `THEME_ORDINAL` | A pointer to a theme token chosen from an ordered scale, like type size or spacing. Whatever theme is active supplies the real value. |
| `COMPUTED` | A value worked out from another property at compute time — for example, padding sized relative to a font, or a label color picked for contrast against its background. |

---

### Atomic, Compound, and Layered Shapes

A schema's defaults sit on top of the same four property shapes the rest of the system uses. Some properties hold a single value — a color, a display mode, one length. Some spread across parallel sides, like `margin` and `padding`. Some group related facets under one key, like `font` or `border`. And the paint properties — `background`, `gradient`, `shadow` — stack as ordered layers. 

| Shape | Example properties | How it looks in a schema |
| --- | --- | --- |
| **Atomic** | `color`, `display`, `opacity` | Single tagged value. |
| **Compound** | `font`, `border`, `borderTop`, `borderRight`, `borderBottom`, `borderLeft` | Object whose keys are the compound's facets. Each facet is itself an atomic tagged value. |
| **Shorthand** | `margin`, `padding`, `corners`, `position` | Object keyed by side/corner. Each side is an atomic tagged value. |
| **Layered paint** | `background`, `gradient`, `shadow` | An **array** of layer objects. The schema default is always a single layer; additional layers are added per instance by the workspace. Index `0` is topmost. |

---

### Border Compounds

Borders are a special case. Most of the time a component just wants one border that wraps the whole element, so a schema declares a single `border` compound and that's the end of it. But some components need to style individual sides differently — a divider line under a row, a left rail on a card, a top stripe on a banner. For those, the schema declares four additional sibling compounds (`borderTop`, `borderRight`, `borderBottom`, `borderLeft`) so each side can carry its own values.

A component that does not declare the per-side compounds intentionally cannot have its sides styled independently. That is a capability decision made at authoring time, not a runtime restriction.

---

## Default tree, variants, and overrides

Complex components are created by listing other components inside `default.children` (and optionally inside `variants[i].children`). Each child is just a reference to another schema, and that schema decides what properties the child has and what their defaults are.

When the parent wants the child to start with values different from its schema defaults, it adds an `overrides` block on the child entry. Anything listed in `overrides` is matched against the target schema's properties and supplied as the starting value. Anything left out uses the child schema's default. Properties that are not declared in the child's schema cannot be overridden — they are simply not part of that component's vocabulary.

A child entry may also set `variant: "..."` to use a named variant from the referenced child schema as its baseline. If `variant` is omitted, the child uses the referenced schema's `default` tree. If `variant` is present, it must match a `SchemaVariant.id` on the referenced child schema or instantiation throws an error. If a child entry also defines `children`, those nested entries override the selected baseline tree for that child.

Children can themselves have children. There is no special syntax for reaching further down: nest another `children` entry on a `SchemaChild`.

A complex schema always declares its canonical tree under `default`:

```typescript
  default: {
    children: [
      {
        component: Seldon.ComponentId.BUTTON,
        variant: "social",
        overrides: {
          display: { type: Sdn.ValueType.OPTION, value: Sdn.Display.SHOW },
          background: [
            {
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.swatch1",
              },
              /* … other background properties use their defaults */
            },
          ],
        },
        children: [
          {
            component: Seldon.ComponentId.ICON,
            overrides: {
              symbol: { type: Sdn.ValueType.OPTION, value: "material-add" },
            },
          },
          {
            component: Seldon.ComponentId.LABEL,
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Add" },
            },
          },
        ],
      },
      /* … */
    ],
  },
```

A schema can additionally declare alternate `variants` of itself. Each variant carries the same `SchemaTree` shape as `default`, plus identity metadata (`id`, `label`, `intent`). A variant may also set optional `overrides` for root-level properties such as `width` and `height` on the component board variant node.

```typescript
  variants: [
    {
      id: "social",
      label: "Social",
      intent: "Action button styled for social-network sign-in or share.",
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: { /* … */ },
        },
        {
          component: Seldon.ComponentId.LABEL,
          overrides: {
            content: { type: Sdn.ValueType.EXACT, value: "Social" },
          },
        },
      ],
    },
  ],
```

Variant root and instance node ids in `workspace.json` follow `component-{boardKey}-{suffix}` (see [`WORKSPACE.md`](../workspace/WORKSPACE.md) · Nodes); the workspace reducer is the single supported way to mint those ids when instantiating from a catalog schema.

---

## Catalog

The `catalog/index.ts` is the main entry point. It wraps the generated per-level arrays in a typed `Catalog` object and exposes a single resolver:

```typescript
export type Catalog = {
  frames: ComponentSchema[]
  primitives: ComponentSchema[]
  elements: ComponentSchema[]
  parts: ComponentSchema[]
  modules: ComponentSchema[]
  screens: ComponentSchema[]
}

export const catalog: Catalog = {
  frames, primitives, elements, parts, modules, screens,
}

export function getComponentSchema(id: ComponentId): ComponentSchema
```

`getComponentSchema(id)` looks up a schema by its `ComponentId`, throwing via `invariant` if no schema matches. Use it any time you need a schema by id -- never reach into the per-level arrays directly.

Usage:

```typescript
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"

const button = getComponentSchema(ComponentId.BUTTON)
console.log(button.level)        // "element"
console.log(button.properties)   // full default Properties block
```

---

## Validation and Type Safety

Schemas are validated at compile time. `as const satisfies ComponentSchema` rejects:

- Missing required fields (`id`, `name`, `intent`, `tags`, `level`, `icon`, `properties`).
- A complex schema missing the required `default` tree.
- Properties whose tagged shape does not match a `Properties` slot.
- `default` or `variants` declared on a primitive schema.
- Option values outside their declared enum (e.g. an unknown `Cursor` literal).

Runtime checks happen in the workspace and properties layers (override merging, theme resolution, computed-value evaluation). Nothing in this directory performs runtime validation — schemas are pure data.

---

## Performance Considerations

**Note:** These are general guidelines for systems that lean on the catalog heavily. They are not micro-benchmarked claims about this package.

### Optimization Strategies
1. **Resolve schemas once** — call `getComponentSchema` at module load, not inside hot render loops.
2. **Iterate the right bucket** — `catalog.<level>` is already sliced by level; prefer it over filtering the full set.
3. **Treat schemas as frozen** — they are `as const`; never mutate them in place.
4. **Cache derived data** — anything you compute over a schema (icon lookups, prop lists, default snapshots) is safe to memoize across the process lifetime.

### Memory Management
1. **Share schema references** — one `ComponentSchema` instance per id is enough for the whole process.
2. **Avoid deep cloning** — `mergeProperties` from `@seldon/core/properties` returns new objects; you do not need to pre-clone the default `properties` block.
3. **Drop unused buckets** — bundlers can tree-shake unused levels if you import from a specific schema file rather than the catalog.

---

## Error Handling

**Note:** Describes typical failure modes at a product level (TypeScript, validation, missing ids). Specific error strings depend on the caller.

### Validation Errors
- **`getComponentSchema` miss** — throws via `invariant` with `Schema <id> not found` when the id is not in the catalog.
- **Schema shape errors** — TypeScript compilation errors against `ComponentSchema`, `PrimitiveComponentSchema`, or `ComplexComponentSchema`.
- **Property shape errors** — TypeScript errors from `Properties`, surfaced at `as const satisfies ComponentSchema`.

### Graceful Degradation
- **Unknown override keys** — silently dropped at merge time so missing properties stay missing.
- **Missing theme tokens** — fall back to schema defaults via the theme resolver (see [THEMES.md](../themes/THEMES.md)).
- **Missing computed inputs** — `COMPUTED` defaults that reference an absent `basedOn` chain fall back to the property's natural inheritance (see [`compute/get-based-on-value.ts`](../compute/get-based-on-value.ts)).

---

## Adding Components to Core

The high-level recipe; details vary by level.

**1. Pick the bucket**

Decide on the level (`screen`, `module`, `part`, `element`, `primitive`, `frame`) and create the file under the matching directory, grouped by family (e.g. `elements/buttons/MyButton.schema.ts`).

**2. Author the schema**

Start from a sibling schema as a template. Mandatory fields: `id`, `name`, `intent`, `tags`, `level`, `icon`, `properties`. Complex schemas additionally declare `default: { children: [...] }` (always present, can be empty) and may declare `variants: [...]` for alternate trees of the same component.

```typescript
import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  id: Seldon.ComponentId.MY_BUTTON,
  name: "My Button",
  intent: "Action button styled for ...",
  tags: ["button", "action"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    /* category-ordered defaults, see PROPERTY_DISPLAY_ORDER */
  },
  default: {
    children: [
      /* fully flattened catalog references for the canonical tree */
    ],
  },
  variants: [
    /* optional alternate trees: { id, label, intent, children: [...] } */
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLButton" },
}
```

**3. Order properties correctly**

Place property keys inside `properties` in [`PROPERTY_DISPLAY_ORDER`](../properties/constants/property-display.ts) order: attributes → layout → appearance → typography → effects. Within compound objects, follow the facet order shown in [PROPERTIES.md → Property Categories](../properties/PROPERTIES.md#property-categories-ordering-and-types).

**4. Sync the catalog files**

After editing a schema, sync [`catalog/index.ts`](./catalog/index.ts), `constants/index.ts`, and `types/component-id.ts` so the imports, catalog arrays, export config map, and `ComponentId` values stay aligned with the schema files.

Invoke `@components-catalog`.

**5. Wire downstream consumers**

Anything that consumes catalog ids (workspace migrations, React/CSS export overrides, rules config) needs to acknowledge the new `ComponentId`. Most consumers pick it up automatically through the regenerated `ComponentId` enum.

**6. Add tests**

Follow the testing standards in [`tests.mdc`](../../../.cursor/rules/tests.mdc): use v2 workspace samples such as [`workspace/workspace-sample.v0.json`](../workspace/workspace-sample.v0.json), `testTheme`, and real values; no mocks.

---

## Licensing

License and contributor documents live at the repository root under [`license/`](../../../license/README.md). Links in this section resolve from `packages/core/components/` via `../../../license/…`.

This project is licensed as follows:

- **Noncommercial Use** → Licensed under the [PolyForm Noncommercial License](../../../license/noncommercial/LICENSE.md)
- **Commercial Use** → Requires a separate paid license. See [Commercial License Options](../../../license/commercial/COMMERCIAL-LICENSE-README.md)
- **Contributors** → Must follow [Contributing Guidelines](../../../license/contributors/CONTRIBUTING.md) and sign the [Contributor License Agreement](../../../license/contributors/CLA.md)

### Quick Links

- [License index](../../../license/README.md)
- [Noncommercial License (default)](../../../license/noncommercial/LICENSE.md)
- [Licensing overview](../../../README.md#licensing-overview)
- [Commercial License – Overview](../../../license/commercial/COMMERCIAL-LICENSE-README.md)
- [Commercial license terms (full text)](../../../license/commercial/COMMERCIAL-LICENSE.md)
- [Commercial license short-form template](../../../license/commercial/COMMERCIAL-LICENSE-SHORT-FORM.md)
- [Commercial license long-form template](../../../license/commercial/COMMERCIAL-LICENSE-LONG-FORM.md)
- [CLA – Contributor License Agreement](../../../license/contributors/CLA.md)
- [Official repository notice](../../../license/NOTICE.md)

**Reminder:** If you use this software in a business, SaaS product, or any commercial context, you **must obtain a commercial license**.

---

## Links

- [PROPERTIES.md](../properties/PROPERTIES.md) — `ValueType`, property categories, override behaviour
- [THEMES.md](../themes/THEMES.md) — `@token` references, palette generation
- [WORKSPACE.md](../workspace/WORKSPACE.md) — board taxonomy, instance state, reducers
- [Official Website](https://seldon.digital)
- [Documentation](https://docs.seldon.digital)
- [Issues & Discussions](https://github.com/seldon/issues)

--- 

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.