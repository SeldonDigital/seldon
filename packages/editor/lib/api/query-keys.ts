/**
 * Centralized query keys for React Query
 * Using const assertions for type safety and as values
 */

export const QueryKeys = {
  projects: ["projects"] as const,
  projectEntries: ["project-entries"] as const,
} as const
