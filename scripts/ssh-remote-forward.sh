#!/usr/bin/env bash
# Loads .env.tunnel if present (requires dotenv-cli)
if [ -f "$(dirname "$0")/../.env.tunnel" ]; then
	if command -v dotenv >/dev/null 2>&1; then
		eval "$(dotenv -e $(dirname "$0")/../.env.tunnel export)"
	else
		echo "[tunnel] Warning: dotenv-cli not found, skipping .env.tunnel loading."
	fi
fi
# Remote port forward: exposes your local service to the remote host
# Usage env vars:
#   SSH_HOST=user@remote-host
#   REMOTE_PORT=3000         # remote port to open
#   LOCAL_HOST=localhost     # where your local service runs (usually localhost)
#   LOCAL_PORT=3000          # local port your app listens on
#   SSH_OPTS="-i ~/.ssh/id_rsa -o ServerAliveInterval=60"  # optional

set -euo pipefail

: "${SSH_HOST:?SSH_HOST is required, e.g., user@remote}"
REMOTE_PORT=${REMOTE_PORT:-3000}
LOCAL_HOST=${LOCAL_HOST:-localhost}
LOCAL_PORT=${LOCAL_PORT:-3000}
SSH_OPTS=${SSH_OPTS:-}

echo "[tunnel:r] Forwarding remote :${REMOTE_PORT} -> ${LOCAL_HOST}:${LOCAL_PORT} via ${SSH_HOST}"
ssh -N -R "${REMOTE_PORT}:${LOCAL_HOST}:${LOCAL_PORT}" ${SSH_OPTS} "${SSH_HOST}"