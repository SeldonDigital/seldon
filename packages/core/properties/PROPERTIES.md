# Seldon · Properties

Properties provide a comprehensive type-safe property definition and processing system. Properties control how components look and behave, serving as the bridge between design intent and production code.

---

## What Are Properties

Properties are values that define component appearance and behavior. They serve dual purposes: as styling configuration for visual appearance and as a type-safe value system for consistent data handling across the entire design system.

Properties flow through a resolution pipeline that merges values from multiple sources: component schemas provide defaults, workspace customizations apply user changes, themes supply design tokens, and the system resolves everything for export to production code.

---

## Property Types

Workspaces use three shapes for properties: **Atomic**, **Compound**, and **Shorthand**. Under the hood, **layered paint** (`background`, `gradient`, `shadow`) is stored as **arrays of compound layers** (see `nodeStorage: "layered"` in `constants/shared/compound-properties.ts`); the tables below mark those parents as type `array`.

| Kind | What it is | Access |
|------|------------|--------|
| **Atomic** | One stored value is one style decision. Color, display, and a single length are typical. | One control. Nothing lives under the property name as a separate path. |
| **Compound** | Several related values belong to one property. Themes ship presets that apply the whole set together. | Dot paths such as `border.color`. Picking a preset writes its values and clears any piece of the compound that the preset does not specify. |
| **Shorthand** | One property drives several fields of the same kind: four margins, four paddings, four corner radii, and so on. Same idea as CSS shorthand. | You edit an object with named sides or corners, or you set every field at once. The UI may show a single value when all fields match. |

### Atomic Properties

Atomic properties are single values: one decision, no structured sub-fields in the model. Examples include color, gap, opacity, and display.

```typescript
type Properties = {
  color: ColorValue | EmptyValue
  gap: GapValue | EmptyValue
  opacity: PercentageValue | EmptyValue
  display: DisplayValue | EmptyValue
}
```

---

### Compound Properties

These are groups of related styling values that together act as a collection of atomic sub-properties. These properties use dot notation for data access, allowing you to reference specific sub-properties (e.g. `border.width`, `border.color`, `font.size`). This structure keeps related styling organized while maintaining granular control over individual values.

```typescript
type Properties = {
  border: BorderCompound // e.g. optional preset + width, style, color, opacity, …
}
```

Illustrative **theme recipe** shape (e.g. one entry under `theme.border` in a theme object). On a **workspace node**, the same look is stored as a `BorderCompound` — optional `preset` plus facets like `width` and `style` — not a nested `hairline.parameters` tree on `Properties.border`.

```typescript
{
  hairline: {
    name: "Hairline",
    parameters: {
      width: { type: ValueType.OPTION, value: BorderWidth.HAIRLINE },
      style: { type: ValueType.OPTION, value: BorderStyle.SOLID },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      opacity: {
        type: ValueType.EXACT,
        value: { value: 100, unit: Unit.PERCENT },
      },
    },
  },
}
```

Dot notation examples:

```typescript
properties.border.style
properties.border.width
properties.border.color
```

Compound behavior:

- The theme can list **looks** for a compound (for example `border.hairline` with width, style, color). The editor lets you pick one and copies those parameters onto the compound. **Built-in cleared looks** (`@shadow.none`, `@gradient.none`, `@background.none`, `@border.none`, `@font.normal`) are injected at theme compute time, set every facet to **EMPTY**, and appear in the picker like stock looks. Stored values stay on the usual sub-properties (e.g., `border.width`, `border.color`).
- Applying a preset overwrites every parameter that preset defines. Any parameter the preset does not mention is set to **EMPTY**, which clears older values.
- If the user changes any sub-field by hand, treat the compound as **Custom** until it matches one of the theme’s named presets again.

---

### Shorthand Properties

Shorthand properties control several parallel dimensions at once (margins, padding, corner radii), like CSS shorthands. They reduce repetition when you want the same value on every side or a compact object for all sides at once.

```typescript
type Properties = {
  margin: MarginValue      // top, right, bottom, left
  padding: PaddingValue    // top, right, bottom, left
  corners: CornersValue    // topLeft, topRight, bottomLeft, bottomRight
}
```

Wire values use tagged `ValueType` payloads (see `values/layout/margin.ts`, `padding.ts`, `corners.ts`). Conceptually:

```typescript
properties.margin = {
  top: { type: ValueType.THEME_ORDINAL, value: "@margin.cozy" },
  right: { type: ValueType.EXACT, value: { unit: "px", value: 20 } },
  bottom: { type: ValueType.THEME_ORDINAL, value: "@margin.cozy" },
  left: { type: ValueType.EXACT, value: { unit: "px", value: 20 } },
}
properties.corners = {
  topLeft: { type: ValueType.EXACT, value: { unit: "px", value: 4 } },
  topRight: { type: ValueType.EXACT, value: { unit: "px", value: 4 } },
  bottomLeft: { type: ValueType.EXACT, value: { unit: "px", value: 4 } },
  bottomRight: { type: ValueType.EXACT, value: { unit: "px", value: 4 } },
}
// `padding` sides use the same tagged shapes as `margin` (`values/layout/padding.ts`).
```

