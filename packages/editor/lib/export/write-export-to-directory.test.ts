import { describe, expect, test } from "bun:test"
import { writeExportToDirectory } from "./write-export-to-directory"

class MemoryFileHandle {
  constructor(
    private readonly onWrite: (content: string | ArrayBuffer) => void,
  ) {}

  async createWritable() {
    return {
      write: async (content: string | ArrayBuffer) => {
        this.onWrite(content)
      },
      close: async () => {},
    }
  }
}

class MemoryDirectoryHandle {
  readonly directories = new Map<string, MemoryDirectoryHandle>()
  readonly files = new Map<string, string | ArrayBuffer>()

  constructor(readonly name = "") {}

  async getDirectoryHandle(name: string, _options?: { create?: boolean }) {
    let directory = this.directories.get(name)
    if (!directory) {
      directory = new MemoryDirectoryHandle(name)
      this.directories.set(name, directory)
    }
    return directory
  }

  async getFileHandle(name: string, _options?: { create?: boolean }) {
    return new MemoryFileHandle((content) => this.files.set(name, content))
  }
}

function asDirectoryHandle(
  directory: MemoryDirectoryHandle,
): FileSystemDirectoryHandle {
  return directory as unknown as FileSystemDirectoryHandle
}

describe("writeExportToDirectory", () => {
  test("writes files into nested directories", async () => {
    const root = new MemoryDirectoryHandle()

    const count = await writeExportToDirectory(asDirectoryHandle(root), [
      { path: "/components/Button.tsx", content: "button" },
      { path: "styles.css", content: "styles" },
    ])

    expect(count).toBe(2)
    expect(root.files.get("styles.css")).toBe("styles")
    expect(root.directories.get("components")?.files.get("Button.tsx")).toBe(
      "button",
    )
  })

  test("normalizes backslashes before writing", async () => {
    const root = new MemoryDirectoryHandle()

    await writeExportToDirectory(asDirectoryHandle(root), [
      { path: "components\\Button.tsx", content: "button" },
    ])

    expect(root.directories.get("components")?.files.get("Button.tsx")).toBe(
      "button",
    )
  })

  test("rejects traversal and reserved path segments", async () => {
    const root = new MemoryDirectoryHandle()

    await expect(
      writeExportToDirectory(asDirectoryHandle(root), [
        { path: "components/../secret.txt", content: "secret" },
      ]),
    ).rejects.toThrow('Unsafe export path "components/../secret.txt"')

    expect(root.directories.size).toBe(0)
    expect(root.files.size).toBe(0)
  })

  test("skips empty file paths", async () => {
    const root = new MemoryDirectoryHandle()

    const count = await writeExportToDirectory(asDirectoryHandle(root), [
      { path: "/", content: "empty" },
    ])

    expect(count).toBe(0)
    expect(root.directories.size).toBe(0)
    expect(root.files.size).toBe(0)
  })
})
