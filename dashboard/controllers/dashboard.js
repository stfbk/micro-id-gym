const async = require('async');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ncp = require('ncp').ncp;
const path = require('path');
const replace = require('replace-in-file');
const del = require('del');
const fs = require('fs');
var AdmZip = require('adm-zip');

var multer = require('multer')
var upload = multer({dest: 'temp/uploads/'})

upload.fields([{name: 'avatar', maxCount: 1}, {name: 'gallery', maxCount: 8}])


ncp.limit = 16;

router.get('/', (request, response) => {
  response.render("dashboard");
});

router.get('/error', (request, response) => {
  response.render("error");
});


router.post('/generate', upload.fields([
  {name: 'uploadedTool', maxCount: 5},
  {name: 'uploadedIdM', maxCount: 1}
]), (request, response, next) => {
  console.log(request.body);
  const folderName = request.body.migScenarioName + "-" + Date.now();
  let username;
  let password;
  let clientPortAndBasePath;

  if (request.body.clientVersion === "keycloak") {
    clientPortAndBasePath = request.body.clientPort + "/vanilla";
  } else if (request.body.clientVersion === "mitreid") {
    clientPortAndBasePath = request.body.clientPort + "/simple-web-app";
  } else {
    clientPortAndBasePath = request.body.clientPort;
  }


  console.log(typeof request.files.uploadedIdM !== 'undefined' && request.files.uploadedIdM);
  async.waterfall([
    function (cb) {
      ncp("mig/", path.join("temp", folderName), function (error) {
        cb(error)
      });
    },
    function (cb) {
      ncp(path.join('../', 'frontend/', 'proxy'),
        path.join('temp/', folderName, 'frontend/', 'proxy/'),
        function (error) {
          cb(error)
        });
    },
    function (cb) {
      ncp(path.join('../', 'frontend/', 'pentesting-tools'),
        path.join('temp/', folderName, 'frontend/', 'proxy/', 'extension'), function (error) {
          cb(error);
        });
    },
    function (cb) {
      ncp(path.join('../', 'frontend/', 'stix-visualizer'),
        path.join('temp/', folderName, 'frontend/', 'tools/', 'stixvisualizer'),
        function (error) {
          cb(error);
        }
      );
    },
    function (cb) {
      ncp(path.join('../', 'frontend/', 'msc-drawer'),
        path.join('temp/', folderName, 'frontend/', 'tools/', 'mscdrawer'), function (error) {
          cb(error);
        });
    },
    function (cb){
      replaceFileValue(
        path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-saml.json'),
        "5000",
        request.body.mscPort,
        cb
      );
    },
    function (cb){
      replaceFileValue(
        path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-saml.json'),
        "<sessionId>",
        request.body.migScenarioName,
        cb
      );
    },
    function (cb){
      replaceFileValue(
        path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-oauth.json'),
        "5000",
        request.body.mscPort,
        cb,
      );
    },
    function (cb) {
      replaceFileValue(
        path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-oauth.json'),
        "<sessionId>",
        request.body.migScenarioName,
        cb,
      );
    },
    function (clb) {
      if (request.body.targetRadio === "Sandbox") {
        if (request.body.sandboxType.includes("Create")) {
          // remove unused files to reduce zip folder size
          username = "";
          password = "";
          async.waterfall([
            function (cb){
              ncp(path.join('../','backend/','client-repository'),
                path.join('temp/',folderName, 'sut/','client/'), function (error) {
                cb(error);
              });
            },
            function (cb){
              ncp(path.join('../','backend/','idp-repository'),
                path.join('temp/',folderName, 'sut/','idp/'), function (error) {
                  cb(error);
                });
            },
            function (cb){
              async.eachSeries([
                [path.join('temp/',folderName,'sut/','client/','OAuth-OIDC')],
                [path.join('temp/',folderName,'sut/','credential/','OAuth-OIDC')],
                [path.join('temp/',folderName,'sut/','idp/','OAuth-OIDC')],
                [path.join('temp/',folderName,'sut/','docker/','compose-oauth-mitreid.yml')],
                [path.join('temp/',folderName,'sut/','docker/','compose-oauth-keycloak.yml')],
                ], del, cb);
            },
            function (cb){
              fs.rename(
                path.join('temp/',folderName, 'sut/','docker-compose-saml.yml'),
                path.join('temp/',folderName, 'sut/','docker-compose.yml'),
                cb
              );
            },
            function (cb){
              del([
                  path.join('temp/', folderName, 'sut/','client/','SAML/','spring/','src/','**'),
                  path.join('!temp/', folderName, 'sut/','client/','SAML/','spring/','src/',),
                  path.join('!temp/', folderName, 'sut/','client/','SAML/','spring/','src/',`spring-security-saml-sp-1.0-${request.body.clientVersion}.jar`),
                  path.join('!temp/', folderName, 'sut/','client/','SAML/','spring/','src/','idp-metadata.xml')
                ], cb
              );
            },
            function (cb){
              del([
                  path.join('temp/', folderName, 'sut/','idp/','SAML/','shibboleth/', 'src/','shibbolethidp/','**'),
                  path.join('!temp/', folderName, 'sut/','idp/','SAML/','shibboleth/', 'src/','shibbolethidp'),
                  path.join('!temp/', folderName, 'sut/','idp/','SAML/','shibboleth/', 'src/','shibbolethidp',`shibboleth-identity-provider-${request.body.idpVersion}.zip`)]
                , cb
              );
            },
            function (cb) {
              if (request.body.targetRadio === "Sandbox") {
                if (request.body.protocol === "saml") {
                  // customize docker-compose sut
                  const input = path.join('temp/', folderName, '/sut/docker-compose.yml');
                  // add fixes
                  return async.series([
                    function (c) {
                      replaceFileValue(input, "idp_version=3.3.3", "idp_version=" + request.body.idpVersion, c);
                    },
                    function (c) {
                      replaceFileValue(input, "c_version=default", "c_version=" + request.body.clientVersion, c);
                    },
                    function (c) {
                      replaceFileValue(input, "c_port_idp=8888", "c_port_idp=" + request.body.clientPort, c);
                    }
                  ], cb);
                  // finish
                } else { // not saml
                  return  del([
                    path.join('temp/', folderName, 'sut/','client/','SAML'),
                    path.join('temp/', folderName, 'sut/', 'credential/','SAML'),
                    path.join('temp/', folderName, 'sut/','idp/','SAML'),
                    path.join('temp/', folderName, 'frontend/','proxy/','msc-logger-saml.json'),
                  ], cb);
                }
              } else { // not Sandbox

              }
            },
            function (cb){
              cb(null);
            }
          ],clb);
        } else {
          if (typeof request.files.uploadedIdM !== 'undefined' && request.files.uploadedIdM.length > 0) {
            async.series([
              function (c) {
                del([
                  path.join('temp/', folderName, 'sut/','**'),
                  path.join('!temp/',folderName,"sut/")
                  ], c);
              },
              function (c) {
                fs.rename(
                  request.files.uploadedIdM[0].path,
                  path.join('temp/', folderName, request.files.uploadedIdM[0].filename), c
                );
              },
              function (c) {
                // since its misleading in documentation for callback to be called
                const zip = new AdmZip(
                  path.join('temp/', folderName, request.files.uploadedIdM[0].filename)
                );
                zip.extractAllTo(
                  path.join('temp/', folderName, 'sut/'), true
                );
                process.nextTick(c);
              },
              function (c) {
                del.sync([
                  path.join('temp/', folderName, request.files.uploadedIdM[0].filename),
                ], c);
              }
            ], function (error){
              console.log("upload Sandbox");
              clb(error);
            });
          } else {
            clb(new Error('wrong body sandbox type'));
          }
        }
      } else {
        del([ path.join('temp/',folderName,'sut/')], clb);
      }
    },
    function (clb) {
      // customize docker-compose tools
      async.series([
        function (c) {
          replaceFileValue(path.join('temp/', folderName, 'frontend/', 'tools/', 'docker-compose.yml'), "msc_port=5000", "msc_port=" + request.body.mscPort, c);
        },
        function (c) {
          replaceFileValue(path.join('temp/', folderName, 'frontend/', 'tools/', 'docker-compose.yml'), "stix_port=5555", "stix_port=" + request.body.stixPort, c);
        },
        function (c) {
          replaceFileValue(path.join('temp/', folderName, 'frontend/', 'tools/', 'docker-compose.yml'), "5000:5000", request.body.mscPort + ":" + request.body.mscPort, c);
        },
        function (c) {
          replaceFileValue(path.join('temp/', folderName, 'frontend/', 'tools/', 'docker-compose.yml'), "stix_port=5555", "stix_port=" + request.body.stixPort, c);
        },
        function (c) {
          replaceFileValue(path.join('temp/', folderName, 'frontend/', 'tools/', 'docker-compose.yml'), "5555:5555", request.body.stixPort + ":" + request.body.stixPort, c);
        },
      ], clb);
    },
    function (clb) {
      // customize burp option files
      if (typeof request.files.uploadedTool !== 'undefined' && request.files.uploadedTool.length > 0) {
        let additionalTool = [];
        // add extensions to burp
        return async.eachOfSeries(request.files.uploadedTool, function (file, index, callback){
          fs.rename(
            file.path,
            path.join('temp/', folderName, 'frontend/','proxy/','extension/', `${file.filename}.jar`),
            function (error) {
              if(error) {
                return callback(error);
              }
              additionalTool.push({
                errors:'ui',
                extension_file: path.join('./','extension/', `${file.filename}.jar`),
                extension_type:'java',
                loaded: true,
                name:`Additional tool ${1+index}`,
                output: "ui"
              });
              callback(null);
            }
          );
        }, function (error){
          if(error) {
            return clb(error);
          }
          return replaceFileValue(
            path.join('temp/',folderName,'frontend/','proxy/','user-options.json'),
            '<additional-tools>',
            JSON.stringify(additionalTool,null, 2),
            clb);
        });
      }
      clb(null)
    },
    function (clb) {
      replaceFileValue(
        path.join('temp/', folderName,  'frontend/','proxy/','project-options.json'),
        "8080",
        request.body.proxyPort, clb);
    },
    function (clb) {
      if (request.body.protocol === 'saml') {
        async.series([
          function (cb) {
            replaceFileValue(
              path.join('temp/', folderName, 'frontend/', 'proxy/', 'user-options.json'),
              "<saml-plugin-loaded>",
              "true",
              cb);
          },
          function (cb) {
            replaceFileValue(
              path.join('temp/', folderName, 'frontend/','proxy/','user-options.json'),
              "<oauth-plugin-loaded>",
              "false",
              cb);
          },
          function (cb) {
            del([path.join('temp/', folderName, 'frontend/','proxy/','msc-logger-oauth.json')], cb);
          },
          function (cb) {
            fs.rename(
              path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-saml.json'),
              path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-options.json'),
              cb);
          },
        ], clb);
      } else {
        async.series([
          function (cb) {
            replaceFileValue(
              path.join('temp/', folderName, 'frontend/', 'proxy/', 'user-options.json'),
              "<saml-plugin-loaded>",
              "false",
              cb);
          },
          function (cb) {
            replaceFileValue(
              path.join('temp/', folderName, 'frontend/','proxy/','user-options.json'),
              "<oauth-plugin-loaded>",
              "true",
              cb);
          },
          function (cb) {
            del([path.join('temp/', folderName, 'frontend/','proxy/','msc-logger-saml.json')], cb);
          },
          function (cb) {
            fs.rename(
              path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-oauth.json'),
              path.join('temp/',folderName, 'frontend/','proxy/','msc-logger-options.json'),
              cb);
          },
        ], clb);
      }
    },
    // customize README
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<filename>",
        path.join(global.appRoot, 'temp/', folderName),
        clb)
    },
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<proxyPort>", request.body.proxyPort, clb)
    },
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<mscPort>", request.body.mscPort, clb)
    },
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<sessionId>", request.body.migScenarioName, clb)
    },
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<stixPort>", request.body.stixPort, clb)
    },
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<clientPort>", clientPortAndBasePath, clb)
    },
    function (clb) {
      replaceFileValue(path.join('temp/', folderName, 'README.txt'), "<idpPort>", request.body.idpPort, clb)
    },
    function (clb) {
      username = request.body.testerUsername.length > 0 ? request.body.testerUsername : 'user';
      replaceFileValue(path.join('temp/',folderName, 'README.txt'), "<username>", username, clb);
    },
    function(clb){
      password = request.body.testerPassword.length > 0 ? request.body.testerPassword : "password";
      replaceFileValue(path.join('temp/',folderName, 'README.txt'), "<password>", password, clb);
    },
    function (clb){
      del([path.join('temp/','uploads/','**')], clb);
    }
  ], function (error) {
    if (error) {
      return next(error);
    }
    if (request.body.targetRadio === "Sandbox") {
      if (request.body.sandboxType.includes("Create")) {
        response.render("generate", {
          filename: path.join(global.appRoot, 'temp', folderName),
          proxyPort: request.body.proxyPort,
          mscPort: request.body.mscPort,
          stixPort: request.body.stixPort,
          clientPort: clientPortAndBasePath,
          idpPort: request.body.idpPort,
          username,
          password,
          sessionId: request.body.migScenarioName
        });
      } else {
        // change README with upload description
        response.render("generate", {
          filename: path.join(global.appRoot, 'temp', folderName),
          proxyPort: request.body.proxyPort,
          mscPort: request.body.mscPort,
          stixPort: request.body.stixPort,
          clientPort: "",
          idpPort: "",
          username: "",
          password: "",
          sessionId: request.body.migScenarioName
        });
      }
    } else {
      // remove sut deployment description from README
      response.render("generate", {
        filename: path.join(global.appRoot, 'temp', folderName),
        proxyPort: request.body.proxyPort,
        mscPort: request.body.mscPort,
        stixPort: request.body.stixPort,
        clientPort: "",
        idpPort: "",
        username: "",
        password: "",
        sessionId: request.body.migScenarioName
      });
    }
  });
});


router.get('/test', (request, response) => {
  response.render("generate", {
    filename: "/Users/giulio/Desktop/fbk/paper/dashboard/temp/my-test-scenario-1591283852875",
    proxyPort: 8080,
    mscPort: 5000,
    stixPort: 5555,
    idpPort: 9443,
    clientPort: 8001,
    username: "bob",
    password: "secret"
  });
});

function replaceFileValue(filePath, oldValue, newValue, cb) {
  options = {
    files: filePath,
    from: oldValue,
    to: newValue,
  };
  replace(options, function (error, results){
    if(error) {
      return cb(error);
    }
    console.log('In file %s we replaced %s to %s', filePath, oldValue, newValue);
    cb(null);
  });
}


module.exports = router;
