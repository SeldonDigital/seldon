"use client"

import { DEFAULT_CHROME_THEME } from "@lib/chrome/chrome-themes"
import { MenuController } from "@lib/menus/MenuController"
import { MenuEntry } from "@lib/menus/types"
import { motion, useDragControls } from "framer-motion"
import {
  CSSProperties,
  ChangeEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useHotkeys } from "react-hotkeys-hook"
import {
  AUTHORED_LEVEL_OPTIONS,
  useCreateComponentPanel,
} from "./hooks/use-create-component-panel"
import { DialogCreateComponent } from "@seldon/components/modules/DialogCreateComponent"

/**
 * Gate for the Create Component dialog. Mounts the dialog only while the
 * "create-component" panel is active so it recenters on each open, matching the
 * catalog dialogs.
 */
export function CreateComponentController() {
  const panel = useCreateComponentPanel()

  if (!panel.isOpen) return null

  return <CreateComponentDialog {...panel} />
}

type CreateComponentDialogProps = ReturnType<typeof useCreateComponentPanel>

/**
 * View-model for the Create Component dialog. Renders the authored
 * `DialogCreateComponent`, which supplies all copy, icons, and placeholders as
 * baked defaults. This controller only wires behavior: the root-kind items act
 * as a radio pair, the name/intent/tags inputs are controlled, the level field
 * opens a menu of the declarable levels, and the footer buttons cancel and
 * create. The dialog keeps its authored size and is not resizable.
 */
function CreateComponentDialog({
  name,
  setName,
  rootKind,
  setRootKind,
  level,
  setLevel,
  intent,
  setIntent,
  tags,
  setTags,
  nameError,
  canSubmit,
  save,
  close,
}: CreateComponentDialogProps) {
  useHotkeys("esc", close)

  const dragControls = useDragControls()
  const startDrag = useCallback(
    (event: PointerEvent) => dragControls.start(event),
    [dragControls],
  )

  const [levelOpen, setLevelOpen] = useState(false)
  const levelAnchorRef = useRef<HTMLElement | null>(null)

  const onNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    [setName],
  )
  const onIntentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setIntent(event.target.value),
    [setIntent],
  )
  const onTagsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTags(event.target.value),
    [setTags],
  )
  const selectFrame = useCallback(() => setRootKind("frame"), [setRootKind])
  const selectContainer = useCallback(
    () => setRootKind("container"),
    [setRootKind],
  )
  const openLevel = useCallback((event: MouseEvent) => {
    levelAnchorRef.current = event.currentTarget as HTMLElement
    setLevelOpen(true)
  }, [])
  const closeLevel = useCallback(() => setLevelOpen(false), [])

  const levelLabel = useMemo(
    () =>
      AUTHORED_LEVEL_OPTIONS.find((option) => option.value === level)?.label ??
      "",
    [level],
  )
  const levelItems = useMemo<MenuEntry[]>(
    () =>
      AUTHORED_LEVEL_OPTIONS.map((option) => ({
        id: option.value,
        label: option.label,
        selected: option.value === level,
        active: option.value === level,
        activeMarker: "bullet",
        onSelect: () => setLevel(option.value),
      })),
    [level, setLevel],
  )

  const frameSelected = rootKind === "frame"
  const containerSelected = rootKind === "container"
  const frameItemStyle = frameSelected ? styles.optionSelected : styles.option
  const containerItemStyle = containerSelected
    ? styles.optionSelected
    : styles.option
  const nameInvalid = nameError ? "true" : undefined
  const confirmStyle = canSubmit ? undefined : styles.disabled

  // The title bar is the drag handle; the surface itself is not resizable.
  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const cancelButton = { onClick: close }
  const confirmButton = {
    onClick: save,
    "aria-disabled": !canSubmit,
    style: confirmStyle,
  }
  // The level field is read-only display; the value comes from the menu.
  const levelInput = {
    value: levelLabel,
    readOnly: true,
    style: styles.levelInput,
  }

  // Each of these slots gates its subtree and ships baked authored content but
  // no signature default, so an empty object turns the slot on and renders that
  // authored copy, icon, or placeholder. Interactive behavior rides in through
  // `seldonRefs`.
  const showSlot = {}

  const seldonRefs = {
    createComponentFrame: {
      onClick: selectFrame,
      role: "radio",
      "aria-checked": frameSelected ? "true" : "false",
      "aria-selected": frameSelected || undefined,
      style: frameItemStyle,
    },
    createComponentContainer: {
      onClick: selectContainer,
      role: "radio",
      "aria-checked": containerSelected ? "true" : "false",
      "aria-selected": containerSelected || undefined,
      style: containerItemStyle,
    },
    createComponentName: {
      value: name,
      onChange: onNameChange,
      autoFocus: true,
      "aria-invalid": nameInvalid,
    },
    createComponentLevel: {
      onClick: openLevel,
      "aria-expanded": levelOpen,
      style: styles.levelField,
    },
    createComponentIntent: {
      value: intent,
      onChange: onIntentChange,
    },
    createComponentTags: {
      value: tags,
      onChange: onTagsChange,
    },
  }

  return (
    <ModalPortal onClose={close} dragControls={dragControls}>
      <DialogCreateComponent
        data-testid="create-component-dialog"
        bar={barHandle}
        textTitle={showSlot}
        itemCatalog={showSlot}
        icon={showSlot}
        textTitle2={showSlot}
        textSubtitle={showSlot}
        itemCatalog2={showSlot}
        icon2={showSlot}
        textTitle3={showSlot}
        textSubtitle2={showSlot}
        formControl={showSlot}
        textLabel={showSlot}
        formControlCombobox={showSlot}
        textLabel2={showSlot}
        input2={levelInput}
        formControl2={showSlot}
        textLabel3={showSlot}
        formControl3={showSlot}
        textLabel4={showSlot}
        button={cancelButton}
        textLabel5={showSlot}
        button2={confirmButton}
        textLabel6={showSlot}
        seldonRefs={seldonRefs}
      />
      <MenuController
        open={levelOpen}
        anchorRef={levelAnchorRef}
        onClose={closeLevel}
        items={levelItems}
      />
    </ModalPortal>
  )
}

