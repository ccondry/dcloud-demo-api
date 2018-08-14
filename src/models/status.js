const request = require('request-promise-native')
const xml2js = require('xml2js')

const host = process.env.FINESSE_HOST
const username = process.env.FINESSE_USERNAME
const password = process.env.FINESSE_PASSWORD
const labMode = process.env.CS_LAB_MODE === 'true'
const csHost1 = process.env.CS_REST_HOST_1
const csHost2 = process.env.CS_REST_HOST_2

// promisify xml2js.parseString
function parseXmlString (string) {
  return new Promise(function (resolve, reject) {
    xml2js.parseString(string, {explicitArray: false}, function (err, result) {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
// decode connection data from base64 string into JSON
function decodeConnectionData (connectionDataString) {
  const buff = new Buffer(connectionDataString, 'base64')
  const text = buff.toString('ascii')
  const connectionData = JSON.parse(text)
  return connectionData
}

async function getFinesseCsStatus () {
  // get finesse context service machine account status
  console.log('Getting Context Service machine account status for', host, 'in Context Service')

  // get finesse connection data XML
  let xml
  try {
    xml = await request({
      url:'https://' + host + ':8443/fusion-mgmt-connector/api/ContextServiceConfig',
      auth: {
        user: username,
        pass: password
      }
    })
  } catch (e) {
    console.log('host', host)
    console.log('username', username)
    console.log('password', password)
    throw new Error(`Failed to get Context Service config from Finesse server ${host} - ${e.message}`)
  }

  // parse xml to json
  let json
  try {
    json = await parseXmlString(xml)
  } catch (e) {
    throw new Error(`Failed to get parse Context Service config from Finesse server ${host} - ${e.message}`)
  }

  // get status
  const status = json.ContextServiceConfig.status
  // get machine account info by decoding connection data string
  const connectionData = decodeConnectionData(json.ContextServiceConfig.connectionData)
  // get the machine account ID from credentials
  const machineAccountId = labMode ? connectionData.credentialsLabMode.cisUuid : connectionData.credentials.cisUuid
  // query the cs-manager-api for machine account details

  let machineAccount
  try {
    machineAccount = await request({
      url: csHost1 + '/machineaccount/' + machineAccountId,
      json: true
    })
  } catch (e) {
    console.log('Failed to get machine account details from cs-manager-api on', csHost1, e.message)
    console.log('Trying cs-manager-api on', csHost2)
    try {
      machineAccount = await request({
        url: csHost2 + '/machineaccount/' + machineAccountId,
        json: true
      })
    } catch (e2) {
      throw new Error(`Failed to get machine account details from cs-manager-api on ${csHost1} and ${csHost2} - ${e2.message}`)
    }
  }
  return {
    id: machineAccount.id,
    status,
    created: machineAccount.meta.created,
    lastModified: machineAccount.meta.lastModified,
    lastLoginTime: machineAccount.meta.lastLoginTime
  }
}

module.exports = {
  getFinesseCsStatus
}
