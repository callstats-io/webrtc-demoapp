'use strict';

const LandingPage = require('./LandingPage/LandingPage');
const mocha = require('mocha');

mocha.describe('LandinPage', function() {
  mocha.describe('#openLandingPage', function() {
    const landingPage = new LandingPage();
    mocha.it('should open the landing page and wait for 3 second', function(done) {
      this.timeout(15 * 1000);
      landingPage.openPage('https://localhost:4040').then((success) => {
        done();
      }, (e) => {
        done(e);
      });
    });
    mocha.it('should failed to open the landing page', function(done) {
      this.timeout(15 * 1000);
      landingPage.openPage('https://localhost:4041').then((success) => {
        done();
      }, (e) => {
        console.error(e);
        done();
      });
    });
    mocha.it('should successfully authenticate with csio server', function(done) {
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
  });
});

/* describe('MeetingPage', function() {
  describe('#getUserMedia', function() {
    describe('#audioOnly', function() {});
    describe('#videoOnly', function() {});
    describe('#both', function() {});
  });
}); */
