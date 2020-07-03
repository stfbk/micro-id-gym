	#preparing the basic environment
FROM ubuntu:16.04

	#secure -> version without vulnerabilities
	#base -> version that doesn't print the RelayState value
	#relaystate-vuln -> version that prints the RelayState value without sanitizing it
	#relaystate-sanitized -> version that sanitizes the RelayState value before printing it
	#canonicalization-vuln -> version vulnerable to canonicalization attack
	#billion-laughs-vuln -> version vulnerable to billion laughs attack

ARG c_version
ARG c_port
ARG idp_port

ENV C_PORT=$c_port
ENV IDP_PORT=$idp_port

RUN apt-get update
RUN apt-get install -y default-jdk nano unzip curl

COPY src/spring-security-saml-sp-1.0-$c_version.jar /spring-security-saml-sp-1.0.jar
COPY ssl/keystore.jks /keystore.jks

RUN mkdir /metadata
COPY src/idp-metadata.xml /metadata
RUN sed -i 's+localhost/idp/profile+localhost:'$IDP_PORT'/idp/profile+g' /metadata/idp-metadata.xml;



CMD java -jar spring-security-saml-sp-1.0.jar --server.port=$C_PORT
