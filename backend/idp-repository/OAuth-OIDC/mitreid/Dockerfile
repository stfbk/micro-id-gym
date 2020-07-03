FROM maven:3-jdk-8
USER root

  # version = redirect-vuln for AS vulnerable to redirect_uri attack, secure version for any other value
ARG version

  # authorization server and client port used to adapt the standard webapp to the custom one created with docker
ARG idp_port
ARG c_port

ENV LOCAL_VERSION=$version
ENV LOCAL_AUTH_SERVER_PORT=$idp_port
ENV LOCAL_CLIENT_PORT=$c_port


RUN apt-get update
RUN apt-get install -y sed

COPY ./OpenID-Connect-Java-Spring-Server /opt

WORKDIR /opt


  # define AS basic url based on the the port chosen during the configuration
RUN sed -i 's+http://localhost:8080/openid-connect-server-webapp+http://localhost:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp+g' /opt/openid-connect-server-webapp/src/main/webapp/WEB-INF/server-config.xml

RUN mvn -DskipTests package
RUN mvn -DskipTests clean install




WORKDIR /opt/openid-connect-server-webapp
CMD mvn jetty:run-war -Djetty.port=$LOCAL_AUTH_SERVER_PORT
