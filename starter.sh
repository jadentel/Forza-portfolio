#!/bin/bash

# NOTE: when stopping client dev server with ctrl+c, npm will give some errors but ignore them,
# I think it is because it reacieves an interrupt or smth idk i asked chatgpt why.

# IMAGE NAMES
CLIENT_DEV="forza-client-dev"
CLIENT_REL="forza-client-rel"
SERVER_DEV="forza-server-dev"
SERVER_REL="forza-server-rel"

# Check correct number of arguments
if [ $# != 3 ]; then
    echo "Expected 3 arguments"
fi

# Rest is pretty self explanatory
if [[ $1 == "run" ]]; then
    if [[ $2 == "client" ]]; then
        echo "Starting client (webserver)"
        if [[ $3 == "dev" ]]; then
            docker run -it -p 3000:3000 -v $(pwd)/client:/app $CLIENT_DEV npm run dev
        elif [[ $3 == "rel" ]]; then
            docker run -it -p 3000:3000 $CLIENT_REL
        else
            echo "Expected either 'dev' or 'rel' for argument 3"
        fi
    elif [[ $2 == "server" ]]; then
        echo "Starting flask db"
        if [[ $3 == "dev" ]]; then
            docker run -it -p 5000:5000 -v $(pwd)/server:/app $SERVER_DEV /usr/local/bin/flask run
        elif [[ $3 == "rel" ]]; then
            docker run -it -p 3000:3000 $SERVER_REL
        else
            echo "Expected either 'dev' or 'rel' for argument 3"
        fi
    else
        echo "Expected either 'client' or 'server' for argument 2"
        exit -1
    fi
elif [[ $1 == "build" ]]; then
    if [[ $2 == "client" ]]; then
        echo "Building client (webserver) docker image"
        if [[ $3 == "dev" ]]; then
            docker build -t $CLIENT_DEV -f client/Dockerfile.dev client
        elif [[ $3 == "rel" ]]; then
            docker build -t $CLIENT_REL client/
        else
            echo "Expected either 'dev' or 'rel' for argument 3"
        fi
    elif [[ $2 == "server" ]]; then
        echo "Building flask db docker image"
        if [[ $3 == "dev" ]]; then
            docker build -t $SERVER_DEV -f server/Dockerfile.dev server
        elif [[ $3 == "rel" ]]; then
            docker build -t $SERVER_REL server/
        else
            echo "Expected either 'dev' or 'rel' for argument 3"
        fi
    else
        echo "Expected either 'client' or 'server' for argument 2"
        exit -1
    fi
elif [[ $1 == "test" ]]; then
    echo "Testing is not yet supported"
    exit 0
else
    echo "Expected either 'run' or 'build"
    exit -1
fi