Shorthand behavior:

- **Display:** Show one value when all dimensions match; otherwise show multiple values in facet order.
- **Application:** Choosing a shorthand option from its picker usually applies that value to every sub-dimension at once.
- **Overrides:** The shorthand is treated as overridden when any sub-dimension differs from the node’s catalog default.

---

## Value Types

Properties use seven value types to handle different data sources and behaviors:

| Value type | Meaning |
|------------|---------|
| `EMPTY` | Unset: resolved by the platform or defaults. Inheritance from parents or platform defaults can apply. |
| `INHERIT` | Explicitly uses the parent component’s value, forming a direct parent → child inheritance chain. |
| `EXACT` | A concrete value (color, size, text, etc.) with no reference to another property or theme. |
| `OPTION` | One of a fixed set of allowed choices. |
| `COMPUTED` | Derived from other properties (e.g. math or functions), such as width as 80% of the parent. |
| `THEME_CATEGORICAL` | A theme token from a non-ordered set (e.g. colors, font families). |
| `THEME_ORDINAL` | A theme token from an ordered scale (e.g. spacing, type size steps). |

```typescript
enum ValueType {
  EMPTY = "empty",                          // Unset values, resolved by platform 
  INHERIT = "inherit",                      // Inherit values from parent
  EXACT = "exact",                          // Custom values
  OPTION = "option",                        // Predefined options
  COMPUTED = "computed",                    // Derived values 
  THEME_CATEGORICAL = "theme.categorical",  // Non-sequential theme tokens
  THEME_ORDINAL = "theme.ordinal",          // Sequential theme tokens
}
```

### Value Type Examples

```typescript
// EMPTY - Unset values
{ type: ValueType.EMPTY, value: null }

// INHERIT - Inherited values
{ type: ValueType.INHERIT, value: null }

// EXACT - Custom values
{ type: ValueType.EXACT, value: "#ff0000" }
{ type: ValueType.EXACT, value: { unit: "px", value: 16 } }

// OPTION - Predefined options
{ type: ValueType.OPTION, value: BorderWidth.HAIRLINE }
{ type: ValueType.OPTION, value: "center" }
{ type: ValueType.OPTION, value: "bold" }

// COMPUTED - Derived values (`function` matches `ComputedFunction` / stored JSON: camelCase, e.g. autoFit, highContrastColor, opticalPadding, match)
{ type: ValueType.COMPUTED, 
  value: { 
    function: "autoFit", 
    input: { basedOn: "#parent.size", factor: 0.8 } 
  }
}

// THEME_CATEGORICAL - Non-sequential theme values
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
{ type: ValueType.THEME_CATEGORICAL, value: "@fontFamily.primary" }

// THEME_ORDINAL - Sequential theme values
{ type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" }
{ type: ValueType.THEME_ORDINAL, value: "@margin.large" }
```

---

### Override Behavior

Overrides indicate when property values differ from their catalog schema defaults. An editor needs to track overrides to help users understand which properties have been customized, as well as to provide visual feedback about the current state of component styling.

**Override detection** occurs when any property value differs from its catalog schema value:

- Atomic properties as single values
- Compound properties and sub-properties when any sub-property differs
- Shorthand properties and sub-properties when any sub-property differs

Whenever any property is overridden, an editor should provide visual feedback in the interface, typically through styling changes like highlighting, icons, or color coding. This helps users quickly identify which properties have been customized from their default state.

Overridden properties can be reset back to their default values, either individually or in groups. This is particularly useful when experimenting with different styling options or when reverting changes.

---

### Missing Properties Behavior

When a property is missing from a component schema, it is intentionally excluded from that component's capabilities. This is a deliberate design choice that serves several purposes:

- Component specialization ensures each component only exposes the properties it actually needs, keeping interfaces clean and focused. 
- Type safety prevents invalid configurations by ensuring missing properties cannot be set on components. 
- Validation maintains security by ensuring only properties declared in the schema can be overridden. 
- Inheritance control allows missing properties to inherit from parent components or platform defaults.

For example, an Icon component might not have a `padding` property in its schema, meaning it cannot have padding set directly. Instead, it inherits spacing from its parent container, which is the intended behavior for an icon element.

---

## Property Categories, Ordering and Types

Below are all property values and their fields. They are grouped into categories and should be displayed in any editor or interface using these categories and the ordering present in the tables below.

**IMPORTANT:** A type of `array` in the tables below means an **ordered list** of layer values for a property that can have multiple instances (backgrounds, gradients, shadows).

