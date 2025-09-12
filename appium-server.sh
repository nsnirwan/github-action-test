#!/bin/bash

# Unified script to control Appium server
# Usage: ./appium-server.sh start|stop|restart|status

ACTION=$1
LOG_FILE="appium.log"
PID_FILE="appium.pid"

start_appium() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      echo "⚠️ Appium is already running with PID $PID"
      exit 0
    else
      echo "⚠️ PID file exists but process is not running. Cleaning up..."
      rm "$PID_FILE"
    fi
  fi

  echo "🚀 Starting Appium..."
  nohup appium --log "$LOG_FILE" > /dev/null 2>&1 &
  APPIUM_PID=$!
  echo $APPIUM_PID > "$PID_FILE"

  sleep 2
  if ps -p $APPIUM_PID > /dev/null 2>&1; then
    echo "✅ Appium started with PID $APPIUM_PID"
  else
    echo "❌ Failed to start Appium"
    exit 1
  fi
}

stop_appium() {
  if [ ! -f "$PID_FILE" ]; then
    echo "❌ No PID file found. Appium may not be running."
    exit 1
  fi

  PID=$(cat "$PID_FILE")
  if ps -p $PID > /dev/null 2>&1; then
    echo "🛑 Stopping Appium (PID $PID)..."
    kill $PID
    rm "$PID_FILE"
    echo "✅ Appium stopped."
  else
    echo "⚠️ No running Appium process with PID $PID. Cleaning up..."
    rm "$PID_FILE"
  fi
}

status_appium() {
  echo "🔍 Checking Appium status at http://localhost:4723/wd/hub/status"
  if curl -s http://localhost:4723/wd/hub/status | grep -q "Appium"; then
    echo "✅ Appium is running!"
  else
    echo "❌ Appium is not responding on port 4723."
  fi
}

restart_appium() {
  stop_appium
  sleep 2
  start_appium
}

case "$ACTION" in
  start)
    start_appium
    ;;
  stop)
    stop_appium
    ;;
  status)
    status_appium
    ;;
  restart)
    restart_appium
    ;;
  *)
    echo "❌ Invalid command: $ACTION"
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
