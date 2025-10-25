"use client"

import { useProjects } from "@lib/api/hooks/use-projects"
import { Grid } from "../Grid"
import { ImportProjectButton } from "../ImportProjectButton"
import { NewProjectButton } from "../NewProjectButton"
import { ProjectCard } from "../ProjectCard"
import { Section } from "../Section"

export const ProjectsSection = () => {
  const { data: projects } = useProjects()

  return (
    <Section
      className="z-10"
      title="Projects"
      slots={{
        header: {
          trailing: (
            <>
              <NewProjectButton />
              <ImportProjectButton />
            </>
          ),
        },
      }}
    >
      <Grid>
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            testId={`project-${project.id}`}
          />
        ))}
      </Grid>
    </Section>
  )
}