### Attributes
Properties that are specific to the selected component type and define its core functionality. This category also includes **accessibility**, **form control** fields, **media** sources, **board** sizing, and **workspace/catalog** knobs (`display`, `size`, `buttonSize`) that are not general CSS layout.

| Property | Type | Values |
| --- | --- | --- |
| `display` | `atomic` | `empty` \| `inherit` \| `exact: string` \| `option: show, hide, exclude` |
| `htmlElement` | `atomic` | `empty` \| `inherit` \| `option: a, h1, h2, h3, h4, h5, h6, p, span, label, div, section, article, header, footer, main, nav, aside, figure, figcaption, form, fieldset, menu, option, optgroup, li, ol, ul` \| `exact: string` |
| `wrapperElement` | `atomic` | `empty` \| `inherit` \| `option: div, section, article, aside, main, nav, header, footer, ul, ol, li, form, fieldset, figure, menu, blockquote, thead, tbody, tfoot, tr` \| `exact: string` (Frame catalog only) |
| `content` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| `symbol` | `atomic` | `empty` \| `inherit` \| `option: iconId` \| `exact: string` |
| `source` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| `imageFit` | `atomic` | `empty` \| `inherit` \| `option: original, contain, cover, stretch` |
| `altText` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| `inputType` | `atomic` | `empty` \| `inherit` \| `option: text, number, email, password, search, tel, url, date, datetime-local, checkbox, radio` \| `exact: string` |
| `placeholder` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| `checked` | `atomic` | `empty` \| `inherit` \| `exact: boolean` \| `option: true, false` |
| `ariaLabel` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| `ariaHidden` | `atomic` | `empty` \| `inherit` \| `exact: boolean` \| `option: true, false` |
| `size` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @size.*` \| `computed: autoFit, match` |
| `buttonSize` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @fontSize.*` |
| `screenWidth` | `atomic` | `empty` \| `exact: px, rem` \| `option: fit, fill, desktop, laptop, tablet, mobile, watch, television` \| `computed: autoFit` |
| `screenHeight` | `atomic` | `empty` \| `exact: px, rem` \| `option: fit, fill, desktop, laptop, tablet, mobile, watch, television` \| `computed: autoFit` |
| `cursor` | `atomic` | `empty` \| `inherit` \| `option: default, none, context-menu, help, pointer, progress, wait, cell, crosshair, text, vertical-text, alias, copy, move, no-drop, not-allowed, grab, grabbing, e-resize, n-resize, ne-resize, nw-resize, s-resize, se-resize, sw-resize, w-resize, ew-resize, ns-resize, nesw-resize, nwse-resize, col-resize, row-resize, all-scroll, zoom-in, zoom-out` \| `exact: string` |

---

### Layout
Properties that control the positioning, sizing, and spatial relationships of components.

