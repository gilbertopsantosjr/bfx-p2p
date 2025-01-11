#!/bin/bash

# Print current grape processes
echo "Current Grape processes:"
ps aux | grep grape | grep -v grep

# Count number of grape processes
GRAPE_COUNT=$(ps aux | grep grape | grep -v grep | wc -l)

# Kill all grape processes
pkill -f grape

# Wait a moment
sleep 2

# Check if any processes remain
REMAINING=$(ps aux | grep grape | grep -v grep | wc -l)

echo "Found $GRAPE_COUNT Grape processes"
if [ $REMAINING -eq 0 ]; then
    echo "Successfully stopped all Grape processes"
else
    echo "Warning: $REMAINING Grape processes still running"
    echo "Remaining processes:"
    ps aux | grep grape | grep -v grep
    echo "Try using: kill -9 \$(pgrep -f grape)"
fi

# Check if ports are still in use
for PORT in 20001 20002 30001 30002; do
    if lsof -i :$PORT > /dev/null; then
        echo "Warning: Port $PORT is still in use"
        lsof -i :$PORT
    fi
done