const {
  openBrowser,
  closeBrowser,
  newPage,
  goTo,
} = require('../../../services/scraper');

const pomeloLogin = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_WWWLogin';
const pomeloScheduleDetils = 'https://pomelo.uninorte.edu.co/pls/prod/bwskfshd.P_CrseSchdDetl';

const pomeloSchedule = async (username, password) => {
  const browser = await openBrowser();
  const page = await newPage(browser);

  await goTo(page, pomeloLogin);

  await page.evaluate((user, pass) => {
    const userField = this.document.querySelector('#UserID');
    const passwordField = this.document.querySelector('#PIN > input[type=password]');
    userField.value = user;
    passwordField.value = pass;
    this.document.querySelector('body > div.pagebodydiv > form > p > input[type=submit]').click();
  }, username, password);

  await page.waitFor(() => this.document.querySelector('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)'));
  const welcomeMessage = await page.evaluate(() => this.document.querySelector('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)').textContent);
  const fullName = welcomeMessage.match(/,\s([\s\S]+),/)[1];

  await page.screenshot({ path: 'auth.png' });

  await goTo(page, pomeloScheduleDetils);

  await page.waitFor(() => this.document.querySelector('#term_id'));

  await page.evaluate(() => {
    this.document.querySelector('#term_id').value = [...this.document.querySelector('#term_id').options].filter(elem => !elem.text.toLowerCase().includes('ver solo'))[0].value;
    this.document.querySelector('body > div.pagebodydiv > form > input[type=submit]').click();
  });

  await page.waitFor(() => this.document.querySelectorAll('.datadisplaytable').length);

  const schedule = await page.evaluate(() => {
    const result = [];
    const tables = [...this.document.querySelectorAll('.datadisplaytable')];
    for (let i = 0; i < tables.length; i += 2) {
      const timesTable = [...[...tables[i + 1].children[1].children].filter((_, idx) => idx !== 0)];
      result.push({
        nrc: tables[i].children[1].children[1].children[1].textContent,
        subjectName: tables[i].caption.textContent,
        times: timesTable.map(elem => [...elem.children].map(row => row.textContent)),
      });
    }
    return result;
  });

  await page.screenshot({ path: 'schedule.png' });
  await closeBrowser(browser);

  return { fullName, schedule };
};

module.exports = {
  pomeloSchedule,
};
