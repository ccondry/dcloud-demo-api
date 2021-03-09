# demo-api Change Log

Dates are in YYYY.MM.DD-X format, where X is revision number

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