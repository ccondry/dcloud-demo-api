const express = require('express')
const router = express.Router()
const email = require('../models/email')

router.post('/', async (req, res) => {
  try {
    // determine TO email address
    let to
    if (req.body.multichannel === 'sfdc') {
      // use SFDC email address?
      to = process.env.SFDC_EMAIL
    } else if (req.body.to && req.body.to.length && req.body.to.indexOf('@') < 0) {
      // try to make TO address from incoming data
      to = req.body.to + '@dcloud.cisco.com'
    } else {
      // default TO address
      to = process.env.email_to
    }

    // construct nodemailer options
    const mailOptions = {
      from: `"${req.body.name || ''}" <${req.body.email}>`, // sender address
      to, // list of receivers
      subject: req.body.subject || '', // Subject line
      text: req.body.text || '', // plain text body
      html: req.body.html || '' // html body
    }
    // send email
    const info = await email.send(mailOptions)
    console.log(info)
    // return response to client
    return res.status(200).send(info)
  } catch (error) {
    console.log('error sending email', req.body, ':', error.message)
    res.status(500).send(error.message)
  }
})

module.exports = router
