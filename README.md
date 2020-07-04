# Micro-Id-Gym (MIG)

Micro-Id-Gym (MIG) aims to assist system administrators and testers in the deployment and pen-testing of IdM protocol instances.

## Features

- Setup and deploy a custom SSO solution based on SAML and OIDC/OAuth
- Run automated tests to discover vulnerabilities in the implementation of SSO based on SAML and OIDC/OAuth
- Graphically represents the authentication flow as message sequence chart and deeply inspect it
- Access Cyber Threat Intelligence (CTI) information to assess how a vulnerability can be exploited and how severe it is

## Dependencies

To be able to run MIG tool you will need to install:
- [NodeJs](https://nodejs.org/en/download/)
- [Java](https://www.java.com/it/download/)
- a browser (Chrome, Firefox)
- [Docker](https://docs.docker.com/get-docker/)


## Download

You can download MIG tool by cloning this git repository:

```
git clone https://github.com/stfbk/micro-id-gym/
```


## Usage

Open a new terminal, reach the dashboard folder and install the necessary packages with the command:

```
npm install
```

Run then the dashboard with the command:

```
node app
```
Visit `localhost:2020` to start using MIG tool webapp.
A dashboard for the configuration is presented. Here you can customize the ports where the System Under Test (SUT) and the tools will run.
At the end of the configuration, click on the button *Download scenario and tools* to generate a folder with the customized SUT and tools.
Following the instructions provided by the webapp and available also in the `README` file inside the folder, you can run the testing environment.

The instructions to use the frontend components are available at the following links: <br>
**MSC Drawer:**
- [MSC Logger Plugin](./docs/msc-logger.md)
- [MSC Webapp](./docs/msc-drawer.md)

**STIX Visualizer:**
- [Webapp](./docs/stix.md)

**Pentesting tools:**
- [MIG - OAuth/OIDC](./docs/oauth-plugin.md)
- [MIG - SAML SSO](./docs/saml-plugin.md)


## Credits

MIG tool exists thanks to the following projects:

- [SAML](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)[3]
- [OAuth](https://tools.ietf.org/html/rfc6749)[2]
- [OpenID Connect](https://openid.net/connect/)[4]
- [STIX](https://oasis-open.github.io/cti-documentation/)[1]
- [Shibboleth](https://wiki.shibboleth.net/confluence/display/IDP30/Home)
- [MITREid](https://github.com/mitreid-connect)
- [Keycloak](https://github.com/keycloak)
- [Burpsuite Community Edition](https://portswigger.net/burp/communitydownload)
- [cti-stix-visualization](https://github.com/oasis-open/cti-stix-visualization)
- [JS Sequence Diagrams](https://github.com/bramp/js-sequence-diagrams)


## References

[1] [OASIS Cyber Threat Intelligence (CTI) TC](https://www.oasis-open.org/committees/cti) <br>
[2] [Security Considerations OAuth (accessed june 23, 2020)](https://tools.ietf.org/id/draft-bradley-oauth-jwt-encoded-state-08.html#rfc.section.6) <br>
[3] [Security Assertion Markup Language (SAML) V2.0 Technical Overview](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html) <br>
[4] [OpenID Connect](https://openid.net/connect/) <br>

## License
Copyright 2019-2020, Fondazione Bruno Kessler

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

```
http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Developed within [Security & Trust](https://stfbk.github.io/) Research Unit at [Fondazione Bruno Kessler](https://www.fbk.eu/en/) (Italy)
