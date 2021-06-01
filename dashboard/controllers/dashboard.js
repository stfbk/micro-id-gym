const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ncp = require('ncp').ncp;
const replace = require('replace-in-file');
const del = require('del');
const fs = require('fs');
var AdmZip = require('adm-zip');

var multer  = require('multer')
var upload = multer({ dest: 'temp/uploads/' })

upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])



ncp.limit = 16;

router.get('/', (request, response) => {
  response.render("dashboard");
});

router.get('/error', (request, response) => {
  response.render("error");
});


router.post('/generate', upload.fields([{ name: 'uploadedTool', maxCount: 5 }, { name: 'uploadedIdM', maxCount: 1 }]), (request, response) => {
  console.log(request.body);
  folderName = request.body.migScenarioName + "-" + Date.now();
  console.log(typeof request.files.uploadedIdM !== 'undefined' && request.files.uploadedIdM);


  ncp("mig", "temp/" + folderName, function (error) {
    if (error) {
      response.render("error");
    }
    ncp("../frontend/proxy", "temp/" + folderName + "/frontend/proxy", function (error) {
      if (error) {
        response.render("error");
      }
      ncp("../frontend/pentesting-tools", "temp/" + folderName + "/frontend/proxy/extension", function (error) {
        if (error) {
          response.render("error");
        }
        ncp("../frontend/stix-visualizer", "temp/" + folderName + "/frontend/tools/stixvisualizer", function (error) {
          if (error) {
            response.render("error");
          }
          ncp("../frontend/msc-drawer", "temp/" + folderName + "/frontend/tools/mscdrawer", function (error) {
            if (error) {
              response.render("error");
            }
            if(request.body.targetRadio == "Sandbox") {
              if(request.body.sandboxType.includes("Create")) {
                // remove unused files to reduce zip folder size
                username = "";
                password = "";
                ncp("../backend/client-repository", "temp/" + folderName + "/sut/client", function (error) {
                  if (error) {
                    response.render("error");
                  }
                  ncp("../backend/idp-repository", "temp/" + folderName + "/sut/idp", function (error) {
                    if (error) {
                      response.render("error");
                    }
                    if(request.body.protocol == "saml") {

                      del.sync(["temp/" + folderName + "/sut/client/OAuth-OIDC"]);
                      del.sync(["temp/" + folderName + "/sut/credential/OAuth-OIDC"]);
                      del.sync(["temp/" + folderName + "/sut/idp/OAuth-OIDC"]);
                      del.sync(["temp/" + folderName + "/sut/docker-compose-oauth-mitreid.yml"]);
                      del.sync(["temp/" + folderName + "/sut/docker-compose-oauth-keycloak.yml"]);
                      del.sync(["temp/" + folderName + "/frontend/proxy/msc-logger-oauth.json"]);
                      fs.renameSync("temp/" + folderName + "/sut/docker-compose-saml.yml", "temp/" + folderName + "/sut/docker-compose.yml");
                      fs.renameSync("temp/" + folderName + "/frontend/proxy/msc-logger-saml.json", "temp/" + folderName + "/frontend/proxy/msc-logger-options.json");

                      del.sync(["temp/" + folderName + "/sut/client/SAML/spring/src/**", "!temp/" + folderName + "/sut/client/SAML/spring/src", "!temp/" + folderName + "/sut/client/SAML/spring/src/spring-security-saml-sp-1.0-" + request.body.clientVersion + ".jar", "!temp/" + folderName + "/sut/client/SAML/spring/src/idp-metadata.xml"]);

                      del.sync(["temp/" + folderName + "/sut/idp/SAML/shibboleth/src/shibbolethidp/**", "!temp/" + folderName + "/sut/idp/SAML/shibboleth/src/shibbolethidp", "!temp/" + folderName + "/sut/idp/SAML/shibboleth/src/shibbolethidp/shibboleth-identity-provider-" + request.body.idpVersion + ".zip"]);

                      // customize docker-compose sut
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "idp_version=3.3.3", "idp_version=" + request.body.idpVersion);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "c_" + request.body.clientVersion.replace("-", "_") + "_port=8888", "c_" + request.body.clientVersion.replace("-", "_") + "_port=" + request.body.clientPort);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "9443:443", request.body.idpPort + ":443");
                      username = request.body.testerUsername.length > 0 ? request.body.testerUsername : "user";
                      password = request.body.testerPassword.length > 0 ? request.body.testerPassword : "password";
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "testerUsername=mig", "testerUsername=" + username);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "testerPassword=mig", "testerPassword=" + password);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "c_version=secure", "c_version=" + request.body.clientVersion);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "c_port=8888", "c_port=" + request.body.clientPort);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "idp_port=9443", "idp_port=" + request.body.idpPort);
                      replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "8888:8888", request.body.clientPort + ":" + request.body.clientPort);
                    } else {
                  del.sync(["temp/" + folderName + "/sut/client/SAML"]);
                  del.sync(["temp/" + folderName + "/sut/credential/SAML"]);
                  del.sync(["temp/" + folderName + "/sut/idp/SAML"]);
                  del.sync(["temp/" + folderName + "/sut/docker-compose-saml.yml"]);
                  del.sync(["temp/" + folderName + "/frontend/proxy/msc-logger-saml.json"]);
                  fs.renameSync("temp/" + folderName + "/frontend/proxy/msc-logger-oauth.json", "temp/" + folderName + "/frontend/proxy/msc-logger-options.json");

                  if(request.body.clientVersion == "keycloak") {
                    fs.renameSync("temp/" + folderName + "/sut/docker-compose-oauth-keycloak.yml", "temp/" + folderName + "/sut/docker-compose.yml");
                    del.sync(["temp/" + folderName + "/sut/docker-compose-oauth-mitreid.yml"]);
                    del.sync(["temp/" + folderName + "/sut/client/OAuth-OIDC/mitreid"]);
                    del.sync(["temp/" + folderName + "/sut/credential/OAuth-OIDC/mitreid"]);
                    del.sync(["temp/" + folderName + "/sut/idp/OAuth-OIDC/mitreid"]);
                  } else {
                    fs.renameSync("temp/" + folderName + "/sut/docker-compose-oauth-mitreid.yml", "temp/" + folderName + "/sut/docker-compose.yml");
                    del.sync(["temp/" + folderName + "/sut/docker-compose-oauth-keycloak.yml"]);
                    del.sync(["temp/" + folderName + "/sut/client/OAuth-OIDC/keycloak"]);
                    del.sync(["temp/" + folderName + "/sut/credential/OAuth-OIDC/keycloak"]);
                    del.sync(["temp/" + folderName + "/sut/idp/OAuth-OIDC/keycloak"]);
                  }

                  // customize docker-compose sut
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "version=redirect-vuln", "version=" + request.body.idpVersion);
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "c_port=8888", "c_port=" + request.body.clientPort);
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "idp_port=9000", "idp_port=" + request.body.idpPort);
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "9000:9000", request.body.idpPort + ":" + request.body.idpPort);
                  username = request.body.testerUsername.length > 0 ? request.body.testerUsername : "user";
                  password = request.body.testerPassword.length > 0 ? request.body.testerPassword : "password";
                  if(request.body.clientVersion == "mitreid") {
                    replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "c_port=8888", "c_port=" + request.body.clientPort);
                    replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "testerUsername=mig", "testerUsername=" + username);
                    replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "testerPassword=mig", "testerPassword=" + password);
                  }
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "c_port=8888", "c_port=" + request.body.clientPort);
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "idp_port=9000", "idp_port=" + request.body.idpPort);
                  replaceFileValue("temp/" + folderName + "/sut/docker-compose.yml", "8888:8888", request.body.clientPort + ":" + request.body.clientPort);
                }
                  });
                });
              } else {
                if (typeof request.files.uploadedIdM !== 'undefined' && request.files.uploadedIdM.length > 0) {
                  del.sync(["temp/" + folderName + "/sut/**", "!temp/" + folderName + "/sut"]);
                  fs.renameSync(request.files.uploadedIdM[0].path, "temp/" + folderName + "/" + request.files.uploadedIdM[0].filename);
                  var zip = new AdmZip("temp/" + folderName + "/" + request.files.uploadedIdM[0].filename);
                  zip.extractAllTo("temp/" + folderName + "/sut/", true);
                  del.sync(["temp/" + folderName + "/" + request.files.uploadedIdM[0].filename]);
                  console.log("upload Sandbox");
                } else {
                  response.render("error");
                }
              }
            } else {
              del.sync(["temp/" + folderName + "/sut"]);
            }
            // customize docker-compose tools
            replaceFileValue("temp/" + folderName + "/frontend/tools/docker-compose.yml", "msc_port=5000", "msc_port=" + request.body.mscPort);
            replaceFileValue("temp/" + folderName + "/frontend/tools/docker-compose.yml", "stix_port=5555", "stix_port=" + request.body.stixPort);
            replaceFileValue("temp/" + folderName + "/frontend/tools/docker-compose.yml", "5000:5000", request.body.mscPort + ":" + request.body.mscPort);
            replaceFileValue("temp/" + folderName + "/frontend/tools/docker-compose.yml", "stix_port=5555", "stix_port=" + request.body.stixPort);
            replaceFileValue("temp/" + folderName + "/frontend/tools/docker-compose.yml", "5555:5555", request.body.stixPort + ":" + request.body.stixPort);

            // customize burp option files
            additionalTool = '';
            if (typeof request.files.uploadedTool !== 'undefined' && request.files.uploadedTool.length > 0) {
              // add extensions to burp
              for(i = 0; i < request.files.uploadedTool.length; i++) {
                fs.renameSync(request.files.uploadedTool[i].path, "temp/" + folderName + "/frontend/proxy/extension/" + request.files.uploadedTool[i].filename + ".jar");
                additionalTool += ','+
                '{'+
                    '"errors":"ui",'+
                    '"extension_file":"./extension/' + request.files.uploadedTool[i].filename + ".jar" + '",'+
                    '"extension_type":"java",'+
                    '"loaded": true,'+
                    '"name":"Additional tool ' + (i+1) + '",'+
                    '"output":"ui"'+
                '}';
              }
            }
            replaceFileValue("temp/" + folderName + "/frontend/proxy/user-options.json", "<additional-tools>", additionalTool);
            replaceFileValue("temp/" + folderName + "/frontend/proxy/project-options.json", "8080", request.body.proxyPort);
            if(request.body.protocol == "saml"){
              replaceFileValue("temp/" + folderName + "/frontend/proxy/user-options.json", "<saml-plugin-loaded>", "true");
              replaceFileValue("temp/" + folderName + "/frontend/proxy/user-options.json", "<oauth-plugin-loaded>", "false");
            } else{
                replaceFileValue("temp/" + folderName + "/frontend/proxy/user-options.json", "<saml-plugin-loaded>", "false");
                replaceFileValue("temp/" + folderName + "/frontend/proxy/user-options.json", "<oauth-plugin-loaded>", "true");
            }
            replaceFileValue("temp/" + folderName + "/frontend/proxy/msc-logger-options.json", "5000", request.body.mscPort);
            replaceFileValue("temp/" + folderName + "/frontend/proxy/msc-logger-options.json", "test-logger", request.body.migScenarioName);

            // customize README
            if(request.body.clientVersion == "keycloak")
              clientPortAndBasePath = request.body.clientPort + "/vanilla";
            else if (request.body.clientVersion == "mitreid")
              clientPortAndBasePath = request.body.clientPort + "/simple-web-app";
            else
              clientPortAndBasePath = request.body.clientPort;

            replaceFileValue("temp/" + folderName + "/README.txt", "<filename>", global.appRoot + "/temp/" + folderName);
            replaceFileValue("temp/" + folderName + "/README.txt", "<proxyPort>", request.body.proxyPort);
            replaceFileValue("temp/" + folderName + "/README.txt", "<mscPort>", request.body.mscPort);
            replaceFileValue("temp/" + folderName + "/README.txt", "<sessionId>", request.body.migScenarioName);
            replaceFileValue("temp/" + folderName + "/README.txt", "<stixPort>", request.body.stixPort);
            replaceFileValue("temp/" + folderName + "/README.txt", "<clientPort>", clientPortAndBasePath);
            replaceFileValue("temp/" + folderName + "/README.txt", "<idpPort>", request.body.idpPort);
            username = request.body.testerUsername.length > 0 ? request.body.testerUsername : "user";
            password = request.body.testerPassword.length > 0 ? request.body.testerPassword : "password";
            replaceFileValue("temp/" + folderName + "/README.txt", "<username>", username);
            replaceFileValue("temp/" + folderName + "/README.txt", "<password>", password);

            del.sync(["temp/uploads/**"]);

            if(request.body.targetRadio == "Sandbox") {
              if(request.body.sandboxType.includes("Create")) {
                response.render("generate", {filename: global.appRoot + "/temp/" + folderName, proxyPort: request.body.proxyPort, mscPort: request.body.mscPort, stixPort: request.body.stixPort, clientPort: clientPortAndBasePath, idpPort: request.body.idpPort, username: username, password: password, sessionId: request.body.migScenarioName});
              } else {
                // change README with upload description

                response.render("generate", {filename: global.appRoot + "/temp/" + folderName, proxyPort: request.body.proxyPort, mscPort: request.body.mscPort, stixPort: request.body.stixPort, clientPort: "", idpPort: "", username: "", password: "", sessionId: request.body.migScenarioName});
              }
            } else {
              // remove sut deployment description from README
              response.render("generate", {filename: global.appRoot + "/temp/" + folderName, proxyPort: request.body.proxyPort, mscPort: request.body.mscPort, stixPort: request.body.stixPort, clientPort: "", idpPort: "", username: "", password: "", sessionId: request.body.migScenarioName});

            }

          });
        });
      });
    });
  });
});




router.get('/test', (request, response) => {
  response.render("generate", {filename: "/Users/giulio/Desktop/fbk/paper/dashboard/temp/my-test-scenario-1591283852875", proxyPort: 8080, mscPort: 5000, stixPort: 5555, idpPort: 9443, clientPort: 8001, username: "bob", password: "secret"});
});

function replaceFileValue(filePath, oldValue, newValue) {
  options = {
    files: filePath,
    from: oldValue,
    to: newValue,
  };
  try {
    const results = replace.sync(options);
    console.log('Replacement results:', results);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}


module.exports = router;
