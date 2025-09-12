#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"
UNIT_NAME="calc-app"

case "$ACTION" in
  start)
    echo "Starting Calculator using systemd-run ..."
    systemd-run --user --unit="$UNIT_NAME" \
      env DISPLAY=:1 XAUTHORITY=/home/annex04/.Xauthority gnome-calculator
    echo "✅ Calculator launch request sent."
    ;;
  stop)
    echo "Stopping Calculator..."
    systemctl --user stop "$UNIT_NAME" || true
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    systemctl --user status "$UNIT_NAME" --no-pager || true
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
