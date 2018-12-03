const express = require('express')
const router = express.Router()
const model = require('../models/upstream')
const config = require('../config')

// list customers
router.get('/customer', async (req, res, next) => {
  try {
    console.log('GET request to list Upstream customers...')
    const customers = await model.getCustomers()
    console.log('GET request to list Upstream customers succeeded. Found', customers.length, 'records.')
    // return OK
    return res.status(200).send(customers)
  } catch (e) {
    // failed
    console.error('failed to list Upstream customers:', e.message)
    // return error message
    return res.status(500).send(e.message)
  }
})

// add customer
router.post('/customer', async (req, res, next) => {
  try {
    console.log('POST request to create Upstream customer...')
    if (!req.body.vertical || !req.body.firstName || !req.body.lastName || !req.body.phone || !req.body.email) {
      console.log('POST request to create Upstream customer failed - invalid input')
      return res.status(400).send('Invalid input. Please provide the following parameters in the body of your request: contactId, firstName, lastName, phone, email, vertical.')
    }
    await model.createCustomer({
      contactId: req.body.phone,
      vertical: req.body.vertical,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email
    })
    // create customer succeeded
    console.log('POST request to create Upstream customer - customer created.'
    if (req.body.interactionHistory == true) {
      console.log('Copying interaction history...')
      // determine source contact ID to use for copying interaction history
      // default to first
      const sourceContactId = config.histories[req.body.vertical] || config.histories[0]
      // now copy interaction history
      await model.copyInteractionHistory({
        sourceContactId,
        contactId: req.body.phone,
        vertical: req.body.vertical,
        name: req.body.firstName + ' ' + req.body.lastName,
        phone: req.body.phone,
        email: req.body.email
      })
      console.log('POST request to create Upstream customer - interaction history copied.')
    }
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
router.post('/customer/:id', async (req, res, next) => {
  try {
    console.log('POST request to set Upstream customer vertical...')
    if (!req.body.vertical) {
      console.log('POST request to create Upstream customer failed - invalid input')
      return res.status(400).send('Invalid input. Please provide the following parameters in the body of your request: vertical.')
    }
    await model.setVertical({
      contactId: req.params.id,
      vertical: req.body.vertical
    })
    console.log('POST request to set Upstream customer vertical successful. Set customer', req.params.id, 'vertical to', req.body.vertical)
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
