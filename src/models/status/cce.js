const request = require('request-promise-native')
const parser = require('../parsers')

const host = process.env.CCE_HOST || 'ccedata.dcloud.cisco.com'
const username = process.env.CCE_USERNAME || 'administrator@dcloud.cisco.com'
const password = process.env.CCE_PASSWORD || 'C1sco12345'


// example bad status (stale/invalid data)
//
// <contextServiceRegistration>
// <refURL>/unifiedconfig/config/contextserviceregistration</refURL>
// <permissionInfo>
// <canUpdate>true</canUpdate>
// <role>Administrator</role>
// <departmentAdmin>false</departmentAdmin>
// </permissionInfo>
// <state>invalid</state>
// </contextServiceRegistration>

// example good status
//
//   <contextServiceRegistration>
// <refURL>/unifiedconfig/config/contextserviceregistration</refURL>
// <managementUrl>https://admin.ciscospark.com</managementUrl>
// <permissionInfo>
// <canUpdate>true</canUpdate>
// <role>Administrator</role>
// <departmentAdmin>false</departmentAdmin>
// </permissionInfo>
// <state>registered</state>
// </contextServiceRegistration>

// get CCE AW server's Context Service registration status. can't get more than that with APIs...
async function getCsStatus () {
  // get CCE web admin CS status XML
  let xml
  try {
    xml = await request({
      url:'https://' + host + '/unifiedconfig/config/contextserviceregistration',
      auth: {
        user: username,
        pass: password
      }
    })
  } catch (e) {
    throw new Error(`Failed to get Context Service status from CCE AW server ${host} - ${e.message}`)
  }

  // parse xml to json
  try {
    const json = parser.xml2js(xml)
    return {
      state: json.contextServiceRegistration.state
    }
  } catch (e) {
    throw new Error(`Failed to get parse Context Service status from CCE AW server ${host} - ${e.message}`)
  }
}

module.exports = {
  getCsStatus
}
