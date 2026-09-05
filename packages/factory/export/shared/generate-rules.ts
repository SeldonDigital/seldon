import { PLATFORMS, PLATFORM_LIST } from "../platforms/registry"

import type { ExportOptions, FileToExport, PlatformId } from "../types"

/**
 * Values every rule document reads. They come from the export target and the
 * platform registry, so the emitted rules track the framework this export baked
 * in and the platforms Seldon can generate today. Adding an available platform
 * to the registry updates the framework rule without touching this file.
 */
interface RulesContext {
  componentsFolder: string
  framework: PlatformId
  frameworkLabel: string
  isVue: boolean
  componentExtension: string
  availableLabels: string[]
  availableList: string
}

/**
 * Emits the copyable rule set into `<components>/rules/`. The documents guide an
 * IDE assistant working in the consuming repo: how to use the components, why
 * the folder is generated output, which framework the export targets, where the
 * code that drives the components lives, and how to use the CSS tokens.
 *
 * Rules ship with the scripts export, so `export-workspace` calls this from the
 * same `includeScripts` block. They are documentation the user copies and edits,
 * so they stay out of `scripts/INTEGRITY.json`.
 */
export function generateRules(options: ExportOptions): FileToExport[] {
  const context = buildContext(options)
  const folder = `${context.componentsFolder}/rules`

  // File names are prefixed with `seldon-` so they stay namespaced once copied
  // into a shared rules folder such as `.cursor/rules/`, where generic names
  // would collide with the user's own rules.
  return [
    { path: `${folder}/seldon-rules.md`, content: rulesReadme(context) },
    { path: `${folder}/seldon-using-components.md`, content: usingSeldonComponents(context) },
    {
      path: `${folder}/seldon-editing-components.md`,
      content: editingExportedComponents(context),
    },
    { path: `${folder}/seldon-framework-target.md`, content: frameworkTarget(context) },
    { path: `${folder}/seldon-driving-components.md`, content: controllersAndRefs(context) },
    { path: `${folder}/seldon-css-tokens.md`, content: cssVariablesAndTokens(context) },
  ]
}

function buildContext(options: ExportOptions): RulesContext {
  const framework = options.target.framework
  const isVue = framework === "vue"
  const availableLabels = PLATFORM_LIST.filter((platform) => platform.status === "available").map(
    (platform) => platform.label,
  )

  return {
    componentsFolder: options.output.componentsFolder,
    framework,
    frameworkLabel: PLATFORMS[framework]?.label ?? framework,
    isVue,
    componentExtension: isVue ? "vue" : "tsx",
    availableLabels,
    availableList: formatList(availableLabels),
  }
}

/** Joins labels into prose, such as `React and Vue` or `React, Vue, and Swift`. */
function formatList(labels: string[]): string {
  if (labels.length === 0) return "none"
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`

  const head = labels.slice(0, -1).join(", ")

  return `${head}, and ${labels[labels.length - 1]}`
}

function rulesReadme(context: RulesContext): string {
  const { componentsFolder, frameworkLabel } = context

  return `# Seldon Rules

Seldon generated these rules alongside the components in \`${componentsFolder}\`. They
are for the assistant in your IDE, so it works with the generated components the
way Seldon expects. They do nothing on their own. Copy the ones you want into
your own repo.

This export targets **${frameworkLabel}**.

## Install

Pick the place your assistant reads:

- Cursor: copy each file into \`.cursor/rules/\`, rename it to \`.mdc\`, and add front
  matter at the top. A rule that should always apply uses:

  \`\`\`
  ---
  description: Working with Seldon exported components
  globs:
  alwaysApply: true
  ---
  \`\`\`

- \`AGENTS.md\`: paste the contents under a heading in your \`AGENTS.md\`.

Keep them in your own tree, not inside \`${componentsFolder}\`. This folder is
regenerated on every export, so anything left here is overwritten. Each file is
prefixed with \`seldon-\`, so it stays separate from your own rules once copied.

## Files

- \`seldon-using-components.md\` how to render and customize the presentational
  components.
- \`seldon-editing-components.md\` why \`${componentsFolder}\` is generated output and
  what to change instead.
- \`seldon-framework-target.md\` the framework this export targets and when to warn
  about a mismatch.
- \`seldon-driving-components.md\` where the code that drives the components lives in
  your app, and how to wire nested nodes by ref name.
- \`seldon-css-tokens.md\` how to use the Seldon CSS variables and tokens.

## Refreshing

Re-export to refresh these rules. The framework and folder path are baked in at
export time, so a new export rewrites them to match your current setup.
`
}

