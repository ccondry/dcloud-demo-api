const express = require('express')
const router = express.Router()
const model = require('../models/answers')
const session = require('../models/session')
const redundantRequest = require('../models/redundant-request')

// get mobile app answers from mm or mm-dev
router.get('/:id', async (req, res, next) => {
  try {
    console.log('request to get mobile app answers for', req.params.id)
    // get answers
    const answers = await model.get(req.params.id)
    return res.status(200).send(answers)
  } catch (e) {
    // failed
    console.error('failed to get mobile app answers for', req.params.id, ':', e.message)
    return res.status(500).send(e.message)
  }
})

// save mobile app answers to mm and mm-dev
router.put('/:ani', async (req, res, next) => {
  try {
    console.log('request to save mobile app answers for', req.params.ani)
    // get datacenter and session ID from session.xml file
    const json = await session.get()
    // save answers
    await redundantRequest({
      url: '/api/v1/answers/' + req.params.ani,
      method: 'PUT',
      body: {
        sessionId: json.id,
        datacenter: json.datacenter,
        phoneNumber: req.params.ani
      },
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    console.log('successfully saved mobile app answers for', req.params.ani)
    // return CREATED
    return res.status(202).send(response)
  } catch (e) {
    // failed
    console.error('failed to save mobile app answers for', req.params.ani, ':', e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