interface ModalPortalProps {
  onClose: () => void
  dragControls: ReturnType<typeof useDragControls>
  children: ReactNode
}

/**
 * Centered, draggable, non-resizable modal surface. Portals to the document
 * body and pins the canvas theme via `data-theme`, matching `Canvas`, so the
 * authored dialog resolves the same swatch and high-contrast palette as the
 * board on the canvas. It deliberately omits `data-mode`: the editor chrome's
 * light/dark mode never applies to authored design content, only to chrome. The
 * surface drags from its title bar through `dragControls` and sizes to its
 * content, so it is not resizable. Clicking the backdrop closes.
 */
function ModalPortal({ onClose, dragControls, children }: ModalPortalProps) {
  const stopPropagation = useCallback(
    (event: MouseEvent) => event.stopPropagation(),
    [],
  )

  return createPortal(
    <div data-theme={DEFAULT_CHROME_THEME} style={styles.scope}>
      <div onClick={onClose} style={styles.overlay}>
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={false}
          onClick={stopPropagation}
          style={styles.surface}
        >
          {children}
        </motion.div>
      </div>
    </div>,
    document.body,
  )
}

const styles: Record<string, CSSProperties> = {
  scope: {
    display: "contents",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  surface: {
    width: "fit-content",
    height: "fit-content",
    WebkitFontSmoothing: "auto",
  },
  dragHandle: {
    cursor: "grab",
    userSelect: "none",
    touchAction: "none",
  },
  option: {
    cursor: "pointer",
  },
  optionSelected: {
    cursor: "pointer",
  },
  levelField: {
    cursor: "pointer",
  },
  levelInput: {
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}
