const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    console.log('request to get session data')

    // read the dcloud session file and return the contents
    fs.readFile('/dcloud/session.xml', function (err, data) {
      if (err) throw err

      // parse xml to json object
      const json = JSON.parse(parser.toJson(data))

      // return data
      return res.status(200).send(json.session)
    })
  } catch (e) {
    console.error('failed to get session data', e)
    return res.status(500).send(e)
  }
})

module.exports = router
