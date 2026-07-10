# Seldon · Factory · React Export

Seldon's Factory React Export turns a Seldon workspace into a React component library. It generates one `.tsx` file per component variant, the CSS files, native primitives, icons, fonts, utilities, and a package README. Every text file gets a license header.

---

## Entry Point

`exportReact` in `export-react.ts` is the entry point.

```typescript
async function exportReact(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]>
```

`exportReact` runs these steps:

1. Build the export context with `buildExportContext` to get the parent index.
2. Build the CSS style registry with `buildStyleRegistry` from the CSS export.
3. Discover components with `getComponentsToExport`, then sort them by level.
4. Collect icon ids from `getUsedIconIds` and every icon enabled in the workspace icon sets.
5. Emit `styles.css` with `generateComponentStylesheet`.
6. Emit one theme file per theme with `generateThemeStylesheetFiles`.
7. Transform image paths to relative paths with `replaceImagesWithRelativePaths`.
8. Generate component files, native primitives, the Frame component, icons, the icon index, the Fonts component, the package README, utility files, and image files.
9. Generate the `refs/index.ts` registry with `generateRefsRegistry`. It is emitted only when at least one node carries a ref.
10. Add a license header to every string file with `insertLicense`, then run a final Prettier pass over each source file so the output stays formatted.

Each generation step runs inside a `try/catch` so one failure does not stop the others.

---

## Directory Layout

The code is grouped by pipeline stage:

1. **Discovery** (`discovery/`) finds components to export and builds their JSON trees.
2. **Validation** (`validation/`) checks proposed children against the component schema.
3. **Generation** (`generation/`) builds interfaces, functions, props, and imports.
4. **Assets** (`assets/`) builds icons, fonts, images, and the icon index.
5. **Utilities** (`utils/`) holds shared helpers.

`constants.ts` defines the source markers. `format.ts` formats TypeScript.

---

## Discovery

**Components to export** (`discovery/get-components-to-export.ts`)
`getComponentsToExport` collects every variant on a component board, skips `Frame`, and maps each one to a `ComponentToExport`. It sets the output path from the pluralized component level, such as `elements/Button.tsx`. It builds the JSON tree with `getJsonTreeFromChildren` and attaches the export config.

**JSON tree** (`discovery/get-json-tree-from-children.ts`)
`getJsonTreeFromChildren` walks the component children into a `JSONTreeNode` tree. It drops children with `display: EXCLUDE`, guards against circular references, numbers repeated component names, records the CSS class names per node, escapes text content, and resolves prop options for icons and HTML elements. Icon prop options include every icon enabled in the workspace icon sets, so the generated `IconProps["icon"]` union covers every exported icon.

**Other discovery helpers**

| File | Role |
| --- | --- |
| `get-component-name.ts` | Formats a component name from a node |
| `get-icon-component-name.ts` | Builds an icon component name from an icon id |
| `get-node-origin-chain.ts` | Traces the origin chain of a node for class names |
| `get-used-icon-ids.ts` | Collects the icon ids referenced in the workspace |
| `get-used-native-components.ts` | Finds the native primitives a workspace uses |
| `native-html-file-stem.ts` | Maps used elements to native file names |

---

## Validation

**Component props** (`validation/validate-component-props.ts`)
`validateComponentProps` splits proposed children into `validProps` and `invalidProps`. It matches each child against the active schema branch, the default tree or a selected schema variant. `Frame` allows any children. When the schema cannot be found, it treats all children as valid. `validateTreeNodeProps` and `validateExportedComponentProps` apply this to a tree node and to a component root.

---

## Generation

**Component files** (`generation/helpers/generate-component-files.ts`)
`generateComponentFiles` builds each component file. For each component it builds the JSX structure, then inserts the interface, the function, the default props, and the imports. When the config returns `iconMap`, it inserts the icon map. It formats the result.

**JSX structure** (`generation/preprocess/generate-jsx-structure.ts`)
`generateJSXStructure` returns the root JSX node and a map of prop names. It assigns prop names once with `assignPropNames` and carries them on each node. Every non-frame child renders behind a guard. A schema-valid child guards on its merged props variable not being `null`, so it renders by default and disappears when the caller passes `null`. An invalid child guards on its prop being passed, so it renders only when the caller provides it. A frame is conditional only when it is an invalid prop. When a child has only valid children, it passes the grandchildren as props instead of rendering them. `jsx-structure-to-string.ts` turns the structure into JSX text.

---

**Inserts** (`generation/inserts/`)

| File | Role |
| --- | --- |
| `insert-interface.ts` | Writes the TypeScript interface that extends the right HTML element type |
| `insert-component-function.ts` | Writes the component function, its variable declarations, and its return statement |
| `insert-default-props.ts` | Writes the default prop objects |
| `insert-imports.ts` | Writes the imports. It walks the tree and the JSX structure, imports only the components and interfaces that render, resolves icon and native paths, and always imports `combineClassNames` |
| `insert-icon-map.ts` | Writes the icon map for components that return `iconMap`. The map stays total over the `IconProps["icon"]` union. Ids without a catalog file map to `IconDefault` |
| `insert-license.ts` | Adds the license header |

---

**Shared generators** (`generation/shared/`)

