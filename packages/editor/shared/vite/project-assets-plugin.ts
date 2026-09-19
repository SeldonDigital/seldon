import fs from "node:fs"
import path from "node:path"

import type { IncomingMessage, ServerResponse } from "node:http"
import type { Connect, Plugin } from "vite"

export interface ProjectAssetsPluginOptions {
  root?: string
}

const ROUTE = "/sdn"
const ASSETS_SUBDIR = path.join("public", "sdn")

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
}

/**
 * Serves the project's public/sdn folder at /sdn so the editor canvas can
 * resolve paths that set_image stores on source and background.
 */
export function projectAssetsPlugin(options: ProjectAssetsPluginOptions = {}): Plugin {
  const root = options.root ?? process.cwd()
  const middleware = createMiddleware(root)

  return {
    name: "seldon-project-assets",
    configureServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(ROUTE, middleware)
    },
  }
}

/** Serves one image from <root>/public/sdn. Calls next for anything else. */
function createMiddleware(root: string): Connect.NextHandleFunction {
  const assetsDir = path.resolve(root, ASSETS_SUBDIR)

  return (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next()

      return
    }

    const urlPath = decodeURIComponent((req.url ?? "").split("?")[0] ?? "")
    const relative = urlPath.replace(/^\/+/, "")

    if (!relative) {
      next()

      return
    }

    const filePath = path.resolve(assetsDir, relative)
    const fromDir = path.relative(assetsDir, filePath)

    if (fromDir.startsWith("..") || path.isAbsolute(fromDir)) {
      res.statusCode = 403
      res.end()

      return
    }

    const type = CONTENT_TYPES[path.extname(filePath).toLowerCase()]

    if (!type) {
      next()

      return
    }

    fs.stat(filePath, (error, stat) => {
      if (error || !stat.isFile()) {
        next()

        return
      }

      res.setHeader("Content-Type", type)
      res.setHeader("Content-Length", String(stat.size))

      if (req.method === "HEAD") {
        res.end()

        return
      }

      fs.createReadStream(filePath).pipe(res)
    })
  }
}
