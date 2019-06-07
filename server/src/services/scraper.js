const puppeteer = require('puppeteer');

const openBrowser = async () => puppeteer.launch();

const closeBrowser = async browser => browser.close();

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
 *
 * @param {Puppeteer.Page} page
 *   Puppeteer page object
 * @param {string} url
 *   Site url.
 */
const goTo = async (page, url) => page.goto(url, { waitUntil: 'networkidle2' });

module.exports = {
  openBrowser,
  closeBrowser,
  newPage,
  goTo,
};
