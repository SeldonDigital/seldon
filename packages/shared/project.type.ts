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

export interface ProjectAllResponse {
  data: ProjectListItem[]
}

export interface ProjectGetResponse {
  data: Project
}

export interface NewProjectInput {
  name?: string
  tree: JSONObject
}

export interface NewProjectResponse {
  data: Project
}

export interface ProjectUpdateVariables {
  id: string
  input: Partial<Project>
}

export interface UpdateProjectInput {
  name?: string
  tree?: JSONObject
}

export interface ProjectUpdateResponse {
  data: Project
}
