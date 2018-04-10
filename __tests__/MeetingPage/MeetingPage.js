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
  async shareMeetingLink(meetingURL) {
    const page = await chrome.browser.getPage();
    await page.goto(meetingURL);
    await page.waitFor(5 * 1000);
    await page.click(
      '#navbar > ul.nav.navbar-nav.navbar-right > li:nth-child(2) > a'
    );
    // #app > div > div > div:nth-child(4) > div > div > div.modal-body > div > a
    const _meetingURL = await page.evaluate(() => {
      const elem = document.querySelector('#app > div > div > div:nth-child(4) > div > div > div.modal-body > div > a');
      return elem ? elem.href : '';
    });
    await chrome.browser.closeChrome();
    return meetingURL === _meetingURL;
  }
  async closeMeeting(meetingURL) {
    const page = await chrome.browser.getPage();
    await page.evaluateOnNewDocument(() => {
      document.addEventListener('meetingpage.onfeedbackprovided', function(e) {
        const detail = e.detail.feedback;
        console.log('*', detail);
        if (detail.meetingFeedback === 4 && detail.audioFeedback === 3 &&
        detail.videoFeedback === 3 && detail.screenshareFeedback === 3 &&
        detail.commentFeedback === 'sample demo comment for testing') {
          window.navigator.success = true;
        } else {
          window.navigator.success = false;
        }
      }, false);
    });
    await page.goto(meetingURL);
    await page.waitFor(5 * 1000);
    await page.click(
      '#navbar > ul.nav.navbar-nav.navbar-right > li:nth-child(3) > a'
    );
    // Change rating to all three star
    await page.click(
      '#app > div > div > div:nth-child(6) > div > div > div.modal-body > div:nth-child(1) > div:nth-child(3) > ul > li:nth-child(4) > a'
    );
    await page.click(
      '#app > div > div > div:nth-child(6) > div > div > div.modal-body > div:nth-child(2) > div:nth-child(3) > ul > li:nth-child(3) > a'
    );
    await page.click(
      '#app > div > div > div:nth-child(6) > div > div > div.modal-body > div:nth-child(3) > div:nth-child(3) > ul > li:nth-child(3) > a'
    );
    await page.click(
      '#app > div > div > div:nth-child(6) > div > div > div.modal-body > div:nth-child(4) > div:nth-child(3) > ul > li:nth-child(3) > a'
    );
    await page.type(
      '#app > div > div > div:nth-child(6) > div > div > div.row > div.col-xs-8 > div > textarea', 'sample demo comment for testing'
    );
    // Give feedback, and close
    await page.click(
      '#app > div > div > div:nth-child(6) > div > div > div.modal-footer > button'
    );
    const retval = await page.evaluate(() => {
      return navigator.success;
    });
    await page.waitFor(2 * 1000);
    await chrome.browser.closeChrome();
    return retval;
  }
}

module.exports = MeetingPage;
