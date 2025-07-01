import puppeteer from 'puppeteer';

(
  async () => {
    const browser = await puppeteer.launch()
    const webpage = await browser.newPage()
    await webpage.setViewport({width: 1920,  height:1080})
    await webpage.goto('https://www.crocs.com/')
    await webpage.screenshot({path: 'screenshot1-crocs.png', fullPage: true})
    await browser.close()
  }
)()
