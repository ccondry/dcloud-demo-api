const express = require('express')
const router = express.Router()
const request = require('request-promise-native')

// filter items less than 5 days old
function lessThanFiveDaysOld (v) {
  const created = new Date(v.lastUpdated)
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

async function getCustomer (query) {
  try {
    // find customer
    let customers
    try {
      customers = await request({
        url: `${process.env.CS_REST_HOST_1}/customer`,
        qs: {
          q: query
        },
        json: true
      })
    } catch (e) {
      console.log('failed to search for customer on cs-manager-1. trying cs-manager-2...')
      try {
        customers = await request({
          url: `${process.env.CS_REST_HOST_2}/customer`,
          qs,
          json: true
        })
      } catch (e2) {
        console.log('failed to search for customer on cs-manager-2. throwing error.')
        throw e2
      }
    }

    // find CS customer
    switch (customers.length) {
      case 0: throw `no customers found matching ${JSON.stringify(qs)}`
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

async function getRequest (customer) {
  try {
    // find recent CS request objects
    let requests
    try {
      requests = await request({
        url: `${process.env.CS_REST_HOST_1}/request`,
        qs: {
          q: `customerId:${customer.id}`
        },
        json: true
      })
    } catch (e) {
      console.log('failed to search for request on cs-manager-1. trying cs-manager-2...')
      try {
        requests = await request({
          url: `${process.env.CS_REST_HOST_2}/request`,
          qs: {
            q: `customerId:${customer.id}`
          },
          json: true
        })
      } catch (e2) {
        console.log('failed to search for request on cs-manager-2. throwing error.')
        throw e2
      }
    }


    const latestRequest = requests.filter(lessThanFiveDaysOld).sort(byCreated)[0]
    if (latestRequest) {
      console.log('using latest request', latestRequest)
      // use latest request
      return latestRequest
    } else {
      console.log('no recent requests. creating new CS request object...')
      // create new request
      let ret
      try {
        ret = await request({
          url: `${process.env.CS_REST_HOST_1}/request`,
          method: 'POST',
          json: true,
          body: {
            "type": "request",
            "state": "active",
            "customerRefUrl": customer.refUrl,
            "fieldsets": [
              "cisco.base.request"
            ],
            "dataElements": []
          }
        })
      } catch (e) {
        console.log('failed to create request on cs-manager-1. trying cs-manager-2...')
        try {
          ret = await request({
            url: `${process.env.CS_REST_HOST_2}/request`,
            method: 'POST',
            json: true,
            body: {
              "type": "request",
              "state": "active",
              "customerRefUrl": customer.refUrl,
              "fieldsets": [
                "cisco.base.request"
              ],
              "dataElements": []
            }
          })
        } catch (e2) {
          console.log('failed to create request on cs-manager-2. throwing error.')
          throw e2
        }
      }
      return ret
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
    const rq = await getRequest(customer)

    // set customer ID and request ID
    body.customerRefUrl = customer.refUrl
    body.parentRefUrl = rq.refUrl

    // create transcript activity
    let activity


    try {
      activity = await request({
        url: `${process.env.CS_REST_HOST_1}/activity`,
        method: 'POST',
        body,
        json: true
      })
    } catch (e) {
      console.log('failed to create activity on cs-manager-1. trying cs-manager-2...')
      try {
        activity = await request({
          url: `${process.env.CS_REST_HOST_2}/activity`,
          method: 'POST',
          body,
          json: true
        })
      } catch (e2) {
        console.log('failed to create activity on cs-manager-2. throwing error.')
        throw e2
      }
    }

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
    const response = await sendTranscript(req.query.q, req.body)
    console.log('successfully saved chat transcript')
    return res.status(201).send(response)
  } catch (e) {
    console.error('failed to save survey answers', e)
    return res.status(500).send(e)
  }
})

module.exports = router
