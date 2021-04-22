const express = require('express')
const router = express.Router()
const session = require('../models/session')

// set up map of URL paths to the redirect base URL
const hostMap = {
  // links: 'https://mm-links.cxdemo.net/',
  links: 'https://mm.cxdemo.net/api/v1/redirect/links/',
  cumulus: process.env.MM_API_1,
  brand: process.env.MM_BRAND_URL
}

// redirect client to an mm website, based on the last part of the path string
router.get('/:page', async (req, res, next) => {
  try {
    console.log('redirect request for page id', req.params.page)
    // get session.xml data as JSON object
    const json = session.get()
    // set up base URL for redirect
    const host = hostMap[req.params.page]
    if (host) {
      // construct the redirect URL with dCloud session ID and datacenter
      let redirect = `${host}?session=${json.id}&datacenter=${json.datacenter}`
      // append user's query, ignoring session and datacenter
      for (const key of Object.keys(req.query)) {
        if (!['session', 'datacenter'].includes(key)) {
          redirect += `&${key}=${req.query[key]}`
        }
      }
      console.log('redirecting user at page', req.params.page, 'to', redirect)
      // redirect client with 302
      return res.redirect(302, redirect)
    } else {
      // host not found in hostmap
      // return 404 NOT FOUND
      return res.status(404).send('no redirect found for page ' + req.params.page)
    }
  } catch (e) {
    console.error('redirect failed for page', req.params.page, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
