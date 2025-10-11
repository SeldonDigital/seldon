import type { JSONObject } from "hono/utils/types"

export interface ProjectListItem {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Project extends ProjectListItem {
  tree: JSONObject
}

export type NewProjectInput = {
  name?: string
  tree: JSONObject
}

export type UpdateProjectInput = {
  name?: string
  tree?: JSONObject
}
