import {
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"

type Direction = 1 | -1

interface PropertyEditRowEntry {
  ref: RefObject<HTMLElement | null>
  activate: () => void
  isNavigable: boolean
}

interface PropertyEditNavigationApi {
  register: (key: string, entry: PropertyEditRowEntry) => void
  unregister: (key: string) => void
  /**
   * Commits the move from `currentKey` to the next navigable, visible property
   * row in the given direction. Returns `true` when a target row was activated,
   * `false` when there is no adjacent row (start or end of the list).
   */
  moveFocus: (currentKey: string, direction: Direction) => boolean
}

const PropertyEditNavigationContext =
  createContext<PropertyEditNavigationApi | null>(null)

/**
 * Coordinates roving edit focus across property rows. Only the row being edited
 * mounts an input, so native Tab cannot reach the next field. Rows register
 * their frame element and an `activate` callback here; `moveFocus` orders the
 * registered rows by DOM position and enters edit mode on the adjacent one.
 */
export function PropertyEditNavigationProvider({
  children,
}: {
  children: ReactNode
}) {
  const rowsRef = useRef<Map<string, PropertyEditRowEntry>>(new Map())

  const register = useCallback((key: string, entry: PropertyEditRowEntry) => {
    rowsRef.current.set(key, entry)
  }, [])

  const unregister = useCallback((key: string) => {
    rowsRef.current.delete(key)
  }, [])

  const moveFocus = useCallback((currentKey: string, direction: Direction) => {
    const ordered = Array.from(rowsRef.current.entries())
      .filter(
        ([, entry]) =>
          entry.isNavigable &&
          entry.ref.current !== null &&
          // `offsetParent` is null for elements that are not rendered (e.g.
          // inside a collapsed section mid-animation), so skip them.
          entry.ref.current.offsetParent !== null,
      )
      .sort(([, a], [, b]) => {
        const aNode = a.ref.current
        const bNode = b.ref.current
        if (!aNode || !bNode) return 0
        const relation = aNode.compareDocumentPosition(bNode)
        if (relation & Node.DOCUMENT_POSITION_FOLLOWING) return -1
        if (relation & Node.DOCUMENT_POSITION_PRECEDING) return 1
        return 0
      })

    const currentIndex = ordered.findIndex(([key]) => key === currentKey)
    if (currentIndex === -1) return false

    const targetIndex = currentIndex + direction
    if (targetIndex < 0 || targetIndex >= ordered.length) return false

    const [, target] = ordered[targetIndex]
    target.activate()
    requestAnimationFrame(() => {
      target.ref.current?.scrollIntoView({ block: "nearest" })
    })
    return true
  }, [])

  const api = useMemo<PropertyEditNavigationApi>(
    () => ({ register, unregister, moveFocus }),
    [register, unregister, moveFocus],
  )

  return (
    <PropertyEditNavigationContext.Provider value={api}>
      {children}
    </PropertyEditNavigationContext.Provider>
  )
}

/**
 * Registers a property row with the edit-navigation coordinator for its
 * lifetime. `activate` enters edit mode on the row. `isNavigable` excludes rows
 * with no control, dimmed rows, and read-only rows from Tab traversal.
 */
export function usePropertyEditRowRegistration(
  key: string,
  ref: RefObject<HTMLElement | null>,
  activate: () => void,
  isNavigable: boolean,
) {
  const nav = useContext(PropertyEditNavigationContext)
  const activateRef = useRef(activate)
  activateRef.current = activate

  useEffect(() => {
    if (!nav) return
    nav.register(key, {
      ref,
      activate: () => activateRef.current(),
      isNavigable,
    })
    return () => nav.unregister(key)
  }, [nav, key, ref, isNavigable])
}

/** Returns the edit-navigation API, or `null` outside the provider. */
export function usePropertyEditNavigation(): PropertyEditNavigationApi | null {
  return useContext(PropertyEditNavigationContext)
}
