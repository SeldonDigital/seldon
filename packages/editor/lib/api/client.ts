import { getEndpointUrl } from "./helpers/get-endpoint-url"
import { getHeaders } from "./helpers/get-headers"
import { handleResponse } from "./helpers/handle-response"
import * as Types from "./types"

export * from "./types"

export const api = {
  project: {
    create: async () =>
      fetch(getEndpointUrl("/projects"), {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({
          tree: {},
        }),
      }).then(handleResponse<Types.ApiProjectCreateResponse>),
    get: async (id: string) => {
      return fetch(getEndpointUrl(`/projects/${id}`), {
        method: "GET",
        headers: await getHeaders(),
        // Opt-out of data caching
        cache: "no-store",
      }).then(handleResponse<Types.ApiProjectGetResponse>)
    },
    update: async ({ id, input }: Types.ApiProjectUpdateVariables) => {
      return fetch(getEndpointUrl(`/projects/${id}`), {
        method: "PATCH",
        headers: await getHeaders(),
        body: JSON.stringify(input),
      }).then(handleResponse<Types.ApiProjectUpdateResponse>)
    },
    all: async () => {
      return fetch(getEndpointUrl(`/projects`), {
        method: "GET",
        headers: await getHeaders(),
      }).then(handleResponse<Types.ApiProjectAllResponse>)
    },
    delete: async (projectId: string) => {
      return fetch(getEndpointUrl(`/projects/${projectId}`), {
        method: "DELETE",
        headers: await getHeaders(),
      }).then(handleResponse<Types.ApiProjectAllResponse>)
    },
  },
  mutations: {
    create: async ({
      projectId,
      mutations,
    }: Types.ApiProjectMutationsCreateBulkVariables) => {
      return fetch(getEndpointUrl(`/projects/${projectId}/mutations`), {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ mutations }),
      }).then(handleResponse<Types.ApiProjectMutationsCreateBulkResponse>)
    },
  },
  upload: {
    create: async ({
      projectId,
      imageData,
    }: Types.ApiUploadCreateVariables) => {
      const formData = new FormData()

      formData.append("projectId", projectId)
      formData.append("file", imageData)

      const headers = await getHeaders("multipart/form-data")

      return fetch(getEndpointUrl("/assets"), {
        method: "POST",
        headers,
        body: formData,
      }).then(handleResponse<Types.ApiUploadCreateResponse>)
    },
  },
}
