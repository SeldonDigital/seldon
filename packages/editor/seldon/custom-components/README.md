# Custom Components

Hand-authored View components for the editor. They fill gaps the generated
`seldon/` components do not yet cover.

These are temporary placeholders. Each one should be replaced by a real
generated Seldon view over time. Keeping them here, behind the
`@seldon/components/custom-components` path, lets `app/` depend on a stable View
boundary so the swap to a generated component never touches application code.

## Rules

- Pure presentational. Props in, JSX out.
- No state, no data fetching, no side effects beyond rendering.
- Allowed imports: `react` and other views from `@seldon/components/*`.
- Do not import from `@app/*`, `@lib/*`, or `@seldon/core/*` runtime modules.
  Colors, data, styles, ids, and handlers arrive through props. Type-only
  imports from core are tolerated when a shared union has no local equivalent.

## Layout

- `primitives/` single-element building blocks.
- `icons/` custom icon value renderers.
- `controls/` interactive shells driven entirely by props.

Class-free positioned `div` wrappers, overlay visuals, and transient feedback are
app concerns, not View placeholders. They live under `app/` (for example
`app/overlays/` and `app/toaster/`), not here.
