/** Versioned index of workspace source files owned by one repository. */
export interface ProjectManifest {
  projectId: string
  version: 1
  workspaces: Record<string, ProjectWorkspaceManifestEntry>
}

/** One workspace source registered in a repository project manifest. */
export interface ProjectWorkspaceManifestEntry {
  sourceFileName: string
  updatedAt?: string
}

/** The legacy project pointer shape that named one workspace source. */
export interface LegacyProjectPointer {
  workspace: string
}

export function createProjectManifest(projectId: string): ProjectManifest {
  return {
    projectId,
    version: 1,
    workspaces: {},
  }
}

export function readProjectManifest(value: unknown): ProjectManifest | undefined {
  if (!isRecord(value) || value.version !== 1 || typeof value.projectId !== "string") {
    return undefined
  }

  if (!isRecord(value.workspaces)) return undefined

  const workspaces: Record<string, ProjectWorkspaceManifestEntry> = {}

  for (const [id, entry] of Object.entries(value.workspaces)) {
    if (!isRecord(entry) || typeof entry.sourceFileName !== "string") return undefined

    workspaces[id] = {
      sourceFileName: entry.sourceFileName,
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : undefined,
    }
  }

  return {
    projectId: value.projectId,
    version: 1,
    workspaces,
  }
}

export function readLegacyProjectPointer(value: unknown): LegacyProjectPointer | undefined {
  if (!isRecord(value) || typeof value.workspace !== "string" || value.workspace.length === 0) {
    return undefined
  }

  return { workspace: value.workspace }
}

export function setProjectWorkspace(
  manifest: ProjectManifest,
  workspaceId: string,
  entry: ProjectWorkspaceManifestEntry,
): ProjectManifest {
  return {
    ...manifest,
    workspaces: {
      ...manifest.workspaces,
      [workspaceId]: entry,
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
