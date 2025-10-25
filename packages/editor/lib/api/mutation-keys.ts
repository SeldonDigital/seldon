/**
 * Centralized mutation keys for React Query
 * Using const assertions for type safety and as values
 */

export const MutationKeys = {
  createProject: ["create-project"] as const,
} as const
