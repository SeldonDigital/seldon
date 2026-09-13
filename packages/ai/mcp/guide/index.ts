import { COMPOSITION_GUIDE } from "./composition"
import { EXPORT_GUIDE } from "./export"
import { IMAGES_GUIDE } from "./images"
import { PROPERTIES_GUIDE } from "./properties"
import { THEME_GUIDE } from "./theme"
import { WORKFLOW_GUIDE } from "./workflow"

/** Sections get_design_guide can return. */
export const DESIGN_GUIDE_SECTIONS = [
  "workflow",
  "composition",
  "properties",
  "theme",
  "images",
  "export",
] as const

export type DesignGuideSection = (typeof DESIGN_GUIDE_SECTIONS)[number]

const GUIDES: Record<DesignGuideSection, string> = {
  workflow: WORKFLOW_GUIDE,
  composition: COMPOSITION_GUIDE,
  properties: PROPERTIES_GUIDE,
  theme: THEME_GUIDE,
  images: IMAGES_GUIDE,
  export: EXPORT_GUIDE,
}

const SECTION_SUMMARIES: Record<DesignGuideSection, string> = {
  workflow: "One-shot build order from an empty workspace.",
  composition: "Catalog versus authored components, levels, and nesting.",
  properties: "Value types, shapes, tokens, and set_properties.",
  theme: "Token overrides, palette, and spacing feel.",
  images: "set_image, /sdn paths, and what not to store.",
  export: "workspace_export layout and render_preview.",
}

const INDEX = `Seldon design guide. Call get_design_guide with a section.

${DESIGN_GUIDE_SECTIONS.map((section) => `- ${section}: ${SECTION_SUMMARIES[section]}`).join("\n")}

Start with workflow.
`

/** Returns one guide section, or the section index when the name is omitted. */
export function getDesignGuide(section?: string): string {
  if (!section) return INDEX

  const key = section.trim().toLowerCase()

  if ((DESIGN_GUIDE_SECTIONS as readonly string[]).includes(key)) {
    return GUIDES[key as DesignGuideSection]
  }

  return `Unknown section "${section}". Pass one of: ${DESIGN_GUIDE_SECTIONS.join(", ")}.`
}
