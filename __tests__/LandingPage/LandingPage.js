'use strict';
const chrome = require('./../browser/browser');

class LandingPage {
  // check if we can open the page at given url
  async openPage(demoURL) {
    const page = await chrome.browser.getPage();
    await page.goto(demoURL);
    await page.waitFor(3 * 1000);
    await page.screenshot({path: 'landing-page.png'});
    await chrome.browser.closeChrome();
  }
  // check if csio is successfully initialized
  async initializeCSIO(demoURL) {
    let isAuthenticate = false;
    const page = await chrome.browser.getPage();
    page.on('console', msg => {
      if (msg._text) {
        if (msg._text.includes('errCode= success') && msg._text.includes('SDK authentication successful')) {
          isAuthenticate = true;
        }
        if (msg._text.includes('errCode= httpError') && msg._text.includes('Connection to the server closed.')) {
          isAuthenticate = false;
        }
      }
    });
    await page.goto(demoURL);
    await page.waitFor(5 * 1000);
    return isAuthenticate;
  }
  // check if we can create a meeting
  async createMeeting(demoURL, roomName) {
    const page = await chrome.browser.getPage();
    await page.goto(demoURL);
    await page.waitFor(
      '#app > div > div > div.container-fluid > div:nth-child(1) > div.col-xs-5 > ul > li:nth-child(2) > div > input',
      { timeout: 5 * 1000 });
    // provide room name
    await page.evaluate((roomName) => {
      document.querySelector(
        '#app > div > div > div.container-fluid > div:nth-child(1) > div.col-xs-5 > ul > li:nth-child(2) > div > input'
      ).value = roomName;
    }, roomName);

    // click create room
    await page.evaluate(() => {
      document.querySelector(
        '#app > div > div > div.container-fluid > div:nth-child(1) > div.col-xs-5 > ul > li:nth-child(3) > button'
      ).click();
    });
    await chrome.browser.closeChrome();
  }
  // check if we can open a meeting page
  async openMeeting(demoURL) {
    const page = await chrome.browser.getPage();
    await page.goto(demoURL);
    await page.waitFor(3 * 1000);
    await page.screenshot({path: 'example.png'});
    await chrome.browser.closeChrome();
  }
}

module.exports = LandingPage;