| Property | Type | Values |
| --- | --- | --- |
| `direction` | `atomic` | `empty` \| `inherit` \| `exact: string` \| `option: ltr, rtl` |
| `placement` | `atomic` | `empty` \| `inherit` \| `option: static, relative, absolute, fixed, sticky` |
| `position` | `shorthand` | `position.top, position.right, position.bottom, position.left` |
| └ `position.top` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| └ `position.right` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| └ `position.bottom` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| └ `position.left` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| `orientation` | `atomic` | `empty` \| `inherit` \| `exact: string` \| `option: horizontal, vertical` |
| `align` | `atomic` | `empty` \| `inherit` \| `option: auto, top-left, top-center, top-right, left, center, right, bottom-left, bottom-center, bottom-right` \| `exact: string` |
| `width` | `atomic` | `empty` \| `inherit` \| `exact: px, rem, %` \| `theme.ordinal: @dimension.*` \| `option: fit, fill` \| `computed: autoFit, match` |
| `height` | `atomic` | `empty` \| `inherit` \| `exact: px, rem, %` \| `theme.ordinal: @dimension.*` \| `option: fit, fill` \| `computed: autoFit, match` |
| `margin` | `shorthand` | `margin.top, margin.right, margin.bottom, margin.left` |
| └ `margin.top` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @margin.*` |
| └ `margin.right` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @margin.*` |
| └ `margin.bottom` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @margin.*` |
| └ `margin.left` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @margin.*` |
| `padding` | `shorthand` | `padding.top, padding.right, padding.bottom, padding.left` |
| └ `padding.top` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @padding.*` \| `computed: opticalPadding, match` |
| └ `padding.right` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @padding.*` \| `computed: opticalPadding, match` |
| └ `padding.bottom` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @padding.*` \| `computed: opticalPadding, match` |
| └ `padding.left` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @padding.*` \| `computed: opticalPadding, match` |
| `gap` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @gap.*` \| `option: evenly-spaced` \| `computed: match` |
| `rotation` | `atomic` | `empty` \| `inherit` \| `exact: degrees, −360–360` |
| `wrapChildren` | `atomic` | `empty` \| `inherit` \| `exact: boolean` \| `option: true, false` |
| `clip` | `atomic` | `empty` \| `inherit` \| `exact: boolean` \| `option: true, false` |
| `columns` | `atomic` | `empty` \| `inherit` \| `exact: number, 1–100` |
| `rows` | `atomic` | `empty` \| `inherit` \| `exact: number, 1–100` |
| `cellAlign` | `atomic` | `empty` \| `inherit` \| `option: auto, top-left, top-center, top-right, left, center, right, bottom-left, bottom-center, bottom-right` \| `exact: string` |
| `dimension` | `atomic` | `empty` \| `inherit` \| `exact: px, rem, %` \| `theme.ordinal: @dimension.*` \| `option: fit, fill` \| `computed: autoFit, match` |
| `resize` | `atomic` | `empty` \| `inherit` \| `exact: string` \| `option: fit, fill` |
| `screenSize` | `atomic` | `empty` \| `inherit` \| `exact: string` \| `option: desktop, laptop, tablet, mobile, watch, television` |

These three keys are **auxiliary layout** fields: they appear on the `Properties` type and in `PROPERTY_SCHEMAS` after the primary layout table keys (see `schemas/PROPERTY-SCHEMAS.md`).

**To be implemented:**
- `zIndex` - Stacking order (integer, auto)
- `clipPath` - Clipping path (basic shapes, url)
- `minWidth`, `maxWidth` - Minimum/maximum width constraints
- `minHeight`, `maxHeight` - Minimum/maximum height constraints
- `outline` - Outline styling (width, style, color, offset)
- `grid` - CSS Grid system (template, auto, gap)
- `gridColumns` - Multi-column layout (count, width, gap, rule)

---

### Appearance
Properties that control the visual appearance and styling of components.

| Property | Type | Values |
| --- | --- | --- |
| `color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| `accentColor` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| `brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| `opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| `background` | `array` | `background[]`, ordered, `background[0]` topmost |
| └ **Each Background** | `compound` | `preset: image, position, size, repeat, color, blendMode, filter, brightness, opacity` |
| └ └ `background[].preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @background.*` (built-in `@background.none`) |
| └ └ `background[].image` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| └ └ `background[].position` | `atomic` | `empty` \| `inherit` \| `option: default, top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right` \| `exact: px, rem, %` \| `exact: DoubleAxisValue` |
| └ └ `background[].size` | `atomic` | `empty` \| `inherit` \| `option: original, contain, cover, stretch` \| `exact: px, rem, %` \| `exact: paired` |
| └ └ `background[].repeat` | `atomic` | `empty` \| `inherit` \| `option: no-repeat, repeat, repeat-x, repeat-y` |
| └ └ `background[].color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ └ `background[].blendMode` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| └ └ `background[].filter` | `atomic` | `empty` \| `inherit` \| `exact: string` |
| └ └ `background[].brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `background[].opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| `border` | `compound` | `preset: style, color, width, brightness, opacity, collapse` |
| └ `border.preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @border.*` (built-in `@border.none`) |
| └ `border.style` | `atomic` | `empty` \| `inherit` \| `option: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden` |
| └ `border.color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ `border.width` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: hairline` \| `theme.ordinal: @borderWidth.*` |
| └ `border.brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `border.opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `border.collapse` | `atomic` | `empty` \| `inherit` \| `option: separate, collapse` |
| `borderTop` | `compound` | `preset: style, color, width, brightness, opacity, collapse` |
| └ `borderTop.preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @border.*` (built-in `@border.none`) |
| └ `borderTop.style` | `atomic` | `empty` \| `inherit` \| `option: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden` |
| └ `borderTop.color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ `borderTop.width` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: hairline` \| `theme.ordinal: @borderWidth.*` |
| └ `borderTop.brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderTop.opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderTop.collapse` | `atomic` | `empty` \| `inherit` \| `option: separate, collapse` |
| `borderRight` | `compound` | `preset: style, color, width, brightness, opacity, collapse` |
| └ `borderRight.preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @border.*` (built-in `@border.none`) |
| └ `borderRight.style` | `atomic` | `empty` \| `inherit` \| `option: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden` |
| └ `borderRight.color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ `borderRight.width` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: hairline` \| `theme.ordinal: @borderWidth.*` |
| └ `borderRight.brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderRight.opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderRight.collapse` | `atomic` | `empty` \| `inherit` \| `option: separate, collapse` |
| `borderBottom` | `compound` | `preset: style, color, width, brightness, opacity, collapse` |
| └ `borderBottom.preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @border.*` (built-in `@border.none`) |
| └ `borderBottom.style` | `atomic` | `empty` \| `inherit` \| `option: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden` |
| └ `borderBottom.color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ `borderBottom.width` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: hairline` \| `theme.ordinal: @borderWidth.*` |
| └ `borderBottom.brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderBottom.opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderBottom.collapse` | `atomic` | `empty` \| `inherit` \| `option: separate, collapse` |
| `borderLeft` | `compound` | `preset: style, color, width, brightness, opacity, collapse` |
| └ `borderLeft.preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @border.*` (built-in `@border.none`) |
| └ `borderLeft.style` | `atomic` | `empty` \| `inherit` \| `option: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden` |
| └ `borderLeft.color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ `borderLeft.width` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: hairline` \| `theme.ordinal: @borderWidth.*` |
| └ `borderLeft.brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderLeft.opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ `borderLeft.collapse` | `atomic` | `empty` \| `inherit` \| `option: separate, collapse` |
| `corners` | `shorthand` | `corners.topLeft, corners.topRight, corners.bottomLeft, corners.bottomRight` |
| └ `corners.topLeft` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: rounded, squared` \| `theme.ordinal: @corners.*` |
| └ `corners.topRight` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: rounded, squared` \| `theme.ordinal: @corners.*` |
| └ `corners.bottomLeft` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: rounded, squared` \| `theme.ordinal: @corners.*` |
| └ `corners.bottomRight` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `option: rounded, squared` \| `theme.ordinal: @corners.*` |
| `borderCollapse` | `atomic` | `empty` \| `inherit` \| `option: separate, collapse` |

---

### Typography
Properties that control text styling, fonts, and typography.

| Property | Type | Values |
| --- | --- | --- |
| `font` | `compound` | `preset: family, style, weight, size, lineHeight, textCase, letterSpacing` |
| └ `font.preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @font.*` (built-in `@font.normal`) |
| └ `font.family` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @fontFamily.*` \| `option: string` \| `exact: string` |
| └ `font.style` | `atomic` | `empty` \| `inherit` \| `option: normal, italic, oblique` \| `exact: string` |
| └ `font.weight` | `atomic` | `empty` \| `inherit` \| `exact: number, 100–900` \| `theme.ordinal: @fontWeight.*` |
| └ `font.size` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @fontSize.*` \| `computed: autoFit, match` |
| └ `font.lineHeight` | `atomic` | `empty` \| `inherit` \| `exact: px, rem, %` \| `exact: unitless number, >0` \| `theme.ordinal: @lineHeight.*` |
| └ `font.textCase` | `atomic` | `empty` \| `inherit` \| `option: normal, lowercase, uppercase, capitalize` |
| └ `font.letterSpacing` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| `textAlign` | `atomic` | `empty` \| `inherit` \| `option: auto, left, right, center, justify` |
| `textCase` | `atomic` | `empty` \| `inherit` \| `option: normal, lowercase, uppercase, capitalize` |
| `textDecoration` | `atomic` | `empty` \| `inherit` \| `option: none, underline, overline, line-through` |
| `wrapText` | `atomic` | `empty` \| `inherit` \| `exact: boolean` \| `option: true, false` |
| `lines` | `atomic` | `empty` \| `inherit` \| `exact: number, integer, ≥0` |

**To be implemented:**
- `textIndent` - Text indentation (length, percentage)
- `wordSpacing` - Word spacing (length, normal)
- `wordBreak` - Word breaking behavior (normal, break-all, keep-all, break-word)
- `lineBreak` - Line breaking behavior (auto, loose, normal, strict, anywhere)
- `hyphens` - Hyphenation control (none, manual, auto)

---

### Effects
Properties that control visual effects and interactions.

| Property | Type | Values |
| --- | --- | --- |
| `gradient` | `array` | `gradient[]`, ordered, `gradient[0]` topmost |
| └ **Each Gradient** | `compound` | `preset: gradientType, angle, startColor, startOpacity, startBrightness, startPosition, endColor, endOpacity, endBrightness, endPosition` |
| └ └ `gradient[].preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @gradient.*` (built-in `@gradient.none`) |
| └ └ `gradient[].gradientType` | `atomic` | `empty` \| `inherit` \| `option: linear, radial` |
| └ └ `gradient[].angle` | `atomic` | `empty` \| `inherit` \| `exact: degrees` |
| └ └ `gradient[].startColor` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ └ `gradient[].startBrightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `gradient[].startOpacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `gradient[].startPosition` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `gradient[].endColor` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ └ `gradient[].endBrightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `gradient[].endOpacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `gradient[].endPosition` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| `shadow` | `array` | `shadow[]`, ordered, `shadow[0]` topmost |
| └ **Each Shadow** | `compound` | `preset: offsetX, offsetY, blur, color, brightness, opacity, spread` |
| └ └ `shadow[].preset` | `atomic` | `empty` \| `inherit` \| `theme.categorical: @shadow.*` (built-in `@shadow.none`) |
| └ └ `shadow[].offsetX` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| └ └ `shadow[].offsetY` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` |
| └ └ `shadow[].blur` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @blur.*` |
| └ └ `shadow[].color` | `atomic` | `empty` \| `inherit` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` \| `computed: highContrastColor, match` |
| └ └ `shadow[].brightness` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `shadow[].opacity` | `atomic` | `empty` \| `inherit` \| `exact: %, 0–100` |
| └ └ `shadow[].spread` | `atomic` | `empty` \| `inherit` \| `exact: px, rem` \| `theme.ordinal: @spread.*` |
| `scroll` | `atomic` | `empty` \| `inherit` \| `option: none, both, horizontal, vertical` |
| `scrollbarStyle` | `atomic` | `empty` \| `inherit` \| `option: default, hidden, overlay, thin` |

