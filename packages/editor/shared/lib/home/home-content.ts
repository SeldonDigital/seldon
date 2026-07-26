export type OtherEditor = "React" | "Vue"

/**
 * Copy shared by both editors' home screens, so the two mirrored apps never
 * drift the way their bespoke CSS is allowed to. Each app supplies its own
 * name for the other editor since that half of the sentence is app-specific.
 */
export const HOME_CONTENT = {
  title: "Seldon · Editor",
  subtitle: (otherEditor: OtherEditor) =>
    `Workspaces are stored on your machine and shared with the ${otherEditor} editor. Open a workspace.json file or create a new workspace.`,
  newWorkspaceButton: "New workspace",
  openWorkspaceButton: "Open workspace.json",
  recentWorkspacesHeading: "Recent workspaces",
  loading: "Loading…",
  noWorkspaces: "No workspaces yet.",
  deleteButton: "Delete",
  deleteConfirm: "Delete this workspace?",
  newWorkspaceNamePrompt: "Workspace name",
  defaultWorkspaceName: "Untitled",
}
