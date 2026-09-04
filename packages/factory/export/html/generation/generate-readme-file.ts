import type { ExportOptions, FileToExport } from "../../types"

/**
 * Writes the package README for an HTML+CSS export. Fragments have no props
 * API. A consumer or MCP wraps chosen files in a document that links the CSS.
 */
export function generateReadmeFile(options: ExportOptions): FileToExport {
  const content = `# Seldon HTML

This export writes flattened HTML fragments and shared CSS. Each file is one variant's full tree as native tags. Nothing in a file includes another file.

## Wrap a fragment

Link the stylesheet and each theme file this export wrote. Paste one or more fragments into the body.

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="./styles.css" />
    <link rel="stylesheet" href="./styles/seldon.css" />
  </head>
  <body>
    <!-- paste fragments here -->
  </body>
</html>
\`\`\`

Remote font links live in \`fonts.html\`. Copy those \`<link>\` tags into the document head when the export ran with remote fonts enabled.

## Assemble pages

A screen fragment is already an assembled page. Use it as the body.

A new page that was not authored as a screen is sibling composition. Concatenate existing fragments next to each other. Do not nest \`Button.html\` inside \`Card.html\`. The card already contains its buttons.

## Files this export writes

- \`{level-plural}/{Name}.html\` is one flattened fragment per variant
- \`styles.css\` holds reset, base, and component rules
- \`styles/{slug}.css\` holds theme token variables
- \`fonts.html\` holds remote font host links
- \`refs/registry.json\` lists \`data-seldon-ref\` names when nodes carry refs

For more about Seldon, visit [github.com/SeldonDigital/seldon](https://github.com/SeldonDigital/seldon)
`

  return {
    path: `${options.output.componentsFolder}/README.md`,
    content,
  }
}
