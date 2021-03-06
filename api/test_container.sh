#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd -P)"
VARS_FILE=${DIR}/vars.cfg
LOCAL_VARS_FILE=${DIR}/vars.local.cfg

DOCKER=$( which docker 2> /dev/null )

[ ! -x "$DOCKER" ] && echo "Missing 'docker' executable: ${DOCKER}" && exit 1
[ ! -f "$VARS_FILE" ] && echo "Missing vars file: ${VARS_FILE}" && exit 1

# shellcheck source=$VARS_FILE
source $VARS_FILE

# use different settings for development
# shellcheck source=$LOCAL_VARS_FILE
[ -f $LOCAL_VARS_FILE ] && source $LOCAL_VARS_FILE

[ ! "$AUTHOR_NAME" ] && echo "Missing AUTHOR_NAME variable" && exit 1
[ ! "$IMAGE_NAME" ] && echo "Missing IMAGE_NAME variable" && exit 1

${DIR}/build_container.sh --for-tests

CONTAINER_NAME="${IMAGE_NAME}_test"

$DOCKER ps --filter "name=${CONTAINER_NAME}" --no-trunc --format "{{.ID}}" | xargs --no-run-if-empty $DOCKER rm --force

COMMON_ARGS=(
    "--rm"
    "--name ${CONTAINER_NAME}"
    "generic/booking-node-api-tests"
    "npm run-script testNoCover"
)

if [ -t 1 ]; then
    $DOCKER run \
        -t \
        ${COMMON_ARGS[*]}
else
    $DOCKER run \
        ${COMMON_ARGS[*]}
fi
