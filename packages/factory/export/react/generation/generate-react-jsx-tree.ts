import { ComponentLevel } from "@seldon/core/components/constants"
import { NodeIdToClass } from "../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../types"
import { getHumanReadablePropName } from "../discovery/get-human-readable-prop-name"
import {
  getComponentIdFromComponent,
  getComponentIdFromName,
  validateComponentProps,
} from "../validation/validate-component-props"

/**
 * Generate JSX tree content for components with children using clean pattern
 */
export function generateJSXTree(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
): string {
  const { tree, config } = component

  // For simple components with one child, use inline format
  if (
    Array.isArray(tree.children) &&
    tree.children.length === 1 &&
    !tree.children[0].children
  ) {
    const child = tree.children[0]
    const propsName =
      propNamesMap.get(child.dataBinding.path) ||
      getHumanReadablePropName(child.dataBinding.path, {
        simplifiedPropNames: true,
        parentComponentName: component.name,
      })
    const propsVarName = `${propsName}Props`

    return `return <${config.react.returns} className={frameClassName} {...props}>
        <${child.name} {...${propsVarName}} />
    </${config.react.returns}>`
  }

  // For more complex components, use multi-line format with parentheses
  let content = `return (\n    <${config.react.returns} className={frameClassName} {...props}>`

  if (Array.isArray(tree.children)) {
    // Validate component props against schema
    const componentId = getComponentIdFromComponent(component)
    const validation = componentId
      ? validateComponentProps(component.name, componentId, tree.children)
      : {
          validProps: tree.children,
          invalidProps: [],
          componentHasFewerPropsThanSchema: false,
        }

    // Process all children in their original order, maintaining position
    tree.children.forEach((node) => {
      const isValidProp = Array.isArray(validation.validProps)
        ? validation.validProps.some(
            (validNode: JSONTreeNode) =>
              validNode.dataBinding.path === node.dataBinding.path,
          )
        : false

      if (isValidProp) {
        // Handle valid props normally
        if (node.level === ComponentLevel.FRAME) {
          content += generateFrameComponent(
            node,
            component,
            nodeIdToClass,
            propNamesMap,
          )
        } else {
          content += generateRegularComponent(
            node,
            component,
            nodeIdToClass,
            propNamesMap,
          )
        }
      } else {
        // Handle invalid props as inline custom components
        content += generateCustomComponent(
          node,
          component,
          nodeIdToClass,
          propNamesMap,
        )
      }
    })
  }

  content += `\n    </${config.react.returns}>\n  )`
  return content
}

/**
 * Generate a frame component using clean pattern
 */
function generateFrameComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
): string {
  const propsName =
    propNamesMap.get(node.dataBinding.path) ||
    getHumanReadablePropName(node.dataBinding.path, {
      simplifiedPropNames: true,
      parentComponentName: component.name,
    })

  const propsVarName = `${propsName}Props`

  let content = `\n      <Frame {...${propsVarName}}>`
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => {
      content += generateRegularComponent(
        child,
        component,
        nodeIdToClass,
        propNamesMap,
      )
    })
  }
  content += `\n      </Frame>`
  return content
}

/**
 * Generate a regular component using clean pattern
 */
function generateRegularComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
): string {
  const propsName =
    propNamesMap.get(node.dataBinding.path) ||
    getHumanReadablePropName(node.dataBinding.path, {
      simplifiedPropNames: true,
      parentComponentName: component.name,
    })

  if (Array.isArray(node.children)) {
    // Validate child component props against its schema
    const childComponentId = getComponentIdFromName(node.name)
    const childValidation = childComponentId
      ? validateComponentProps(node.name, childComponentId, node.children)
      : {
          validProps: node.children,
          invalidProps: [],
          componentHasFewerPropsThanSchema: false,
        }

    // If the child component has invalid props, render it inline instead of as a component call
    if (childValidation.invalidProps.length > 0) {
      return generateInlineComponent(
        node,
        component,
        propsName,
        nodeIdToClass,
        propNamesMap,
        childValidation,
      )
    } else {
      return generateNormalComponentWithValidProps(
        node,
        component,
        propsName,
        nodeIdToClass,
        propNamesMap,
        childValidation,
      )
    }
  } else {
    // No children, render as simple component
    const propsVarName = `${propsName}Props`
    return `\n        <${node.name} {...${propsVarName}} />`
  }
}

