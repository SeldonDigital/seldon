# Seldon · Computed Properties

Some property values should not be frozen. They should react to their surroundings. A button sizes its text to the control. A label turns black or white so it stays readable on whatever sits behind it. A border matches the fill it wraps. Computed properties capture these reactions as small rules instead of fixed values.

A computed property stores the name of a rule, not an answer. At compute time each rule reads the current node, its ancestors, and the active theme, then produces a concrete value. Change the surface or swap the theme, and every dependent value follows. This folder holds the compute functions that turn each `ValueType.COMPUTED` value on a merged `Properties` object into a resolved, tagged value.

---

## Pipeline

`computeProperties` walks one properties object and resolves every computed value. It takes the merged properties and a `ComputeContext`. The context holds this node's properties, an optional parent context, and the resolved theme. The walk copies plain values through and sends each computed value to `dispatchComputed`.

`dispatchComputed` reads the stored function key and calls the matching compute function:

- `AUTO_FIT` calls `computeAutoFit`.
- `HIGH_CONTRAST_COLOR` calls `computeHighContrastColor`.
- `OPTICAL_PADDING` calls `computeOpticalPadding`.
- `MATCH_COLOR` calls `computeMatchColor`.

The walk handles three shapes. Top-level atomic cells resolve directly. Object facet maps such as `border`, `font`, and `margin` resolve each facet. Layered paint arrays such as `background` and `shadow` resolve each layer through `computeLayeredPaintStack`.

A computed schema entry stores only the function. It does not author a `basedOn` path or a `factor`.

```typescript
buttonSize: { type: ValueType.COMPUTED, value: ComputedFunction.AUTO_FIT }
```

Each compute function derives its own source at compute time. The editor and an AI agent resolve the same stored value the same way.

---

## Context And Sources

`ComputeContext` is the argument to every compute function.

```typescript
export type ComputeContext = {
  properties: Properties
  parentContext: ComputeContext | null
  theme: Theme
  layoutMode?: LayoutMode
}
```

`computeNodeProperties` at `@seldon/core/workspace/compute` builds this context for a workspace node. It merges schema defaults, template overrides, and instance overrides. It resolves the effective theme from the node or its nearest ancestor. It then calls `computeProperties`. A variant root has no composition parent, so its parent context comes from the owning board. This backs every root against the board surface for the canvas, the editor, and export. Results stay in memory. They are not written to the workspace file.

Compute functions read source values through `getBasedOnValue`. A `basedOn` path uses one of three anchors:

- `#` reads the current node.
- `#parent.` reads the immediate parent.
- `#self.` reads the current node with a parent fallback.

`parseBasedOnPath` splits a path into its anchor and a layer-0-anchored lookup path. It maps a schema-style paint path such as `background.color` to the runtime path `background.0.color`.

`resolveBasedOnWithAnchor` walks the parent chain. A `#parent.` path walks up while the hit is missing, `EMPTY`, `INHERIT`, or explicit `transparent`. A `#self.` path reads the node first. When the node's own value does not contribute, it falls back to the same parent walk. A background layer with `kind: none` does not contribute even when its `color` facet still carries a leftover swatch.

Compute functions read their tunable values from the theme Computed groups, not from the schema:

- `autoFit.parameters.factor`
- `opticalPadding.parameters.{leftRhythm, rightRhythm, verticalRhythm}`
- `highContrast.parameters.{contrastRatio, fallbackColor, includeBleed}`
- `matchColor.parameters.{includeBrightness, includeOpacity}`
- the `modulation` ratio and base sizes

---

## Auto Fit

Auto Fit scales a size from an ancestor size token. `resolveAutoFitSource` walks the ancestor chain and returns the first usable value. It reads `buttonSize` first, then `size`. It falls back to the `@fontSize.medium` theme ordinal when neither appears. Auto Fit sits on a child, so the walk starts at the parent.

