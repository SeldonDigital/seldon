import { type Document, Window } from "happy-dom"

/**
 * A short, browser-like User-Agent so sites that gate on a missing agent still
 * return their markup. Kept minimal on purpose; this is a local dev tool.
 */
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"

/**
 * Fetches a page and parses its HTML into a happy-dom `Document`. This is the
 * DOM source for the import pipeline: it runs server-side because a browser
 * cannot fetch and parse an arbitrary cross-origin site. It reads the raw HTML
 * response and does not execute page scripts, so client-rendered markup that
 * only exists after hydration is not captured.
 */
export async function fetchDom(url: string): Promise<Document> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    redirect: "follow",
  })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }
  const html = await response.text()
  const window = new Window({ url })
  window.document.write(html)
  return window.document
}
