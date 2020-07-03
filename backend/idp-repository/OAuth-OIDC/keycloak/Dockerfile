FROM openjdk:8-jre
USER root

ARG version
ARG idp_port
ARG c_port

ENV KEYCLOAKVULN=$version
ENV LOCAL_AUTH_SERVER_PORT=$idp_port
ENV LOCAL_CLIENT_PORT=$c_port

WORKDIR /opt

RUN mkdir vulnKeycloak

COPY vulnKeycloak/ /opt/vulnKeycloak
COPY keycloakDetails.json /opt/vulnKeycloak/

  # register the client redirect_uri to the AS list
RUN sed -i 's+http://localhost:8080/+http://localhost:'$LOCAL_CLIENT_PORT'/+g' /opt/vulnKeycloak/keycloakDetails.json
RUN sed -i 's+http://client:8080/+http://client:'$LOCAL_CLIENT_PORT'/+g' /opt/vulnKeycloak/keycloakDetails.json

WORKDIR /opt/vulnKeycloak

CMD ./bin/standalone.sh -Dkeycloak.migration.action=import -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=/opt/vulnKeycloak/keycloakDetails.json -Dkeycloak.migration.strategy=OVERWRITE_EXISTING -Djboss.http.port=$LOCAL_AUTH_SERVER_PORT -b 0.0.0.0