| File | Role |
| --- | --- |
| `assign-prop-names.ts` | Assigns one prop name per node |
| `generate-children-props.ts` | Builds the child prop fields for an interface. Every field is optional and accepts `null` to suppress its element |
| `generate-typescript-interface-base.ts` | Builds the interface base and generic types |
| `generate-react-component-return-statements.ts` | Builds the return statement, including icon maps and dynamic HTML elements |
| `generate-variable-declarations.ts` | Declares the merged props variable per node. The variable resolves to `null` when the caller passes `null`, so suppression flows into grandchildren passed as props |
| `generate-props-spread.ts` | Builds the function signature. Schema children get an `sdn` default. Invalid children get no default |
| `generate-default-props.ts` | Builds the `sdn` default object. Invalid children contribute no defaults |
| `generate-jsdoc-comment.ts` | Generates the JSDoc comment with intent, tags, type, and a usage example |
| `get-conditional-prop-paths.ts` | Collects the node paths of invalid children that render conditionally |
| `data-ref-attr.ts` | Emits a node's reference handle as a `data-seldon-ref` JSX attribute. Returns an empty string when the node has no ref |

---

**Component type label** (`generation/inline-components/`, `custom-components/`)
Two predicates classify a component for the `Type` line in the generated JSDoc. They do not change how a component renders:

| Type | Predicate | Condition |
| --- | --- | --- |
| Inline | `isInlineComponent` | The component has a `Frame` as a direct child |
| Custom | `isCustomComponent` | The variant is a user variant and the component is not inline |
| Default | none | Neither predicate is true |

---

**Helpers** (`generation/helpers/`)

| File | Role |
| --- | --- |
| `generate-frame-component.ts` | Writes the shared `Frame` component |
| `get-native-component-files.ts` | Reads the native primitive files. Stems come from the `htmlElement` values on workspace nodes and from each exported component's `exportConfig.react.returns` when it names an HTML wrapper. It always includes `HTML.Div` for the Frame |
| `generate-readme-file.ts` | Writes the package README, including the child prop contract |

---

## Assets

| File | Role |
| --- | --- |
| `assets/get-images-to-export.ts` | Finds the images a workspace uses |
| `assets/transform-image-paths.ts` | Rewrites absolute image paths to relative export paths |
| `assets/get-files-to-export-from-images-to-export.ts` | Reads image files for export |
| `assets/get-icons.ts` | Reads the icon component file for each used icon id. It resolves each id to a catalog file with `resolveIconExport`, skips ids that do not resolve with a warning, and generates the `IconDefault` component for the default icon |
| `assets/generate-icon-index.ts` | Writes the icon index file. It writes an export line only for icons that resolve to a catalog file and deduplicates by component name, so the index never references files that were not emitted |
| `assets/get-fonts-component.ts` | Writes the `Fonts` component. It emits font host links for remote families only when `options.enableRemoteFonts` is set |
| `assets/generate-refs-registry.ts` | Writes the `refs/index.ts` registry. It exports a `SeldonRef` string-literal union of every node ref and a `SELDON_REFS` map from ref to its component, node id, and class name. Returns `null` when no node carries a ref, so the file is only emitted when it has content |

---

## Utilities

| File | Role |
| --- | --- |
| `utils/class-name.ts` | Provides class name helpers used during generation |
| `utils/generate-utility-file-contents.ts` | Writes the exported runtime utility files: `utils/class-name.ts` (`combineClassNames`), `utils/apply-ref.ts` (`applyRef`), `utils/icon-registry.ts` (dynamic icon registry), and `utils/resize.ts` (framework-agnostic resize helpers) |
| `utils/pluralize-level.ts` | Pluralizes a component level for output paths |
| `utils/transform-source.ts` | Appends or prepends content to a source string |
| `utils/case-utils.ts` | Supports casing for generated names |
| `utils/find-icon-path.ts` | Resolves an icon id to its catalog component file |

---

## Formatting

`format.ts` runs Prettier on generated TypeScript. It runs twice so the import sort plugin puts each import on its own line. It honors a `skipFormat` option.

Prettier options come from one file: `export/export-prettier-config.ts`. Both the React formatter and the CSS formatter read it, so all exported files format the same way. To change how exports are formatted, edit that file. Its defaults match the Seldon repository so generated files land already formatted and do not churn on the next format pass.

The filename is not a name Prettier auto-discovers, so a consumer's own Prettier never applies it to their source. A consumer exporting into a differently formatted codebase edits `export-prettier-config.ts` to match their style.

After license insertion, `exportReact` runs a final Prettier pass over every emitted source file. This keeps verbatim template output, such as the utility files, formatted like the rest.

---

## Constants

`constants.ts` defines the `MARKERS` used during generation: remove-block markers and insertion points for the component body, before the component, and after the component.

---

## Generated Output

`exportReact` returns an array of `FileToExport`. The output is a component library grouped by level, plus `styles.css`, one theme file per theme under `styles/`, native primitives under `native-react/`, the `Frame` component, icons under `icons/`, the `Fonts` component, the runtime helpers under `utils/`, image files, and a package README. When any node carries a reference handle, it also emits a `refs/index.ts` registry. Every component file holds a typed interface, a React function, CSS class wiring, and tree-shaken imports.

Every child prop in a generated interface is optional and nullable. A schema child renders with its `sdn` defaults when the prop is omitted and does not render when the caller passes `null`. An invalid child renders only when the caller passes the prop.

A node with a reference handle renders a `data-seldon-ref` attribute carrying its ref. The emitted `refs/index.ts` exports a `SeldonRef` union and a `SELDON_REFS` map so app code can target those nodes by a type-safe ref name.

---

## Icons

Used icons come from two sources. `getUsedIconIds` collects icons referenced by components. The export also adds every icon enabled in the workspace icon sets, so a shipped icon set stays complete even when a component does not reference an icon.

`utils/find-icon-path.ts` resolves an icon id to its catalog component file with tolerant name matching. Icon file emission, the icon index, and the icon map all use the same resolution, so they stay consistent. Ids that do not resolve are skipped from the files and the index, and the icon map renders them through `IconDefault`.

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
