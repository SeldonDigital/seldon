# Seldon · Factory · HTML+CSS Export

Seldon's Factory HTML export turns a Seldon workspace into flattened HTML fragments and shared CSS. It writes one `.html` file per component variant. Each file is that variant's full tree as native tags. Nothing in a file includes another file.

---

## Entry Point

`exportHtml` in `export-html.ts` is the entry point.

```typescript
async function exportHtml(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]>
```

`exportHtml` runs these steps:

1. Build the export context with `buildExportContext` to get the parent index.
2. Rewrite image paths, then build the CSS style registry.
3. Discover components with `getComponentsToExport` and remap paths to `.html`.
4. Emit `styles.css` and one theme file per theme.
5. Walk each variant tree into a flattened fragment.
6. Emit the refs registry when nodes carry refs, `fonts.html`, the package README, and image files.
7. Add an HTML comment license to each `.html` file, then format with Prettier's `html` parser.

The picker label is HTML+CSS. The platform id is `html`.

---

## Fragment Contract

A fragment is inner markup only. It is not a full document.

A card fragment already contains its buttons. A screen fragment already contains its cards. Concatenate fragments as siblings to assemble a new page. Do not nest one fragment file inside another.

Wrap chosen fragments in a document that links `styles.css` and each `styles/{slug}.css` file. Copy font links from `fonts.html` when remote fonts are on.

---

## Discovery

`discovery/get-components-to-export.ts` reuses the React discovery IR and remaps `.tsx` to `.html`. Display rules match the other targets. Exclude and Mock stay out unless `includeHiddenComponents` is on. Stub emits an empty element.

---

## Generation

| File | Role |
| --- | --- |
| `generation/generate-html-fragment.ts` | Walks a `JSONTreeNode` tree into native tags, classes, text, attributes, refs, and inline SVG icons |
| `generation/generate-component-files.ts` | Writes one fragment per variant and collects ref slot data |
| `generation/generate-readme-file.ts` | Writes the package README |

The Icon primitive is not emitted as its own file. Each use inlines SVG from `getIconData`.

---

## Assets

`assets/get-fonts-snippet.ts` writes `fonts.html` from `export/shared/collect-remote-font-urls.ts`. Remote families emit links only when `enableRemoteFonts` is set.

Images and CSS come from the shared pipelines used by React and Vue.

---

## Formatting

`format-html.ts` runs Prettier's `html` parser. It honors `skipFormat` and `formatConfigRoot`.