function usingSeldonComponents(context: RulesContext): string {
  const { componentsFolder, frameworkLabel, isVue } = context

  const usageExample = isVue
    ? `\`\`\`vue
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
\`\`\``
    : `\`\`\`tsx
// Renders with baked defaults
<CardProduct />

// Override content on named slots, remove one with null
<CardProduct
  textTitle={{ children: "Premium Product" }}
  button={{ onClick: buy }}
  button2={null}
/>
\`\`\``

  return `# Using Seldon Components

The components in \`${componentsFolder}\` are the ${frameworkLabel} view layer. They are
presentational. Seldon bakes every piece of content, every icon, and the full
structure into each component as its \`sdn\` defaults. They hold no application
state, no data fetching, and no side effects. Your own code supplies behavior and
data, not layout. See \`seldon-driving-components.md\` for where that code lives.

## Render and customize

Every component renders on its own with its defaults. Pass a typed prop to a
named slot to override that slot. Pass \`null\` to a slot to remove it.

${usageExample}

## Slots and content

- A slot prop takes the same shape the underlying element accepts, such as
  \`{ children }\` for text or \`{ onClick }\` for an action.
- Passing \`null\` removes an optional element. Use it to drop a slot the design
  ships by default.
- Do not rebuild a component by hand. Compose the generated components and drive
  them from your own code.

## Icons

Icons render by id from the generated \`icons/\` set. Set an icon slot to the id
you want, such as \`{ icon: "material-star" }\`. Do not import raw SVG files.

## Imports

Components live under their level folder inside \`${componentsFolder}\`:
\`primitives/\`, \`elements/\`, \`parts/\`, \`modules/\`, \`frames/\`, and \`screens/\`.
Import from the level folder, not from a deep path inside a component.

## Accessibility

Keep \`role\` and \`aria*\` values coming from the code that drives the view. The
view exposes them as props. Do not hardcode accessibility values inside the
generated tree.

See the generated \`${componentsFolder}/README.md\` for the full prop reference.
`
}

