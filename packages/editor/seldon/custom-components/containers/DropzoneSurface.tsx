import {
  ChangeEvent,
  CSSProperties,
  DragEvent,
  ReactNode,
  Ref,
} from "react"

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
      <input
        type="file"
        ref={fileInputRef}
        style={hiddenInputStyle}
        accept={accept}
        onChange={onFileChange}
      />
      <div
        style={style}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
      >
        {children}
      </div>
    </>
  )
}
