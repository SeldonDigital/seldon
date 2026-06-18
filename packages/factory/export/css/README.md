# Seldon · Factory CSS Export

Seldon's Factory CSS Export turns a Seldon workspace into CSS. It produces one component stylesheet and one theme stylesheet file per theme. The component stylesheet holds reset styles, base styles, and component classes. Each theme file holds the CSS custom properties for one theme.

---

## Entry Point

The React export drives the CSS pipeline. `exportReact` runs three steps:

1. Build the export context with `buildExportContext` to get the parent index.
2. Build the style registry with `buildStyleRegistry`.
3. Generate the component stylesheet with `generateComponentStylesheet` and the theme files with `generateThemeStylesheetFiles`.

`buildStyleRegistry` accepts a `forceRegeneration` flag. When set, every node gets a class even when its CSS is empty.

---

## Directory Layout

The code is grouped by pipeline stage:

1. **Discovery** (`discovery/`) builds the style registry and class names.
2. **Generation** (`generation/`) builds the component stylesheet and theme files.
3. **Utilities** (`utils/`) holds shared helpers.

`types.ts` defines `Classes` and `NodeIdToClass`.

---

## Discovery

**Style registry** (`discovery/get-style-registry.ts`)
`buildStyleRegistry` walks every workspace node and builds a CSS class for each one. It sorts nodes so defaults come first, then variants, then instances. For an instance that points to a template variant, it stores only the CSS that differs from the variant. It deduplicates classes that share the same CSS and the same catalog id. It skips nodes with empty CSS unless the node is a default variant, has a template source, or `forceRegeneration` is set. It records the tree depth of each node for cascade ordering. It returns `classes`, `nodeIdToClass`, `classNameToNodeId`, and `nodeTreeDepths`.

**Class names** (`discovery/get-class-name.ts`)
`getClassNameForNode` builds a class name from the node catalog id and type:

| Node type       | Class name                                                               |
| --------------- | ------------------------------------------------------------------------ |
| Default variant | `sdn-button`                                                             |
| Custom variant  | `sdn-button-iconic`                                                      |
| Instance        | `sdn-button-iconic--abc12`, the variant class plus a four-character hash |

---

## Generation

**Component stylesheet** (`generation/generate-css-stylesheet.ts`)
`generateComponentStylesheet` builds the component stylesheet. It inserts reset styles, then base styles, then component styles, then formats the result. It does not insert theme variables.

**Reset styles** (`generation/insert-reset-styles.ts`)
`insertResetStyles` inserts a CSS reset that handles box-sizing, margins, padding, and form elements for consistent cross-browser styling.

**Base styles** (`generation/insert-base-styles.ts`)
`insertBaseStyles` sets the base font size to `16px`, sets a default font family on `html` and `body`, and defines a `--hairline` variable with media query overrides for 2x, 3x, and 4x pixel ratios.

**Component styles** (`generation/insert-node-styles.ts`)
`insertNodeStyles` sorts the registry classes and appends them under a component styles header. Non-instance classes come before instance classes. Among non-instances, variant classes come first, then shallower tree depths, then alphabetical order. Empty rules are dropped.

**Theme files** (`generation/insert-theme-variables.ts`)
`generateThemeStylesheetFiles` writes one CSS file per entry in `workspace.themes`. When the workspace has no themes, it writes a single `seldon` file. Each file is a `:root` block of CSS custom properties for one theme, named `styles-{slug}.css`. The prefix is `--sdn-` for the `seldon` theme and `--sdn-{slug}-` for other themes. Tokens include core values, font families, the color system, swatches, sizes, margins, paddings, gaps, corners, font sizes, font weights, line heights, and border widths. `generateThemeStylesheet` builds the block for one theme.

**Theme slug** (`generation/get-theme-slug.ts`)
`getThemeSlug` maps a workspace theme id to a slug. The slug names both the theme file and its CSS variable prefix. A default theme slugs from its stock catalog id. A variant walks its template chain to the root default, prepends that slug, and appends its own label, such as `seldon-red`. A theme id without a workspace entry slugs from the id.

---

## Utilities

**Formatting** (`utils/format.ts`)
`format` runs Prettier with the CSS parser.

---

## Generated Output

The CSS pipeline produces:

| Field                 | Contents                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `componentStylesheet` | A formatted stylesheet with reset styles, base styles, and component classes                                                            |
| `themeStylesheets`    | An array of `ThemeStylesheetFile`. Each item has a `themeId`, a `path` under the components folder, and the CSS `content` for one theme |

---

## Theme Variable References

Component classes reference theme tokens through CSS custom properties. `buildStyleRegistry` resolves properties with `useThemeVariableReferences` enabled and passes the theme slug, so a class points at `--sdn-{slug}-` variables. The matching values live in the theme files. This keeps one set of component classes that can switch themes by swapping the theme file.

---

## Class Deduplication

`buildStyleRegistry` reuses a class when another node has the same CSS and the same catalog id. Deduplication stays within one component type, but it does cross variants of that component. When two variants of the same component resolve to identical CSS, the later variant reuses the earlier variant's class and emits no class of its own. This keeps the component stylesheet smaller. Consumers that reference class names by hand must resync after an export, because a style edit can merge or split classes.

---

## Cascade Ordering

`insertNodeStyles` orders classes so the cascade resolves correctly. Variant classes come before instance classes. Shallower nodes come before deeper nodes. Classes at the same depth fall back to alphabetical order.

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
