import type { IconId } from "@seldon/core/icons"
import { getIconComponentName } from "@seldon/factory/export/react/discovery/get-icon-component-name"
import type {
  ExportAssetReader,
  IconExportSource,
} from "@seldon/factory/export/asset-reader"

const nativeModules = import.meta.glob(
  "../../../core/components/native-react/*.tsx",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>

const iconModules = import.meta.glob(
  "../../../core/icons/sets/**/*.tsx",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>

const ICON_DEFAULT_CONTENT = `import { SVGAttributes } from "react"

export function IconDefault(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 320"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="22"
      >
        <path d="m149.745 193.824-77.015 79.99 111.427 11.736M189.587 179.323 300 191.094l-77.817 80.616M184.157 285.55l5.43-106.227M300 191.094 247.27 46.22M72.73 273.814 20 128.939M97.017 48.953 20 128.939l111.427 11.737M136.854 34.45 247.27 46.22l-77.815 80.619" />
      </g>
    </svg>
  )
}
`

function stemFromNativeKey(key: string): string {
  const match = key.match(/\/([^/]+)\.tsx$/)
  return match?.[1] ?? key
}

const nativeByStem = Object.fromEntries(
  Object.entries(nativeModules).map(([key, content]) => [
    stemFromNativeKey(key),
    content,
  ]),
)

const iconByComponentName = new Map<string, IconExportSource>()

for (const [key, content] of Object.entries(iconModules)) {
  const match = key.match(/icons\/sets\/(.+)\.tsx$/)
  if (!match) continue
  const relativePath = match[1]
  const componentName = relativePath.split("/").pop() ?? relativePath
  iconByComponentName.set(componentName, { relativePath, content })
}

export function createBrowserExportAssetReader(): ExportAssetReader {
  return {
    readNativeComponent(fileStem: string): string | undefined {
      return nativeByStem[fileStem]
    },
    readIconFile(): Buffer | undefined {
      return undefined
    },
    getIconExportSource(iconId: IconId): IconExportSource | undefined {
      if (iconId === "__default__") {
        return { relativePath: "IconDefault", content: ICON_DEFAULT_CONTENT }
      }
      const componentName = getIconComponentName(iconId)
      return iconByComponentName.get(componentName)
    },
    listNativeComponentFileStems(): string[] {
      return Object.keys(nativeByStem)
    },
  }
}
