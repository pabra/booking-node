#! /bin/bash

DIRECTORY_TO_OBSERVE="$1"
function block_for_change {
    inotifywait -r \
        -e modify,move,create,delete \
        $DIRECTORY_TO_OBSERVE
}

BUILD_SCRIPT="$2"
function build {
    $BUILD_SCRIPT
}

build
while block_for_change; do
    build
done
