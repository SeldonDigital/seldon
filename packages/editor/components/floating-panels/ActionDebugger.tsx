"use client"

import { useState } from "react"
import { Action } from "@seldon/core"
import customTheme from "@seldon/core/themes/custom"
import { CURRENT_WORKSPACE_VERSION } from "@seldon/core/workspace/middleware/migration/middleware"
import { processAiActions } from "@seldon/core/workspace/reducers/ai/helpers/process-ai-actions"
import { useActionDebugger } from "@lib/hooks/use-action-debugger"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Button } from "../ui/Button"
import { Text } from "../ui/Text"
import { FloatingPanel } from "../ui/floating-panel/FloatingPanel"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "../constants"

const actions: Action[] = []

export function ActionDebugger() {
  const [value, setValue] = useState(JSON.stringify(actions, null, 2))
  const { workspace, dispatch } = useWorkspace()
  const { selectNode, selectBoard } = useSelection()
  const { toggleActionDebugger, showActionDebugger } = useActionDebugger()

  if (!showActionDebugger) return null

  return (
    <FloatingPanel
      handleClose={toggleActionDebugger}
      initialPosition={{
        x: window.innerWidth - PANEL_INITIAL_WIDTH - 25,
        y: window.innerHeight - PANEL_INITIAL_HEIGHT - 25,
      }}
    >
      <div className="px-4 pb-4 bottom-0 h-full right-0 flex flex-col gap-2 w-full">
        <Text variant="title" className="text-white">
          Action Debugger
        </Text>
        <textarea
          className="text-black text-xs flex-1 bg-white"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste actions"
          value={value}
        />
        <div className="flex justify-between gap-2 py-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              dispatch({
                type: "set_workspace",
                payload: {
                  workspace: {
                    version: CURRENT_WORKSPACE_VERSION,
                    boards: {},
                    byId: {},
                    customTheme,
                  },
                },
              })
              selectNode(null)
              selectBoard(null)
            }}
          >
            Clear workspace
          </Button>
          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </FloatingPanel>
  )

  function handleSubmit() {
    let actions: Action[] = []
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        actions = parsed
      } else if (typeof parsed === "object" && parsed.type && parsed.payload) {
        actions = [parsed]
      } else {
        alert("Invalid action(s), must be an action or an array of actions")
      }

      console.group("Actions")
      console.info(actions)
      console.groupEnd()

      const newWorkspace = processAiActions(workspace, actions)
      console.group("New Workspace")
      console.info(newWorkspace)
      dispatch({ type: "set_workspace", payload: { workspace: newWorkspace } })

      console.groupEnd()

      dispatch({
        type: "set_workspace",
        payload: { workspace: newWorkspace },
      })
    } catch (error) {
      console.error(error)
      alert("Unable to parse actions, see console for details")
    }
  }
}
