<script setup lang="ts">
import { createEmptyWorkspace } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
  type StoredWorkspace,
} from "@seldon/editor/lib/storage/workspace-store"
import { useToastStore } from "@lib/stores/toast-store"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const toast = useToastStore()
const workspaces = ref<StoredWorkspace[]>([])
const loading = ref(true)
const fileInput = ref<HTMLInputElement | null>(null)

async function refresh(): Promise<void> {
  loading.value = true
  workspaces.value = await listStoredWorkspaces()
  loading.value = false
}

async function create(): Promise<void> {
  const record = await createStoredWorkspace("Untitled", createEmptyWorkspace())
  router.push(`/${record.id}`)
}

function open(id: string): void {
  router.push(`/${id}`)
}

async function remove(id: string): Promise<void> {
  await deleteStoredWorkspace(id)
  await refresh()
}

async function duplicate(record: StoredWorkspace): Promise<void> {
  await createStoredWorkspace(`${record.name} copy`, record.workspace)
  await refresh()
}

function triggerImport(): void {
  fileInput.value?.click()
}

async function onImportFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return
  try {
    const parsed = JSON.parse(await file.text()) as
      | Partial<StoredWorkspace>
      | Workspace
    const workspace = ((parsed as Partial<StoredWorkspace>).workspace ??
      parsed) as Workspace
    if (!workspace || typeof workspace !== "object" || !("nodes" in workspace)) {
      toast.addToast("Invalid workspace file")
      return
    }
    const name =
      (parsed as Partial<StoredWorkspace>).name ??
      file.name.replace(/\.json$/i, "")
    const record = await createStoredWorkspace(name, workspace)
    router.push(`/${record.id}`)
  } catch {
    toast.addToast("Could not read workspace file")
  }
}

onMounted(refresh)
</script>

<template>
  <main class="home">
    <h1>Seldon Editor (Vue)</h1>
    <p class="home-subtitle">
      Workspaces are stored on your machine and shared with the React editor.
    </p>

    <div class="home-actions">
      <button class="home-create" @click="create">New workspace</button>
      <button class="home-import" @click="triggerImport">Import…</button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="home-file"
        @change="onImportFile"
      />
    </div>

    <p v-if="loading" class="home-empty">Loading…</p>
    <p v-else-if="workspaces.length === 0" class="home-empty">
      No workspaces yet.
    </p>

    <ul v-else class="home-list">
      <li v-for="ws in workspaces" :key="ws.id" class="home-item">
        <button class="home-item__open" @click="open(ws.id)">
          <span class="home-item__name">{{ ws.name }}</span>
          <span class="home-item__meta">
            {{ ws.lastEditor ?? "?" }} · {{ ws.updatedAt }}
          </span>
        </button>
        <button class="home-item__action" @click="duplicate(ws)">
          Duplicate
        </button>
        <button class="home-item__delete" @click="remove(ws.id)">Delete</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.home {
  padding: 3rem;
  max-width: 720px;
  margin: 0 auto;
  color: #18181b;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.home-subtitle {
  color: #52525b;
}
.home-actions {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0 2rem;
}
.home-create {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #18181b;
  color: #fff;
  cursor: pointer;
}
.home-import {
  padding: 0.5rem 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background: #fff;
  color: #18181b;
  cursor: pointer;
}
.home-file {
  display: none;
}
.home-item__action {
  padding: 0 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background: #fff;
  color: #18181b;
  cursor: pointer;
}
.home-empty {
  color: #a1a1aa;
}
.home-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.home-item {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}
.home-item__open {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  text-align: left;
}
.home-item__meta {
  font-size: 0.75rem;
  color: #a1a1aa;
}
.home-item__delete {
  padding: 0 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  background: #fff;
  color: #b91c1c;
  cursor: pointer;
}
</style>
