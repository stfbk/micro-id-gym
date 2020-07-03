FROM node:10

WORKDIR /usr/src/app

COPY . .

ARG stix_port

ENV SERVER_PORT_ENV=$stix_port

RUN npm install

RUN touch /usr/src/app/.env

  # setup server port
RUN echo "SERVER_PORT="$SERVER_PORT_ENV >> /usr/src/app/.env


CMD ["node", "app"]
