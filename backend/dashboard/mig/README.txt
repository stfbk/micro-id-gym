ENVIRONMENT CONFIGURATION INSTRUCTIONS

The customized environment can be found at: <filename>
The folder is structured in three subfolders: proxy, tools and sso. Each one contains the files to run a part of MIG environment. Perform the following steps to setup the environment.

PROXY
- open the terminal and reach the folder proxy
- run java -jar burpsuite_community_v2020.2.1.jar --user-config-file=user-options.json --config-file=project-options.json &
- configure your browser to use the proxy at port <proxyPort>
    * Chrome: https://portswigger.net/support/configuring-chrome-to-work-with-burp
    * IE: https://portswigger.net/support/configuring-internet-explorer-to-work-with-burp
    * Firefox: https://portswigger.net/support/configuring-firefox-to-work-with-burp
    * Safari: https://portswigger.net/support/configuring-safari-to-work-with-burp


TOOLS
- open the terminal and reach the folder tools
- run docker-compose up --build
- open the browser
- visit localhost:<mscPort> to use the MSC Drawer
- login into the drawer with the password <sessionId>
- visit localhost:<stixPort> to use STIX visualizer


SINGLE SIGN-ON SCENARIO
- add the following entries to the host file of your machine
    * 127.0.0.1 identityprovider
    * 127.0.0.1 client
- open the terminal and reach the folder sso
- run docker-compose up --build
- open the browser
- visit the Client at localhost:<clientPort>
- visit the Identity Provider at localhost:<idpPort>
