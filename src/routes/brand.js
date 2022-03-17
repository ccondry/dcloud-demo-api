const express = require('express')
const router = express.Router()
const session = require('../models/session')

let host
if (process.env.MM_BRAND_URL) {
  host = process.env.MM_BRAND_URL
} else {
  console.warn('process.env.MM_BRAND_URL is not configured. defaulting to', 'https://mm-brand.cxdemo.net')
  host = 'https://mm-brand.cxdemo.net'
}

// forward client to brand website
router.get('/', async (req, res, next) => {
  try {
    // parse session.xml to json object
    const json = await session.get()
    // extract relevant data
    // determine if we should redirect to the secondary server or primary server
    // const host = req.query.dev === 'true' ? process.env.MM_API_2 : process.env.MM_API_1
    // construct the redirect URL
    let redirect = `${host}/?session=${json.id}&datacenter=${json.datacenter}`

    // copy user ID from request to redirect URL, if provided
    if (req.query.userId) {
      redirect += '&userId=' + req.query.userId
    }
    // if PCCE, set the vertical config flag so that cumulus does not prompt for vertical selection
    // if (process.env.DEMO_TYPE === 'pcce') {
    //   redirect += '&config=true'
    // }
    // append user's query, ignoring session and datacenter
    for (const key of Object.keys(req.query)) {
      if (!['session', 'datacenter'].includes(key)) {
        redirect += `&${key}=${req.query[key]}`
      }
    }
    // redirect client with 302
    return res.redirect(302, redirect)
  } catch (e) {
    console.error(e)
    return res.status(500).send(e.message)
  }
})

module.exports = router
