#!/bin/bash

upload() {
    cd ../upload

    set -a
    source .env
    set +a

    /home/wang/.nvm/versions/node/v21.6.1/bin/npm run dev
}

client() {
    cd ../client
    /home/wang/.nvm/versions/node/v21.6.1/bin/npm run dev
}

db() {
    cd ../db

    set -a
    source .env
    set +a

    docker compose up -d
    if [ $? -ne 0 ]; then
        echo "Failed to start mongodb service."
    else 
        echo "Started mongodb service."
    fi
}

auth() {
    cd ../auth/

    set -a 
    source .env
    set +a

    /home/wang/.nvm/versions/node/v21.6.1/bin/npm run dev
}

cleanup() {
    echo "Terminating background processes..."
    kill $upload_id $client_id $auth_id
    cd ../db
    docker compose down
    if [ $? -ne 0 ]; then
        echo "Failed to stop mongodb service."
    fi
    wait $upload_id $client_id $auth_id
}

trap cleanup SIGINT SIGTERM

db &
db_id=$!

upload &
upload_id=$!

client &
client_id=$!

auth &
auth_id=$!

wait $upload_id $client_id $auth_id
