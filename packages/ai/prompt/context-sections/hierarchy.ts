import { rules } from "@seldon/core/rules/config/rules.config"
import { section } from "./section"

const TITLE = "Hierarchy (level -> may contain):"

/**
 * Context section: Hierarchy.
 *
 * Seldon only allows a component to contain certain levels, and core rejects an
 * insert that violates the hierarchy. Publishing the rule up front lets the
 * model plan a legal nesting before it emits an add or insert, instead of
 * learning the constraint through a rejected action. The rule is read from core
 * so the section matches the validation the action will actually face.
 */
export function hierarchySection(): string[] {
  const body: string[] = []
  for (const [level, config] of Object.entries(rules.componentLevels)) {
    const mayContain = config.mayContain
    body.push(
      `- ${level}: ${mayContain.length > 0 ? mayContain.join(", ") : "(nothing)"}`,
    )
  }
  return section(TITLE, body)
}
