'use strict';

const LandingPage = require('./LandingPage/LandingPage');
const MeetingPage = require('./MeetingPage/MeetingPage');

describe('LandinPage', function() {
  describe('#openLandingPage', function() {
    const landingPage = new LandingPage();
    it('should open the landing page and wait for 3 second', function(done) {
      this.timeout(15 * 1000);
      landingPage.openPage('https://localhost:4040').then((success) => {
        done();
      }, (e) => {
        done(e);
      });
    });
    it('should failed to open the landing page', function(done) {
      this.timeout(15 * 1000);
      landingPage.openPage('https://localhost:4041').then((success) => {
        done();
      }, (e) => {
        console.error(e);
        done();
      });
    });
    it('should successfully authenticate with csio server', function(done) {
      this.timeout(15 * 1000);
      landingPage.initializeCSIO('https://localhost:4040').then((success) => {
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
      landingPage.createMeeting('https://localhost:4040', 'test-room-101').then((success) => {
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
      landingPage.openMeeting('https://localhost:4040', 'test-room-101').then((success) => {
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
      meetingPage.canInitializeMedia('https://localhost:4040/test-user-media').then((success) => {
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
      this.timeout(15 * 1000);
      meetingPage.shareMeetingLink('https://localhost:4040/test-user-media').then((success) => {
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
      meetingPage.closeMeeting('https://localhost:4040/test-user-media').then((success) => {
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
});
