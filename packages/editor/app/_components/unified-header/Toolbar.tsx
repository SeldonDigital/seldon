"use client"

import { COLORS, lcha } from "@lib/utils/colors"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { BarToolsSeldon } from "@components/seldon/elements/BarToolsSeldon"

export const Toolbar = () => {
  const { activeTool, setActiveTool } = useTool()
  const { closeDialog } = useDialog()

  const handleSelectClick = () => {
    closeDialog()
    setActiveTool("select")
  }

  const handleInsertComponentClick = () => {
    closeDialog()
    setActiveTool("component")
  }

  const isSelectActive = activeTool === "select"
  const isComponentActive = activeTool === "component"

  return (
    <>
      <style>{`
        .seldon-tool-button {
          cursor: pointer;
        }

        .seldon-tool-button[data-state="idle"] {
          background-color: transparent !important;
          border-color: transparent !important;
          color: ${lcha(COLORS.pearl[500], 1)} !important;
        }

        .seldon-tool-button[data-state="active"] {
          border-color: ${lcha(COLORS.primary[500], 1)} !important;
          color: ${lcha(COLORS.primary[500], 1)} !important;
        }

        .seldon-tool-button[data-state="idle"]:hover {
          background-color: ${lcha(COLORS.white, 0.1)} !important;
        }

        .seldon-tool-button svg {
          color: currentColor;
        }
      `}</style>
      <BarToolsSeldon
        buttonToolProps={{
          className: "seldon-tool-button",
          // @ts-expect-error data-state is valid on DOM
          "data-state": isSelectActive ? "active" : "idle",
          onClick: handleSelectClick,
          "data-testid": "select-button",
        }}
        buttonTool2Props={{
          className: "seldon-tool-button",
          // @ts-expect-error data-state is valid on DOM
          "data-state": isComponentActive ? "active" : "idle",
          onClick: handleInsertComponentClick,
          "data-testid": "insert-component-button",
        }}
      />
    </>
  )
}
