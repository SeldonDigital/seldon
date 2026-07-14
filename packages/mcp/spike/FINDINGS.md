# Factory-SSR spike — findings

Date: 2026-07-05 · Decides: Factory-SSR (`view_node` render pipeline) vs. the
bespoke HTML-assembler fallback

## Verdict: **GO** — Factory-SSR stands, the fallback assembler stays shelved.

`factory-ssr.spike.test.ts` proves the full pipeline in-process with zero disk
writes and zero Core/Factory changes:

1. build a workspace in memory (Text = primitive, Button = composite with
   icon/text children, ProductCard = deeper composite),
2. `exportWorkspace` in memory (`skipFormat: true`, tree-shaken icons),
3. bundle each generated component with esbuild against a **virtual
   filesystem** plugin over the export's `FileToExport[]` (~60 lines; resolves
   relative/absolute specifiers, `.tsx`/`.ts`/index candidates, CSS via the
   `empty` loader, binaries via `binary`),
4. evaluate the CJS bundle with a `require` shim providing only `react` and
   `react/jsx-runtime`,
5. `renderToStaticMarkup`, inlining `styles.css` into a full HTML document.

All three components render production markup: Button emits
`<button class="sdn-button">` with its icon child as a fully inlined `<svg>`;
ProductCard emits its image + nested frame tree.

## Measurements

- Whole suite (export of 3 boards + 3 esbuild bundles + 3 renders): ~450 ms
  after module import — comfortably inside the 500 ms budget for
  `format: "css"` once the export is cached per session.
- Inlined-CSS document weight: ~15 KB for ProductCard (mostly the shared
  stylesheet), body markup itself a few hundred bytes.

## Caveats for the `view_node` implementation

- **Exotic component exports.** Generated components may be `forwardRef`/
  `memo` wrappers — objects, not functions. Pass them to `createElement`
  as-is; don't type-check for `function`.
- **Default variants can render sparse.** Button's text child renders empty
  without props, so a default render shows only the icon. `view_node` should
  render *variants* (which carry authored content) and consider sample props —
  ties into the rendering defaults.
- **Remote asset references.** ProductCard's default image points at
  `https://static.seldon.app/…` and emits a `<link rel="preload">`. HTML/CSS
  formats are unaffected, but Playwright screenshots would fetch it —
  reconcile with the no-runtime-network rule (block or allow-list network in
  the browser context).
- **Externals must stay minimal.** Only `react` and `react/jsx-runtime` were
  needed. If Factory output ever imports more host modules, extend the shim
  deliberately; the virtual-fs plugin fails loudly on unknown specifiers by
  design (that's the teaching-error posture applied to ourselves).
