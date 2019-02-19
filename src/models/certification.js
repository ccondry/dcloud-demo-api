const request = require('request-promise-native')
const parser = require('./parsers')

// warn if required env vars not set
if (!process.env.CCE_HOST) console.warn('process.env.CCE_HOST not configured')
if (!process.env.CCE_USERNAME) console.warn('process.env.CCE_USERNAME not configured')
if (!process.env.CCE_PASSWORD) console.warn('process.env.CCE_PASSWORD not configured')

// construct Basic auth string for request
const basicAuth = Buffer.from(`${process.env.CCE_USERNAME}:${process.env.CCE_PASSWORD}`).toString('base64')
// API URL base
const baseUrl = `https://${process.env.CCE_HOST}/unifiedconfig/config/agent/`

function updateAgent (data) {
  // extract dbid from agent refURL
  const dbid = data.agent.refURL.split('/').pop()
  // post updated agent to CCE
  const xml = parser.js2xml(data)
  // do the request on CCE
  return request({
    method: 'PUT',
    baseUrl,
    url: dbid,
    auth,
    body: xml,
    headers: {
      'Authorization': 'Basic ' + basicAuth,
      'Content-Type': 'application/xml'
    }
  })
}

// get agent info from unified config using dbid
async function getAgent (dbid) {
  let response1
  try {
    response1 = await request({
      method: 'GET',
      baseUrl,
      url: dbid,
      auth
    })
    // convert xml response to json
    return parser.xml2js(response1)
  } catch (e) {
    throw e
  }
}

// update certification attribute on agent 'dbid' to 'grade'
async function go (dbid, grade) {
  const agent = await getAgent(dbid)
  const newAttribute = {
    attributeValue: grade,
    attribute: {
      refURL: '/unifiedconfig/config/attribute/' + process.env.CERTIFICATION_ATTRIBUTE_ID
    }
  }
  // are there no attributes?
  if (!agent.agent.agentAttributes) {
    // no attributes - so add it
    agent.agent.agentAttributes = {
      agentAttribute: newAttribute
    }

    // save to CCE
    return updateAgent(agent)
  } else {
    // there are attributes
    // extract agent's current PQ attributes
    const attributes = agent.agent.agentAttributes.agentAttribute

    if (Array.isArray(attributes)) {
      // more than 1 attribute
      // look for certification attribute by ID
      const attribute = attributes.find(v => {
        return v.attribute.refURL.split('/').pop() === process.env.CERTIFICATION_ATTRIBUTE_ID
      })
      if (attribute) {
        // agent has attribute - update the value
        attribute.attributeValue = grade
        // save to CCE
        return updateAgent(agent)
      } else {
        // agent does not have attribute - push it onto the array
        attributes.push(newAttribute)
        // save to CCE
        return updateAgent(agent)
      }
    } else {
      // 1 attribute
      if (attributes.refURL.split('/').pop() === process.env.CERTIFICATION_ATTRIBUTE_ID) {
        // this is the attribute - update it
        attributes.attributeValue = grade
        // save to CCE
        return updateAgent(agent)
      } else {
        // not the attribute - make this an array and push the old and new attributes
        agent.agent.agentAttributes.agentAttribute = [attributes, newAttribute]
        // save to CCE
        return updateAgent(agent)
      }
    }
  }
}

module.exports = go
