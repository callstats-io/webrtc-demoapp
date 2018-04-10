'use strict';
const chrome = require('./../browser/browser');

class MeetingPage {
  // check if we can open the page at given url
  async openPage(demoURL) {
    const page = await chrome.browser.getPage();
    await page.goto(demoURL);
    await page.waitFor(3 * 1000);
    await page.screenshot({path: 'landing-page.png'});
    await chrome.browser.closeChrome();
  }
  async canInitializeMedia(meetingURL) {
    const page = await chrome.browser.getPage();
    await page.evaluateOnNewDocument(() => {
      document.addEventListener('csiomediactrl.onLocalUserMedia', function(e) {
        window.navigator.mediaSuccess = true;
      }, false);
      document.addEventListener('csiopeerconnection.onWebrtcError', function(e) {
        window.navigator.mediaSuccess = false;
      }, false);
    });
    await page.goto(meetingURL);
    await page.waitFor(10 * 1000);
    const retval = await page.evaluate(() => {
      return navigator.mediaSuccess;
    });
    await chrome.browser.closeChrome();
    return retval;
  }
}

module.exports = MeetingPage;
