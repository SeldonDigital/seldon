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
 * the folder is generated output, which framework the export targets, how a
 * controller drives data through refs, and how to use the CSS tokens.
 *
 * Rules ship with the scripts export, so `export-workspace` calls this from the
 * same `includeScripts` block. They are documentation the user copies and edits,
 * so they stay out of `scripts/INTEGRITY.json`.
 */
export function generateRules(options: ExportOptions): FileToExport[] {
  const context = buildContext(options)
  const folder = `${context.componentsFolder}/rules`

  return [
    { path: `${folder}/README.md`, content: rulesReadme(context) },
    { path: `${folder}/using-seldon-components.md`, content: usingSeldonComponents(context) },
    { path: `${folder}/editing-exported-components.md`, content: editingExportedComponents(context) },
    { path: `${folder}/framework-target.md`, content: frameworkTarget(context) },
    { path: `${folder}/controllers-and-refs.md`, content: controllersAndRefs(context) },
    { path: `${folder}/css-variables-and-tokens.md`, content: cssVariablesAndTokens(context) },
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
regenerated on every export, so anything left here is overwritten.

## Files

- \`using-seldon-components.md\` how to render and customize the components.
- \`editing-exported-components.md\` why \`${componentsFolder}\` is generated output and
  what to change instead.
- \`framework-target.md\` the framework this export targets and when to warn about a
  mismatch.
- \`controllers-and-refs.md\` how a controller drives component data through refs.
- \`css-variables-and-tokens.md\` how to use the Seldon CSS variables and tokens.

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

The components in \`${componentsFolder}\` are ${frameworkLabel} views. They are
presentational. Seldon bakes every piece of content, every icon, and the full
structure into each component as its \`sdn\` defaults. Your app supplies behavior
and data, not layout.

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

Keep \`role\` and \`aria*\` values coming from your controller. The view exposes
them as props. Do not hardcode accessibility values inside the generated tree.

See the generated \`${componentsFolder}/README.md\` for the full prop reference.
`
}

function editingExportedComponents(context: RulesContext): string {
  const { componentsFolder } = context

  return `# Editing Exported Components

Treat \`${componentsFolder}\` as generated output. Seldon rewrites this whole folder
on every export. Any hand edit here is lost the next time the user exports.

## Warn before editing

Before you change any file under \`${componentsFolder}\`, warn the user:

- The change is overwritten on the next export.
- The durable fix is to change the design in the Seldon Editor, then re-export.
- When a local Seldon MCP server is available, use it to change the workspace,
  then re-export. It applies the same typed actions the Editor uses.

Only edit inside \`${componentsFolder}\` when the user understands and accepts that
the edit is temporary.

## Never hand-edit these

- The workspace \`.json\` copy at the root of \`${componentsFolder}\`. It is the design
  source. Change it only through Seldon actions, never by patching the JSON.
- \`refs/index.ts\` and \`refs/registry.json\`. Seldon generates the ref registry.
- \`styles.css\` and \`styles/\`. Seldon generates the stylesheets from the theme.
- The generated component files. Change the schema in Seldon, not the output.

## The workspace contract

A Seldon workspace changes only through typed actions. The Editor sends actions,
a reducer applies them, and the result serializes to JSON. An MCP server follows
the same contract. Do not patch the workspace maps by hand outside that path.

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

Check the framework of the app you are working in, then compare it to the target.

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
// The controller owns state and data
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
\`\`\``

  return `# Controllers and Refs

Seldon components are views. Drive them with a controller. Seldon expects an
MVC or MVVM shape: a \`*Controller.${componentExtension}\` file owns state and data,
then renders the generated view and feeds it values.

If the app does not use an MVC or MVVM approach, warn the user. Seldon expects a
controller to drive the data. Without one, the view has no place to receive
state and events, and the ref wiring below has nowhere to live.

## Refs over prop order

A composed component nests many slots. Addressing them by position is brittle.
Drive any node by its stable ref name through a single \`seldonRefs\` map instead.
Each referenced node carries a \`data-seldon-ref\` name, and the matching entry in
the map wins over the baked default and any positional prop.

${controllerExample}

The view exposes \`seldonRefs\` when it has children. The names come from the
workspace and appear in \`${componentsFolder}/refs/index.ts\`. Prefer this map over
matching the nested slot order.

## Naming a refs map

When you split refs into named maps, name each map after what it drives, such as
\`rowRefs\` or \`headerRefs\`. The bindings scan resolves a map by name and keeps the
first declaration, so two maps with the same name in one file collide. A bare
\`seldonRefs\` name is fine only when the file holds one map.

## Repeated rows

In a \`${isVue ? "v-for" : ".map()"}\` row, read a per-row map or call a helper that
returns the row object. That keeps each row's values resolvable by the scanner.

## Record the bindings

After you wire controllers, regenerate the bindings manifest so the ref-to-code
map stays current:

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
height. Use the matching \`--sdn-*\` variable, or a Seldon class that already reads
it. Pick the nearest step on a scale rather than inventing a new value.

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
`
}
