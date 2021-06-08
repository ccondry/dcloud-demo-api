require('dotenv').load()
const demo = require('../src/models/demo')

// get demo base configuration
demo.get().then(r => {
  console.log(r)
})
.catch(e => {
  console.log(e)
})