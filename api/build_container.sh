#!/bin/bash

BIN_READLINK=$( test -f /usr/local/bin/greadlink && echo "greadlink" || echo "readlink" )
DIR="$( dirname "$( $BIN_READLINK -f "$0" )" )"
BUILD_DIR=${DIR}/build
VARS_FILE=${DIR}/vars.cfg

DOCKER=$( which docker 2> /dev/null )

[ ! -x "$DOCKER" ] && echo "Missing 'docker' executable: ${DOCKER}" && exit 1
[ ! -f "$VARS_FILE" ] && echo "Missing vars file: ${VARS_FILE}" && exit 1
[ ! -d "$BUILD_DIR" ] && echo "Missing build dir: ${BUILD_DIR}" && exit 1

# shellcheck source=vars.cfg
source $VARS_FILE

[ ! "$AUTHOR_NAME" ] && echo "Missing AUTHOR_NAME variable" && exit 1
[ ! "$IMAGE_NAME" ] && echo "Missing IMAGE_NAME variable" && exit 1

$DOCKER build -t "${AUTHOR_NAME}/${IMAGE_NAME}" $BUILD_DIR
