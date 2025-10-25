"use client"

import { COLORS, hsla } from "@lib/ui/colors"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { BarToolsSeldon } from "@components/seldon/elements/BarToolsSeldon"

export const Toolbar = () => {
  const { activeTool, setActiveTool } = useTool()
  const { closeDialog } = useDialog()

  // testIds
  const selectButtonTestId = "select-button"
  const sketchButtonTestId = "sketch-button"
  const insertComponentButtonTestId = "insert-component-button"

  // onClick handlers
  const handleSelectClick = () => {
    closeDialog()
    setActiveTool("select")
  }

  const handleSketchClick = () => {
    closeDialog()
    setActiveTool("sketch")
  }

  const handleInsertComponentClick = () => {
    closeDialog()
    setActiveTool("component")
  }

  // active tool
  const isSelectActive = activeTool === "select"
  const isSketchActive = activeTool === "sketch"
  const isComponentActive = activeTool === "component"

  // button states
  const selectButtonState = isSelectActive ? "active" : "idle"
  const sketchButtonState = isSketchActive ? "active" : "idle"
  const componentButtonState = isComponentActive ? "active" : "idle"

  return (
    <>
      <style jsx global>{`
        .seldon-tool-button {
          cursor: pointer;
        }

        .seldon-tool-button[data-state="idle"] {
          background-color: transparent !important;
          border-color: transparent !important;
          color: ${hsla(COLORS.pearl, 1)} !important;
        }

        .seldon-tool-button[data-state="active"] {
          border-color: ${hsla(COLORS.blue[500], 1)} !important;
          color: ${hsla(COLORS.blue[500], 1)} !important;
        }

        .seldon-tool-button[data-state="idle"]:hover {
          background-color: ${hsla(COLORS.white, 0.1)} !important;
        }

        .seldon-tool-button svg {
          color: currentColor;
        }
      `}</style>
      <BarToolsSeldon
        buttonToolProps={{
          className: "seldon-tool-button",
          // @ts-expect-error - data-state is not supported by the types
          "data-state": selectButtonState,
          "data-is-selected": isSelectActive,
          onClick: handleSelectClick,
          "data-testid": selectButtonTestId,
        }}
        buttonIconProps={{
          style: {
            color: "currentcolor",
          },
        }}
        buttonTool1Props={{
          className: "seldon-tool-button",
          // @ts-expect-error - data-state is not supported by the types
          "data-state": sketchButtonState,
          "data-is-selected": isSketchActive,
          onClick: handleSketchClick,
          "data-testid": sketchButtonTestId,
        }}
        buttonTool1IconProps={{
          style: {
            color: "currentcolor",
          },
        }}
        buttonTool2Props={{
          className: "seldon-tool-button",
          // @ts-expect-error - data-state is not supported by the types
          "data-state": componentButtonState,
          "data-is-selected": isComponentActive,
          onClick: handleInsertComponentClick,
          "data-testid": insertComponentButtonTestId,
        }}
        buttonTool2IconProps={{
          style: {
            color: "currentcolor",
          },
        }}
      />
    </>
  )
}
