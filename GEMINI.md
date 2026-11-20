# Robotic OFC Site Guidelines & Persistent Safe Local Hosting

## MANDATORY: Autonomous Local Hosting
The website in `robotic-ofc-site` MUST ALWAYS be locally hosted on `http://localhost:3000`.
The user should never have to manually instruct the assistant to "locally host".

### Autonomous Dev Server Protocol
At the beginning of any session, when responding to user requests, or after modifying code:
1. **Verify Server Status**:
   - Check if an active background task running `npm run dev` exists via `manage_task(Action='list')`.
   - Or run a quick check with `node scripts/check-server.js` or a non-blocking test to `http://localhost:3000`.
2. **Safe Spawning (Zero Duplication & Zero Port Conflicts)**:
   - If port 3000 is already active and serving `robotic-ofc-site`, **DO NOT** launch another instance.
   - If the server is NOT running, launch it safely in the background:
     - `run_command`
     - `CommandLine`: `npm run dev`
     - `Cwd`: `robotic-ofc-site`
     - `IsDaemon`: `true`
     - `WaitMsBeforeAsync`: `5000`
3. **Safety & Stability Constraints**:
   - Always run as a background daemon (`IsDaemon: true`) to prevent blocking the user or the agent.
   - Strictly bind locally to `localhost:3000` without exposing unencrypted tunnels or dangerous external ports.
   - Ensure the server remains resilient and fast across changes.
