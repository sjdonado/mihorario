/**
 * ScraperService
 * @author sjdonado
 * @since 1.0.0
 */

const puppeteer = require('puppeteer');

/**
 * Open new Puppeteer browser
 */
const openBrowser = () => puppeteer.launch({ args: ['--no-sandbox'] });

/**
 * Close Puppeteer browser
 * @param {*} Puppeteer.browser
 */
const closeBrowser = browser => browser.close();

/**
 * Create new Puppeteer page
 * @param {*} Puppeteer.browser
 */
const newPage = async (browser) => {
  const page = await browser.newPage();
  // Required config for optimize the page loading time
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });
  return page;
};

/**
 * Go to link
 * @param {*} Puppeteer.page
 * @param {string} url
 */
const goTo = async (page, url) => page.goto(url, { waitUntil: 'networkidle2' });

module.exports = {
  openBrowser,
  closeBrowser,
  newPage,
  goTo,
};
