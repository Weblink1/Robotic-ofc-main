---
name: auto-host
description: >-
  Ensures the robotic-ofc-site Next.js web application is continuously and safely hosted on http://localhost:3000.
  Use whenever a new session starts, before performing tasks, or after code edits so the user never needs to manually request local hosting.
---

# Auto-Host Skill for Robotic OFC

## Purpose
Guarantees that `robotic-ofc-site` is always locally hosted on `http://localhost:3000` safely, quietly, and without compromising ports, performance, or system stability.

## Safety & Idempotency Rules
1. **Never Duplicate**: Always check if a dev server is already running on port 3000 before running `npm run dev`. Avoid port conflicts (Next.js shifting to 3001, 3002).
2. **Localhost Only**: Strictly bind to `localhost:3000`. Never expose unauthorized tunnels or unsecured debug endpoints.
3. **Background Daemon**: Always launch the server using `IsDaemon: true` and `WaitMsBeforeAsync: 5000` so it does not block conversation turns.
4. **Resilient Recovery**: If `http://localhost:3000` is unresponsive or returns an error, safely terminate the broken task and restart it.

## Verification & Startup Procedure

1. **Quick Status Check**:
   Run the zero-hang health check:
   ```powershell
   node scripts/check-server.js
   ```
   If it outputs `{"status":"online","statusCode":200}`, the server is healthy and ready.

2. **Safe Launch (If Offline)**:
   If the server is offline:
   - Check if an orphaned background task exists using `manage_task(Action='list')`.
   - Start the dev server in the background:
     - `run_command`
     - `CommandLine`: `npm run dev`
     - `Cwd`: `robotic-ofc-site`
     - `IsDaemon`: `true`
     - `WaitMsBeforeAsync`: `5000`
   - Confirm it reaches `http://localhost:3000`.
