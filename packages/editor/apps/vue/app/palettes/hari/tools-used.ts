/**
 * One tool-activity line in the Hari transcript: a status icon and its label.
 * The transcript builds these from a turn's activity and `HariTools` renders one
 * `MessageToolsUsed` per entry. A shared module because an SFC cannot export a
 * type for another SFC to import.
 */
export interface ToolUsed {
  key: string
  icon: string
  text: string
}
