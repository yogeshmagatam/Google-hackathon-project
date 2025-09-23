#!/usr/bin/env bash
# Loads .env.tunnel if present (requires dotenv-cli)
if [ -f "$(dirname "$0")/../.env.tunnel" ]; then
	if command -v dotenv >/dev/null 2>&1; then
		eval "$(dotenv -e $(dirname "$0")/../.env.tunnel export)"
	else
		echo "[tunnel] Warning: dotenv-cli not found, skipping .env.tunnel loading."
	fi
fi
# Local port forward: exposes remote service to your local machine
# Usage env vars (set before running or inline):
#   SSH_HOST=user@remote-host
#   LOCAL_PORT=3000          # local port to map
#   REMOTE_HOST=localhost    # remote host the service listens on (often localhost)
#   REMOTE_PORT=3000         # remote port
#   SSH_OPTS="-i ~/.ssh/id_rsa -o ServerAliveInterval=60"  # optional

set -euo pipefail

: "${SSH_HOST:?SSH_HOST is required, e.g., user@remote}"
LOCAL_PORT=${LOCAL_PORT:-3000}
REMOTE_HOST=${REMOTE_HOST:-localhost}
REMOTE_PORT=${REMOTE_PORT:-3000}
SSH_OPTS=${SSH_OPTS:-}

echo "[tunnel:l] Forwarding local :${LOCAL_PORT} -> ${REMOTE_HOST}:${REMOTE_PORT} via ${SSH_HOST}"
ssh -N -L "${LOCAL_PORT}:${REMOTE_HOST}:${REMOTE_PORT}" ${SSH_OPTS} "${SSH_HOST}"