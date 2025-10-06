import fs from "node:fs"
import path from "node:path"
import { ExportOptions, FileToExport } from "../../types"

/**
 * Get the native primitives that should all be exported
 * @param options - Export options
 * @returns List of files to export
 */
export function getNativeComponentFiles(
  options: ExportOptions,
): FileToExport[] {
  const primitives: FileToExport[] = []
  const entries = fs.readdirSync(
    path.join(options.rootDirectory, "packages/core/components/native-react"),
    { withFileTypes: true },
  )

  for (const entry of entries) {
    if (entry.isFile()) {
      primitives.push({
        path: path.join(
          options.output.componentsFolder,
          "native-react",
          entry.name,
        ),
        content: fs.readFileSync(
          path.join(entry.parentPath, entry.name),
          "utf8",
        ),
      })
    }
  }

  return primitives
}
