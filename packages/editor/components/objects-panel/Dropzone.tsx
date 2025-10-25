import { DropzoneParams, useDropzone } from "./hooks/use-dropzone"
import { Indicator } from "./Indicator"

export function Dropzone({
  target,
  placement,
  onDragEnter,
  onDragLeave,
}: DropzoneParams) {
  const { isValidDropTarget, ref } = useDropzone({
    target,
    placement,
    onDragEnter,
    onDragLeave,
  })

  return (
    <div
      ref={ref}
      className="flex-1"
      data-testid={`node-${target.id}-dropzone-${placement}`}
    >
      {isValidDropTarget && <Indicator placement={placement} color="blue" />}
    </div>
  )
}