```typescript
export function resolveAutoFitSource(context: ComputeContext): AtomicValue {
  let cursor: ComputeContext | null = context.parentContext
  while (cursor) {
    const buttonSize = findInObject<Value>(cursor.properties, "buttonSize")
    if (isUsableSize(buttonSize)) {
      return buttonSize
    }
    const size = findInObject<Value>(cursor.properties, "size")
    if (isUsableSize(size)) {
      return size
    }
    cursor = cursor.parentContext
  }
  return AUTO_FIT_FALLBACK
}
```

`computeAutoFit` reads `theme.autoFit.parameters.factor` and multiplies the source by it. It supports an `EXACT` number, an `EXACT` length with a unit, and a `@fontSize` or `@size` theme ordinal. A theme ordinal resolves through `getThemeOption` and `modulate` against the theme modulation base and ratio. An unsupported source degrades to `EMPTY`, so an unresolved input never breaks compute or export.

```typescript
const factor = context.theme.autoFit.parameters.factor
const basedOnValue = resolveAutoFitSource(context)

if (basedOnValue.type === ValueType.EXACT) {
  if (typeof basedOnValue.value === "number") {
    return { ...basedOnValue, value: round(basedOnValue.value * factor) }
  }
}
```

---

## High Contrast

High Contrast picks a readable foreground swatch for a background surface. `resolveHighContrastSource` returns the fixed source `#self.background.color`. The `#self.` anchor reads the node's own background first. It walks ancestors while the layer is empty or transparent. A node without its own background contrasts against the nearest painting ancestor.

```typescript
export function resolveHighContrastSource(): string {
  return "#self.background.color"
}
```

`computeHighContrastColor` resolves the surface color through the theme. It reads sibling `brightness` and `opacity` on the layer where the color walk stopped. It applies them to the surface. It then calls `resolveHighContrastForeground`. When the path misses or resolves to an empty or transparent color, the surface falls back to `theme.highContrast.parameters.fallbackColor`.

`resolveHighContrastForeground` is the theme-parameterized core. It reads `contrastRatio` and `includeBleed`. It picks white or black from the surface luminance against the contrast ratio. With bleed on, it returns the theme's `@swatch.white` or `@swatch.black`, which carry the hue bleed. With bleed off, it builds a neutral white or black from the color harmony white and black points with zero saturation. The factory export shares this function, so a theme bakes its own answer per surface.

```typescript
export function resolveHighContrastForeground(surface, theme) {
  const { contrastRatio, includeBleed } = theme.highContrast.parameters
  const useWhite = isDarkBackgroundColor(surface, contrastRatio)

  if (includeBleed) {
    const themeOption = getThemeOption(
      useWhite ? "@swatch.white" : "@swatch.black",
      theme,
    )
    return themeSwatchToColorValue(themeOption)
  }

  const harmony = theme.colorHarmony.parameters
  return {
    type: ValueType.EXACT,
    value: {
      hue: 0,
      saturation: 0,
      lightness: useWhite ? harmony.whitePoint : harmony.blackPoint,
    },
  }
}
```

A root node with no parent context computes against the fallback surface and returns the theme black swatch.

---

## Optical Padding

Optical Padding tunes an element's own padding to its own size token. `resolveOpticalPaddingSource` derives the source from self first. It reads `#buttonSize`, then `#font.size`. It falls back to `#parent.fontSize` when neither is set. The parent fontSize is a safety net.

```typescript
export function resolveOpticalPaddingSource(context: ComputeContext): string {
  const properties = context.properties as Record<string, unknown>

  if (hasValue(properties.buttonSize)) {
    return "#buttonSize"
  }

  const font = properties.font as Record<string, unknown> | undefined
  if (font && hasValue(font.size)) {
    return "#font.size"
  }

  return "#parent.fontSize"
}
```

`computeOpticalPadding` reads the padding side from `keys.subPropertyKey`. It maps the side to a rhythm from `theme.opticalPadding.parameters`. The `left` and `right` sides use their own rhythm. The `top` and `bottom` sides use `verticalRhythm`. A missing side defaults to `leftRhythm`. It multiplies the resolved source by that rhythm. It supports an `EXACT` number, an `EXACT` length with a unit, and a `@fontSize` theme ordinal. An `@fontSize` ordinal resolves through `getThemeOption` and `modulate`. An unresolved or unsupported source degrades to `EMPTY`.

