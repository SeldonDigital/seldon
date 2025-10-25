import { HasProjects } from "@components/projects/HasProjects"
import { ProjectsScreen } from "@components/projects/ProjectsScreen"
import { SetQueryData } from "@components/projects/SetInitialProjectsData"
import { DesignSystemsSection } from "@components/projects/sections/DesignSystemsSection"
import { HeroSection } from "@components/projects/sections/HeroSection"
import { ProjectsSection } from "@components/projects/sections/ProjectsSection"
import { TemplatesSection } from "@components/projects/sections/TemplatesSection"
import { QueryKeys } from "@lib/api/query-keys"

export function Homepage() {
  return (
    <>
      <SetQueryData queryKey={QueryKeys.projects} initialData={[]} />
      <ProjectsScreen>
        <HeroSection firstName={"creator"} />
        <HasProjects>
          <ProjectsSection />
          <hr className="border-charcoal mt-8" />
        </HasProjects>
        <TemplatesSection />
        <hr className="border-charcoal mt-8" />
        <DesignSystemsSection />
      </ProjectsScreen>
    </>
  )
}
