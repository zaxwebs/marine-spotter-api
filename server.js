// imports
require('dotenv').config()
const express = require('express')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
//setup
const app = express()
//helpers

//routes
app.use('/', async (req, res, next) => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(process.env.URL_A)
    await page.goto(process.env.URL_B)
    const content = await page.content()
    await browser.close()
    const $ = cheerio.load(content)
    const scrapedData = []
    $('#forecastdata > div > table > tbody > tr').each((index, element) => {
      if (index === 0) return true
      const tds = $(element).find('td')
      const place = $(tds[0]).text()
      const direction = $(tds[1]).text()
      const bearing = $(tds[2]).text()
      const distances = $(tds[3])
        .text()
        .split('-')
      const distance = { start: distances[0], end: distances[1] }
      const depths = $(tds[4])
        .text()
        .split('-')
      const depth = { start: depths[0], end: depths[1] }
      const latitude = $(tds[5]).text()
      const longitude = $(tds[6]).text()
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      tableRow = {
        place,
        direction,
        bearing,
        distance,
        depth,
        latitude,
        longitude,
        googleMapsUrl
      }
      scrapedData.push(tableRow)
    })

    res.send(scrapedData)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.statusCode || res.status(500)
  res.json({
    status: res.statusCode,
    message: err.message
  })
})

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
