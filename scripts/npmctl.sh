#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"
# optional 2nd arg = app dir override; if empty we use GITHUB_WORKSPACE or default
ARG_APP_DIR="${2:-}"
APP_DIR="${ARG_APP_DIR:-${GITHUB_WORKSPACE:-$HOME/annex04/projects/ASSESS-PREP-FE}}"
LOG_DIR="${LOG_DIR:-$HOME/.npm-app-logs}"
PID_FILE="$LOG_DIR/app.pid"

mkdir -p "$LOG_DIR"

if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: app dir not found: $APP_DIR"
  exit 2
fi

# find npm and node
NPM_BIN=$(command -v npm || true)
NODE_BIN=$(command -v node || true)

cd "$APP_DIR"

case "$ACTION" in
  start)
    if [ -f "$PID_FILE" ] && ps -p "$(cat "$PID_FILE")" >/dev/null 2>&1; then
      echo "App already running (PID $(cat "$PID_FILE"))."
      exit 0
    fi
    if [ -z "$NPM_BIN" ]; then
      echo "npm not found in PATH. Install node/npm or update PATH."
      exit 3
    fi
    echo "Starting app in $APP_DIR ..."
    nohup "$NPM_BIN" start >"$LOG_DIR/out.log" 2>"$LOG_DIR/err.log" &
    echo $! > "$PID_FILE"
    echo "Started, PID $(cat "$PID_FILE")"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      echo "Stopping PID $(cat "$PID_FILE") ..."
      kill "$(cat "$PID_FILE")" || true
      rm -f "$PID_FILE"
      echo "Stopped."
    else
      echo "No PID file; attempting pkill (may stop other node apps) ..."
      pkill -f "node .*" || true
      echo "pkill attempted."
    fi
    ;;
  restart)
    "$0" stop "$APP_DIR"
    sleep 1
    "$0" start "$APP_DIR"
    ;;
  status)
    if [ -f "$PID_FILE" ] && ps -p "$(cat "$PID_FILE")" >/dev/null 2>&1; then
      echo "App running (PID $(cat "$PID_FILE"))."
    else
      echo "App not running. Last logs (if any):"
      tail -n 100 "$LOG_DIR/out.log" || true
      tail -n 100 "$LOG_DIR/err.log" || true
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status} [app_dir]"
    exit 1
    ;;
esac
