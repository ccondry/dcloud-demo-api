const express = require('express')
const router = express.Router()
const model = require('../models/upstream')

// add customer
router.post('/customer', async (req, res, next) => {
  try {
    console.log('POST request to create Upstream customer...')
    if (!req.body.contactId || !req.body.vertical || !req.body.firstName || !req.body.lastName || !req.body.phone || !req.body.email) {
      console.log('POST request to create Upstream customer failed - invalid input')
      return res.status(400).send('Invalid input. Please provide the following parameters in the body of your request: contactId, firstName, lastName, phone, email, vertical.')
    }
    await model.createCustomer({
      contactId: req.body.contactId,
      vertical: req.body.vertical,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email
    })
    console.log('POST request to create Upstream customer succeeded')
    // return ACCEPTED
    return res.status(202).send()
  } catch (e) {
    // failed
    console.error('failed to create Upstream customer:', e.message)
    // return error message
    return res.status(500).send(e.message)
  }
})

// set vertical of customer
router.post('/customer/vertical', async (req, res, next) => {
  try {
    console.log('POST request to set Upstream customer vertical...')
    if (!req.body.contactId || !req.body.vertical) {
      console.log('POST request to create Upstream customer failed - invalid input')
      return res.status(400).send('Invalid input. Please provide the following parameters in the body of your request: contactId, vertical.')
    }
    await model.setVertical({
      contactId: req.body.contactId,
      vertical: req.body.verticalId
    })
    // return ACCEPTED
    return res.status(202).send()
  } catch (e) {
    // failed
    console.error('failed to set upstream customer vertical:', e.message)
    // return error message
    return res.status(500).send(e.message)
  }
})

module.exports = router
