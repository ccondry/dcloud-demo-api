const dcloud = require('./session')
const fs = require('fs')
const readline = require('readline')
const fetch = require('node-fetch')

module.exports = {
  run,
  getSettings
}

async function run () {
  try {
    // get dcloud session info from session.xml
    const session = dcloud.get()
    // validate session.xml data
    if (!session) throw Error('session.xml JSON data was undefined')
    
    // build query string
    const settings = getSettings()
    const demo = settings.demo
    const version = settings.version
    const isInstant = settings.instant === 'true'
    // send session.xml JSON to the server
    await fetch(`https://mm.cxdemo.net/api/v1/sessions?demo=${demo}&version=${version}&instant=${isInstant}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({session})
    })
  } catch (e) {
    throw e
  }
}

// read the .env file from demo-automation project, and parse into JSON
function getSettings () {
  const path = '/opt/dcloud/demo-automation/.env'
  const text = fs.readFileSync(path, 'utf-8')
  const lines = text.split('\n')
  // const fileStream = fs.createReadStream('/opt/dcloud/demo-automation/.env')
  
  // const lines = readline.createInterface({
  //   input: fileStream,
  //   crlfDelay: Infinity
  // })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const settings = {}
  for (const line of lines) {
    // Each line in input.txt will be successively available here as `line`.
    // console.log(`Line from file: ${line}`)
    const parts = line.split('=')
    const key = parts.shift().trim()
    const value = parts.join('=').trim()
    if (key.indexOf('#') === 0) {
      // ignore comments
      continue
    } else {
      // store value
      settings[key] = value
    }
  }
  return settings
}  