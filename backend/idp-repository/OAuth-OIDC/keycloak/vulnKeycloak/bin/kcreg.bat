@echo off

if "%OS%" == "Windows_NT" (
  set "DIRNAME=%~dp0%"
) else (
  set DIRNAME=.\
)
java %KC_OPTS% -cp %DIRNAME%\client\keycloak-client-registration-cli-7.0.0-SNAPSHOT.jar org.keycloak.client.registration.cli.KcRegMain %*