function editingExportedComponents(context: RulesContext): string {
  const { componentsFolder, framework } = context

  return `# Editing Exported Components

Treat \`${componentsFolder}\` as generated output. Seldon rewrites this whole folder
on every export, so any hand edit here is lost the next time these components are
exported. This is true of the view files too, so behavior and data belong in your
own code, not inside the generated tree.

## Warn before editing

Before you change any file under \`${componentsFolder}\`, tell the user:

- The change is overwritten the next time these components are exported.
- The durable fix is to change the design in Seldon, then re-export.
- Who can do that depends on the project. If you have the Seldon Editor or a
  Seldon MCP server, use it. If you only have these generated files, ask whoever
  owns the design source to make the change.

Only edit inside \`${componentsFolder}\` when the user understands and accepts that
the edit is temporary.

## Never hand-edit these

- \`refs/index.ts\` and \`refs/registry.json\`. Seldon generates the ref registry.
- \`styles.css\` and \`styles/\`. Seldon generates the stylesheets from the theme.
- The generated component files. Change the design in Seldon, not the output.

## Where the design comes from

These components come from a Seldon workspace, a JSON file that holds the design.
How a project handles that file varies. Some keep it in the repo and re-export
from it. Others install the components from a package such as \`@seldon/terminus\`
and never see it. Either way, the design changes in Seldon, not by editing this
folder.

A workspace changes only through Seldon's typed actions, whether an editor or a
Seldon MCP server sends them. That is why a hand-patched JSON, or a hand-edited
file here, drifts from the design. Do not reproduce a design change that way.
Make the change in Seldon if you can, or ask whoever owns the source.

## Re-export when you own the source

If your project keeps the workspace JSON and has the Seldon CLI, regenerate the
components by pointing the exporter at that file:

\`\`\`sh
npx seldon-export --input path/to/workspace.json --platform ${framework}
\`\`\`

The \`seldon-export\` CLI ships with \`@seldon/factory\`, and \`@seldon/terminus\` and
\`@seldon/hari\` pull it in. Install one so the command is available:

\`\`\`sh
npm i -D @seldon/factory
\`\`\`

Add a script so a re-export is one command. Add \`--framework vite\` or
\`--framework next\` if your project uses that layout:

\`\`\`json
{
  "scripts": {
    "seldon:export": "seldon-export --input path/to/workspace.json --platform ${framework}"
  }
}
\`\`\`

Commit the workspace JSON if you keep it in the repo. If you run the Seldon Editor
locally, ignore its scratch store so backups and the live store stay out of the
repo:

\`\`\`gitignore
.seldon/workspaces/
.seldon/*.bak
\`\`\`

## Generated scripts

\`scripts/\` holds generated scanner code with \`scripts/INTEGRITY.json\` recording a
hash per file. Do not edit the scripts. Verify integrity before running them.
Your own rule files under \`rules/\` are not hashed, so copy them out and edit the
copies in your repo.
`
}

function frameworkTarget(context: RulesContext): string {
  const { componentsFolder, frameworkLabel, availableList, availableLabels } = context

  const otherAvailable = availableLabels.filter((label) => label !== frameworkLabel)
  const otherLine =
    otherAvailable.length > 0
      ? `Seldon can also export ${formatList(otherAvailable)}. If the user wants a
${formatList(otherAvailable)} app, tell them to re-export with that target rather
than porting these files by hand.`
      : `${frameworkLabel} is the only framework Seldon exports today.`

  return `# Framework Target

This export targets **${frameworkLabel}**. The components in \`${componentsFolder}\` are
${frameworkLabel} components.

Seldon exports these frameworks today: ${availableList}.

## Warn on a mismatch

A framework mismatch is different from an architecture question. The view layer
is framework-specific, so check the framework of the app you are working in and
compare it to the target.

- If the app is not ${frameworkLabel}, warn the user. ${frameworkLabel} components do
  not run in a different framework's app. Do not try to convert the generated
  files. Tell the user to re-export for their framework.
- If the app framework is none of ${availableList}, warn the user that Seldon does
  not export their framework yet, so these components will not run as-is.

${otherLine}
`
}

