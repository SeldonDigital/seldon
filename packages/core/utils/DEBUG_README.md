# Debug Logger Usage Guide

The Seldon debug logger provides structured logging for debugging the system. Logs appear in different places depending on where the code runs.

## Where Logs Appear

### Client-Side Operations (Browser)
- **Location**: Browser DevTools Console (F12 or Cmd+Option+I)
- **Examples**: 
  - Workspace manipulation (duplicate, delete, insert, reorder nodes)
  - Schema conversion (adding boards)
  - Property setting

### Server-Side Operations (Node.js)
- **Location**: Terminal/Console where the server is running
- **Examples**:
  - Factory export to GitHub (runs in Next.js API route)
  - Factory export scripts
  - Server-side workspace computation (orchestration and resolution in core—see [`../workspace/compute/README.md`](../workspace/compute/README.md))

## Enabling Debug Mode

### Client-Side (Browser)
1. **Via Menu**: Help > Enable Debug Mode
2. **Via Console**: 
   ```javascript
   localStorage.setItem("debug-mode", JSON.stringify({state:{enabled:true},version:0}))
   ```

### Server-Side (Terminal)
1. **Environment Variable**: Set `DEBUG_MODE=true` in your `.env` file
2. **Command Line**: 
   ```bash
   DEBUG_MODE=true npm run dev
   ```
3. **Permanent**: Add to `.env.local`:
   ```
   DEBUG_MODE=true
   ```

## Testing Debug Logger

### Browser Console
```javascript
window.testDebugLogger()
```

### Terminal (Node.js)
```typescript
import { testDebugLogger } from "@seldon/core/utils/debug-logger"
testDebugLogger()
```

## Debug Categories

The logger uses categories to organize messages:
- **Schema**: Schema conversion into workspace nodes
- **Workspace**: Workspace manipulation (duplicate, delete, insert, reorder)
- **Factory**: Factory export from workspace into React components

## Example Output

```
[Factory: computeWorkspace] Computing workspace properties
[Factory: computeWorkspace] Starting workspace computation
  {
    "totalNodes": 42
  }
[Factory: computeWorkspace] Workspace computation complete
**********
```

## Troubleshooting

### No logs in browser console
1. Check that "Enable Debug Mode" is toggled on in the menu
2. Run `window.testDebugLogger()` to verify
3. Check localStorage: `localStorage.getItem("debug-mode")`

### No logs in terminal
1. Set `DEBUG_MODE=true` environment variable
2. Restart your dev server
3. Check that you're looking at the correct terminal (where the server is running)

### Mixed client/server operations
- Client-side operations → Browser console
- Server-side operations → Terminal
- Some operations (like GitHub export) run server-side, so logs appear in terminal

