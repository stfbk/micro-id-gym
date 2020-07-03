FROM centos:6

ENV VERSION=2.4.46

ARG testerUsername
ARG testerPassword

RUN yum -y install openldap openldap-clients openldap-servers
COPY src/olcDatabase={1}monitor.ldif /etc/openldap/slapd.d/cn\=config/olcDatabase={1}monitor.ldif
COPY src/olcDatabase={2}bdb.ldif /etc/openldap/slapd.d/cn\=config/olcDatabase={2}bdb.ldif

COPY src/base.ldif /
COPY src/ou.ldif /
COPY src/user.ldif /
COPY src/startup.sh /startup.sh
RUN chmod +x /startup.sh

  # add custom user credential
RUN sed -i 's+migTesterUID+'$testerUsername'+g' /user.ldif
RUN sed -i 's+migTesterPassword+'$testerPassword'+g' /user.ldif



CMD /startup.sh ; tail -f /dev/null
