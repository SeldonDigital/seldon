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
  const [isHandleHovered, setIsHandleHovered] = useState(false)
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
    <div
      style={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      <div
        ref={containerRef}
        className={className}
        style={{
          height: "auto",
          overflow: "auto",
          maxHeight: "480px",
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            display: "flex",
            height: "0.75rem",
            width: "4rem",
            cursor: isDragging ? "grabbing" : "grab",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHandleHovered ? 0.5 : 0.3,
            outline: "none",
            transition: "opacity 150ms",
          }}
          onMouseEnter={() => setIsHandleHovered(true)}
          onMouseLeave={() => setIsHandleHovered(false)}
          onMouseDown={handleMouseDown}
        >
          <span
            style={{
              display: "block",
              height: "3px",
              width: "2rem",
              borderRadius: "var(--sdn-corners-tight)",
              backgroundColor: "#F5F5F5",
            }}
          ></span>
        </button>
      </div>
    </div>
  )
}
