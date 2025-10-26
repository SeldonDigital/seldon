import { handleResponse } from "./client.helper.js"
import type {
  NewProjectResponse,
  ProjectAllResponse,
  ProjectGetResponse,
  ProjectUpdateResponse,
  ProjectUpdateVariables,
} from "./project.type.js"

type ContentType = "json" | "form-data" | "multipart/form-data"

export async function getHeaders(
  type: ContentType = "json",
): Promise<HeadersInit> {
  const headers: HeadersInit = {
    Accept: "application/json",
  }

  if (type === "json") {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

export function getEndpointUrl(path: string): string {
  // TODO: OPENSOURCE MIGRATION
  return `/api${path}`
}

export const api = {
  project: {
    async create(): Promise<NewProjectResponse> {
      const response = await fetch(getEndpointUrl("/projects"), {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({
          tree: {},
        }),
      })

      const parsed = await handleResponse<NewProjectResponse>(response)

      return {
        ...parsed,
        data: {
          ...parsed.data,
          createdAt: new Date(parsed.data.createdAt),
          updatedAt: new Date(parsed.data.updatedAt),
        },
      }
    },
    async get(id: string): Promise<ProjectGetResponse> {
      const response = await fetch(getEndpointUrl(`/projects/${id}`), {
        method: "GET",
        headers: await getHeaders(),
      })

      const parsed = await handleResponse<ProjectGetResponse>(response)

      return {
        ...parsed,
        data: {
          ...parsed.data,
          createdAt: new Date(parsed.data.createdAt),
          updatedAt: new Date(parsed.data.updatedAt),
        },
      }
    },
    async update({
      id,
      input,
    }: ProjectUpdateVariables): Promise<ProjectUpdateResponse> {
      const response = await fetch(getEndpointUrl(`/projects/${id}`), {
        method: "PATCH",
        headers: await getHeaders(),
        body: JSON.stringify(input),
      })

      const parsed = await handleResponse<ProjectUpdateResponse>(response)

      return {
        ...parsed,
        data: {
          ...parsed.data,
          createdAt: new Date(parsed.data.createdAt),
          updatedAt: new Date(parsed.data.updatedAt),
        },
      }
    },
    async all(): Promise<ProjectAllResponse> {
      const response = await fetch(getEndpointUrl(`/projects`), {
        method: "GET",
        headers: await getHeaders(),
      })

      const parsed = await handleResponse<ProjectAllResponse>(response)

      return {
        ...parsed,
        data: parsed.data.map((project) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        })),
      }
    },
    async delete(projectId: string): Promise<ProjectAllResponse> {
      const response = await fetch(getEndpointUrl(`/projects/${projectId}`), {
        method: "DELETE",
        headers: await getHeaders(),
      })

      const parsed = await handleResponse<ProjectAllResponse>(response)

      return {
        ...parsed,
        data: parsed.data.map((project) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        })),
      }
    },
  },
  upload: {
    async create({ projectId, imageData }: any): Promise<any> {
      const formData = new FormData()

      formData.append("projectId", projectId)
      formData.append("file", imageData)

      const headers = await getHeaders("multipart/form-data")

      const response = await fetch(getEndpointUrl("/assets"), {
        method: "POST",
        headers,
        body: formData,
      })

      return handleResponse<any>(response)
    },
  },
}
