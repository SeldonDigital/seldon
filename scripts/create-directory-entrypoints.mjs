import { readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const directory = process.argv[2]

if (!directory) throw new Error("Expected a compiled package directory.")

async function createEntrypoints(currentDirectory) {
  const entries = await readdir(currentDirectory, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const childDirectory = path.join(currentDirectory, entry.name)
    const childEntries = await readdir(childDirectory, { withFileTypes: true })
    const hasIndex = childEntries.some((child) => child.isFile() && child.name === "index.js")

    if (hasIndex) {
      const entrypoint = path.join(currentDirectory, `${entry.name}.js`)
      const typeEntrypoint = path.join(currentDirectory, `${entry.name}.d.ts`)

      await writeFile(entrypoint, `export * from "./${entry.name}/index.js"\n`)
      await writeFile(typeEntrypoint, `export * from "./${entry.name}/index.js"\n`)
    }

    await createEntrypoints(childDirectory)
  }
}

await createEntrypoints(directory)
