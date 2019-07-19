const moment = require('moment');
const ApiError = require('../../../lib/ApiError');
const {
  openBrowser,
  closeBrowser,
  newPage,
  goTo,
} = require('../../../services/scraper');

const pomeloLogin = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_WWWLogin';
const pomeloScheduleDetils = 'https://pomelo.uninorte.edu.co/pls/prod/bwskfshd.P_CrseSchdDetl';
const pomeloLogout = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_Logout';

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

  return page.waitForSelector('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)', {
    visible: true,
    timeout: 1000,
  }).then(async () => {
    const welcomeMessage = await page.evaluate(() => this.document.querySelector('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)').textContent);
    const fullName = welcomeMessage.match(/,\s([\s\S]+),/)[1];

    // await page.screenshot({ path: 'auth.png' });
    return { browser, page, fullName };
  }).catch(() => {
    throw new ApiError('Invalid credentials', 400);
  });
};

/**
 * Logout to Pomelo
 * @param {Object} page
 */
const logout = page => goTo(page, pomeloLogout);

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloSchedulePeriods = async (username, password) => {
  const { page, fullName } = await login(username, password);

  await goTo(page, pomeloScheduleDetils);
  await page.waitForSelector('#term_id', { visible: true });

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
  const { browser, page } = await login(username, password);

  await goTo(page, pomeloScheduleDetils);
  await page.waitForSelector('#term_id', { visible: true });

  await page.evaluate((option) => {
    this.document.querySelector('#term_id').value = option;
    this.document.querySelector('body > div.pagebodydiv > form > input[type=submit]').click();
  }, scheduleOption);

  await page.waitForSelector('.datadisplaytable', { visible: true });
  await page.waitFor(() => [...this.document.querySelectorAll('.datadisplaytable')].length > 0);

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
          shortName: tables[i].caption.textContent.split(' - ')[0],
          type: obj[0],
          start: hours[1],
          finish: hours[2],
          place: obj[3],
          startDate: dates[1],
          finishDate: dates[2],
          subjectType: obj[5],
          teacher: obj[6],
        };
        // Add to results by day index
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

  const scheduleByHours = Array.from(Array(14), () => new Array(6));

  subjectsByDays.forEach((day, index) => {
    day.forEach((row) => {
      const startSubjectDate = moment(row.start, 'hh:mm A');
      const finishSubjectDate = moment(row.finish, 'hh:mm A');

      let startSubjectInt = parseInt(startSubjectDate.hours(), 10);
      const finishSubjectInt = parseInt(finishSubjectDate.hours(), 10);

      while (finishSubjectInt - startSubjectInt >= 1) {
        scheduleByHours[startSubjectInt - 6][index] = Object.assign({}, row, {
          startParsedTime: `${startSubjectInt}:${startSubjectDate.minutes()}`,
          finishParsedTime: `${startSubjectInt + 1}:${finishSubjectDate.minutes()}`,
          startDate: moment(row.startDate, 'MMM DD, YYYY', 'es'),
          finishDate: moment(row.finishDate, 'MMM DD, YYYY', 'es'),
        });
        startSubjectInt += 1;
      }
    });
  });

  // await page.screenshot({ path: 'scheduleByHours.png' });
  await logout(page);
  await closeBrowser(browser);

  return { scheduleByHours, subjectsByDays };
};

module.exports = {
  pomeloSchedule,
  pomeloSchedulePeriods,
};
