/**
 * Optional screenshot backend for view_node's "image" format.
 * Playwright is an optionalDependency, mirroring semantic search's
 * @huggingface/transformers ladder (semantic-search.ts):
 *
 * - Playwright not installed → SILENT null; view_node falls back to "html"
 *   (the documented, expected state — not a fault).
 * - Playwright installed but broken (missing browser binaries, launch
 *   failure) → LOUD one-time stderr report, then null; still falls back.
 *
 * Network: the browser context blocks every remote request (the
 * server makes no network calls at runtime). Remote fonts fall back to
 * system fonts and remote images render as empty boxes in screenshots; the
 * html format is unaffected (links stay in the document for human viewing).
 */

export interface ScreenshotOptions {
  /** Viewport width in CSS pixels (default: 800). */
  width?: number
  /** Device scale factor (default: 2). */
  deviceScaleFactor?: number
}

/** The subset of Playwright this module touches. */
interface PlaywrightModule {
  chromium: {
    launch(options: { headless: boolean }): Promise<{
      newPage(options: {
        viewport: { width: number; height: number }
        deviceScaleFactor: number
      }): Promise<{
        route(
          pattern: string,
          handler: (route: {
            request(): { url(): string }
            abort(): Promise<void>
            continue(): Promise<void>
          }) => Promise<void>,
        ): Promise<void>
        setContent(
          html: string,
          options: { waitUntil: "networkidle" | "load" },
        ): Promise<void>
        screenshot(options: { fullPage: boolean }): Promise<Buffer>
      }>
      close(): Promise<void>
    }>
  }
}

export interface ScreenshotProviderOptions {
  /** Injection point so tests can simulate a missing/broken dependency. */
  importPlaywright?: () => Promise<PlaywrightModule>
  /** Loud-failure sink; defaults to stderr (stdout is the MCP channel). */
  reportError?: (message: string) => void
}

export interface ScreenshotProvider {
  /**
   * PNG bytes for one HTML document, or null when screenshots are
   * unavailable for any reason. Never throws; a broken install reports
   * loudly once, then latches to null.
   */
  capture(html: string, options?: ScreenshotOptions): Promise<Buffer | null>
}

/** Default viewport width in CSS pixels; render-target reports it, so shared. */
export const DEFAULT_WIDTH = 800
const DEFAULT_SCALE = 2

export function createScreenshotProvider(
  providerOptions: ScreenshotProviderOptions = {},
): ScreenshotProvider {
  const importPlaywright =
    providerOptions.importPlaywright ??
    (() => import("playwright") as unknown as Promise<PlaywrightModule>)
  const reportError =
    providerOptions.reportError ??
    ((message: string) => console.error(`[seldon-mcp] ${message}`))

  /** null = unavailable (latched); undefined = not yet attempted. */
  let playwright: PlaywrightModule | null | undefined

  async function resolvePlaywright(): Promise<PlaywrightModule | null> {
    if (playwright !== undefined) return playwright
    try {
      playwright = await importPlaywright()
    } catch {
      // Optional dependency not installed — the documented silent fallback.
      playwright = null
    }
    return playwright
  }

  let reportedBroken = false

  return {
    async capture(html, options = {}) {
      const module = await resolvePlaywright()
      if (!module) return null

      let browser: Awaited<
        ReturnType<PlaywrightModule["chromium"]["launch"]>
      > | null = null
      try {
        browser = await module.chromium.launch({ headless: true })
        const page = await browser.newPage({
          viewport: {
            width: options.width ?? DEFAULT_WIDTH,
            height: 600, // fullPage screenshot grows past this
          },
          deviceScaleFactor: options.deviceScaleFactor ?? DEFAULT_SCALE,
        })
        // No network at runtime. Everything the render needs is
        // inlined in the document; anything else (remote fonts/images) is
        // deliberately dropped from screenshots.
        await page.route("**/*", async (route) => {
          const url = route.request().url()
          if (url.startsWith("http://") || url.startsWith("https://")) {
            await route.abort()
          } else {
            await route.continue()
          }
        })
        await page.setContent(html, { waitUntil: "load" })
        return await page.screenshot({ fullPage: true })
      } catch (error) {
        if (!reportedBroken) {
          reportedBroken = true
          reportError(
            `Playwright is installed but screenshots fail: ${(error as Error).message}. ` +
              `Falling back to the "html" format. If browser binaries are ` +
              `missing, run "npx playwright install chromium".`,
          )
        }
        return null
      } finally {
        await browser?.close().catch(() => {})
      }
    },
  }
}
