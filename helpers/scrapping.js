// imports
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

exports.getScrapedData = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  // skip loading of stylesheets, fonts and images
  page.on('request', req => {
    if (
      req.resourceType() == 'stylesheet' ||
      req.resourceType() == 'font' ||
      req.resourceType() == 'image'
    ) {
      req.abort()
    } else {
      req.continue()
    }
  })
  await page.goto(process.env.URL_A)
  await page.goto(process.env.URL_B)
  const content = await page.content()
  await browser.close()
  const $ = cheerio.load(content)
  const scrappedData = []
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
    scrappedData.push(tableRow)
  })

  return scrappedData
}
