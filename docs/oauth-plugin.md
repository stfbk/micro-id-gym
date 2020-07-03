# MIG - OAuth/OIDC

This plugin performs passive and active tests through the analysis of the traffic generated during OAuth/OIDC authentication and/or authorization process. If a vulnerability is discovered, the information about it is reported in the plugin table and can be saved as json file.

## How to use

1. Select which browser you prefer. Plugin is compatible with Chrome/Chromium and Firefox. **Changing web browser will reset the driver binary, so you will need to reselect it**.
2. Download `Selenium WebDriver` binary at [https://www.selenium.dev/downloads/](https://www.selenium.dev/downloads/) for the browser you selected. Pay attention to the browser version.
3. Select the downloaded file using the `Select driver` button.
4. Create a track for your test and insert it into the text area. You can write it manually or you can use [Katalon](https://www.katalon.com/) plugin to create it automatically.
5. Run the track test to check whether the track is correct. This test will enable the passive and active checks.
6. Run the passive checks and then active checks. Follow this order because some active tests rely on some passive ones.
7. If you want you can save the result as a JSON file.



## Commands available in the test track
* **open | http://www.example.com |**: open web browser at the indicated URL
* **type | *indicator*=example | text**: types the string *text* at the indicated location
* **click | *indicator*=example**: clicks the indicated element of the page

#### Types of indicators
* name
* class
* id
* xpath
* link


## Tests Notes

* If the IdM protocol is not OAuth, the tests **[11] JWT are well formed** and **[17] JWT are validated** are not executed. In case of OIDC the tests are executed.
* If the `state` parameter (defined as [RECOMMENDED](https://tools.ietf.org/html/rfc6749#section-1.3.1) in the standard) is not used, the test **[12] Require state parameter** and **[15] Prevent state parameter modification** are not executed.
* If the `PKCE` extension is not used, the tests **[13] Require code_challenge parameter** and **[14] Require code_challenge_method** are not executed.
* If the `URI` does not contain subdirectories, the test **[16] Prevent Redirect URI modification with /../** is not executed.
