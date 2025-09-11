#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"
APP="gnome-calculator"

# where to store PID file
LOG_DIR="$HOME/.calc-app-logs"
PID_FILE="$LOG_DIR/calc.pid"

# which display to use (default :0, adjust if needed)
DISPLAY_NUMBER="${DISPLAY_NUMBER:-:0}"

mkdir -p "$LOG_DIR"

case "$ACTION" in
  start)
    if [ -f "$PID_FILE" ] && ps -p "$(cat "$PID_FILE")" >/dev/null 2>&1; then
      echo "Calculator already running (PID $(cat "$PID_FILE"))."
      exit 0
    fi
    echo "Starting Calculator on DISPLAY=$DISPLAY_NUMBER..."
    DISPLAY="$DISPLAY_NUMBER" nohup "$APP" >/dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "Started, PID $(cat "$PID_FILE")"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      echo "Stopping Calculator PID $(cat "$PID_FILE")..."
      kill "$(cat "$PID_FILE")" || true
      rm -f "$PID_FILE"
      echo "Stopped."
    else
      echo "No PID file found; trying pkill..."
      pkill -f "$APP" || true
    fi
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    if [ -f "$PID_FILE" ] && ps -p "$(cat "$PID_FILE")" >/dev/null 2>&1; then
      echo "Calculator running (PID $(cat "$PID_FILE"))."
    else
      echo "Calculator not running."
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
