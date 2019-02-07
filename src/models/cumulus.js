let db
try {
  db = require('./mongodb')
} catch (e) {
  console.log('failed to connect to mongo DB:', e)
}

const defaults = {
  chatBotEnabled: true,
  chatBotSurveyEnabled: true,
  chatBotToken: process.env.chat_bot_token,
  language: 'en',
  // multichannel: "ece",
  region: 'US',
  vertical: 'finance'
}

// get user's Cumulus config from database
async function getConfig (username) {
  try {
    // look up user config in database
    const config = await db.findOne('cumulus.config', {username}, {_id: 0})
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
function saveConfig (username, config) {
  config.username = username
  return db.upsert('cumulus.config', {username}, config)
}

module.exports = {
  getConfig,
  saveConfig
}
