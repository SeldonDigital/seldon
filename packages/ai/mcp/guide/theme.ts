/** How to retune a workspace theme without hardcoding literals. */
export const THEME_GUIDE = `A theme is a bundle of tokens. Components reference tokens with @ paths. Swapping or overriding tokens retunes every node that points at them.

Call list_theme_tokens or search_theme_tokens to find paths. Call get_computed_theme to see resolved values.

Change one token with set_theme_override. Pass the theme id from the context, a path such as swatch.primary or fontSize.medium, and a value. Pass null to reset that token.

Retune the whole palette through colorHarmony. Set colorHarmony.parameters.baseColor on the theme. The dynamic swatches white, gray, black, primary, and swatch1 through swatch4 recompute from that base. Do not hand-author those eight colors.

Set spacing density for the whole theme with set_spacing_feel. Feels are breathe, spacious, cozy, compact, and tight. That scales spacing and size tokens together. For one node only, use nudge or set_properties.

Look tokens are compound recipes:
- @font.body, @font.heading
- @border.hairline, @border.none
- @shadow.moderate, @shadow.none
- @gradient.primary

@font.normal, @border.none, and @shadow.none clear every facet.

A workspace always keeps the seldon theme. Other stock themes are optional.

Prefer a token change when the same look should apply everywhere. Prefer set_properties on one node when the change is local.
`
