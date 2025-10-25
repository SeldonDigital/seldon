import { type Context, Hono } from "hono"

import type { AppEnv } from "../types.js"

const VITE_HOST = "http://localhost:2301"

export async function makeSPAApp(env: AppEnv): Promise<Hono> {
  return await devServerApp()
}

async function devServerApp() {
  const app = new Hono()

  const fetchVite = (url: string, incoming: Headers) => {
    const headers = new Headers(incoming)

    headers.delete("cookie")
    headers.delete("host")

    return fetch(url, { headers })
  }

  app.get("/:filename{(.+\\..+$)|^@.+}", (c) => {
    const url = makeUrl(c.req.url, VITE_HOST)

    return fetchVite(url, c.req.raw.headers)
  })

  app.get("*", async (c) => {
    const url = makeUrl(c.req.url, VITE_HOST)

    console.log("Fetching Vite URL:", c.req.url, url)

    const response = await fetchVite(url, c.req.raw.headers)
    const content = await response.text()

    return serveHTML(c, content)
  })

  return app
}

async function serveHTML(c: Context, content: string) {
  c.header("content-type", "text/html")
  c.header("cache-control", "no-store")

  return c.html(content, 200)
}
export function makeUrl(url: string, targetHost: string): string {
  const originalUrl = new URL(url, targetHost)
  const newUrl = new URL(originalUrl.pathname, targetHost)

  newUrl.search = originalUrl.search

  return newUrl.toString()
}