**Gradient multi-stop:** Beyond start/end fields on each layer, the flattened catalog includes `gradientStopColor`, `gradientStopBrightness`, `gradientStopOpacity`, and `gradientStopPosition` (`schemas/data/property-schemas.ts`). End-to-end product UI for arbitrary multi-stop editing may still lag that schema surface.

**To be implemented:**
- `multipleStops` - Full editor/UX for arbitrary multi-stop gradients (see **Gradient multi-stop** above)
- `scrollSnap` - Scroll snap behavior (none, x, y, block, inline, both)
- `scrollSnapAlign` - Scroll snap alignment (none, start, end, center)
- `scrollSnapStop` - Scroll snap stop behavior (normal, always)
- `scrollPadding` - Scroll padding (length values)
- `scrollMargin` - Scroll margin (length values)

---

### Behavior (To be implemented)
Properties for component interactions and user behavior.

**Interactions** (subsection):
- `onClick` - Click event handlers
- `onHover` - Hover event handlers  
- `onFocus` - Focus event handlers
- `onActive` - Active state handlers
- `onDisabled` - Disabled state handlers

**Pointer** (subsection):
- `userSelect` - Text selection behavior
- `pointerEvents` - Pointer event handling

---

### Motion (To be implemented)
Properties for animations, transitions, and motion effects.

