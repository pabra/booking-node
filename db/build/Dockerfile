FROM mariadb:10

# set correct timezone
RUN echo 'Europe/Berlin' > /etc/timezone \
    && DEBIAN_FRONTEND=noninteractive dpkg-reconfigure tzdata \
    && ln -s /var/lib/mysql/.my.cnf /root/.my.cnf

ADD booking_node.cnf /etc/mysql/conf.d/
ADD 01_allow_access_to_test_db.sh /docker-entrypoint-initdb.d/
ADD 02_set_new_root_pw.sh /docker-entrypoint-initdb.d/
