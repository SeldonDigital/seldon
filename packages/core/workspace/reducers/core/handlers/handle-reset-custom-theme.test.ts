import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace-with-properties"
import customTheme from "../../../../themes/custom"
import { Ratio } from "../../../../themes/types"
import { Workspace } from "../../../types"
import { handleResetCustomTheme } from "./handle-reset-custom-theme"

describe("handleResetCustomTheme", () => {
  it("should reset the custom theme to the default theme", () => {
    const workspace: Workspace = {
      ...WORKSPACE_FIXTURE,
      customTheme: {
        ...WORKSPACE_FIXTURE.customTheme,
        core: {
          ...WORKSPACE_FIXTURE.customTheme.core,
          ratio: Ratio.GoldenRatio,
          fontSize: 20,
        },
      },
    }

    const result = handleResetCustomTheme({}, workspace)

    expect(result.customTheme).toEqual(customTheme)
  })
})
