import { CSSProperties, ChangeEvent, useCallback } from "react"
import { Frame } from "@seldon/components/frames/Frame"
import { Input } from "@seldon/components/primitives/Input"
import { TextSubtitle } from "@seldon/components/primitives/TextSubtitle"
import type { EntryNodeLevel } from "@seldon/core/workspace/model/entry-node"
import {
  AUTHORED_LEVEL_OPTIONS,
  AuthoredRootKind,
} from "./hooks/use-create-component-panel"

interface CreateComponentFormProps {
  name: string
  setName: (value: string) => void
  rootKind: AuthoredRootKind
  setRootKind: (value: AuthoredRootKind) => void
  level: EntryNodeLevel
  setLevel: (value: EntryNodeLevel) => void
  intent: string
  setIntent: (value: string) => void
  tags: string
  setTags: (value: string) => void
  nameError: string | null
}

/**
 * Hand-authored form body for the Create Component dialog. Collects the
 * authored component's root kind, name, declared level, intent, and tags. The
 * dialog shell owns the title and footer buttons; this frame owns the fields.
 * Raw select controls keep this view bespoke.
 */
export function CreateComponentForm({
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
}: CreateComponentFormProps) {
  const onNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    [setName],
  )
  const onRootKindChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      setRootKind(event.target.value as AuthoredRootKind),
    [setRootKind],
  )
  const onLevelChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      setLevel(event.target.value as EntryNodeLevel),
    [setLevel],
  )
  const onIntentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setIntent(event.target.value),
    [setIntent],
  )
  const onTagsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTags(event.target.value),
    [setTags],
  )

  const levelOptions = AUTHORED_LEVEL_OPTIONS.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))

  const nameErrorNode = nameError ? (
    <TextSubtitle style={styles.error}>{nameError}</TextSubtitle>
  ) : null

  return (
    <Frame wrapperElement="div" style={styles.form}>
      <Frame wrapperElement="div" style={styles.field}>
        <TextSubtitle style={styles.label}>Root</TextSubtitle>
        <select
          value={rootKind}
          onChange={onRootKindChange}
          style={styles.select}
          data-testid="create-component-root"
        >
          <option value="container">Container</option>
          <option value="frame">Frame</option>
        </select>
      </Frame>

      <Frame wrapperElement="div" style={styles.field}>
        <TextSubtitle style={styles.label}>Name</TextSubtitle>
        <Input
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Pricing Panel"
          autoFocus
          style={styles.input}
          data-testid="create-component-name"
        />
        {nameErrorNode}
      </Frame>

      <Frame wrapperElement="div" style={styles.field}>
        <TextSubtitle style={styles.label}>Level</TextSubtitle>
        <select
          value={level}
          onChange={onLevelChange}
          style={styles.select}
          data-testid="create-component-level"
        >
          {levelOptions}
        </select>
      </Frame>

      <Frame wrapperElement="div" style={styles.field}>
        <TextSubtitle style={styles.label}>Intent</TextSubtitle>
        <Input
          type="text"
          value={intent}
          onChange={onIntentChange}
          placeholder="What this component is for"
          style={styles.input}
          data-testid="create-component-intent"
        />
      </Frame>

      <Frame wrapperElement="div" style={styles.field}>
        <TextSubtitle style={styles.label}>Tags</TextSubtitle>
        <Input
          type="text"
          value={tags}
          onChange={onTagsChange}
          placeholder="Comma separated"
          style={styles.input}
          data-testid="create-component-tags"
        />
      </Frame>

      <TextSubtitle style={styles.note}>
        The name must be unique in this workspace. The same name in another
        workspace can still collide on export.
      </TextSubtitle>
    </Frame>
  )
}

const styles: Record<string, CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--sdn-gaps-comfortable)",
    width: "100%",
    padding: "var(--sdn-margins-comfortable)",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--sdn-gaps-tight)",
    width: "100%",
  },
  label: {
    width: "100%",
  },
  input: {
    width: "100%",
  },
  select: {
    width: "100%",
  },
  error: {
    width: "100%",
    color: "var(--sdn-swatch-punch)",
  },
  note: {
    width: "100%",
    opacity: 0.7,
  },
}
