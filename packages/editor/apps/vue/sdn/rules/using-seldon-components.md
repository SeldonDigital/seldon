# Using Seldon Components

The components in `seldon` are Vue views. They are
presentational. Seldon bakes every piece of content, every icon, and the full
structure into each component as its `sdn` defaults. Your app supplies behavior
and data, not layout.

## Render and customize

Every component renders on its own with its defaults. Pass a typed prop to a
named slot to override that slot. Pass `null` to a slot to remove it.

```vue
<template>
  <!-- Renders with baked defaults -->
  <CardProduct />

  <!-- Override content on named slots -->
  <CardProduct
    :text-title="{ children: 'Premium Product' }"
    :button="{ onClick: buy }"
    :button2="null"
  />
</template>
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

Components live under their level folder inside `seldon`:
`primitives/`, `elements/`, `parts/`, `modules/`, `frames/`, and `screens/`.
Import from the level folder, not from a deep path inside a component.

## Accessibility

Keep `role` and `aria*` values coming from your controller. The view exposes
them as props. Do not hardcode accessibility values inside the generated tree.

See the generated `seldon/README.md` for the full prop reference.
