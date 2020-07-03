FROM openjdk:8-jre
USER root

ARG idp_port
ARG c_port

ENV LOCAL_AUTH_SERVER_PORT=$idp_port
ENV LOCAL_CLIENT_PORT=$c_port

RUN mkdir webApp

COPY webApp/ /opt/webApp


WORKDIR /opt/webApp/bin

  # register the authorization server base url
RUN sed -i 's+identityprovider:9000+identityprovider:'$LOCAL_AUTH_SERVER_PORT'+g' /opt/webApp/bin/standalone.sh
RUN sed -i 's+identityprovider:9000+identityprovider:'$LOCAL_AUTH_SERVER_PORT'+g' /opt/webApp/standalone/configuration/standalone.xml


EXPOSE 8080

CMD ./standalone.sh -Djboss.http.port=$LOCAL_CLIENT_PORT -b 0.0.0.0