/**
 * Generate custom component when extra props are present using clean pattern
 */
function generateCustomComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
): string {
  const propName =
    propNamesMap.get(node.dataBinding.path) ||
    getHumanReadablePropName(node.dataBinding.path, {
      simplifiedPropNames: true,
      parentComponentName: component.name,
    })

  const propsVarName = `${propName}Props`

  // Check if this component has children that should be passed as props
  let childPropsString = ""
  if (Array.isArray(node.children) && node.children.length > 0) {
    const childChildProps: string[] = []
    // Generate section-specific prop names for custom components
    const sectionPropNames = new Map<string, string>()
    const sectionBaseNameCounts = new Map<string, number>()

    node.children.forEach((grandchild) => {
      // Get the base prop name relative to this section
      const basePropName = getHumanReadablePropName(
        grandchild.dataBinding.path,
        {
          simplifiedPropNames: true,
          parentComponentName: node.name,
        },
      )

      // Extract base name for counting
      const baseName = basePropName.replace(/\d+$/, "").replace(/Props$/, "")

      // Count occurrences within this section
      const currentCount = sectionBaseNameCounts.get(baseName) || 0
      const newCount = currentCount + 1
      sectionBaseNameCounts.set(baseName, newCount)

      // Generate section-specific prop name
      let sectionPropName: string
      if (newCount === 1) {
        sectionPropName = basePropName
      } else {
        if (basePropName.endsWith("Props")) {
          const baseWithoutProps = basePropName.replace(/Props$/, "")
          sectionPropName = `${baseWithoutProps}${newCount}Props`
        } else {
          sectionPropName = `${baseName}${newCount}`
        }
      }

      sectionPropNames.set(grandchild.dataBinding.path, sectionPropName)
    })

    node.children.forEach((grandchild) => {
      const sectionPropName = sectionPropNames.get(grandchild.dataBinding.path)!
      const grandchildPropsVarName = `${sectionPropName}Props`
      childChildProps.push(`${sectionPropName}={${grandchildPropsVarName}}`)
    })

    if (childChildProps.length > 0) {
      childPropsString = " " + childChildProps.join(" ")
    }
  }

  return `\n      {${propName} && (
        <${node.name} {...${propsVarName}}${childPropsString} />
      )}`
}

/**
 * Generate inline component when child has extra props present using clean pattern
 */
function generateInlineComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  propsName: string,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
  childValidation: any,
): string {
  const topLevelElement = "Frame"
  const propsVarName = `${propsName}Props`

  let content = `\n      <${topLevelElement} {...${propsVarName}}>`

  // Render all child components in their original order
  if (Array.isArray(node.children)) {
    node.children.forEach((child: JSONTreeNode) => {
      const childIsValid = childValidation.validProps.some(
        (validChild: JSONTreeNode) =>
          validChild.dataBinding.path === child.dataBinding.path,
      )

      const childPropName =
        propNamesMap.get(child.dataBinding.path) ||
        getHumanReadablePropName(child.dataBinding.path, {
          simplifiedPropNames: true,
          parentComponentName: component.name,
        })

      const childPropsVarName = `${childPropName}Props`
      let childPropsString = ""

      if (Array.isArray(child.children) && child.children.length > 0) {
        const childChildProps: string[] = []
        child.children.forEach((grandchild: JSONTreeNode) => {
          const grandchildPropName =
            propNamesMap.get(grandchild.dataBinding.path) ||
            getHumanReadablePropName(grandchild.dataBinding.path, {
              simplifiedPropNames: true,
              parentComponentName: component.name,
            })

          const childComponentPropName = grandchildPropName.replace(/\d+$/, "")
          const grandchildPropsVarName = `${grandchildPropName}Props`
          childChildProps.push(
            `${childComponentPropName}={${grandchildPropsVarName}}`,
          )
        })

        if (childChildProps.length > 0) {
          childPropsString = " " + childChildProps.join(" ")
        }
      }

      if (childIsValid) {
        content += `\n        <${child.name} {...${childPropsVarName}}${childPropsString} />`
      } else {
        content += `\n        {${childPropName} && (
          <${child.name} {...${childPropsVarName}}${childPropsString} />
        )}`
      }
    })
  }

  content += `\n      </${topLevelElement}>`
  return content
}

