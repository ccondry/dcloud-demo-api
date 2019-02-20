const request = require('request-promise-native')
const parser = require('./parsers')

// warn if required env vars not set
if (!process.env.CCE_HOST) console.warn('process.env.CCE_HOST not configured')
if (!process.env.CCE_USERNAME) console.warn('process.env.CCE_USERNAME not configured')
if (!process.env.CCE_PASSWORD) console.warn('process.env.CCE_PASSWORD not configured')

const auth = {
  user: process.env.CCE_USERNAME,
  pass: process.env.CCE_PASSWORD,
  sendImmediately: true
}

// API URL base
const baseUrl = `https://${process.env.CCE_HOST}/unifiedconfig/config/agent/`

// export function
module.exports = async function (agentId, grade) {
  try {
    const dbid = await getAgentDbId(agentId)
    await setCertificationGrade(dbid, grade)
  } catch (e) {
    throw e
  }
}

// find agent DB ID for agent ID
async function getAgentDbId (agentId) {
  try {
    const response = await request({
      method: 'GET',
      url: baseUrl,
      qs: {q: agentId},
      auth
    })
    const json = parser.xml2js(response)
    const agents = json.results.agents.agent
    let agent
    // did we find more than one agent matching our query?
    if (Array.isArray(agents)) {
      // find the agent matching exactly the agent ID
      agent = agents.find(v => {
        return v.agentId === agentId
      })
    } else if (agents.agentId === agentId) {
      // only one agent found - our agent
      agent = agents
    } else {
      throw Error(`Couldn't find exact agent ID match for ${agentId}.`)
    }
    const dbid = agent.refURL.split('/').pop()
    return dbid
  } catch (e) {
    throw e
  }
}

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
async function setCertificationGrade (dbid, grade) {
  const agent = await getAgent(dbid)
  // console.log('got agent', agent)
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
