const { openBrowser, newPage, goTo } = require('../../../services/scraper');

const pomeloAuth = async (userName, password) => {
  const browser = await openBrowser();
  const page = await newPage(browser);
  await goTo(page, 'https://pomelo.uninorte.edu.co/pls/prod/bwskfshd.P_CrseSchdDetl');

  await page.evaluate(async (user, pass) => {
    const userField = this.document.querySelector('#UserID');
    userField.value = user;
    const passwordField = this.document.querySelector('#PIN > input[type=password]');
    passwordField.value = pass;
    this.document.querySelector('body > div.pagebodydiv > form > p > input[type=submit]').click();
  }, userName, password);

  await page.screenshot({ path: 'test.png' });

  return { page, browser };
};

const pomeloLogout = async (browser) => {

};

module.exports = {
  pomeloAuth,
  pomeloLogout,
};
