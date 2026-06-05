"use client"

import { invariant } from "@seldon/core/helpers/utils/invariant"

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

export const selectFile = (options: SelectFileOptions = {}) => {
  return new Promise<SelectFileResult>((resolve) => {
    const input = document.createElement("input")
    input.type = "file"
    if (options.accept) {
      input.accept = options.accept
    }
    input.onchange = () => {
      const files = Array.from(input.files ?? [])
      const file = files[0]
      invariant(file, "No file selected")
      resolve({ success: true, file })
      input.remove()
    }
    input.oncancel = () => {
      resolve({ success: false })
      input.remove()
    }
    input.click()
  })
}
