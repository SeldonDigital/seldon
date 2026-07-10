import { CSSProperties, ChangeEvent, DragEvent, ReactNode, Ref } from "react"
import { Frame } from "@seldon/components/frames/Frame"
import { Input } from "@seldon/components/primitives/Input"

interface DropzoneSurfaceProps {
  fileInputRef: Ref<HTMLInputElement>
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  accept?: string
  style?: CSSProperties
  onDragOver?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
  onDrop?: (event: DragEvent) => void
  onClick?: () => void
  children: ReactNode
}

const hiddenInputStyle: CSSProperties = { display: "none" }

/**
 * Hidden file input paired with a click-and-drop target area. All selection and
 * drag handling arrives via props; the dropzone style is supplied by the caller.
 */
export function DropzoneSurface({
  fileInputRef,
  onFileChange,
  accept = "image/*",
  style,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  children,
}: DropzoneSurfaceProps) {
  return (
    <>
      <Input
        type="file"
        ref={fileInputRef}
        style={hiddenInputStyle}
        accept={accept}
        onChange={onFileChange}
      />
      <Frame
        wrapperElement="div"
        style={style}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
      >
        {children}
      </Frame>
    </>
  )
}
