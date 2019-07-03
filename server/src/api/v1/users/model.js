const moment = require('moment');
const {
  openBrowser,
  closeBrowser,
  newPage,
  goTo,
} = require('../../../services/scraper');

const pomeloLogin = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_WWWLogin';
const pomeloScheduleDetils = 'https://pomelo.uninorte.edu.co/pls/prod/bwskfshd.P_CrseSchdDetl';

/**
 * Login to Pomelo
 * @param {String} username
 * @param {String} password
 */
const login = async (username, password) => {
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
  return { browser, page, fullName };
};

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloScheduleOptions = async (username, password) => {
  const { page, fullName } = await login(username, password);

  await goTo(page, pomeloScheduleDetils);
  await page.waitFor(() => this.document.querySelector('#term_id'));

  const options = await page.evaluate(() => [...this.document.querySelector('#term_id').options]
    .filter(elem => !elem.text.toLowerCase().includes('ver solo'))
    .map(elem => ({ text: elem.text, value: elem.value })));
  return { options, fullName };
};

/**
 * Get Pomelo schedule
 * @param {String} username
 * @param {String} password
 * @param {String} scheduleOption
 */
const pomeloSchedule = async (username, password, scheduleOption) => {
  const { browser, page, fullName } = await login(username, password);

  await goTo(page, pomeloScheduleDetils);
  await page.waitFor(() => this.document.querySelector('#term_id'));

  await page.evaluate((option) => {
    this.document.querySelector('#term_id').value = option;
    this.document.querySelector('body > div.pagebodydiv > form > input[type=submit]').click();
  }, scheduleOption);

  await page.waitFor(() => this.document.querySelectorAll('.datadisplaytable').length > 0);

  const subjectsByDays = await page.evaluate(() => {
    const result = [[], [], [], [], [], [], []];
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
              result[0].push(data);
              break;
            case 'M':
              result[1].push(data);
              break;
            case 'I':
              result[2].push(data);
              break;
            case 'J':
              result[3].push(data);
              break;
            case 'V':
              result[4].push(data);
              break;
            case 'S':
              result[5].push(data);
              break;
            case 'D':
              result[6].push(data);
              break;
            default:
              break;
          }
        });
      });
    }
    this.window.scrollTo(0, 1000);
    return result;
  });

  const schedule = [];
  subjectsByDays.forEach((day) => {
    const scheduleDay = {};
    day.forEach((row) => {
      const startSubjectDate = moment(row.start, 'hh:mm A');
      const finishSubjectDate = moment(row.finish, 'hh:mm A');

      let startSubjectInt = parseInt(startSubjectDate.hours(), 10);
      const finishSubjectInt = parseInt(finishSubjectDate.hours(), 10);

      while (finishSubjectInt - startSubjectInt >= 1) {
        scheduleDay[`${startSubjectInt}:${startSubjectDate.minutes()}`] = Object.assign({}, row, {
          start: `${startSubjectInt}:${startSubjectDate.minutes()}`,
          finish: `${startSubjectInt + 1}:${finishSubjectDate.minutes()}`,
          startDate: moment(row.startDate, 'MMM DD, YYYY', 'es').format('DD/MM/YYYY'),
          finishDate: moment(row.finishDate, 'MMM DD, YYYY', 'es').format('DD/MM/YYYY'),
        });
        startSubjectInt += 1;
      }
    });
    schedule.push(scheduleDay);
  });

  await page.screenshot({ path: 'schedule.png' });
  await closeBrowser(browser);

  return { fullName, schedule, subjectsByDays };
};

module.exports = {
  pomeloSchedule,
  pomeloScheduleOptions,
};
