#!/bin/bash
set -e

cp src_www/js/config.js src_www/js/config_.js
sed -i "s/__API_HOST_PROTO__/$API_HOST_PROTO/g" src_www/js/config_.js
sed -i "s/__API_HOST_NAME__/$API_HOST_NAME/g" src_www/js/config_.js
sed -i "s/__API_HOST_PORT__/$API_HOST_PORT/g" src_www/js/config_.js

if [[ $DEVEL ]] && [[ $DEVEL != 0 ]]; then
    /data/bin/watch_dir_then_execute.sh /data/src_www /data/bin/deploy_page.sh &
else
    /data/bin/deploy_page.sh
fi

exec "$@"
