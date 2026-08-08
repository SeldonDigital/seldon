# Driving Seldon Components

Seldon generates the view layer. The components in `sdn` are
presentational. They bake in content and structure and receive behavior and data
through props and a `seldonRefs` map. They own no state, no data, and no effects.

Give that ownership to the code in your app that already holds state and renders
the view. Seldon's own dialogs put it in a `*Controller.vue` file,
so these rules call that role the controller. Your app may name it something else.
The requirement is only that the Seldon component stays presentational and gets
its data from whatever owns state in your app.

## Where this role lives

Use the place your app already keeps state. Common homes:

- A container or parent component that holds the state and renders the view.
- A hook or composable that owns the state, with a thin component that renders the
  view from it.
- A route or page loader that owns the data, with a client component that wires
  the view.
- A store such as Redux, Zustand, or Pinia, read through a wrapper that feeds the
  view.
- An MVC controller or an MVVM view model, when the app is built that way.

Do not tell the user to adopt MVC. Find where this app owns state, and drive the
view from there.

## When logic and views are mixed today

Keep the Seldon component itself presentational. You cannot add state or data
fetching inside the generated tree, because Seldon rewrites it on every export.
Put that logic in the nearest owner the app already has, and pass values in. A
small wrapper beside the view is enough. Do not fork the generated files to hold
state.

## Refs over prop order

A composed component nests many slots. Addressing them by position is brittle.
Drive any node by its stable ref name through a single `seldonRefs` map. Each
referenced node carries a `data-seldon-ref` name, and the matching entry in the
map wins over the baked default and any positional prop.

```vue
<script setup lang="ts">
// Whatever owns state in your app, here a thin wrapper
const workspaceName = ref("")
function save() { /* ... */ }

// Drive nested nodes by ref name, not by slot position
const exportRefs = computed(() => ({
  exportWorkspaceName: { value: workspaceName.value, onChange: setName },
  exportConfirm: { onClick: save },
}))
</script>

<template>
  <DialogExport :seldon-refs="exportRefs" />
</template>
```

The view exposes `seldonRefs` when it has children. The names come from the
workspace and appear in `sdn/refs/index.ts`. Prefer this map over
matching the nested slot order.

## Author the map so it can be read

The bindings scanner in `sdn/scripts/` reads your `seldonRefs` map
from source without running it. Write the map so a static read sees every key:

- Author it as a plain object with fixed string keys. A `useMemo` or a Vue
  `computed` works only when its callback returns one object directly, as in
  `computed(() => ({ ... }))`.
- Do not build the map in a block body that returns a variable, in a loop, or with
  a computed key such as `refs[name + "Confirm"]`. Do not spread another object
  into it.
- Spell out every key. A key the scanner cannot read leaves that node unlinked in
  the bindings map, with no error, so the miss is silent.
- Values may be dynamic and may call a helper. Only the keys must be fixed.

## Naming a refs map

When you split refs into named maps, name each map after what it drives, such as
`rowRefs` or `headerRefs`. The bindings scan resolves a map by name and keeps the
first declaration, so two maps with the same name in one file collide. A bare
`seldonRefs` name is fine only when the file holds one map.

## Repeated rows

In a `v-for` row, read a per-row map or call a helper that
returns the row object. That keeps each row's values resolvable by the scanner.

## Record the bindings

After you wire the views, regenerate the bindings manifest so the ref-to-code map
stays current:

```sh
node sdn/scripts/generate-bindings.mjs
```

Run it with `--check` in continuous integration to fail on a stale manifest. See
`sdn/scripts/README.md` for the flags. This export baked in
Vue, so the script scans a Vue project.
