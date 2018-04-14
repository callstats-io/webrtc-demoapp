'use strict';
const chrome = require('./../browser/browser');

class MeetingPage {
  // check if we can open the page at given url
  async openPage(demoURL) {
    const page = await chrome.browser.getPage();
    await page.goto(demoURL);
    await page.waitFor(3 * 1000);
    await page.screenshot({ path: 'landing-page.png' });
    await chrome.browser.closeChrome();
  }
  async canInitializeMedia(meetingURL) {
    const page = await chrome.browser.getPage();
    await page.evaluateOnNewDocument(() => {
      document.addEventListener(
        'csiomediactrl.onLocalUserMedia',
        function(e) {
          window.navigator.mediaSuccess = true;
        },
        false
      );
      document.addEventListener(
        'csiopeerconnection.onWebrtcError',
        function(e) {
          window.navigator.mediaSuccess = false;
        },
        false
      );
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
      const elem = document.querySelector(
        '#app > div > div > div:nth-child(4) > div > div > div.modal-body > div > a'
      );
      return elem ? elem.href : '';
    });
    await chrome.browser.closeChrome();
    return meetingURL === _meetingURL;
  }
  async closeMeeting(meetingURL) {
    const page = await chrome.browser.getPage();
    await page.evaluateOnNewDocument(() => {
      document.addEventListener(
        'meetingpage.onfeedbackprovided',
        function(e) {
          const detail = e.detail.feedback;
          console.log('*', detail);
          if (
            detail.meetingFeedback === 4 &&
            detail.audioFeedback === 3 &&
            detail.videoFeedback === 3 &&
            detail.screenshareFeedback === 3 &&
            detail.commentFeedback === 'sample demo comment for testing'
          ) {
            window.navigator.success = true;
          } else {
            window.navigator.success = false;
          }
        },
        false
      );
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
      '#app > div > div > div:nth-child(6) > div > div > div.row > div.col-xs-8 > div > textarea',
      'sample demo comment for testing'
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
  async changeName(meetingURL) {
    const page = await chrome.browser.getPage();
    await page.goto(meetingURL);
    await page.waitFor(5 * 1000);
    await page.click(
      '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(2) > div.col-xs-7 > div:nth-child(1) > a'
    );
    await page.waitFor(1 * 1000);
    // just bring focus
    await page.type(
      '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(2) > div.col-xs-7 > div:nth-child(1) > div > div > input',
      ''
    );
    await page.waitFor(1 * 1000);
    // clear the input field
    page.evaluate(() => {
      document.querySelector(
        '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(2) > div.col-xs-7 > div:nth-child(1) > div > div > input'
      ).value =
        '';
    });
    await page.type(
      '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(2) > div.col-xs-7 > div:nth-child(1) > div > div > input',
      'demo-name'
    );
    await page.waitFor(1 * 1000);
    // save name
    await page.click(
      '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(2) > div.col-xs-7 > div:nth-child(1) > a'
    );
    await page.waitFor(1 * 1000);
    const retval = await page.evaluate(() => {
      let userName = JSON.parse(localStorage.getItem('userName'));
      return userName === 'demo-name';
    });
    await chrome.browser.closeChrome();
    return retval;
  }
  // a conference with 3 people
  async createe2econference(meetingURL) {
    const page1 = await chrome.browser.getPage();
    const page2 = await chrome.browser.getPage();
    const page3 = await chrome.browser.getPage();
    const participant = async(page) => {
      await page.goto(meetingURL);
      await page.waitFor(20 * 1000);
      // get number of participants
      const participantCount = page.evaluate(() => {
        const elem = document.querySelectorAll('#app > div > div > div.container-fluid > div > div.col-xs-8 > div:nth-child(2) > div:nth-child(2) > div > div');
        return elem ? elem.length : 0;
      });
      await page.waitFor(1 * 1000);
      await page.close();
      return participantCount;
    };
    const cnt = 3;
    const retval = await Promise.all([participant(page1), participant(page2), participant(page3)]);

    await chrome.browser.closeChrome();
    return retval[0] === retval[1] && retval[1] === retval[2] && retval[2] === cnt - 1;
  }
  async exchangeMessage(meetingURL) {
    const page1 = await chrome.browser.getPage();
    await page1.evaluateOnNewDocument(() => {
      document.addEventListener(
        'csiopeerconnection.onChannelMessage',
        function(e) {
          let userId = e.detail.userId;
          const label = e.detail.label;
          const channelMessage = JSON.parse(e.detail.message);
          const message = channelMessage.message;
          if (label === 'chat' && userId !== 'Me') {
            window.navigator.msg1 = message;
          }
        },
        false
      );
    });
    const page2 = await chrome.browser.getPage();
    await page2.evaluateOnNewDocument(() => {
      document.addEventListener(
        'csiopeerconnection.onChannelMessage',
        function(e) {
          let userId = e.detail.userId;
          const label = e.detail.label;
          const channelMessage = JSON.parse(e.detail.message);
          const message = channelMessage.message;
          if (label === 'chat' && userId !== 'Me') {
            window.navigator.msg2 = message;
          }
        },
        false
      );
    });
    const participant = async(page, msg, isFirst) => {
      await page.goto(meetingURL);
      await page.waitFor(10 * 1000);
      // type message
      await page.type(
        '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(4) > div > div:nth-child(2) > div > input',
        msg
      );
      // send message
      await page.click(
        '#app > div > div > div.container-fluid > div > div.col-xs-4 > div:nth-child(4) > div > div:nth-child(2) > div > span > button'
      );
      await page.waitFor(5 * 1000);
      const retval = isFirst ? await page.evaluate(() => {
        return navigator.msg1;
      }) : await page.evaluate(() => {
        return navigator.msg2;
      });
      await page.close();
      return retval;
    };
    const msg = ['test message from peer 1', 'test message from peer 2'];
    const retval = await Promise.all([participant(page1, msg[0], true), participant(page2, msg[1], false)]);
    await chrome.browser.closeChrome();
    return msg[0] === retval[1] && msg[1] === retval[0];
  }
}

module.exports = MeetingPage;