```typescript
function getRatio(side, rhythm) {
  switch (side) {
    case "left":
      return rhythm.leftRhythm
    case "right":
      return rhythm.rightRhythm
    case "top":
      return rhythm.verticalRhythm
    case "bottom":
      return rhythm.verticalRhythm
    default:
      return rhythm.leftRhythm
  }
}
```

---

## Match Color

Match Color sets a color facet from a color in the node's own background chain. `resolveMatchColorSource` returns the fixed source `#self.background.color`. The `#self.` anchor walks ancestors while the layer is empty or transparent until a contributing color appears.

```typescript
export function resolveMatchColorSource(): string {
  return "#self.background.color"
}
```

`computeMatchColor` returns the matched color for a normal target. A border color target returns `transparent` instead. CSS paints the fill under the border, so a same-color border would composite over the fill and darken at reduced opacity. A transparent border lets the fill show through, so it blends at every opacity and stays identical at full opacity. An unresolved source degrades to `EMPTY`. A source that still resolves to a `COMPUTED` value also degrades to `EMPTY`.

```typescript
export function computeMatchColor(value, context, keys) {
  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(resolveMatchColorSource(), context)
  } catch (error) {
    if (error instanceof InvariantError) throw error
    return EMPTY_VALUE
  }

  if (basedOnValue.type === ValueType.COMPUTED) {
    return EMPTY_VALUE
  }

  if (isBorderColorTarget(keys)) {
    return TRANSPARENT_VALUE
  }

  return basedOnValue
}
```

`applyMatchColorMirror` handles the sibling `brightness` and `opacity`. It runs after each compound, layer, and top-level color group resolves. When a color facet resolves to Match Color, the mirror copies the matched source layer's `brightness` and `opacity` onto the resolved facets. Two theme toggles gate it. `theme.matchColor.parameters.includeBrightness` and `includeOpacity` each turn one facet on. A facet the container does not expose is skipped, so the mirror never injects a property the schema did not declare.

---

## Notes

- Import from `@seldon/core/properties/compute` or `@seldon/core`. The main `properties` barrel omits compute to avoid import cycles.
- `COMPUTED_FUNCTION_DISPLAY_NAMES` maps each `ComputedFunction` to its editor label. Compute pickers, property formatting, and value stringification read it.
- Pass `{ stage: "effective" }` to `computeNodeProperties` to stop after merge and before computed resolution. The properties UI uses that mode for editor status.

---

## Related Docs

- [Properties](../README.md)

---

## Licensing

License and contributor documents live at the repository root under [`license/`](../../../../license/README.md). Links in this section resolve from `packages/core/properties/compute/` via `../../../../license/…`.

This project is licensed as follows:

- **Noncommercial Use** → Licensed under the [PolyForm Noncommercial License](../../../../license/noncommercial/LICENSE.md)
- **Commercial Use** → Requires a separate paid license. See [Commercial License](../../../../license/commercial/COMMERCIAL-LICENSE.md)
- **Contributors** → Must follow [Contributing Guidelines](../../../../license/contributors/CONTRIBUTING.md) and sign the [Contributor License Agreement](../../../../license/contributors/CLA.md)

### Quick Links

- [License index](../../../../license/README.md)
- [Noncommercial License (default)](../../../../license/noncommercial/LICENSE.md)
- [Licensing overview](../../../../README.md#licensing)
- [Commercial license terms (full text)](../../../../license/commercial/COMMERCIAL-LICENSE.md)
- [CLA – Contributor License Agreement](../../../../license/contributors/CLA.md)
- [Official repository notice](../../../../license/NOTICE.md)

**Reminder:** If you use this software in a business, SaaS product, or any commercial context, you **must obtain a commercial license**.

---

## Links

- [Core](../../README.md)
- [Factory](../../../factory/README.md)
- [Editor](../../../editor/README.md)
- [Official Website](https://seldon.digital)
- [Issues & Discussions](https://github.com/seldon/issues)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
