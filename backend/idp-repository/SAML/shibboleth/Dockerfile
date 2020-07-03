	#preparing the basic environment
FROM ubuntu:16.04

	# Defining the shibboleth version
	#	Supported:
	#		All version above the 3rd
	#	Actually available:
	#		shibboleth-identity-provider-3.2.1 -> vulnerable version of IdP. It does not perform RelayState value sanitization
	#		shibboleth-identity-provider-3.3.3 -> secure version of IdP. It performs sanitization of the RelayState before sending it back with the SAMLResponse to the C

ARG idp_version
ARG c_secure_port
ARG c_base_port
ARG c_relaystate_vuln_port
ARG c_relaystate_sanitized_port
ARG c_canonicalization_vuln_port
ARG c_billion_laughs_port

ENV SHIB_VERSION=shibboleth-identity-provider-$idp_version
ENV C_SECURE_PORT=$c_secure_port
ENV C_BASE_PORT=$c_base_port
ENV C_RELAYSTATE_VULN_PORT=$c_relaystate_vuln_port
ENV C_RELAYSTATE_SANITIZED_PORT=$c_relaystate_sanitized_port
ENV C_CANONICALIZATION_PORT=$c_canonicalization_vuln_port
ENV C_BILLION_LAUGHS_PORT=$c_billion_laughs_port


RUN apt-get update
RUN apt-get install -y tomcat8 tomcat8-admin nano unzip curl

	#setting some variables
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/jre
ENV CATALINA_BASE /var/lib/tomcat8
ENV CATALINA_HOME /usr/share/tomcat8

ENV PATH $CATALINA_HOME/bin:$JAVA_HOME/bin:$PATH

	#configuring tomcat
COPY src/tomcat-users.xml $CATALINA_BASE/conf/tomcat-users.xml
COPY src/manager.xml /usr/share/tomcat8-admin/manager/META-inf/manager.xml

RUN sed -i 's/-Xmx128/-Xmx1500/' /etc/default/tomcat8

	#extracting shibboleth
COPY src/shibbolethidp/${SHIB_VERSION}.zip /
RUN unzip /${SHIB_VERSION}.zip
RUN rm ${SHIB_VERSION}.zip
#COPY src/shibbolethidp/${SHIB_VERSION} /

	#building and granting permission to everyone
COPY src/build.xml /${SHIB_VERSION}/bin/build.xml
RUN /${SHIB_VERSION}/bin/install.sh
COPY src/idp.xml $CATALINA_BASE/conf/Catalina/localhost/idp.xml
RUN sed -i "s/'127.0.0.1\/32'/'0.0.0.0\/0'/" /opt/shibboleth-idp/conf/access-control.xml
RUN find /opt/shibboleth-idp/conf/ -type f -exec chmod 644 {} \;
RUN mkdir /opt/shibboleth-idp/metadata/metadata

	#configuring the first part of the IdP
COPY src/jstl-1.2.jar /opt/shibboleth-idp/edit-webapp/WEB-INF/lib/jstl-1.2.jar
RUN /opt/shibboleth-idp/bin/build.sh

	#install apache for running idp over https

RUN apt-get update
RUN apt-get install apache2 openssl -y

	#preparing apache for running over https
RUN a2dissite 000-default
RUN a2enmod proxy_ajp ssl
COPY src/localhost.conf /etc/apache2/sites-available/localhost.conf
COPY ./ssl/keys/idp.key /etc/ssl/private/idp.key
COPY ./ssl/certs/idp.crt /etc/ssl/certs/idp.crt
RUN a2ensite localhost

COPY src/server.xml $CATALINA_BASE/conf/server.xml


	#configuring LDAP
COPY ./src/ldap.properties /opt/shibboleth-idp/conf/ldap.properties
RUN mv /opt/shibboleth-idp/conf/attribute-resolver.xml /opt/shibboleth-idp/conf/attribute-resolver-default.xml
COPY ./src/attribute-resolver.xml /opt/shibboleth-idp/conf/attribute-resolver.xml
COPY ./src/attribute-filter.xml /opt/shibboleth-idp/conf/attribute-filter.xml
RUN keytool -import -trustcacerts -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt -alias lan-self-cert -file /etc/ssl/certs/idp.crt

	#configuring idp
