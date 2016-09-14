#!/bin/bash
set -e

if [[ $DEVEL ]] && [[ $DEVEL != 0 ]]; then
    /data/bin/watch_dir_then_execute.sh /data/src_www /data/bin/deploy_page.sh &
fi

exec "$@"
