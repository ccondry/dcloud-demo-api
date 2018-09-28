const mssql = require('mssql')
require('dotenv').load()

async function go () {
  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST,
    database: process.env.SQL_DB
  }

  const query = `SELECT * FROM [PostCallSurvey]`

  try {
    const pool = await new mssql.ConnectionPool(config).connect()
    const datetime = new Date()
    const results = await pool.request().query(query)
    mssql.close()
    return results
  } catch (e) {
    mssql.close()
    throw e
  }

  mssql.close()
  return results
}

go().then(result => {
  console.log('success', result)
}).catch(e => {
  console.error('error', e)
})
