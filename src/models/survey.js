const mssql = require('mssql')

async function saveAnswers (data) {
  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST,
    database: process.env.SQL_DB
  }

  const query = `INSERT INTO [PostCallSurvey] (DateTime, SurveyId, ANI, Name, Q1, Q2)
  VALUES (@datetime, @surveyId, @ani, @name, @q1, @q2)`

  try {
    const pool = await new mssql.ConnectionPool(config).connect()
    const results = await pool.request()
    .input('datetime', mssql.DateTime, new Date())
    .input('surveyId', mssql.VarChar, data.surveyId)
    .input('ani', mssql.VarChar, data.ani)
    .input('name', mssql.VarChar, data.name)
    .input('q1', mssql.VarChar, data.q1)
    .input('q2', mssql.VarChar, data.q2)
    .query(query)
    mssql.close()
    return results.rowsAffected
  } catch (e) {
    mssql.close()
    throw e
  }

  mssql.close()
  return results
}

module.exports = { saveAnswers }
