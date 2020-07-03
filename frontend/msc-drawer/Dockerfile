FROM node:10

WORKDIR /usr/src/app

COPY . .

ARG msc_port
ARG stix_port

ENV SERVER_PORT_ENV=$msc_port
ENV STIX_PORT_ENV=$stix_port

RUN npm install

RUN touch /usr/src/app/.env

  # setup server port
RUN echo "SERVER_PORT="$SERVER_PORT_ENV >> /usr/src/app/.env

  # setup mongodb uri
RUN echo "MONGODB_URI=mongodb://mongo:27017/docker-webApp" >> /usr/src/app/.env

  # setup stix endpoint
RUN echo "STIX_VISUALIZER_ENDPOINT=http://localhost:"$STIX_PORT_ENV"/stix/generate" >> /usr/src/app/.env

CMD sleep 5; node app