**Transition** (subsection):
- `transitionProperty` - CSS properties to transition
- `transitionDuration` - Transition duration
- `transitionTimingFunction` - Transition timing function
- `transitionDelay` - Transition delay

**Animation** (subsection):
- `animationName` - Animation name/keyframes
- `animationDuration` - Animation duration
- `animationTimingFunction` - Animation timing function
- `animationDelay` - Animation delay
- `animationIterationCount` - Number of iterations
- `animationDirection` - Animation direction
- `animationFillMode` - Animation fill mode
- `animationPlayState` - Animation play state

**Transform** (subsection):
- `transformTranslate` - Translation transforms
- `transformRotate` - Rotation transforms
- `transformScale` - Scale transforms
- `transformSkew` - Skew transforms
- `transformMatrix` - Matrix transforms
- `transformOrigin` - Transform origin point
- `transformStyle` - Transform style (flat, preserve-3d)

**Perspective** (subsection):
- `perspective` - 3D perspective distance
- `perspectiveOrigin` - Perspective origin point
- `backfaceVisibility` - Backface visibility

---

### Data (To be implemented)
Properties for data binding, validation, and loading states.

**Data Source** (subsection):
- `dataSource` - Data source configuration
- `dataFormat` - Data format specification
- `dataBinding` - Data binding configuration

**Validation** (subsection):
- `dataValidationRequired` - Required field validation
- `dataValidationPattern` - Pattern validation
- `dataValidationMin` - Minimum value validation
- `dataValidationMax` - Maximum value validation

**Loading States** (subsection):
- `dataLoadingLoading` - Loading state indicator
- `dataLoadingError` - Error state indicator
- `dataLoadingEmpty` - Empty state indicator

---

## Property Merging

`mergeProperties` in `properties/helpers/merge-properties.ts` merges **two** property snapshots. Pass the earlier/base object first and the newer patch second. Optional `mergeSubProperties` (default `true`) controls whether facet maps (e.g. `margin`, `font`, `position`) and layered stacks (`background`, `gradient`, `shadow`) merge field-by-field or slot-by-slot instead of replacing whole values.

```typescript
import { mergeProperties } from "@seldon/core/properties"

const merged = mergeProperties(schemaDefaults, variantOverrides, {
  mergeSubProperties: true,
})

// Combine more than two sources by chaining:
const withInstance = mergeProperties(merged, instanceOverrides)
```

Workspace pipelines typically reduce **an** ordered list (defaults → variant → instance, and so on) with repeated two-way merges.

### Workspace serialization

[`workspace.json`](../workspace/WORKSPACE.md) holds **raw authoring state** only: each node’s **`template`** (`catalog:{ComponentId}` or `node:{nodeId}`) and **`overrides`** (`Properties`). Effective merged properties and **`ValueType.COMPUTED`** resolution are produced by read-side selectors (for example `computeNodeProperties`); they are **not** persisted back into the file.

### Computed resolution (imports)