/**
 * Generate normal component when all child props are valid using clean pattern
 */
function generateNormalComponentWithValidProps(
  node: JSONTreeNode,
  component: ComponentToExport,
  propsName: string,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
  childValidation: any,
): string {
  const propsVarName = `${propsName}Props`

  const usedChildPropNames = new Set<string>()
  const usedGrandchildPropNames = new Set<string>()

  let childProps: string[] = []

  // Process all props in the order they appear in propNamesMap
  const orderedPropNames = Array.from(propNamesMap.entries())

  for (const [path, propName] of orderedPropNames) {
    // Check if this prop belongs to our current node's valid children or their children
    let foundChild: JSONTreeNode | null = null
    let isDirectChild = false

    // Check if it's a direct child
    for (const child of childValidation.validProps) {
      if (child.dataBinding.path === path) {
        foundChild = child
        isDirectChild = true
        break
      }
    }

    // Check if it's a grandchild
    if (!foundChild) {
      for (const child of childValidation.validProps) {
        if (Array.isArray(child.children)) {
          for (const grandchild of child.children) {
            if (grandchild.dataBinding.path === path) {
              foundChild = grandchild
              isDirectChild = false
              break
            }
          }
        }
        if (foundChild) break
      }
    }

    if (foundChild) {
      if (isDirectChild) {
        // Handle direct child
        let baseName = getHumanReadablePropName(path, {
          simplifiedPropNames: true,
          parentComponentName: node.name,
        }).replace(/\d+$/, "")

        let childPropName = baseName
        let counter = 2
        while (usedChildPropNames.has(childPropName)) {
          if (baseName.endsWith("Props")) {
            childPropName = baseName.replace("Props", `${counter}Props`)
          } else {
            childPropName = `${baseName}${counter}`
          }
          counter++
        }
        usedChildPropNames.add(childPropName)

        const childPropsVarName = `${propName}Props`
        childProps.push(`${childPropName}={${childPropsVarName}}`)
      } else {
        // Handle grandchild
        // Get the base name for the grandchild prop (e.g., icon, label)
        let grandchildBaseName =
          foundChild.name.charAt(0).toLowerCase() + foundChild.name.slice(1)

        // Handle numbered grandchildren (icon2, label2, etc.)
        const grandchildMatch = propName.match(/(\w+?)(\d+)$/)
        if (grandchildMatch) {
          grandchildBaseName = grandchildMatch[1]
        }

        // Generate unique prop name for grandchild to avoid duplicates
        let finalGrandchildPropName = grandchildBaseName
        let grandchildCounter = 2
        while (usedGrandchildPropNames.has(finalGrandchildPropName)) {
          finalGrandchildPropName = `${grandchildBaseName}${grandchildCounter}`
          grandchildCounter++
        }
        usedGrandchildPropNames.add(finalGrandchildPropName)

        const grandchildPropsVarName = `${propName}Props`
        childProps.push(
          `${finalGrandchildPropName}={${grandchildPropsVarName}}`,
        )
      }
    }
  }

  const allProps = [`{...${propsVarName}}`, ...childProps].join(" ")
  return `\n        <${node.name} ${allProps} />`
}

// Export with the expected name for tests
export const generateReactJsxTree = generateJSXTree
