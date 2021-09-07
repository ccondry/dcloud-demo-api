const express = require('express')
const router = express.Router()
const pkg = require('../../package.json')

// get the version of this software
router.get('/', async (req, res, next) => {
  try {
    // software name and version
    const data = {
      name: pkg.name,
      version: pkg.version
    }
    return res.status(200).send(data)
  } catch (e) {
    console.log(`Failed to get server version:`, e.message)
    return res.status(500).send(e.message)
  }
})

module.exports = router
