"use client"

import { useProjects } from "@lib/api/hooks/use-projects"

/**
 * If inverted is false, it will return children if there are projects.
 * If inverted is true, it will return children if there are no projects.
 */
export const HasProjects = ({
  children,
  inverted = false,
}: {
  children: React.ReactNode
  inverted?: boolean
}) => {
  const { data: projects } = useProjects()

  if (inverted === false) {
    if (!projects || projects.length === 0) {
      return null
    }

    return children
  } else {
    if (projects && projects.length > 0) {
      return null
    }

    return children
  }
}