The main [`@seldon/core/properties`](./index.ts) barrel **does not** re-export the compute pipeline (to avoid import cycles). Use **`@seldon/core/properties/compute`** or **`@seldon/core`** for `computeProperties`, `getBasedOnValue`, per-function engines, and compute types. Behavior and path rules for computed values are documented in [`compute/PROPERTIES-COMPUTE.md`](./compute/PROPERTIES-COMPUTE.md).

---

## Validation Examples

```typescript
// ✅ Valid properties
const validProps: Properties = {
  color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
  font: {
    size: { type: ValueType.EXACT, value: { unit: "rem", value: 1.5 } },
  },
}

// ❌ TypeScript will catch invalid properties
const invalidProps: Properties = {
  color: { type: "invalid", value: "red" }, // Type error
  font: { size: { type: ValueType.EXACT, value: "large" } }, // Type error
}
```

---

## Type Safety

### Value Type Constraints
```typescript
// Restricted types with validation
type Restricted<T, R> = T & { restrictions?: R }

// Example: Column count with range validation
columns: Restricted<ColumnCountValue | EmptyValue, number>
// Restrictions: min: 1, max: 100
```

### Property Path Validation

**Authoritative path unions** live in [`types/property-keys.ts`](types/property-keys.ts) as `CompoundPropertyPath`, `ShorthandPropertyPath`, and `PropertyPath` (their union). They include every top-level key, compound facets (`border.*`, `font.*`, per-side borders, `position.*`), shorthand sides (`margin.*`, `padding.*`, `corners.*`), and layered paint facets with **bracket indices** in the type literal:

```typescript
// Abbreviated from `types/property-keys.ts` — see source for full definitions keyed by BorderCompound, FontCompound, etc.
export type CompoundPropertyPath =
  | PropertyKey
  | `border.${keyof BorderCompound & string}`
  | `borderTop.${keyof BorderCompound & string}`
  | `borderRight.${keyof BorderCompound & string}`
  | `borderBottom.${keyof BorderCompound & string}`
  | `borderLeft.${keyof BorderCompound & string}`
  | `font.${keyof FontCompound & string}`
  | `position.${keyof PositionValue & string}`
  | `background[${number}].${keyof BackgroundLayer & string}`
  | `gradient[${number}].${keyof GradientCompound & string}`
  | `shadow[${number}].${keyof ShadowCompound & string}`

export type ShorthandPropertyPath =
  | `margin.${keyof MarginValue & string}`
  | `padding.${keyof PaddingValue & string}`
  | `corners.${keyof CornersValue & string}`

export type PropertyPath = CompoundPropertyPath | ShorthandPropertyPath
```

**Runtime paths** used by `getBasedOnValue` and `findInObject` are **dot-separated only**: array indices are numeric path segments, not brackets. Use `background.0.color`, `shadow.0.offsetX`, not `background[0].color`.

### Theme Reference Validation
```typescript
// Many swatch and token paths use `Restricted<..., ThemeSwatchKey>` (etc.) so invalid
// `@…` strings are compile-time errors on those properties.
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" } // ✅ Valid where restricted
{ type: ValueType.THEME_CATEGORICAL, value: "@invalid.token" }  // ❌ Type error when the key is in a restricted union
```

---

## Performance Considerations

**Note:** The bullets below are **general engineering guidance** for systems that use properties heavily. They are not a guarantee that every optimization is implemented or measured inside this package.

### Optimization Strategies
1. **Minimize computed properties** - use only when necessary
2. **Cache resolved values** when possible
3. **Optimize property merging** for large workspaces
4. **Use efficient validation** for runtime checks

### Memory Management
1. **Reuse property objects** where possible
2. **Avoid deep cloning** of property structures
3. **Use immutable updates** for property changes
4. **Clean up unused properties** during workspace operations

---

## Error Handling

**Note:** This section describes **typical failure modes** at a product level (TypeScript, validation, theme resolution, compute). Specific error strings, logging hooks, or fallbacks depend on the caller and are not all implemented as APIs in `packages/core/properties`.

### Validation Errors
- **Invalid property structure** - TypeScript compilation errors
- **Invalid value types** - Runtime validation errors
- **Invalid theme references** - Theme resolution errors
- **Invalid computed properties** - Computation errors

### Graceful Degradation
- **Missing theme values** - Fallback to exact values
- **Invalid property values** - Use default values
- **Computation errors** - Fallback to parent values
- **Resolution failures** - Use platform defaults

### Debugging Support
- **Clear error messages** for invalid properties
- **Property resolution logging** for debugging
- **Theme reference validation** with helpful messages
- **Computation step logging** for complex properties

---

## Adding Properties to Core

This is a step-by-step process if you would like to introduce new properties to the codebase.

**1. Add to Properties Type**
Update `/packages/core/properties/types/properties.ts`:

```typescript
export type Properties = Partial<{
  // ... existing properties
  newProperty: Restricted<NewPropertyValue | EmptyValue, string>
}>
```

**2. Create Value Type**
Add to `/packages/core/properties/values/` (appropriate category):

```typescript
// /packages/core/properties/values/appearance/new-property.ts
// From `values/<segment>/file.ts` → two levels up to `properties/`, then the constants barrel:
import { ValueType } from "../../constants"
// Deeper files (e.g. `values/effects/gradients/foo.ts`) need one more `../` per folder:
// import { ValueType } from "../../../constants"
// Outside this package: `import { ValueType } from "@seldon/core/properties/constants"`

export interface NewPropertyValue {
  type: ValueType.EXACT
  value: string
  restrictions?: {
    allowedValues?: string[]
    maxLength?: number
  }
}
```

**3. Constants, catalog layout, and option enums**

- **`constants/shared/`** — `value-types.ts` (`ValueType`), `units.ts` (`Unit`), `computed.ts` (`ComputedFunction`), `empty.ts` (`EMPTY_VALUE`), `compound-properties.ts` (`PROPERTY_COMPOUND_CATALOG`, layered vs facet `nodeStorage`), `shorthand-properties.ts` (`PROPERTY_SHORTHAND_KEYS`). Updating compounds or shorthands usually touches these so merge/compute walk the node correctly.
- **`constants/property-display.ts`** — `PropertyDisplayCategory`, `PROPERTY_DISPLAY_ORDER`: source of truth for **inspector section** and **display order** of flattened catalog keys; keep in sync with [`schemas/data/property-schemas.ts`](./schemas/data/property-schemas.ts) when adding keys.
- **`constants/typography/font-families.ts`** — Google font family list used by typography.

Preset-like choices for a single property usually live **next to the value module** under `values/` (e.g. an `enum` or map co-exported with the value type and `PropertySchema`), not under a deep `constants/<category>/` tree.

```typescript
// Example: optional preset enum beside the value file
// /packages/core/properties/values/appearance/new-property.ts
export enum NewPropertyOption {
  OPTION1 = "option1",
  OPTION2 = "option2",
  OPTION3 = "option3",
}
```

**4. Update exports**
- Add `export * from "./<category>/new-property"` (or a targeted export) in **`values/index.ts`** in the right section. Root **`properties/index.ts`** already re-exports `./values`, so consumers get the new symbols from `@seldon/core/properties` without duplicating paths there.
- If you add or change something under **`constants/`**, export it from **`constants/index.ts`**.

**5. Add Tests**
Create test files following existing patterns:

```typescript
// /packages/core/properties/values/appearance/new-property.test.ts
import { describe, expect, it } from "bun:test"
import { NewPropertyValue } from "./new-property"
import { ValueType } from "../../constants"

describe("NewPropertyValue", () => {
  it("should create valid property value", () => {
    const value: NewPropertyValue = {
      type: ValueType.EXACT,
      value: "test-value"
    }
    
    expect(value.type).toBe(ValueType.EXACT)
    expect(value.value).toBe("test-value")
  })
})
```

---

## Licensing

License and contributor documents live at the **repository root** under [`docs/LICENSES/`](../../../docs/LICENSES/README-NOTICE.md) (full tree: `terminus/docs/LICENSES/`). Links in this section resolve from `packages/core/properties/` via `../../../docs/…`.

This project uses a **dual-licensing model**:

- **Noncommercial Use** → Licensed under the [PolyForm Noncommercial License](../../../docs/LICENSES/noncommercial/LICENSE)
- **Commercial Use** → Requires a paid license. See [Commercial License Options](../../../docs/LICENSES/commercial/COMMERCIAL-LICENSE-README.md)
- **Contributors** → Must follow [Contributing Guidelines](../../../docs/LICENSES/contributors/CONTRIBUTING.md) and sign the [Contributor License Agreement](../../../docs/LICENSES/contributors/CLA.md)

### Quick Links
- [Noncommercial License (default)](../../../docs/LICENSES/noncommercial/LICENSE)
- [Dual-License Terms](../../../docs/LICENSES/noncommercial/DUAL-LICENSE.md)
- [Commercial License – Overview](../../../docs/LICENSES/commercial/COMMERCIAL-LICENSE-README.md)
- [Commercial license terms (full text)](../../../docs/LICENSES/commercial/COMMERCIAL-LICENSE.md) — short-form/long-form **.docx** agreements are not stored in this repo; use the overview link or maintainers for executed templates.
- [CLA – Contributor License Agreement](../../../docs/LICENSES/contributors/CLA.md)

**Reminder:** If you are using this software in a business, SaaS product, or any commercial context, you **must obtain a commercial license**.

---

## Links

- [Official Website](https://seldon.digital)
- [Documentation](https://docs.seldon.digital)
- [Issues & Discussions](https://github.com/seldon/issues)
