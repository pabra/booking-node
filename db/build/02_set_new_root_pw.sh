#!/bin/bash

PWGEN=$(which pwgen)

[ ! -x "$PWGEN" ] && echo "Missing executable pwgen." && exit 1

PW="$(pwgen -s 12 1)"
echo "new root password: ${PW}"

mysql -v -uroot --password='' <<EOT
USE mysql;
UPDATE user SET password=PASSWORD("${PW}") WHERE user='root';
FLUSH PRIVILEGES;
EOT

echo $PW > /var/lib/mysql/.root_pw

cat > /var/lib/mysql/.my.cnf <<EOF
[client]
user=root
password=${PW}
EOF
