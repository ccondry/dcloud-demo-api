const express = require('express')
const router = express.Router()
const email = require('../models/email')

// CVP uses this route to send emails out to real email addresses on the internet
router.post('/email', async (req, res) => {
  try {
    // construct nodemailer options
    const mailOptions = {
      from: req.body.from || req.query.from,
      to: req.body.to || req.query.to,
      subject: req.body.subject || req.query.subject || '',
      text: req.body.text || req.query.text || '',
      html: req.body.html || req.query.html || ''
    }
    // send email
    const info = await email.send(mailOptions)
    console.log('sent email:', info)
    // return response to client
    return res.status(200).send(info)
  } catch (error) {
    console.log('error sending email', req.body, ':', error.message)
    res.status(500).send({message: error.message})
  }
})

module.exports = router
