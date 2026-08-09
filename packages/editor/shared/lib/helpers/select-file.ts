"use client"

type SelectFileResult =
  | {
      success: true
      file: File
    }
  | {
      success: false
    }

interface SelectFileOptions {
  accept?: string
}

/**
 * Opens the native file picker and resolves with the chosen file, or
 * `{ success: false }` when the user cancels.
 *
 * Cancel is detected two ways: the `cancel` event where a browser fires it, and
 * a focus fallback for those that do not. Focus returns to the window when the
 * picker closes on both a pick and a cancel; a pick also fires `change`, which
 * settles first, so a tick after focus with no file means the picker was
 * cancelled. This keeps a cancelled picker from leaving the caller waiting.
 */
export const selectFile = (options: SelectFileOptions = {}) => {
  return new Promise<SelectFileResult>((resolve) => {
    const input = document.createElement("input")

    input.type = "file"

    if (options.accept) {
      input.accept = options.accept
    }

    let settled = false

    const settle = (result: SelectFileResult) => {
      if (settled) return
      settled = true
      window.removeEventListener("focus", onFocus)
      input.remove()
      resolve(result)
    }

    const onFocus = () => {
      window.setTimeout(() => {
        if (!input.files || input.files.length === 0) settle({ success: false })
      }, 300)
    }

    input.onchange = () => {
      const file = Array.from(input.files ?? [])[0]

      settle(file ? { success: true, file } : { success: false })
    }

    input.oncancel = () => settle({ success: false })

    window.addEventListener("focus", onFocus)
    input.click()
  })
}
