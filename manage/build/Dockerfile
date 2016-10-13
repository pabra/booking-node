FROM nginx:stable

RUN echo 'Europe/Berlin' > /etc/timezone \
    && DEBIAN_FRONTEND=noninteractive dpkg-reconfigure tzdata \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
        vim \
        curl \
        inotify-tools \
        nodejs \
        npm \
    && apt-get clean \
    && ln -s nodejs /usr/bin/node

WORKDIR /data/

ADD package.json ./

RUN npm install \
    && npm start

ADD . ./

RUN cp nginx.conf /etc/nginx/nginx.conf \
    && echo "alias ll='ls -lahF'" >> ~/.bashrc

ENTRYPOINT ["/data/bin/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
