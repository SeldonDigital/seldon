# Debug Logger Usage Guide

The Seldon debug logger provides structured local logging for the baseline app.

## Where Logs Appear

### Client-Side Operations
- **Location**: Browser DevTools console
- **Examples**:
  - Workspace manipulation
  - Schema conversion
  - Property setting

### Server-Side Operations
- **Location**: Terminal where the Next.js server is running
- **Examples**:
  - Server-rendered code paths
  - Local Node-side compute utilities

## Enabling Debug Mode

### Browser
1. Use **Help -> Enable Debug Mode**
2. Or set the persisted flag manually:
   ```javascript
   localStorage.setItem("debug-mode", JSON.stringify({ state: { enabled: true }, version: 0 }))
   ```

### Terminal
Run the app with `DEBUG_MODE=true`:

```bash
DEBUG_MODE=true npm run dev
```

## Testing Debug Logger

### Browser Console
```javascript
window.testDebugLogger()
```

### Terminal
```typescript
import { testDebugLogger } from "@seldon/core/utils/debug-logger"

testDebugLogger()
```

## Troubleshooting

### No logs in browser console
1. Check that debug mode is enabled in the Help menu
2. Run `window.testDebugLogger()`
3. Check `localStorage.getItem("debug-mode")`

### No logs in terminal
1. Start the app with `DEBUG_MODE=true`
2. Restart the dev server after changing the environment

