"use client"

import { createElement } from "react"

import { useTextEditOverlay } from "./hooks/use-text-edit-overlay"

export function TextEditOverlay() {
  const { fieldRef, nodeId, overlayStyle, overlayTag, showOverlay, onInput, onKeyDown, onBlur } =
    useTextEditOverlay()

  if (!showOverlay) return null

  return createElement(overlayTag, {
    key: nodeId,
    ref: fieldRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    style: overlayStyle,
    onInput,
    onKeyDown,
    onBlur,
  })
}
