const express = require('express')
const router = express.Router()
const email = require('../models/email')

router.post('/', async (req, res) => {
  try {
    // default TO address
    let to = process.env.email_to
    // try to make TO address from incoming data
    if (req.body.to && req.body.to.length && req.indexOf('@') < 0) {
      to = req.body.to + '@dcloud.cisco.com'
    }
    const mailOptions = {
      from: `"${req.body.name || ''}" <${req.body.email}>`, // sender address
      to, // list of receivers
      subject: req.body.subject || '', // Subject line
      text: req.body.text || '', // plain text body
      html: req.body.html || '' // html body
    }
    const info = await email.send(mailOptions)
    console.log(info)
    res.set("Content-Type", "application/json; charset=utf-8")
    .send(JSON.stringify(info, null, 2));
  } catch (error) {
    console.log('error sending email', req.body, ':', error.message)
    res.status(500).send(error.message)
  }
})

module.exports = router
