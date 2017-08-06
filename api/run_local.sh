#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd -P)"
VARS_FILE=${DIR}/vars.cfg
LOCAL_VARS_FILE=${DIR}/vars.local.cfg

[ ! -f "$VARS_FILE" ] && echo "Missing vars file: ${VARS_FILE}" && exit 1

# shellcheck source=$VARS_FILE
source $VARS_FILE

# use different settings for development
# shellcheck source=$LOCAL_VARS_FILE
[ -f $LOCAL_VARS_FILE ] && source $LOCAL_VARS_FILE

read MYSQL_PORT_3306_TCP_PORT \
    MYSQL_ENV_MYSQL_USER \
    MYSQL_ENV_MYSQL_PASSWORD \
    MYSQL_ENV_MYSQL_DATABASE \
    MYSQL_ENV_MYSQL_TEST_DATABASE \
    <<< \
    "$(
        # shellcheck source=${DIR}/../db/vars.cfg
        source ${DIR}/../db/vars.cfg
        # shellcheck source=${DIR}/../db/vars.local.cfg
        [ -f ${DIR}/../db/vars.local.cfg ] && source ${DIR}/../db/vars.local.cfg
        [ ! "$LOCAL_PORT" ] && LOCAL_PORT=3306
        [ ! "$MYSQL_TEST_DATABASE" ] && MYSQL_TEST_DATABASE=test

        echo $LOCAL_PORT \
            $MYSQL_USER \
            $MYSQL_PASSWORD \
            $MYSQL_DATABASE \
            $MYSQL_TEST_DATABASE
    )"


export NODE_ENV=development
export DEBUG='app:*'
export MYSQL_PORT_3306_TCP_PORT
export MYSQL_ENV_MYSQL_USER
export MYSQL_ENV_MYSQL_PASSWORD
export MYSQL_ENV_MYSQL_DATABASE
export MYSQL_ENV_MYSQL_TEST_DATABASE

# base dir is always "build"
cd ${DIR}/build || exit 1
echo "DEBUGGER: '${DEBUGGER}'"
if [ "$DEBUGGER" ] && [ ! "$DEBUGGER" -eq 0 ]; then
    # node-debug --cli=true app.js
    node --inspect-brk app.js
else
    npm run-script start-dev
fi
