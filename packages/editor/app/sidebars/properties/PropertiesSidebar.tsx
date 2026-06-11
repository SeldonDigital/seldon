import { usePropertiesSidebar } from "./hooks/use-properties-sidebar"
import { SidebarContainer } from "@seldon/components/custom-components"
import {
  sidebarNoSelectionStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { PropertyTree } from "./PropertyTree"

export function PropertiesSidebar() {
  const viewModel = usePropertiesSidebar()

  if (viewModel.kind === "empty") {
    return <SidebarContainer style={sidebarNoSelectionStyle} />
  }

  return (
    <SidebarContainer
      style={sidebarShellStyle}
      data-testid="properties-sidebar"
    >
      <PropertyTree {...viewModel.treeProps} />
    </SidebarContainer>
  )
}
