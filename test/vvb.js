require('dotenv').config()
const vvb = require('../src/models/vvb')

vvb.cva.asr.getServiceAccount('cumulus-hotikl')
.then(r => console.log('success', r))
.catch(e => console.log('error', e))