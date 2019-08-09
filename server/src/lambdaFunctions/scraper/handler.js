/* eslint-disable import/no-unresolved */
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const moment = require('moment');

const pomeloLogin = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_WWWLogin';
const pomeloScheduleDetils = 'https://pomelo.uninorte.edu.co/pls/prod/bwskfshd.P_CrseSchdDetl';
const pomeloLogout = 'https://pomelo.uninorte.edu.co/pls/prod/twbkwbis.P_Logout';

/**
 * Open new Puppeteer browser
 */
const openBrowser = async () => {
  try {
    // Set puppeteer required config
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    return browser;
  } catch (err) {
    const { name, message } = err;
    return { error: { name, message } };
  }
  // finally {
  //   if (browser) await browser.close();
  // }
};

/**
 * Create new Puppeteer page
 * @param {*} Puppeteer.browser
 */
const newPage = async (browser) => {
  const page = await browser.newPage();
  // Required config to optimize the page loading
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
 * @param {string} url
 * @param {*} Puppeteer.browser
 * @param {*} Puppeteer.page
 */
const goTo = async (url, browser = null, page = null) => {
  let currentPage = page;
  if (!currentPage) {
    currentPage = await newPage(browser);
  }
  await currentPage.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  return currentPage;
};

const login = async (browser, username, password) => {
  const page = await goTo(pomeloLogin, browser);

  await page.evaluate((user, pass) => {
    const userField = this.document.querySelector('#UserID');
    const passwordField = this.document.querySelector('#PIN > input[type=password]');
    userField.value = user;
    passwordField.value = pass;
    this.document.querySelector('body > div.pagebodydiv > form > p > input[type=submit]').click();
  }, username, password);

  await page.waitForSelector('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)', {
    visible: true,
    timeout: 10000,
  });

  const welcomeMessage = await page.evaluate(() => this.document.querySelector('body > div.pagebodydiv > table:nth-child(1) > tbody > tr > td:nth-child(2) > b:nth-child(1)').textContent);
  const fullName = welcomeMessage.match(/,\s([\s\S]+),/)[1];

  // await page.screenshot({ path: 'auth.png' });
  return { page, fullName };
};

// /**
//  * Logout to Pomelo
//  * @param {Object} page
//  */
const logout = page => goTo(pomeloLogout, null, page);

/**
 * Get Pomelo schedule options
 * @param {String} username
 * @param {String} password
 */
const pomeloSchedulePeriods = async (username, password) => {
  let browser;
  try {
    browser = await openBrowser();
    const { page, fullName } = await login(browser, username, password);

    await goTo(pomeloScheduleDetils, null, page);
    await page.waitForSelector('#term_id', { visible: true });

    const options = await page.evaluate(() => [...this.document.querySelector('#term_id').options]
      .filter(elem => !elem.text.toLowerCase().includes('ver solo'))
      .map(elem => ({ text: elem.text, value: elem.value })));
    return { options, fullName };
  } catch (err) {
    const { name, message } = err;
    return { error: { name, message } };
  } finally {
    if (browser) await browser.close();
  }
};

/**
 * Get Pomelo schedule
 * @param {String} username
 * @param {String} password
 * @param {String} scheduleOption
 */
const pomeloSchedule = async (username, password, scheduleOption) => {
  let browser;
  try {
    browser = await openBrowser();

    const { page } = await login(browser, username, password);

    await goTo(pomeloScheduleDetils, null, page);
    await page.waitForSelector('#term_id', { visible: true });

    await page.waitFor(10000);

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
        const timesTable = [...[...tables[i + 1].children[1].children]
          .filter((_, idx) => idx !== 0)];
        const scheduleArray = timesTable.map(elem => [...elem.children]
          .map(row => row.textContent));
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

    return { scheduleByHours, subjectsByDays };
  } catch (err) {
    const { name, message } = err;
    return { error: { name, message } };
  } finally {
    if (browser) await browser.close();
  }
};

module.exports.start = async (event) => {
  const {
    username,
    password,
    scheduleOption,
    action,
  } = event;
  let data;
  switch (action) {
    case 'pomeloSchedulePeriods':
      data = await pomeloSchedulePeriods(username, password);
      break;
    case 'pomeloSchedule':
      data = await pomeloSchedule(username, password, scheduleOption);
      break;
    default:
      data = null;
      break;
  }
  return {
    data,
  };
};
