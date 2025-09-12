#!/bin/bash

# start-appium.sh
# Description: Starts the Appium server in the background and saves its PID

echo "🚀 Starting Appium server..."

# Start Appium in background and redirect output to log
nohup appium --log appium.log > /dev/null 2>&1 &

# Capture Appium PID
APPIUM_PID=$!
echo $APPIUM_PID > appium.pid

echo "✅ Appium started with PID $APPIUM_PID"
