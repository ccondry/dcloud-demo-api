const express = require('express')
const router = express.Router()
const request = require('request-promise-native')

// filter items less than 5 days old
function lessThanFiveDaysOld (v) {
  const created = new Date(v.created)
  const now = new Date()
  const diff = now - created
  // if created more than 5 days ago
  const days = diff / (24 * 60 * 60 * 1000)
  if (days > 5) {
    // console.log('older than 5 days')
    return false
  } else {
    // console.log('5 days or newer')
    return true
  }
}

// sort by created date
function byCreated (a, b) {
  if (new Date(a.created) < new Date(b.created)) {
    return -1
  }
  if (new Date(a.created) > new Date(b.created)) {
    return 1
  }
  return 0
}

async function getCustomer (queryString) {
  try {
    // find customer
    const customers = await request({
      url: `${process.env.CS_REST_HOST}/org/${process.env.CS_ORG_ID}/customer`,
      qs: {
        q: `query_string:${queryString}`
      },
      json: true
    })

    // find CS customer
    switch (customers.length) {
      case 0: throw `no customers found matching ${queryString}`
      case 1: {
        // one customer - continue to default for now
      }
      default: {
        // more than 1 result - we don't know which customer to choose
        // choose the first customer and hope for the best
        console.log(`sendTranscript: found ${customers.length} matching customer(s) in Context Service`)
        console.log('sendTranscript: chose first Context Service customer -', customers[0].id)
        return customers[0]
        break
      }
    }
  } catch (e) {
     throw e
  }
}

async function getRequest (customerId) {
  try {
    // find recent CS request objects
    const requests = await request({
      url: `${process.env.CS_REST_HOST}/org/${process.env.CS_ORG_ID}/request`,
      qs: {
        q: `customerId:${customerId}`
      },
      json: true
    })

    const latestRequest = requests.filter(lessThanFiveDaysOld).sort(byCreated)[0]
    if (latestRequest) {
      console.log('using latest request', latestRequest)
      // use latest request
      return latestRequest
    } else {
      console.log('no recent requests. creating new CS request object...')
      // create new request
      return await request({
        url: `${process.env.CS_REST_HOST}/org/${process.env.CS_ORG_ID}/request`,
        method: 'POST',
        json: true,
        body: {
          "type": "request",
          "state": "active",
          "customerRefUrl": `/context/v1/customer/${customerId}`,
          "fieldsets": [
            "cisco.base.request"
          ],
          "dataElements": []
        }
      })
    }
  } catch (e) {
    throw e
  }
}

// looks up customer in Context Service and creates a new
// Context Service activity chat transcript
async function sendTranscript (query, body) {
  try {
    // find customer
    const customer = await getCustomer(query)
    // get a current request object
    const rq = await getRequest(customer.id)

    // set customer ID and request ID
    body.customerRefUrl = `/context/v1/customer/${customer.id}`
    body.parentRefUrl = `/context/v1/request/${rq.id}`

    // create transcript activity
    const activity = await request({
      url: `${process.env.CS_REST_HOST}/org/${process.env.CS_ORG_ID}/activity`,
      method: 'POST',
      body,
      json: true
    })

    console.log(`successfully created Context Service transcript activity for ${query}`)
  } catch (e) {
    console.error(`sendTranscript: exception while creating Context Service transcript activity for ${query}`, e.message)
    throw e
  }
}

// save chat transcript to context service
router.post('/transcript', async (req, res, next) => {
  try {
    console.log('request to save chat transcript:', req.body)
    const response = await sendTranscript(req.query, req.body)
    console.log('successfully saved chat transcript')
    return res.status(201).send(response)
  } catch (e) {
    console.error('failed to save survey answers', e)
    return res.status(500).send(e)
  }
})

module.exports = router
