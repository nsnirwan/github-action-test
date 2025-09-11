#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"

DESKTOP_USER="annex04"
DISPLAY_NUMBER=":1"   # 👈 use :1 instead of :0
XAUTHORITY_FILE="/run/user/1000/gdm/Xauthority"

export DISPLAY="$DISPLAY_NUMBER"
export XAUTHORITY="$XAUTHORITY_FILE"

PID_FILE="/tmp/calc.pid"

case "$ACTION" in
  start)
    if [ -f "$PID_FILE" ] && ps -p "$(cat "$PID_FILE")" >/dev/null 2>&1; then
      echo "Calculator already running (PID $(cat "$PID_FILE"))."
      exit 0
    fi
    echo "Starting Calculator..."
    nohup gnome-calculator >/dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "Started Calculator (PID $(cat "$PID_FILE"))."
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      echo "Stopping Calculator (PID $(cat "$PID_FILE"))..."
      kill "$(cat "$PID_FILE")" || true
      rm -f "$PID_FILE"
      echo "Stopped."
    else
      echo "No PID file found, trying pkill..."
      pkill -f "gnome-calculator" || true
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
