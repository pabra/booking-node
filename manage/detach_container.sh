#!/bin/bash

BIN_READLINK=$( test -f /usr/local/bin/greadlink && echo "greadlink" || echo "readlink" )
DIR="$( dirname "$( $BIN_READLINK -f "$0" )" )"
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
[ ! "$API_HOST_PROTO" ] && echo "Missing API_HOST_PROTO variable" && exit 1
[ ! "$API_HOST_NAME" ] && echo "Missing API_HOST_NAME variable" && exit 1
[ ! "$API_HOST_PORT" ] && echo "Missing API_HOST_PORT variable" && exit 1
[ ! "$LOCAL_PORT" ] && echo "Missing LOCAL_PORT variable" && exit 1

$DOCKER ps --filter "name=^/${IMAGE_NAME}$" --no-trunc --format "{{.ID}}" | xargs --no-run-if-empty $DOCKER rm --force

COMMON_ARGS=(
    "-p 127.0.0.1:${LOCAL_PORT}:80"
    "--name ${IMAGE_NAME}"
    "--env API_HOST_PROTO=${API_HOST_PROTO}"
    "--env API_HOST_NAME=${API_HOST_NAME}"
    "--env API_HOST_PORT=${API_HOST_PORT}"
    "${AUTHOR_NAME}/${IMAGE_NAME}"
)

if [[ $DEVEL ]] && [[ $DEVEL != 0 ]]; then
    COMMON_ARGS=(
        "--env DEVEL=${DEVEL}"
        "--volume ${DIR}/build/src_www:/data/src_www"
        "${COMMON_ARGS[@]}"
    )

    $DOCKER run \
        -it \
        --rm \
        ${COMMON_ARGS[*]}
else
    $DOCKER run \
        --detach \
        --restart always \
        ${COMMON_ARGS[*]}
fi
