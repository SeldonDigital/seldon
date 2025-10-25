import { invariant } from "@seldon/core"

export function getEndpointUrl(
  path: string,
  params?: Record<string, string | number>,
) {
  invariant(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL is not set")

  /**
   * In a SSR environment, API_URL is available so pick that
   * In a browser environment, NEXT_PUBLIC_API_URL is available so pick that
   *
   * This is mainly for local development because for the server docker listens on http://api:2300
   * but for the client it needs to be http://localhost:2300
   */
  const url = new URL(
    `${process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL}${path}`,
  )

  if (params) {
    for (const key in params) {
      if (typeof params[key] === "number") {
        url.searchParams.append(key, params[key].toString())
      }
      if (typeof params[key] === "string") {
        url.searchParams.append(key, params[key])
      }
    }
  }
  return url.toString()
}
