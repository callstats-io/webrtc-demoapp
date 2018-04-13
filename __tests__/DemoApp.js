'use strict';

const LandingPage = require('./LandingPage/LandingPage');
const MeetingPage = require('./MeetingPage/MeetingPage');

// const PAGE_URL = 'https://localhost:4440';
const PAGE_URL = 'https://test-demoapp.callstats.io';
const PAGE_URL_WRONG = 'https://localhost:4441';
describe('LandinPage', function() {
  describe('#openLandingPage', function() {
    const landingPage = new LandingPage();
    it('should open the landing page and wait for 3 second', function(done) {
      this.timeout(15 * 1000);
      landingPage.openPage(`${PAGE_URL}`).then((success) => {
        done();
      }, (e) => {
        done(e);
      });
    });
    it('should failed to open the landing page', function(done) {
      this.timeout(15 * 1000);
      landingPage.openPage(`${PAGE_URL_WRONG}`).then((success) => {
        done('should failed to open landing face');
      }, (e) => {
        console.error(e);
        done();
      });
    });
    it('should successfully authenticate with csio server', function(done) {
      this.timeout(15 * 1000);
      landingPage.initializeCSIO(`${PAGE_URL}`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to authenticate with csio server'));
        }
      }, (e) => {
        done(e);
      });
    });
    it('should create a meeting', function(done) {
      this.timeout(15 * 1000);
      landingPage.createMeeting(`${PAGE_URL}`, 'test-room-101').then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to create meeting page'));
        }
      }, (e) => {
        done(e);
      });
    });
    it('should open a meeting', function(done) {
      this.timeout(15 * 1000);
      landingPage.openMeeting(`${PAGE_URL}`, 'test-room-101').then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to open meeting page'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
});

describe('MeetingPage', function() {
  const meetingPage = new MeetingPage();
  describe('#getUserMedia', function() {
    it('should able to get user media', function(done) {
      this.timeout(15 * 1000);
      meetingPage.canInitializeMedia(`${PAGE_URL}/test-user-media`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to get user media'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
  describe('#shareMeetingLink', function() {
    it('should able to get meeting link', function(done) {
      this.timeout(30 * 1000);
      meetingPage.shareMeetingLink(`${PAGE_URL}/test-share-meeting-link`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to get meeting link'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
  describe('#closeMeetingLink', function() {
    it('should able to close meeting, and provide feedback', function(done) {
      this.timeout(30 * 1000);
      meetingPage.closeMeeting(`${PAGE_URL}/test-close-meeting-link`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to close meeting, and provide feedback'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
  describe('#changeName', function() {
    it('should able to change name', function(done) {
      this.timeout(30 * 1000);
      meetingPage.changeName(`${PAGE_URL}/test-change-room`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to change name'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
  describe('#e2eMeeting', function() {
    it('should able to create a meeting with n people', function(done) {
      this.timeout(60 * 1000);
      meetingPage.createe2econference(`${PAGE_URL}/test-e2e-meeting`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to create an end2end conference'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
  describe('#exchangeMessage', function() {
    it('should able to exchange message in a meeting with n people', function(done) {
      this.timeout(60 * 1000);
      meetingPage.exchangeMessage(`${PAGE_URL}/test-exchange-msg`).then((success) => {
        if (success === true) {
          done();
        } else {
          done(new Error('failed to exchange message in an end2end conference'));
        }
      }, (e) => {
        done(e);
      });
    });
  });
});
