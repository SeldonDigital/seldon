import {
  sidebarNoSelectionStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { SidebarContainer } from "@seldon/components/elements/SidebarContainer"
import { PropertyTree } from "./PropertyTree"
import { usePropertiesSidebar } from "./hooks/use-properties-sidebar"

export function PropertiesSidebar() {
  const viewModel = usePropertiesSidebar()

  if (viewModel.kind === "empty") {
    return <SidebarContainer style={sidebarNoSelectionStyle} />
  }

  return (
    <SidebarContainer style={sidebarShellStyle} data-testid="properties-sidebar">
      <PropertyTree {...viewModel.treeProps} />
    </SidebarContainer>
  )
}
