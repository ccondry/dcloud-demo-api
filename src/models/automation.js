/**
This loads the session.xml file that is created by the dCloud topology
**/

const fs = require('fs')

const envFile = '/opt/dcloud/demo-automation/.env'

let env = ''
// read the dcloud demo automation .env file and return the contents
try {
  env = fs.readFileSync(envFile, 'utf8')
} catch (e) {
  console.error('failed to read and parse dCloud demo automation .env file:', e)
}

module.exports = {
  env
}
