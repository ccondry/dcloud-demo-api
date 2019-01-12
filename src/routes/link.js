const express = require('express')
const router = express.Router()
const request = require('request-promise-native')

// create short link
router.post('/', async (req, res, next) => {
  try {
    console.log('request to create short link')
    const response = await request({
      baseUrl: 'bit.ly',
      url: '/api/v4',
      body: {
        url: req.body.url
      }
    })
    return res.status(200).send(response)
  } catch (e) {
    // failed
    console.error('failed to create short link:', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
