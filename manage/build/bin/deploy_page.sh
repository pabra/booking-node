#!/bin/bash

# cd /data

if [[ $DEVEL ]] && [[ $DEVEL != 0 ]]; then
    # DEVELOPMENT
    # WEBPACK_ARGS='--progress --optimize-minimize --optimize-dedupe --optimize-occurrence-order --devtool eval --devtool source-map'
    WEBPACK_ARGS='--progress --devtool eval --devtool source-map'
else
    # PRODUCTION
    WEBPACK_ARGS='--progress --optimize-minimize --optimize-dedupe --optimize-occurrence-order'
fi

[ ! -d ./srv_www ] && mkdir -pv ./srv_www

echo 'copy *.html files'
cp ./src_www/*.html ./srv_www/

echo "running webpack $WEBPACK_ARGS"
./node_modules/.bin/webpack $WEBPACK_ARGS


echo 'compressing files'
find ./srv_www \
    -type f \
    -name '*.js' \
    -o -name '*.html' \
    -o -name '*.css' | while read -r f; do
        printf '%s (%sk)  ->  ' "$f" "$(du -k $f | cut -f1)"
        gzip -9 -c $f > $f.gz
        printf '%s (%sk)\n' "${f}.gz" "$(du -k ${f}.gz | cut -f1)"
done
