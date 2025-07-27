#!/bin/bash

# Clear the screen
clear

TEST_DOCKERCOMPOSE=docker-compose-test.yaml

echo =========================================
echo ========== RUNNING UNIT TESTS ===========
echo =========================================

# Run unit test for flask
# docker-compose -f $TEST_DOCKERCOMPOSE up backend-unit-dev > /dev/null/ 2>&1 &

echo =========================================
echo =========== RUNNING API TESTS ===========
echo =========================================

# Run api tests
# <cmd> <args> > allout.txt 2>&1 
docker-compose -f $TEST_DOCKERCOMPOSE up backend-test-dev > /dev/null 2>&1 &
FLASK_ID=$!

# Sleep for a bit to wait for server to start
sleep 3
cd server
pytest
if [[ $? -eq 0 ]]; then
    echo Test succeeded
else
    echo Test failed
fi

# kill the server
kill $FLASK_ID
