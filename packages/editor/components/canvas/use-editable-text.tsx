"use client"

import React, { useCallback, useEffect, useState } from "react"
import { ValueType } from "@seldon/core"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"

type CanvasTextInputProps = {
  nodeId?: string
  initialValue: string
}

export function useEditableText({
  nodeId,
  initialValue,
}: CanvasTextInputProps) {
  const [mode, setMode] = useState<"edit" | "display">("display")
  const { dispatch } = useWorkspace()
  const { selectedNodeId } = useSelection()

  const save = useCallback(
    (text: string) => {
      if (mode === "display") return
      const hasChanged = text !== initialValue
      const isNotTooLong = text.length <= 1000

      if (hasChanged && isNotTooLong && selectedNodeId) {
        dispatch({
          type: "set_node_properties",
          payload: {
            nodeId: selectedNodeId,
            properties: { content: { type: ValueType.EXACT, value: text } },
          },
        })
      }

      setMode("display")
    },
    [mode, initialValue, selectedNodeId, dispatch],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        const target = event.target as HTMLElement

        event.preventDefault()
        target.innerText = initialValue
        setMode("display")
      }

      if (
        event.key === "Enter" &&
        (window.navigator.platform.includes("Mac")
          ? event.metaKey
          : event.ctrlKey)
      ) {
        if (mode === "display") return
        const text = (event.target as HTMLElement).innerText
        save(text)
      }
    },
    [initialValue, mode, save],
  )

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      setMode("edit")
      const target = event.target as HTMLElement

      requestAnimationFrame(() => {
        target.focus()
        window.getSelection()?.selectAllChildren(target)
      })
    },
    [],
  )

  const handleInputBlur = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (mode === "display") return
      const text = (event.target as HTMLElement).innerText
      save(text)
    },
    [mode, save],
  )

  useEffect(() => {
    if (mode === "edit" && nodeId !== selectedNodeId) {
      setMode("display")
    }
  }, [selectedNodeId, nodeId, mode])

  if (!nodeId) {
    return {}
  }

  return {
    onDoubleClick: mode === "display" ? handleDoubleClick : undefined,
    onBlur: mode === "edit" ? handleInputBlur : undefined,
    onKeyDown: mode === "edit" ? handleKeyDown : undefined,
    contentEditable: mode === "edit" ? true : undefined,
    suppressContentEditableWarning: true,
    autoFocus: mode === "edit",
  }
}
