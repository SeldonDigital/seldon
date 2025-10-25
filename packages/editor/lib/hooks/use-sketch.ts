import { getSketchVariablesForTarget } from "@lib/sketch/get-sketch-variables-for-target"
import { convertBlobToBase64 } from "@lib/utils/convert-blob-to-base64"
import { useCallback, useRef, useState } from "react"
import {
  DefaultFontStyle,
  DefaultSizeStyle,
  Editor,
  TLOnMountHandler,
  setUserPreferences,
} from "tldraw"
import { create } from "zustand"
import { invariant } from "@seldon/core"
import { useIdentifySketch } from "@lib/api/hooks/use-identify-sketch"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Target } from "./use-target"

/**
 * Status of the sketch generation process
 */
export type SketchStatus = "idle" | "pending" | "success" | "error"

interface SketchState {
  sketchError: Error | null
  setSketchError: (error: Error | null) => void
}

const useStore = create<SketchState>((set) => ({
  sketchError: null,
  setSketchError: (error) => set(() => ({ sketchError: error })),
}))

/**
 * Hook to manage the sketch editor state and functionality
 * Handles canvas setup, drawing, and interaction with the AI sketch identification service
 */
export function useSketch(target?: Target) {
  const { sketchError, setSketchError } = useStore()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace()
  const [instructionText, setInstructionText] = useState("")

  const activeBoardId = activeBoard?.id ?? null

  const {
    identifySketch,
    status,
    data,
    error: identifyError,
    reset,
    variables,
  } = useIdentifySketch()

  // We need a ref to the editor instance so we can access it in our callbacks
  const editorRef = useRef<Editor | null>(null)

  const handleMount: TLOnMountHandler = useCallback(
    (editor) => {
      setUserPreferences({ id: "user", colorScheme: "dark" })

      // Initialize editor with draw tool and small stroke size
      editor.setCurrentTool("draw")

      // Set default styles:
      // Small stroke and small text
      editor.setStyleForNextShapes(DefaultSizeStyle, "s")
      // Sans serif font
      editor.setStyleForNextShapes(DefaultFontStyle, "sans")

      editorRef.current = editor

      // Clear any previous error messages when mounting a new editor
      setSketchError(null)
    },
    [setSketchError],
  )

  const handleClear = useCallback(() => {
    const editor = editorRef.current
    invariant(editor, "Editor is not mounted")
    editor.deleteShapes([...editor.getCurrentPageShapeIds()])

    // Clear any error messages when clearing the canvas
    setSketchError(null)
  }, [setSketchError])

  /**
   * Centralized error handling for the sketch process
   * Maps technical errors to user-friendly messages
   */
  const handleSketchError = useCallback(
    (error: unknown) => {
      let userMessage: string

      if (error instanceof Error) {
        // Map specific error messages to user-friendly messages
        if (error.message.includes("No shapes to export")) {
          userMessage = "Please draw something before generating"
        } else if (
          error.message.includes("too complex") ||
          error.message.includes("processing failed")
        ) {
          userMessage =
            "Failed to process your sketch. Try simplifying your drawing."
        } else if (
          error.message.includes("network") ||
          error.message.includes("timeout")
        ) {
          userMessage =
            "Network issue. Please check your connection and try again."
        } else if (error.message.includes("Editor is not mounted")) {
          userMessage = "Drawing tool not ready. Please try again."
        } else if (error.message.includes("Target is not set")) {
          userMessage = "No placement target selected. Please try again."
        } else {
          // Default message for unknown errors
          userMessage =
            error.message || "An unexpected error occurred. Please try again."
        }
      } else {
        userMessage = "An unexpected error occurred. Please try again."
      }

      // Set the user-friendly message
      setSketchError(new Error(userMessage))

      // Return a new error with the user message
      return new Error(userMessage)
    },
    [setSketchError],
  )

  const handleGenerate = useCallback(async () => {
    const editor = editorRef.current
    invariant(activeBoardId, "Active board ID is not set")

    try {
      // Clear any previous error and reset status
      setSketchError(null)

      try {
        invariant(editor, "Editor is not mounted")
        invariant(target, "Target is not set")
      } catch (error) {
        throw handleSketchError(error)
      }

      // Verify that there are shapes to export
      const shapeIds = [...editor.getCurrentPageShapeIds()]
      try {
        invariant(
          shapeIds.length > 0,
          "No shapes to export. Please draw something first.",
        )
      } catch (error) {
        throw handleSketchError(error)
      }

      // Export the sketch to a blob
      let blob: Blob
      try {
        const image = await editor.toImage(shapeIds, {
          format: "png",
          background: true,
        })

        blob = image.blob
      } catch (exportError) {
        throw handleSketchError(exportError)
      }

      // Send the blob to identify the sketch
      const variables = getSketchVariablesForTarget(target, workspace)
      try {
        await identifySketch({
          ...variables,
          instructions: instructionText,
          imageData: await convertBlobToBase64(blob),
        })

        // Debug logging removed for production compliance
      } catch (apiError) {
        console.error("Sketch identification failed:", apiError)
        throw handleSketchError(apiError)
      }
    } catch (err) {
      // This outer catch handles any errors that weren't caught earlier
      throw handleSketchError(err)
    }
  }, [
    activeBoardId,
    setSketchError,
    target,
    handleSketchError,
    identifySketch,
    workspace,
    instructionText,
  ])

  const handleRegenerate = useCallback(async () => {
    try {
      // Clear any previous error
      setSketchError(null)

      if (!variables) {
        handleSketchError(new Error("No previous sketch data found."))
        return
      }

      // Call identifySketch with the same variables as the last call
      await identifySketch(variables)
    } catch (err) {
      throw handleSketchError(err)
    }
  }, [identifySketch, variables, setSketchError, handleSketchError])

  const handleReset = useCallback(() => {
    // Clear any error messages when resetting
    setSketchError(null)
    reset()
  }, [reset, setSketchError])

  return {
    onMount: handleMount,
    clear: handleClear,
    reset: handleReset,
    generate: handleGenerate,
    regenerate: handleRegenerate,
    editorRef,
    status,
    data,
    error: identifyError || sketchError,
    instructionText,
    setInstructionText,
  }
}
