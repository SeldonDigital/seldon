import { cn } from "@lib/utils/cn"
import React, { useEffect, useRef, useState } from "react"

type ResizableContainerProps = {
  children: React.ReactNode
  id?: string
  className?: string
}

export function ResizableContainer({
  children,
  id,
  className,
}: ResizableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartY(e.clientY)
    setStartHeight(containerRef.current?.clientHeight || 0)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaY = e.clientY - startY
      const newHeight = Math.max(startHeight + deltaY, 50) // Minimum height of 50px
      if (containerRef.current) {
        containerRef.current.style.height = `${newHeight}px`
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startY, startHeight])

  useEffect(() => {
    if (id && containerRef.current) {
      containerRef.current.style.height = "auto"
      setStartHeight(containerRef.current.clientHeight)
    }
  }, [id])

  return (
    <div className="relative flex flex-col">
      <div
        ref={containerRef}
        className={cn("h-auto overflow-auto", className)}
        style={{
          maxHeight: "480px",
        }}
      >
        {children}
      </div>
      <div className="flex w-full items-center justify-center">
        <button
          className={cn(
            "flex h-3 w-16 cursor-grab items-center justify-center opacity-30 outline-none transition-opacity duration-150",
            "hover:opacity-50",
            isDragging && "cursor-grabbing",
          )}
          onMouseDown={handleMouseDown}
        >
          <span className="block h-[3px] w-8 rounded bg-pearl"></span>
        </button>
      </div>
    </div>
  )
}
