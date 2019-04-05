const request = require('request-promise-native')
const uuidv1 = require('uuid/v1')

// warn if required env vars not set
if (!process.env.DIALOGFLOW_DEFAULT_TOKEN) console.warn('process.env.DIALOGFLOW_DEFAULT_TOKEN not configured')
if (!process.env.DIALOGFLOW_DEFAULT_LANGUAGE) console.warn('process.env.DIALOGFLOW_DEFAULT_LANGUAGE not configured')

// figure out a response using DialogFlow AI
module.exports = async function ({
  // the text query
  q,
  // generate a uuid session ID if not set
  sessionId = uuidv1(),
  // the language like 'en'
  lang = process.env.DIALOGFLOW_DEFAULT_LANGUAGE || 'en',
  // the dialog flow client API token for a bot agent
  token = process.env.DIALOGFLOW_DEFAULT_TOKEN || '5dc044d7822d43a5839627427ed28935'
}) {
  // get dialogflow response
  const rsp = await request({
    method: 'POST',
    url: 'https://api.api.ai/v1/query',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    qs: {
      v: '20170910'
    },
    body: {
      sessionId,
      lang,
      q,
    },
    json: true
  })
  console.log('dialogflow response:', JSON.stringify(rsp, null, 2))
  // extract full response message
  const fulfillment = rsp.result.fulfillment
  let ret = ''
  if (fulfillment.speech.length) {
    // add bot's reply to return message
    for (const message of fulfillment.messages) {
      ret += message.speech + ' '
    }
  }

  const result = rsp.result
  // attach compiled speech text onto the response
  result.outputText = ret.trim()
  // attach session ID from DialogFlow response to our output
  result.sessionId = rsp.sessionId
  // return the modified response
  return result
}
