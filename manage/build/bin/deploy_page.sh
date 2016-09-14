#!/bin/bash

# cd /data

if [[ $DEVEL ]] && [[ $DEVEL != 0 ]]; then
    WEBPACK_ARGS=''
else
    WEBPACK_ARGS='--optimize-minimize'
fi

[ ! -d ./srv_www ] && mkdir -pv ./srv_www

echo 'copy *.html files'
cp ./src_www/*.html ./srv_www/

echo "running webpack $WEBPACK_ARGS"
./node_modules/.bin/webpack $WEBPACK_ARGS ./src_www/js/index.js


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
