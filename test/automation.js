const model = require('../src/models/automation')

model.run()
.then(r => console.log('done', r))
.catch(e => console.log('error', e))