COPY ./src/metadata-providers.xml  /opt/shibboleth-idp/conf/metadata-providers.xml
COPY ./src/relying-party.xml /opt/shibboleth-idp/conf/relying-party.xml
COPY ./src/saml-nameid.properties.txt /opt/shibboleth-idp/conf/saml-nameid.properties
COPY ./src/saml-nameid.xml /opt/shibboleth-idp/conf/saml-nameid.xml
COPY ./src/credentials /opt/shibboleth-idp/credentials
COPY ./src/metadata/idp-metadata.xml /opt/shibboleth-idp/metadata


	#adding metadata
COPY ./src/metadata/javasp-secure-metadata.xml /opt/shibboleth-idp/metadata/metadata
COPY ./src/metadata/javasp-base-metadata.xml /opt/shibboleth-idp/metadata/metadata
COPY ./src/metadata/javasp-relaystate-vuln-metadata.xml /opt/shibboleth-idp/metadata/metadata
COPY ./src/metadata/javasp-relaystate-sanitized-metadata.xml /opt/shibboleth-idp/metadata/metadata
COPY ./src/metadata/javasp-canonicalization-vuln-metadata.xml /opt/shibboleth-idp/metadata/metadata
COPY ./src/metadata/javasp-billion-laughs-vuln-metadata.xml /opt/shibboleth-idp/metadata/metadata


	# adaption custom C ports to metadata files TO BE FIXED
RUN sed -i 's+localhost:8001+localhost:'$C_SECURE_PORT'+g' /opt/shibboleth-idp/metadata/metadata/javasp-secure-metadata.xml
RUN sed -i 's+localhost:8002+localhost:'$C_BASE_PORT'+g' /opt/shibboleth-idp/metadata/metadata/javasp-base-metadata.xml
RUN sed -i 's+localhost:8003+localhost:'$C_RELAYSTATE_VULN_PORT'+g' /opt/shibboleth-idp/metadata/metadata/javasp-relaystate-vuln-metadata.xml
RUN sed -i 's+localhost:8004+localhost:'$C_RELAYSTATE_SANITIZED_PORT'+g' /opt/shibboleth-idp/metadata/metadata/javasp-relaystate-sanitized-metadata.xml
RUN sed -i 's+localhost:8005+localhost:'$C_CANONICALIZATION_PORT'+g' /opt/shibboleth-idp/metadata/metadata/javasp-canonicalization-vuln-metadata.xml
RUN sed -i 's+localhost:8006+localhost:'$C_BILLION_LAUGHS_PORT'+g' /opt/shibboleth-idp/metadata/metadata/javasp-billion-laughs-vuln-metadata.xml



	#setting logout
#RUN sed -i 's/<\/IDPSSODescriptor>/<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https:\/\/localhost\/idp\/profile\/SAML2\/Redirect\/SLO"\/>\n<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https:\/\/localhost\/idp\/profile\/SAML2\/POST\/SLO"\/>\n<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST-SimpleSign" Location="https:\/\/localhost\/idp\/profile\/SAML2\/POST-SimpleSign\/SLO"\/>\n<SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:SOAP" Location="https:\/\/localhost:8443\/idp\/profile\/SAML2\/SOAP\/SLO"\/>\n<\/IDPSSODescriptor>/' /opt/shibboleth-idp/metadata/idp-metadata.xml

RUN echo "idp.errors.signed = true" >> /opt/shibboleth-idp/conf/idp.properties
RUN echo "idp.session.enabled = true" >> /opt/shibboleth-idp/conf/idp.properties
RUN echo "idp.session.trackSPSessions = true" >> /opt/shibboleth-idp/conf/idp.properties
RUN echo "idp.storage.htmlLocalStorage = true" >> /opt/shibboleth-idp/conf/idp.properties
RUN echo "idp.session.StorageService = shibboleth.StorageService" >> /opt/shibboleth-idp/conf/idp.properties
RUN echo "idp.session.secondaryServiceIndex = true" >> /opt/shibboleth-idp/conf/idp.properties
RUN echo "idp.logout.elaboration = true" >> /opt/shibboleth-idp/conf/idp.properties

	#start tomcat and the idp
CMD service apache2 start ; catalina.sh run
