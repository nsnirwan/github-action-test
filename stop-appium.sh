#!/bin/bash

# stop-appium.sh
# Description: Stops the Appium server using saved PID

echo "🛑 Stopping Appium server..."

if [ -f appium.pid ]; then
  PID=$(cat appium.pid)
  kill $PID && echo "✅ Appium server stopped (PID: $PID)"
  rm appium.pid
else
  echo "⚠️ PID file not found. Appium may not be running."
fi
