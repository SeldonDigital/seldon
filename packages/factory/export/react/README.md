# Factory React Export System

The Factory React Export System turns a Seldon workspace into a React component library. It generates one `.tsx` file per component variant, the CSS files, native primitives, icons, fonts, utilities, and a package README. Every text file gets a license header.

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
9. Add a license header to every string file with `insertLicense`.

Each generation step runs inside a `try/catch` so one failure does not stop the others.

## Directory Layout

The code is grouped by pipeline stage:

1. **Discovery** (`discovery/`) finds components to export and builds their JSON trees.
2. **Validation** (`validation/`) checks proposed children against the component schema.
3. **Generation** (`generation/`) builds interfaces, functions, props, and imports.
4. **Assets** (`assets/`) builds icons, fonts, images, and the icon index.
5. **Utilities** (`utils/`) holds shared helpers.

`constants.ts` defines the source markers. `format.ts` formats TypeScript.

## Discovery

**Components to export** (`discovery/get-components-to-export.ts`)
`getComponentsToExport` collects every variant on a component board, skips `Frame`, and maps each one to a `ComponentToExport`. It sets the output path from the pluralized component level, such as `components/buttons/Button.tsx`. It builds the JSON tree with `getJsonTreeFromChildren` and attaches the export config.

**JSON tree** (`discovery/get-json-tree-from-children.ts`)
`getJsonTreeFromChildren` walks the component children into a `JSONTreeNode` tree. It drops children with `display: EXCLUDE`, guards against circular references, numbers repeated component names, records the CSS class names per node, escapes text content, and resolves prop options for icons and HTML elements.

**Other discovery helpers**

- `get-component-name.ts` formats a component name from a node.
- `get-icon-component-name.ts` builds an icon component name from an icon id.
- `get-node-origin-chain.ts` traces the origin chain of a node for class names.
- `get-used-icon-ids.ts` collects the icon ids referenced in the workspace.
- `get-used-native-components.ts` finds the native primitives a workspace uses.
- `native-html-file-stem.ts` maps used elements to native file names.

## Validation

**Component props** (`validation/validate-component-props.ts`)
`validateComponentProps` splits proposed children into `validProps` and `invalidProps`. It matches each child against the active schema branch, the default tree or a selected schema variant. `Frame` allows any children. When the schema cannot be found, it treats all children as valid. `validateTreeNodeProps` and `validateExportedComponentProps` apply this to a tree node and to a component root.

## Generation

**Component files** (`generation/helpers/generate-component-files.ts`)
`generateComponentFiles` builds each component file. For each component it builds the JSX structure, then inserts the interface, the function, the default props, and the imports. When the config returns `iconMap`, it inserts the icon map. It formats the result.

**JSX structure** (`generation/preprocess/generate-jsx-structure.ts`)
`generateJSXStructure` returns the root JSX node and a map of prop names. It assigns prop names once with `assignPropNames` and carries them on each node. It marks invalid props and frames as conditional. When a child has only valid children, it passes the grandchildren as props instead of rendering them. `jsx-structure-to-string.ts` turns the structure into JSX text.

**Inserts** (`generation/inserts/`)

- `insert-interface.ts` writes the TypeScript interface that extends the right HTML element type.
- `insert-component-function.ts` writes the component function, its variable declarations, and its return statement.
- `insert-default-props.ts` writes the default prop objects.
- `insert-imports.ts` writes the imports. It walks the tree and the JSX structure, imports only the components and interfaces that render, resolves icon and native paths, and always imports `combineClassNames`.
- `insert-icon-map.ts` writes the icon map for components that return `iconMap`.
- `insert-license.ts` adds the license header.

**Shared generators** (`generation/shared/`)

- `assign-prop-names.ts` assigns one prop name per node.
- `generate-children-props.ts` builds the child prop fields for an interface.
- `generate-typescript-interface-base.ts` builds the interface base and generic types.
- `generate-react-component-return-statements.ts` builds the return statement, including icon maps and dynamic HTML elements.
- `generate-variable-declarations.ts`, `generate-props-spread.ts`, `generate-default-props.ts`, `generate-jsdoc-comment.ts`, and `get-conditional-prop-paths.ts` support these steps.

**Rendering strategy** (`generation/inline-components/`, `custom-components/`)
Two predicates classify a component:

- `isInlineComponent` is true when the component has a `Frame` as a direct child.
- `isCustomComponent` is true when the variant is a user variant and the component is not inline.
- Components that are neither inline nor custom are default components.

**Helpers** (`generation/helpers/`)

- `generate-frame-component.ts` writes the shared `Frame` component.
- `get-native-component-files.ts` reads the native primitive files for the used elements.
- `generate-readme-file.ts` writes the package README.

## Assets

- `assets/get-images-to-export.ts` finds the images a workspace uses.
- `assets/transform-image-paths.ts` rewrites absolute image paths to relative export paths.
- `assets/get-files-to-export-from-images-to-export.ts` reads image files for export.
- `assets/get-icons.ts` reads the icon component file for each used icon id, with a generated fallback for the default icon.
- `assets/generate-icon-index.ts` writes the icon index file.
- `assets/get-fonts-component.ts` writes the `Fonts` component. It emits font host links for remote families only when `options.enableRemoteFonts` is set.

## Utilities

- `utils/class-name.ts` provides class name helpers used during generation.
- `utils/generate-utility-file-contents.ts` writes the exported `utils/class-name.ts` file with `combineClassNames`.
- `utils/pluralize-level.ts` pluralizes a component level for output paths.
- `utils/transform-source.ts` appends or prepends content to a source string.
- `utils/case-utils.ts` and `utils/find-icon-path.ts` support naming and icon paths.

## Formatting

`format.ts` runs Prettier with the `typescript` parser and no semicolons. It runs twice so the import sort plugin puts each import on its own line. It honors a `skipFormat` option.

## Constants

`constants.ts` defines the `MARKERS` used during generation: remove-block markers and insertion points for the component body, before the component, and after the component.

## Generated Output

`exportReact` returns an array of `FileToExport`. The output is a component library grouped by level, plus `styles.css`, one theme file per theme, native primitives under `native-react/`, the `Frame` component, icons under `icons/`, the `Fonts` component, the `utils/class-name.ts` helper, image files, and a package README. Every component file holds a typed interface, a React function, CSS class wiring, and tree-shaken imports.

## Icons

Used icons come from two sources. `getUsedIconIds` collects icons referenced by components. The export also adds every icon enabled in the workspace icon sets, so a shipped icon set stays complete even when a component does not reference an icon.
