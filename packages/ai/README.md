# Seldon · AI

Seldon AI explores turning a chat message into Seldon **workspace actions** with a local model. It reads a workspace for context, runs a tool-calling agent loop with [Pi](https://pi.dev) against a local model through Ollama, and returns a list of `WorkspaceAction` payloads. The editor applies those actions through the same reducer every gesture uses. Nothing leaves the machine, and the package never writes the workspace file itself.

Core owns the workspace and its rules. This package only reads a workspace and proposes actions.

---

## Important ##
This package is in research mode. Everything here is exploratory and may change or be removed. Treat the entry points, prompts, and model choice as experiments, not stable API. Do not depend on it in production.

---

## What The Package Contains

The package groups a few parts that work together:

| Area | Role | Reference |
| --- | --- | --- |
| **Orchestration** | Run one chat turn from request to actions | [orchestrate.ts](./orchestrate.ts) |
| **Pi harness** | Build the session, tools, and turn loop | [pi/](./pi) |
| **System prompt** | Hold the static rules for the agent | [pi/system-prompt.ts](./pi/system-prompt.ts) |
| **Editor context** | Build the per-turn editor context | [pi/editor-context.ts](./pi/editor-context.ts) |
| **Context sections** | Build the reusable context blocks | [prompt/context-sections/](./prompt/context-sections) |
| **Repair** | Fix common shape mistakes before validation | [repair/normalize-actions.ts](./repair/normalize-actions.ts) |
| **Action schema** | List the allowed actions and their payload specs | [schema/action-schema.ts](./schema/action-schema.ts) |
| **Model** | Resolve the local Ollama model for Pi | [pi/model.ts](./pi/model.ts) |

The package imports workspace types, catalogs, and compute from `@seldon/core`. It does not fork property or theme rules.

---

## Local Model

Pi targets a local Ollama model through its OpenAI-compatible endpoint at `http://127.0.0.1:11434/v1`. The endpoint needs no API key. The default model is `gpt-oss:20b`. Tool-calling on small models is the main open question, so a turn may need a larger model.

Install [Ollama](https://ollama.com), start it, and pull the default model:

```bash
brew install ollama
ollama serve
ollama pull gpt-oss:20b
```

On Linux, install Ollama with the official script instead of Homebrew:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

### Environment variables

Pi reads these from `process.env` in [pi/model.ts](./pi/model.ts). An explicit call argument wins first, then the environment variable, then the default.

| Variable | Default | Purpose |
| --- | --- | --- |
| `SELDON_AI_MODEL` | `gpt-oss:20b` | Model id the agent requests |
| `OLLAMA_HOST` | `http://127.0.0.1:11434` | Base URL of the Ollama server |

The agent runs inside the editor dev server. Set a variable inline when you start it from the repo root with `npm run dev`:

```bash
# Use a larger model for one run
SELDON_AI_MODEL="qwen3:8b" npm run dev

# Point at Ollama on another machine
OLLAMA_HOST="http://192.168.1.20:11434" npm run dev
```

Export a variable to reuse it across every command in the shell session:

```bash
export SELDON_AI_MODEL="qwen3:8b"
npm run dev
```

---

## How Callers Use It

The entry point is `chatToActions`. It takes a workspace, a message, and the active board, and returns actions with a short reply.

```typescript
import { chatToActions } from "@seldon/ai"

const { actions, reply } = await chatToActions({
  workspace,
  message: "Make the title use the primary color",
  activeBoardKey,
})
```

`chatToActions` builds a hermetic Pi session with the Seldon tools, injects the per-turn editor context with the user request, and lets the model call tools until it is done. The caller applies the returned actions. This function never changes state.

The model never writes the workspace. All file tools are off, and each Seldon tool only proposes a `WorkspaceAction`. A tool dry-runs the action against an in-memory working copy through the reducer, returns the reducer's error text to the model on rejection, and accumulates accepted actions.

---

## Context

The context is a small summary, not the full workspace file. It lists the active board's node tree with the ids to target, the property vocabulary and value shapes for those components, the hierarchy rules, the theme ids and token ids, and the component catalog ids. The model needs identity and structure, not every property override.

Each part is one context section under [prompt/context-sections/](./prompt/context-sections). [pi/editor-context.ts](./pi/editor-context.ts) builds the compact per-turn context, and the read tools in [pi/tools/context.ts](./pi/tools/context.ts) surface the larger sections on demand. A section drops out when it has nothing to say.

---

## Action Set

The agent may emit a curated subset of `WorkspaceAction`. The allowed types come from [schema/action-schema.ts](./schema/action-schema.ts), and [pi/system-prompt.ts](./pi/system-prompt.ts) documents the payload shapes the model should produce. The mutation tools in [pi/tools/mutations.ts](./pi/tools/mutations.ts) expose those actions. The reducer validates every payload when the editor applies it, so an invalid action is rejected without changing state.

---

## Further Reading

| Topic | Document |
| --- | --- |
| Core | [../core/README.md](../core/README.md) |
| Factory | [../factory/README.md](../factory/README.md) |
| Editor | [../editor/README.md](../editor/README.md) |
| Vocabulary | [GLOSSARY.md](../../GLOSSARY.md) |

---

## Licensing

Seldon is offered under the **PolyForm Noncommercial License 1.0.0** by default, with a separate commercial license for commercial use.

### 1. Noncommercial license

The default software license is the **PolyForm Noncommercial License 1.0.0**.

- You may use, copy, and modify this software for **noncommercial purposes** such as research, education, and personal projects.
- Commercial use is **not permitted** under this license.
- See [license/noncommercial/LICENSE.md](../../license/noncommercial/LICENSE.md) for the summary and link to the full PolyForm text.

### 2. Commercial license

Commercial use covers proprietary software, SaaS platforms, internal business tools, and use as training data for AI or LLMs. You need a **commercial license** for these.

The commercial license may grant:

- Use in commercial or for-profit contexts.
- Ability to create proprietary derivative works as stated in your agreement.
- Long-term support, security updates, and priority bug fixes if offered by the licensor.
- Optional custom terms negotiated with the licensor.

See [COMMERCIAL-LICENSE.md](../../license/commercial/COMMERCIAL-LICENSE.md).

### 3. Obtaining a commercial license

Contact:

- **Licensor:** Seldon Digital, B.V.
- **Email:** info@seldon.digital

### 4. Summary

| Use | Requirement |
| --- | --- |
| Noncommercial use | PolyForm Noncommercial License 1.0.0 |
| Commercial use | Paid commercial license |

---

## Links

- [Core](../core/README.md)
- [Factory](../factory/README.md)
- [Editor](../editor/README.md)
- [Official Website](https://seldon.digital)
- [Issues & Discussions](https://github.com/seldon/issues)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
