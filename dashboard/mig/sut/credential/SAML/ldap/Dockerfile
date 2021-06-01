FROM osixia/openldap:1.5.0


ARG testerUsername
ARG testerPassword




ADD src/bootstrap /container/service/slapd/assets/config/bootstrap
ADD src/environment /container/environment/01-custom

# add custom user credential
RUN sed -i 's+migTesterUID+'$testerUsername'+g' /container/service/slapd/assets/config/bootstrap/ldif/user.ldif
RUN sed -i 's+migTesterPassword+'$testerPassword'+g' //container/service/slapd/assets/config/bootstrap/ldif/user.ldif
