# Using Seldon Components

The components in `sdn` are the React view layer. They are
presentational. Seldon bakes every piece of content, every icon, and the full
structure into each component as its `sdn` defaults. They hold no application
state, no data fetching, and no side effects. Your own code supplies behavior and
data, not layout. See `seldon-driving-components.md` for where that code lives.

## Render and customize

Every component renders on its own with its defaults. Pass a typed prop to a
named slot to override that slot. Pass `null` to a slot to remove it.

```tsx
// Renders with baked defaults
<CardProduct />

// Override content on named slots, remove one with null
<CardProduct
  textTitle={{ children: "Premium Product" }}
  button={{ onClick: buy }}
  button2={null}
/>
```

## Slots and content

- A slot prop takes the same shape the underlying element accepts, such as
  `{ children }` for text or `{ onClick }` for an action.
- Passing `null` removes an optional element. Use it to drop a slot the design
  ships by default.
- Do not rebuild a component by hand. Compose the generated components and drive
  them from your own code.

## Icons

Icons render by id from the generated `icons/` set. Set an icon slot to the id
you want, such as `{ icon: "material-star" }`. Do not import raw SVG files.

## Imports

Components live under their level folder inside `sdn`:
`primitives/`, `elements/`, `parts/`, `modules/`, `frames/`, and `screens/`.
Import from the level folder, not from a deep path inside a component.

## Accessibility

Keep `role` and `aria*` values coming from the code that drives the view. The
view exposes them as props. Do not hardcode accessibility values inside the
generated tree.

See the generated `sdn/README.md` for the full prop reference.
