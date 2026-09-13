/** How to assemble catalog and authored components. */
export const COMPOSITION_GUIDE = `Two ways to make a component.

add_component places a built-in from the catalog as its own board. Pass a catalog id from list_catalog_ids. Use this for screen, text, icon, image, frame, and other shipped pieces you want as-is.

create_authored_component creates a user-defined board with no catalog schema. This is the normal path for new UI. Pass a name, a level, and an optional rootKind of frame or container. The board key derives from the name. Root it, then fill it.

Levels control what may sit inside a parent:
- screen may contain anything
- module may contain modules, parts, elements, primitives, and frames
- part may contain parts, elements, primitives, and frames
- element may contain elements, primitives, and frames
- primitive has no children
- frame may appear anywhere

Build small authored components first. Compose them into larger ones. Do not author a whole page as one board.

Placing children:
- insert_component places the default catalog variant under an existing parent. It creates the catalog board if needed. For text that default is body. For a heading, display, or label, use insert_variant_instance with that variant node id from the create result or list_boards.
- insert_variant_instance places a specific variant under a parent. Use this to nest an authored component. Pass the variant node id, not the board key.
- add_variant adds another tree on a board. Use it for alternate states of a piece, and for each screen page.
- move_component and reorder_component rearrange existing instances.

Default catalog variants are locked. They accept set_properties. They reject insert, delete, reorder, and move. Authored roots you just created are not locked. Fill those directly.

Final screens:
- Add the catalog screen component once.
- Call add_variant before you insert any page content. Build the page on that user variant. Do not insert into component-screen-default.
- Call add_variant again for each extra page.
- Set screenWidth and screenHeight or they stay 600px and clip.
- Insert your modules and parts into each user screen variant.

Reuse before you duplicate. If a card already exists, insert another instance of it. Change one instance with set_properties scope instance. Change every instance with scope all on the source variant.
`
