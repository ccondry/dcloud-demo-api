const request = require('request-promise-native')
const uuid = require('uuid')

// warn if required env vars not set
if (!process.env.DIALOGFLOW_DEFAULT_PROJECT_ID) console.warn('process.env.DIALOGFLOW_DEFAULT_PROJECT_ID not configured. Using default value.')
if (!process.env.DIALOGFLOW_DEFAULT_LANGUAGE_CODE) console.warn('process.env.DIALOGFLOW_DEFAULT_LANGUAGE_CODE not configured. Using default value.')

// figure out a response using DialogFlow AI
module.exports = async function ({
  // the text query
  text,
  // generate a uuid session ID if not set
  sessionId = uuid.v4(),
  // the language like 'en-US'
  languageCode = process.env.DIALOGFLOW_DEFAULT_LANGUAGE_CODE || 'en-US',
  // the dialog flow client API token for a bot agent
  projectId = process.env.DIALOGFLOW_DEFAULT_PROJECT_ID || 'cumulus-v2-hotikl'
}) {
  // get dialogflow response
  const rsp = await request({
    method: 'GET',
    url: 'https://mm.cxdemo.net/v1/dialogflow/query',
    qs: {
      sessionId,
      languageCode,
      text,
      projectId
    },
    json: true
  })

  // get fulfillment from response
  const fulfillment = rsp[0].queryResult.fulfillmentMessages
  const action = rsp[0].queryResult.action
  // extract full response message
  let ret = ''
  if (fulfillment) {
    // add bot's reply to return message
    for (const message of fulfillment) {
      ret += message.text.text[0] + ' '
    }
  }
  // trim output text
  const outputText = ret.trim()

  // return the modified response
  return {
    outputText,
    sessionId,
    projectId,
    languageCode,
    action
  }
}
