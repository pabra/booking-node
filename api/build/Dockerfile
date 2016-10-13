FROM node:argon

# set correct timezone
RUN echo 'Europe/Berlin' > /etc/timezone \
    && DEBIAN_FRONTEND=noninteractive dpkg-reconfigure tzdata \
    # add app user
    && groupadd -r app && useradd -r -g app app \
    # Create app directory and set
    && mkdir -p /usr/src/app \
    && chown -R app:app /usr/src/app \
    # home dir is needed to store npm packages
    && mkdir /home/app \
    && chown -R app:app /home/app


WORKDIR /usr/src/app

ADD package.json .

RUN npm install --production

EXPOSE 3000

ADD . .
RUN chown -R app:app log
USER app

CMD ["npm", "start"]
