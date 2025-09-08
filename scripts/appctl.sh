#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"
APP_DIR="$HOME/my-npm-app"    # change to your app path
LOG_DIR="$HOME/.npm-app-logs"
PID_FILE="$LOG_DIR/app.pid"

mkdir -p "$LOG_DIR"

case "$ACTION" in
  start)
    if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
      echo "App already running with PID $(cat $PID_FILE)"
      exit 0
    fi
    cd "$APP_DIR"
    nohup npm start >"$LOG_DIR/out.log" 2>&1 &
    echo $! > "$PID_FILE"
    echo "Started app with PID $(cat $PID_FILE)"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      kill "$(cat $PID_FILE)" || true
      rm -f "$PID_FILE"
      echo "Stopped app"
    else
      echo "App not running"
    fi
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
      echo "App is running with PID $(cat $PID_FILE)"
    else
      echo "App is not running"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
