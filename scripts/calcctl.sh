#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"

# --- Auto-detect DISPLAY & XAUTHORITY ---
# Try to read from current user environment
if [[ -n "${DISPLAY:-}" ]]; then
  DISPLAY_NUMBER="$DISPLAY"
else
  # fallback: check common values
  DISPLAY_NUMBER=":0"
  [[ -e /tmp/.X11-unix/X1 ]] && DISPLAY_NUMBER=":1"
fi

# Try to find the logged-in desktop user
DESKTOP_USER=$(who | awk '/(:[0-9])/{print $1; exit}')

# Default XAUTHORITY file locations
if [[ -n "${XAUTHORITY:-}" && -e "$XAUTHORITY" ]]; then
  XAUTHORITY_FILE="$XAUTHORITY"
elif [[ -e "/home/$DESKTOP_USER/.Xauthority" ]]; then
  XAUTHORITY_FILE="/home/$DESKTOP_USER/.Xauthority"
elif [[ -e "/run/user/$(id -u $DESKTOP_USER)/gdm/Xauthority" ]]; then
  XAUTHORITY_FILE="/run/user/$(id -u $DESKTOP_USER)/gdm/Xauthority"
else
  echo "⚠️ Could not detect XAUTHORITY, GUI apps may not show"
  XAUTHORITY_FILE=""
fi

export DISPLAY="$DISPLAY_NUMBER"
export XAUTHORITY="$XAUTHORITY_FILE"

PID_FILE="/tmp/calc.pid"

case "$ACTION" in
  start)
    if [ -f "$PID_FILE" ] && ps -p "$(cat "$PID_FILE")" >/dev/null 2>&1; then
      echo "Calculator already running (PID $(cat "$PID_FILE"))."
      exit 0
    fi
    echo "Starting Calculator on DISPLAY=$DISPLAY with XAUTHORITY=$XAUTHORITY ..."
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