function controllersAndRefs(context: RulesContext): string {
  const { componentsFolder, frameworkLabel, isVue, componentExtension } = context

  const controllerExample = isVue
    ? `\`\`\`vue
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
\`\`\``
    : `\`\`\`tsx
// Whatever owns state in your app, here a container component
export function ExportContainer() {
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
\`\`\``

  const readableExample = isVue ? `computed(() => ({ ... }))` : `useMemo(() => ({ ... }), deps)`

  return `# Driving Seldon Components

Seldon generates the view layer. The components in \`${componentsFolder}\` are
presentational. They bake in content and structure and receive behavior and data
through props and a \`seldonRefs\` map. They own no state, no data, and no effects.

Give that ownership to the code in your app that already holds state and renders
the view. Seldon's own dialogs put it in a \`*Controller.${componentExtension}\` file,
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
Drive any node by its stable ref name through a single \`seldonRefs\` map. Each
referenced node carries a \`data-seldon-ref\` name, and the matching entry in the
map wins over the baked default and any positional prop.

${controllerExample}

The view exposes \`seldonRefs\` when it has children. The names come from the
workspace and appear in \`${componentsFolder}/refs/index.ts\`. Prefer this map over
matching the nested slot order.

## Author the map so it can be read

The bindings scanner in \`${componentsFolder}/scripts/\` reads your \`seldonRefs\` map
from source without running it. Write the map so a static read sees every key:

- Author it as a plain object with fixed string keys. A \`useMemo\` or a Vue
  \`computed\` works only when its callback returns one object directly, as in
  \`${readableExample}\`.
- Do not build the map in a block body that returns a variable, in a loop, or with
  a computed key such as \`refs[name + "Confirm"]\`. Do not spread another object
  into it.
- Spell out every key. A key the scanner cannot read leaves that node unlinked in
  the bindings map, with no error, so the miss is silent.
- Values may be dynamic and may call a helper. Only the keys must be fixed.

## Naming a refs map

When you split refs into named maps, name each map after what it drives, such as
\`rowRefs\` or \`headerRefs\`. The bindings scan resolves a map by name and keeps the
first declaration, so two maps with the same name in one file collide. A bare
\`seldonRefs\` name is fine only when the file holds one map.

## Repeated rows

In a \`${isVue ? "v-for" : ".map()"}\` row, read a per-row map or call a helper that
returns the row object. That keeps each row's values resolvable by the scanner.

## Record the bindings

After you wire the views, regenerate the bindings manifest so the ref-to-code map
stays current:

\`\`\`sh
node ${componentsFolder}/scripts/generate-bindings.mjs
\`\`\`

Run it with \`--check\` in continuous integration to fail on a stale manifest. See
\`${componentsFolder}/scripts/README.md\` for the flags. This export baked in
${frameworkLabel}, so the script scans a ${frameworkLabel} project.
`
}

function cssVariablesAndTokens(context: RulesContext): string {
  const { componentsFolder } = context

  return `# CSS Variables and Tokens

Seldon styles come from theme tokens, emitted as \`--sdn-*\` CSS variables. The
generated stylesheets set them, and the component classes read them. Style with
these variables. Never hardcode a raw value.

## Do not hardcode

Do not write a literal color, spacing, radius, border width, font size, or line
height. This holds in your own components too, not only in the generated tree.
Use the matching \`--sdn-*\` variable, or a Seldon class that already reads it. Pick
the nearest step on a scale rather than inventing a new value.

## Token families

The variables group into families:

- \`--sdn-sizes-*\` element sizes
- \`--sdn-paddings-*\` padding steps
- \`--sdn-margins-*\` margin steps
- \`--sdn-gaps-*\` gap steps
- \`--sdn-corners-*\` corner radii
- \`--sdn-border-width-*\` border widths
- \`--sdn-font-size-*\` font sizes
- \`--sdn-font-weight-*\` font weights
- \`--sdn-line-height-*\` line heights
- \`--sdn-swatch-*\` colors

## Switching themes

Each theme ships as \`${componentsFolder}/styles/{slug}.css\` and answers a
\`[data-theme]\` selector. Switch themes by setting the \`data-theme\` attribute on a
container, not by editing a generated stylesheet. The default \`seldon\` theme also
answers \`:root\`.

## Where the values live

Read \`${componentsFolder}/styles/\` to see the variable names a theme defines. Do
not redefine a \`--sdn-*\` variable in your own CSS. Set the theme attribute and let
the generated stylesheet supply the values.

## Do not select generated classes

Do not write a selector, className, or query that uses a generated instance
class. Those names end with \`--\` and a short hash, such as \`sdn-frame--zkmp\`.
Do not select a shared generated class such as \`sdn-dialog-settings\` or
\`sdn-dialog-about\`. That name comes from a style match. It is not the component
name. A later export can merge, split, or rename it.

Select a node with a \`data-seldon-ref\` name, an app class you pass in, or a
role your controller sets. A class such as \`.sdn-button\` or \`.sdn-bar\` names a
component type. Use it only when every instance of that type should match.
`
}
