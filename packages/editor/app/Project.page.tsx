import "tldraw/tldraw.css"

import { Editor } from "@components/Editor"
import { ErrorPage } from "@components/ui/ErrorPage"
import { LoadingPage } from "@components/ui/LoadingPage"
import { UnifiedHeader } from "@components/unified-header/UnifiedHeader"
import { useProject } from "@lib/api/hooks/use-project"
import { ReactNode } from "react"
import { useParams } from "wouter"

import { ProjectInitialize } from "../components/ProjectInitialize"
import { ProjectSync } from "../components/ProjectSync"

export interface ProjectPageProps {}

export function ProjectPage(props: ProjectPageProps) {
  const { projectId } = useParams<{ projectId: string }>()

  const project = useProject(projectId)

  let renderEl: ReactNode = null

  if (project.isPending) {
    renderEl = <LoadingPage />
  } else if (project.data) {
    renderEl = (
      <>
        <Editor />
        <ProjectSync />
        <ProjectInitialize initialData={project.data} />
      </>
    )
  } else {
    renderEl = (
      <ErrorPage
        title="Oops! Something went wrong"
        description={
          <>
            Our editor needs a quick restart.
            <br />
            We&apos;ve been notified and we&apos;re on it.
          </>
        }
        error={project.error.message}
        reloadButtonLabel="Restart"
      />
    )
  }

  return <ProjectPageLayout>{renderEl}</ProjectPageLayout>
}

export interface ProjectPageLayoutProps {
  children: ReactNode
}

export function ProjectPageLayout(props: ProjectPageLayoutProps) {
  return (
    <>
      <UnifiedHeader />
      {props.children}
    </>
  )
}
