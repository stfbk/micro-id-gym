FROM postgres

ENV POSTGRES_USER oic
ENV POSTGRES_PASSWORD oic
ENV POSTGRES_DB mitreid


ARG c_port
ARG testerUsername
ARG testerPassword
ENV LOCAL_CLIENT_PORT=$c_port

COPY ./postgres /docker-entrypoint-initdb.d/

  # register the client redirect_uri to the AS list
RUN sed -i 's+http://localhost:8080/+http://localhost:'$LOCAL_CLIENT_PORT'/simple-web-app/openid_connect_login+g' /docker-entrypoint-initdb.d/InsertData.sql
RUN sed -i 's+http://client:8080/+http://client:'$LOCAL_CLIENT_PORT'/simple-web-app/openid_connect_login+g' /docker-entrypoint-initdb.d/InsertData.sql


  # customize tester credential
RUN sed -i 's+testerUsername+'$testerUsername'+g' /docker-entrypoint-initdb.d/InsertData.sql
RUN sed -i 's+testerPassword+'$testerPassword'+g' /docker-entrypoint-initdb.d/InsertData.sql
RUN sed -i 's+testerRole+'$testerUsername'+g' /docker-entrypoint-initdb.d/InsertData.sql
RUN sed -i 's+testerInfo+'$testerUsername'+g' /docker-entrypoint-initdb.d/InsertData.sql
