/** How property values, shapes, and set_properties work. */
export const PROPERTIES_GUIDE = `set_properties is the primary way to change how a node looks.

Values may be loose. A bare string or number becomes an exact value. A word such as primary or large resolves to a theme token. An @scope.key string becomes a theme reference.

Prefer theme tokens over literals:
- Color: @swatch.primary, @swatch.white, @swatch.black, @swatch.gray
- Type size: @fontSize.small, @fontSize.medium, @fontSize.large
- Spacing: @padding.compact, @margin.comfortable, @gap.tight
- Corners: @corners.small
- Looks: @font.body, @border.hairline, @shadow.moderate

Do not double the prefix. Write @fontSize.medium, never @fontSize.@fontSize.medium.

Shapes:
- Atomic: one value. Examples are color, gap, opacity, display.
- Compound: related facets under one key. Examples are border.color, font.size, board.width. Applying a preset writes every facet the preset defines and clears the rest.
- Shorthand: parallel sides or corners. Examples are margin.top, padding.left, corners.topLeft.
- Layered paint: background and shadow are arrays. Index 0 is the topmost layer. A gradient is a background layer with kind gradient, not a separate stack.

Value tags you may also pass in full:
- empty: unset, falls back to the default
- inherit: take the parent value on purpose
- exact: a literal
- option: a fixed choice such as fit or image
- theme.categorical: a named token such as @swatch.primary
- theme.ordinal: a scale step such as @fontSize.medium

EMPTY is unset. None is an explicit choice, such as gap none. Do not conflate them.

A property absent from a schema is not part of that component. Call get_component_vocabulary for the keys you may set. Call get_node_properties or get_computed_node to read current values.

Scope:
- Omit scope and the tool picks a local override.
- scope instance writes only this node.
- scope all writes the shared source so every instance follows.

nudge steps a concept up or down its theme scale. Use it for relative change. Use set_properties for an absolute value.

Alignment and layout:
- orientation sets row versus column.
- align sets how children sit on the cross axis.
- screenWidth and screenHeight on a screen default to 600px exact. Set them for a real page size.
- New boards fit their content.

Do not store an override that equals the template value. Reset then has nothing to fall back to.
`
