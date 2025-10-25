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
