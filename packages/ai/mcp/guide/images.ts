/** How to place images so they render on the canvas and survive export. */
export const IMAGES_GUIDE = `Use set_image to put an image on a design.

The tool copies the file into the project's public/sdn folder and stores a path such as /sdn/hero.png. The editor canvas serves that folder at /sdn. An exported Vite or Next app serves public/ at the site root, so the same path works after workspace_export.

Pass a local file path or a data URL. Relative paths resolve from the project root. Optional name sets the filename under public/sdn.

With nodeId the tool also writes the property:
- slot source writes the Image component source. This is the default.
- slot background writes background layer 0 as kind image. The node will not paint the file unless kind is image.

Without nodeId the tool only stages the file and returns the /sdn path.

Never write a local filesystem path such as /Users/.../hero.png into source or background. The canvas cannot fetch it. Export cannot fetch it either.

Never write a raw data URL into source or background from set_properties. That bloats the workspace. Let set_image store the file and the short path.

Remote http or https URLs work as source values when the image is already public. Prefer set_image for files you generate or hold locally.

SvelteKit serves static files from static/, not public/. After export to SvelteKit, move the files or pass a matching assets folder.
`
