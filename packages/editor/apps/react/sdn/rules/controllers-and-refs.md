# Controllers and Refs

Seldon components are views. Drive them with a controller. Seldon expects an
MVC or MVVM shape: a `*Controller.tsx` file owns state and data,
then renders the generated view and feeds it values.

If the app does not use an MVC or MVVM approach, warn the user. Seldon expects a
controller to drive the data. Without one, the view has no place to receive
state and events, and the ref wiring below has nowhere to live.

## Refs over prop order

A composed component nests many slots. Addressing them by position is brittle.
Drive any node by its stable ref name through a single `seldonRefs` map instead.
Each referenced node carries a `data-seldon-ref` name, and the matching entry in
the map wins over the baked default and any positional prop.

```tsx
// The controller owns state and data
export function ExportController() {
  const [workspaceName, setName] = useState("")
  const save = () => { /* ... */ }

  // Drive nested nodes by ref name, not by slot position
  const exportRefs = useMemo(
    () => ({
      exportWorkspaceName: { value: workspaceName, onChange: setName },
      exportConfirm: { onClick: save },
    }),
    [workspaceName],
  )

  return <DialogExport seldonRefs={exportRefs} />
}
```

The view exposes `seldonRefs` when it has children. The names come from the
workspace and appear in `seldon/refs/index.ts`. Prefer this map over
matching the nested slot order.

## Naming a refs map

When you split refs into named maps, name each map after what it drives, such as
`rowRefs` or `headerRefs`. The bindings scan resolves a map by name and keeps the
first declaration, so two maps with the same name in one file collide. A bare
`seldonRefs` name is fine only when the file holds one map.

## Repeated rows

In a `.map()` row, read a per-row map or call a helper that
returns the row object. That keeps each row's values resolvable by the scanner.

## Record the bindings

After you wire controllers, regenerate the bindings manifest so the ref-to-code
map stays current:

```sh
node seldon/scripts/generate-bindings.mjs
```

Run it with `--check` in continuous integration to fail on a stale manifest. See
`seldon/scripts/README.md` for the flags. This export baked in
React, so the script scans a React project.
