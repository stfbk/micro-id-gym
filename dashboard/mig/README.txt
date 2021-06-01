ENVIRONMENT CONFIGURATION INSTRUCTIONS

The customized environment can be found at: <filename>
The folder is structured in three subfolders: proxy, tools and, in case of a sandboxed IdM system, sut. Each one contains the files to run a part of MIG. Perform the following steps to setup the environment.

PROXY
- open the terminal and reach the folder frontend/proxy
- run java -jar burpsuite_community_v2020.2.1.jar --user-config-file=user-options.json --config-file=project-options.json &
- configure your browser to use the proxy at port <proxyPort>
    * Chrome: https://portswigger.net/support/configuring-chrome-to-work-with-burp
    * IE: https://portswigger.net/support/configuring-internet-explorer-to-work-with-burp
    * Firefox: https://portswigger.net/support/configuring-firefox-to-work-with-burp
    * Safari: https://portswigger.net/support/configuring-safari-to-work-with-burp


TOOLS
- open the terminal and reach the folder frontend/tools
- run docker-compose up --build
- open the browser
- visit localhost:<mscPort> to use the MSC Drawer
- login into the drawer with the password <sessionId>
- visit localhost:<stixPort> to use STIX visualizer


SYSTEM UNDER TEST
In case of a sandboxed IdM system created using the instances available in MIG Backend:
- add the following entries to the host file of your machine
    * 127.0.0.1 identityprovider
    * 127.0.0.1 client
- open the terminal and reach the folder sut
- run docker-compose up --build
- open the browser
- visit the Client at localhost:<clientPort>
- visit the Identity Provider at localhost:<idpPort>
- to login at the Identity Provider use the following user details <username>:<password>

In case of a sandboxed IdM system uploaded by the user:
- open the terminal and reach the folder sut
- move to the directory where the docker-compose.yml file is located
- run docker-compose up --build
