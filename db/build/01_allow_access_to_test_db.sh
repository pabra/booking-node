#!/bin/bash

[ ! "$MYSQL_USER" ] && echo "Missing MYSQL_USER variable" && exit 1
[ ! "$MYSQL_TEST_DATABASE" ] && echo "Missing MYSQL_TEST_DATABASE variable" && exit 1

mysql -v -uroot --password='' <<EOT
GRANT ALL PRIVILEGES ON \`${MYSQL_TEST_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
EOT
