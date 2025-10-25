import { type Workspace } from "@seldon/core"

// Utility type
export type ObjectOptional<T> = {
  [P in keyof T]?: T[P]
}

// Authentication
export interface ApiAuthLoginVariables {
  email: string
  password: string
}

export interface ApiAuthLoginResponse {
  data: { token: string }
}

// Project
export interface ApiProjectListItem {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ApiProject {
  id: string
  name: string
  tree: Workspace
  createdAt: string
  updatedAt: string
}

export interface ApiProjectCreateResponse {
  data: ApiProject
}

export interface ApiProjectGetResponse {
  data: ApiProject
}

export interface ApiProjectUpdateVariables {
  id: string
  input: ObjectOptional<ApiProject>
}

export interface ApiProjectUpdateResponse {
  data: ApiProject
}

export interface ApiProjectAllResponse {
  data: ApiProjectListItem[]
}

// Project Mutations
export interface ApiProjectMutation {
  id: string
  projectId: string
  body: string
  createdAt: string
}

export interface ApiProjectMutationsCreateBulkVariables {
  projectId: string
  mutations: Pick<ApiProjectMutation, "body">[]
}

export interface ApiProjectMutationsCreateBulkResponse {
  data: { success: boolean }
}

export interface ApiProjectEntryGetManyVariables {
  projectId: string
  limit?: number
  after?: string
}

// Uploads
export interface ApiUploadCreateResponse {
  assetId: string
  projectId: string
  contentType: string
  url: string
}

export interface ApiUploadCreateVariables {
  projectId: string
  imageData: Blob
}
