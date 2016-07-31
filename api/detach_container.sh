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

$DOCKER ps --filter "name=${IMAGE_NAME}" --no-trunc --format "{{.ID}}" | xargs --no-run-if-empty $DOCKER rm --force

DB_VARS_FILE=${DIR}/../db/vars.cfg
[ ! -f "$DB_VARS_FILE" ] && echo "Missing db vars file: ${DB_VARS_FILE}" && exit 1

# shellcheck source=$DB_VARS_FILE
DB_IMAGE_NAME=$(source $DB_VARS_FILE && echo $IMAGE_NAME)

[ ! "$DB_IMAGE_NAME" ] && echo "unable to get DB_IMAGE_NAME" && exit 1

COMMON_ARGS=(
    "--name ${IMAGE_NAME}"
    "--env NODE_ENV=production"
    "--env DEBUG='app:*'"
    "--link ${DB_IMAGE_NAME}:mysql"
    "${AUTHOR_NAME}/${IMAGE_NAME}"
)

if [ "$LOCAL_PORT" ] && [ "$LOCAL_PORT" -gt 0 ]; then
    COMMON_ARGS=(
        "-p ${LOCAL_PORT}:3000"
        "${COMMON_ARGS[@]}"
    )
fi

if [ -n "$DEVEL" ]; then
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
