const fetch = require('./fetch')
const config = require('./configure')

module.exports = {
  async get () {
    try {
      const mmApi = process.env.MM_API_1 || 'https://mm.cxdemo.net'
      // get session.xml details in JSON
      const configuration = await config.get()
      const url = `${mmApi}/api/v1/demo`
      const type = configuration.demo
      const version = configuration.version
      const instant = configuration.instant
      const options = {
        query: {
          type,
          version,
          instant
        }
      }
      // https://mm.cxdemo.net/api/v1/demo?type=pcce&version=11.6v3
      // query cumulus-api for demo base configuration details
      const demos = await fetch(url, options)
      // more than 1 demo
      const message = `found ${demos.length} base configurations for this demo, ${type} ${version} ${instant ? 'instant' : ''}`
      console.log(message)
      // return the first object in the array
      return demos[0]
    } catch (e) {
      throw e
    }
  }
}