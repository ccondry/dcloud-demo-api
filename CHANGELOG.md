# demo-api Change Log

Dates are in YYYY.MM.DD-X format, where X is revision number


# 2022.4.14-1

### Fixes
* **Configuration:** Remove remaining mm-dev reference.


# 2022.4.14

### Fixes
* **Configuration:** Remove mm-dev references to fix 500 errors on routes
that reference it as a backup server.


# 2022.4.7

### Fixes
* **CCAI:** Update URL and default org ID for CCAI.


# 2021.9.7

### Features
* **Version:** Add route to get version info.


# 2021.7.30

### Features
* **Short Link:** Log the response for create short link.


# 2021.7.16

### Features
* **CCAI:** Return more descriptive error when CCAI fails due to token not
existing (because cloud connect has not been enabled).


# 2021.6.8-1

### Fixes
* **Demo Info:** Fix demo info getter route default address again, when MM_API_1
or MM_API_2 is not set.


# 2021.6.8

### Fixes
* **Demo Info:** Fix demo info getter route default address when MM_API_1 is not
set.


# 2021.4.22-1

### Features
* **Brand:** Append user query to brand route, to support adding user ID
to the Brand demo page link.


# 2021.4.22

### Features
* **Redirect:** Append user query to redirect page, to support adding user ID
to the Brand demo page link.


# 2021.3.18-1

### Bug Fixes
* **Redirect:** Remove Webex v4 redirect condition for the links page - the
session.xml file does not have the data we need to know if this session is 
Webex v4 or not.


# 2021.3.18

### Features
* **Redirect:** Redirect Webex v4 demo users to the links page that is now
hosted inside the demo instead of on the cloud web server.


# 2021.3.9

### Bug Fixes
* **Verticals:** Don't remove arrays from the vertical data before returning.


# 2021.2.11

### Features

* **Cloud Connect:** When enabled, will keep a Cloud Connect token cached in
memory and allow /api/v1/ccai GET request to return the CCAI details for a given
call type ID number.


# 2020.12.3-1

### Features

* **CVP Email:** allow GET request to send email as well


# 2020.12.3

### Features

* **CVP Email:** add route for CVP to request an email be sent to the internet


# 2020-11-24

### Features

* **Set Vertical:** if user is logged in and selects one of their own verticals
on a demo with CVA enabled, get the Google Cloud credentials and install them
into PCCE.


# 1.4.0 (2020-10-01)

### Features

* **Base Demo Configs:** add route to get demo base config, and refer to demo base config for whether demo has upstream multichannel