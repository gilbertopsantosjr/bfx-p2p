#!/bin/bash
# start-grape.sh

# Kill any existing Grape processes
pkill -f grape

# Start new Grape processes
DEBUG=* grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002' &
DEBUG=* grape --dp 20002 --aph 30002 --bn '127.0.0.1:20001' &

# Wait a moment for startup
sleep 2

# Check if they're running
ps aux | grep grape