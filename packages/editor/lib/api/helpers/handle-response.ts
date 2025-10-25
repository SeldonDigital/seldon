export async function handleResponse<Data = unknown>(
  response: Response,
): Promise<Data> {
  // If response is ok return the json
  if (response.ok) {
    if (response.status === 204) {
      // We can safely ignore the type because we know the response is empty
      return {} as Data
    }

    try {
      return (await response.json()) as Data
    } catch (error) {
      console.error(response)
      throw new Error(`[${response.status}] ${response.statusText}`)
    }
  }

  // Handle non ok
  try {
    const json = await response.json()

    if (typeof json.error === "string") {
      throw new Error(json.error)
    }

    if (json.error && json.error.message) {
      throw new Error(`[${response.status}] ${json.error.message}`)
    }
    if (typeof json === "string") {
      throw new Error(`[${response.status}] ${json}`)
    }
  } catch (error) {
    console.error(error)
    throw error
  }

  throw new Error(
    `[${response.status}] Unhandled response: ${response.statusText}`,
  )
}
