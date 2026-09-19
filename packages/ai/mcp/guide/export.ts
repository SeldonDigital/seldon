/** How workspace_export writes framework code into the project. */
export const EXPORT_GUIDE = `workspace_export writes framework code into the project and returns the file list.

Pass framework such as react, vue, or html. Pass styles such as css-properties. Set write to false to list paths without writing.

Files land under the project root by default. Pass outputDir to nest them. The path is saved on the workspace so the next export matches.

Typical Vite and Next layout:
- components under src/sdn or components/sdn
- images under public/sdn
- generated code references /sdn/<name>

Images staged with set_image already live at public/sdn. Export leaves those /sdn paths alone. It does not copy them again.

render_preview is not an export. It returns a JPEG of a board or node from a live editor tab so you can check the design. Open the workspace in the editor first. Pass nodeId to capture one piece. Pass boardKey to capture a board the editor is not showing.

A capture never moves the user's selection, board, pan, or zoom.

Headless CLI and HTTP have no canvas. render_preview then returns a message instead of an image. Export still works.
`
