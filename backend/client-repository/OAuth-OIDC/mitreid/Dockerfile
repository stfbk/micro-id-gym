FROM maven:3-jdk-8
USER root

  # authorization server and client port used to adapt the standard webapp to the custom one created with docker
ARG idp_port
ARG c_port

ENV LOCAL_AUTH_SERVER_PORT=$idp_port
ENV LOCAL_SERVER_PORT=$c_port

RUN apt-get update
RUN apt-get install -y sed sudo


COPY ./simple-web-app /opt

WORKDIR /opt

  # redefine static AS endpoint configuration to allow the communication between client and authorization server
RUN sed -i 's+http://localhost:8080/simple-web-app+http://localhost:'$LOCAL_SERVER_PORT'/simple-web-app+g' /opt/src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml

RUN sed -i 's+http://localhost:8080/openid-connect-server-webapp+http://localhost:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp+g' /opt/src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml

RUN sed -i 's+http://localhost:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/token+http://identityprovider:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/token+g' /opt/src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml

RUN sed -i 's+http://localhost:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/jwk+http://identityprovider:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/jwk+g' /opt/src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml

RUN sed -i 's+http://localhost:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/userinfo+http://identityprovider:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/userinfo+g' /opt/src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml


  # customize AS port
RUN sed -i 's+http://localhost:8080/openid-connect-server-webapp/+http://localhost:'$LOCAL_AUTH_SERVER_PORT'/openid-connect-server-webapp/+g' /opt/src/main/webapp/WEB-INF/views/login.jsp


EXPOSE $LOCAL_SERVER_PORT

WORKDIR /opt

CMD mvn jetty:run -Djetty.port=$LOCAL_SERVER_PORT
