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
[ ! "$MYSQL_USER" ] && echo "Missing MYSQL_USER variable" && exit 1
[ ! "$MYSQL_PASSWORD" ] && echo "Missing MYSQL_PASSWORD variable" && exit 1
[ ! "$MYSQL_DATABASE" ] && echo "Missing MYSQL_DATABASE variable" && exit 1
[ ! "$MYSQL_TEST_DATABASE" ] && echo "Missing MYSQL_TEST_DATABASE variable" && exit 1
[ ! "$CONTAINER_DATA" ] && echo "Missing CONTAINER_DATA variable" && exit 1
[ ! -d "$CONTAINER_DATA" ] && echo "Missing directory $CONTAINER_DATA" && exit 1
[ ! -w "$CONTAINER_DATA" ] && echo "Cannot write to directory $CONTAINER_DATA" && exit 1
[ ! -d "${CONTAINER_DATA}/${IMAGE_NAME}" ] && mkdir "${CONTAINER_DATA}/${IMAGE_NAME}"
[ ! -d "${CONTAINER_DATA}/${IMAGE_NAME}/db" ] && mkdir "${CONTAINER_DATA}/${IMAGE_NAME}/db"
[ ! -d "${CONTAINER_DATA}/${IMAGE_NAME}/dumps" ] && mkdir "${CONTAINER_DATA}/${IMAGE_NAME}/dumps"

$DOCKER ps --filter "name=^/${IMAGE_NAME}$" --no-trunc --format "{{.ID}}" | xargs --no-run-if-empty $DOCKER rm --force

COMMON_ARGS=(
    "--env MYSQL_ALLOW_EMPTY_PASSWORD=yes"
    "--env MYSQL_USER=${MYSQL_USER}"
    "--env MYSQL_PASSWORD=${MYSQL_PASSWORD}"
    "--env MYSQL_DATABASE=${MYSQL_DATABASE}"
    "--env MYSQL_TEST_DATABASE=${MYSQL_TEST_DATABASE}"
    "--volume ${CONTAINER_DATA}/${IMAGE_NAME}/db:/var/lib/mysql"
    "--volume ${CONTAINER_DATA}/${IMAGE_NAME}/dumps:/var/backups/dumps"
    "--name ${IMAGE_NAME}"
    "${AUTHOR_NAME}/${IMAGE_NAME}"
)

if [ "$LOCAL_PORT" ] && [ "$LOCAL_PORT" -gt 0 ]; then
    COMMON_ARGS=(
        "-p 127.0.0.1:${LOCAL_PORT}:3306"
        "${COMMON_ARGS[@]}"
    )
fi

if [[ $DEVEL ]] && [[ $DEVEL != 0 ]]; then
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
