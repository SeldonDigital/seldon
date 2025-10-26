import { HasProjects } from "@components/projects/HasProjects"
import { ProjectsScreen } from "@components/projects/ProjectsScreen"
import { DesignSystemsSection } from "@components/projects/sections/DesignSystemsSection"
import { HeroSection } from "@components/projects/sections/HeroSection"
import { ProjectsSection } from "@components/projects/sections/ProjectsSection"
import { TemplatesSection } from "@components/projects/sections/TemplatesSection"
import { UnifiedHeader } from "@components/unified-header/UnifiedHeader"

export function Homepage() {
  return (
    <>
      <UnifiedHeader />
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
