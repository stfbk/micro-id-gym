#!/bin/bash

chkconfig slapd on
service slapd start
ldapadd -f base.ldif -D cn=Manager,dc=localhost -w secret
ldapadd -f ou.ldif -D cn=Manager,dc=localhost -w secret
ldapadd -f user.ldif -D cn=Manager,dc=localhost -w secret