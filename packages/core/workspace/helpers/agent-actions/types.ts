/**
 * Legacy wire action from agent APIs. Prefer {@link WorkspaceAction} for new integrations.
 * `type` values often use an `ai_` prefix; {@link applyAgentActions} maps them to workspace actions.
 */
export type AgentWireAction = {
  type: string
  payload?: Record<string, unknown>
}

/** @deprecated Use {@link AgentWireAction}. Kept for API and editor imports during migration. */
export type AIAction = AgentWireAction
