const express = require('express')
const router = express.Router()
const email = require('../models/email')

router.post('/', async (req, res) => {
  const mailOptions = {
    from: `"${req.body.name || ''}" <${req.body.email}>`, // sender address
    to: process.env.email_to, // list of receivers
    subject: req.body.subject || '', // Subject line
    text: req.body.text || '', // plain text body
    html: req.body.html || '' // html body
  }
  try {
    const info = await email.send(mailOptions)
    console.log(info)
    res.set("Content-type", "application/json; charset=utf-8")
    .send(JSON.stringify(info, null, 2));
  } catch (error) {
    console.log(error)
    res.status(500)
    .send(JSON.stringify(error, null, 2));
  }
})

module.exports = router
