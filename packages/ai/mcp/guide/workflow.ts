/** One-shot build order from an empty workspace. */
export const WORKFLOW_GUIDE = `Build a design from the bottom up.

Call list_boards and get_design_guide as you go. Do not invent catalog ids. Call list_catalog_ids when you need one.

1. Create a workspace with workspace_create if the store is empty. Pin it with workspace_select.
2. Author the small pieces first. A button, a card, a nav item, a footer block. Prefer create_authored_component. The catalog is thin. Use add_component only when a built-in already fits, such as text, icon, image, frame, or screen.
3. Fill each authored board. Select its default variant. Insert catalog primitives with insert_component. Nest other authored boards with insert_variant_instance and the variant node id from list_boards or find_nodes.
4. Compose upward. Parts contain elements. Modules contain parts. Screens contain modules and parts.
5. Final pages are user variants of the catalog screen component. Call add_component with catalog id screen. Then call add_variant before you insert anything. The default screen is locked and rejects children. Build each page on a user variant. Set screenWidth and screenHeight. They default to 600px exact and will clip a wider page.
6. New boards fit their content. Do not pin a board width unless you need a device frame.
7. Put images on a node with set_image. Never write a local filesystem path or a raw data URL into source or background.
8. After each meaningful compose, call render_preview. Pass a nodeId to inspect one piece. It needs an editor tab with the workspace open.
9. Group a multi-step edit in begin_change and commit_change so it lands as one revision.
10. When the design is done, call workspace_export to write framework code into the project.

Hard rules:
- Edit only through write tools. Every write goes through the same pipeline the editor uses.
- Prefer theme tokens such as @swatch.primary and @fontSize.medium over hardcoded literals.
- A property absent from a component schema cannot be set. Call get_component_vocabulary before you guess.
- After a create or insert, use the ids in that result immediately. Do not call find_nodes for a node you just created.
- When the store holds several workspaces, pass targetWorkspaceId on every call.
- Call get_design_guide again for composition, properties, theme, images, or export.
`
