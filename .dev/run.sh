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

auth_db() {
    cd ../auth_db

    set -a
    source .env
    set +a

    docker compose up -d
    if [ $? -ne 0 ]; then
        echo "Failed to start auth mongodb service."
    else 
        echo "Started auth mongodb service."
    fi
}

upload_db() {
    cd ../upload_db

    set -a
    source .env
    set +a

    docker compose up -d
    if [ $? -ne 0 ]; then
        echo "Failed to start upload mongodb service."
    else 
        echo "Started upload mongodb service."
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

    echo "Terminating db services..."
    cd ../auth_db
    docker compose down
    if [ $? -ne 0 ]; then
        echo "Failed to stop auth mongodb service."
    fi

    cd ../upload_db
    docker compose down
    if [ $? -ne 0 ]; then
        echo "Failed to stop upload mongodb service."
    fi

    wait $upload_id $client_id $auth_id
    echo "Terminated upload, client, auth and db services."
}

trap cleanup SIGINT SIGTERM

auth_db &
auth_db_id=$!

upload_db &
upload_db_id=$!

upload &
upload_id=$!

client &
client_id=$!

auth &
auth_id=$!

wait $upload_id $client_id $auth_id
