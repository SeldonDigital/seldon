# CSS Variables and Tokens

Seldon styles come from theme tokens, emitted as `--sdn-*` CSS variables. The
generated stylesheets set them, and the component classes read them. Style with
these variables. Never hardcode a raw value.

## Do not hardcode

Do not write a literal color, spacing, radius, border width, font size, or line
height. This holds in your own components too, not only in the generated tree.
Use the matching `--sdn-*` variable, or a Seldon class that already reads it. Pick
the nearest step on a scale rather than inventing a new value.

Build a translucent color with `color-mix` and a `--sdn-swatch-*` variable. Do
not write an `rgb()` or `rgba()` literal.

```css
color-mix(in srgb, var(--sdn-swatch-black) 35%, transparent)
```

Put SVG paint and width in a `style` object. A `var()` reference does not
resolve in a presentation attribute.

Some values have no token, such as `z-index` and `opacity`. Keep those numeric
and give each one a named constant.

## Token families

The variables group into families:

- `--sdn-sizes-*` element sizes
- `--sdn-paddings-*` padding steps
- `--sdn-margins-*` margin steps
- `--sdn-gaps-*` gap steps
- `--sdn-corners-*` corner radii
- `--sdn-border-width-*` border widths
- `--sdn-font-size-*` font sizes
- `--sdn-font-weight-*` font weights
- `--sdn-line-height-*` line heights
- `--sdn-swatch-*` colors

## Switching themes

Each theme ships as `sdn/styles/{slug}.css` and answers a
`[data-theme]` selector. Switch themes by setting the `data-theme` attribute on a
container, not by editing a generated stylesheet. The default `seldon` theme also
answers `:root`.

## Where the values live

Read `sdn/styles/` to see the variable names a theme defines. Do
not redefine a `--sdn-*` variable in your own CSS. Set the theme attribute and let
the generated stylesheet supply the values.

## Do not select generated classes

Do not write a selector, className, or query that uses a generated instance
class. Those names end with `--` and a short hash, such as `sdn-frame--zkmp`.
Do not select a shared generated class such as `sdn-dialog-settings` or
`sdn-dialog-about`. That name comes from a style match. It is not the component
name. A later export can merge, split, or rename it.

Select a node with a `data-seldon-ref` name, an app class you pass in, or a
role your controller sets. A class such as `.sdn-button` or `.sdn-bar` names a
component type. Use it only when every instance of that type should match.
