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

ROOT_PW=$($DOCKER exec $IMAGE_NAME cat /var/lib/mysql/.root_pw)

[ -z "$ROOT_PW" ] && echo 'unable to get mysql root password' && exit 1

echo '--------------------------'
echo "goto http://127.0.0.1:8888"
echo "login with"
echo "user: ${MYSQL_USER}"
echo "pass: ${MYSQL_PASSWORD}"
echo "root pw: '${ROOT_PW}'"
echo '--------------------------'

$DOCKER run \
    -it \
    --rm \
    --name "${IMAGE_NAME}_phpmyadmin" \
    --link "${IMAGE_NAME}:db" \
    --env "PMA_USER=root" \
    --env "PMA_PASSWORD=${ROOT_PW}" \
    --env "PMA_ARBITRARY=1" \
    --publish 127.0.0.1:8888:80 \
    phpmyadmin/phpmyadmin \
    bash
