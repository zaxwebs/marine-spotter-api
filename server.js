// imports
require('dotenv').config()
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const morgan = require('morgan')
const getScrapedData = require('./helpers/scrapping').getScrapedData

//setup
const app = express()
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(morgan('tiny'))
//helpers

//routes
app.use('/', async (req, res, next) => {
  try {
    const scrappedData = await getScrapedData()
    res.send(scrappedData)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  if (res.statusCode === 200) {
    res.status(500)
    err.message = 'Something went wrong'
    console.log(err.stack)
  }
  res.json({
    status: res.statusCode,
    message: err.message
  })
})

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
