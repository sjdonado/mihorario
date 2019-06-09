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
    const days = [[], [], [], [], [], [], []];
    const tables = [...this.document.querySelectorAll('.datadisplaytable')];
    for (let i = 0; i < tables.length; i += 2) {
      const timesTable = [...[...tables[i + 1].children[1].children].filter((_, idx) => idx !== 0)];
      const scheduleArray = timesTable.map(elem => [...elem.children].map(row => row.textContent));
      scheduleArray.forEach((obj) => {
        const hours = obj[1].match(/([\s\S]+)\s-\s([\s\S]+)/);
        const dates = obj[4].match(/([\s\S]+)\s-\s([\s\S]+)/);
        const data = {
          nrc: tables[i].children[1].children[1].children[1].textContent,
          name: tables[i].caption.textContent,
          type: obj[0],
          start: hours[1],
          finish: hours[2],
          place: obj[3],
          startDate: dates[1],
          finishDate: dates[2],
          subjectType: obj[5],
          teacher: obj[6],
        };
        obj[2].split('').forEach((day) => {
          switch (day) {
            case 'L':
              days[0].push(data);
              break;
            case 'M':
              days[1].push(data);
              break;
            case 'I':
              days[2].push(data);
              break;
            case 'J':
              days[3].push(data);
              break;
            case 'V':
              days[4].push(data);
              break;
            case 'S':
              days[5].push(data);
              break;
            case 'D':
              days[6].push(data);
              break;
            default:
              break;
          }
        });
      });
    }
    return days;
  });

  await page.screenshot({ path: 'schedule.png' });
  await closeBrowser(browser);

  return { fullName, schedule };
};

module.exports = {
  pomeloSchedule,
};
