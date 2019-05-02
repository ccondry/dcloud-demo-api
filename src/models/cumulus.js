const DB = require('./mongodb')
const db = new DB('toolbox')

const defaults = {
  vertical: 'finance'
}

// get user's Cumulus config from database
async function getConfig (userId) {
  try {
    // don't return db ID
    const projection = {_id: 0}
    // look up user config in database
    const config = await db.findOne('cumulus.config', {userId}, {projection})
    // return config if it exists
    if (config) return config
    // return default config since user config did not exist
    else return defaults
  } catch (e) {
    // rethrow errors
    throw e
  }
}

// insert or replace user config in database
function saveConfig (userId, config) {
  config.userId = userId
  return db.upsert('cumulus.config', {userId}, config)
}

module.exports = {
  getConfig,
  saveConfig
}
