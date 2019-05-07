const express = require('express')
const router = express.Router()
const redundantRequest = require('../models/redundant-request')

// get customer info from cloud mongo users table, via cs-manager or cs-manager-2
router.get('/', getCustomer)
router.get('/:contact', getCustomer)

async function getCustomer (req, res, next) {
  // get input parameter
  const contact = req.params.contact || req.query.contact || req.query.ani
  try {
    console.log('request to get customer info for', contact)
    // get data from cs-manager or cs-manager-2
    const customer = await redundantRequest({
      url: '/api/v1/customer',
      qs: {contact},
      method: 'GET',
      json: true
    }, process.env.CS_MANAGER_API_1, process.env.CS_MANAGER_API_2)
    // return customer object
    return res.status(200).send(customer)
  } catch (e) {
    // failed
    console.error('failed to get customer info for', contact, ':', e.message)
    return res.status(500).send(e.message)
  }
}

module.exports = router
