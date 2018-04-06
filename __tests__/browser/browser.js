'use strict';
const puppeteer = require('puppeteer');

class Browser {
  constructor() {
    this.browser = undefined;
    this.isLaunched = false;
  }
  async _launchChrome() {
    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      args: ['--disable-setuid-sandbox', '--no-sandbox'],
      headless: true
    });
    this.isLaunched = true;
  }
  async closeChrome() {
    try {
      if (this.browser !== undefined) {
        await this.browser.close();
      }
    } catch (e) {
      console.error(e);
    }

    this.browser = undefined;
    this.isLaunched = false;
  }
  async getPage() {
    if (this.isLaunched === false) {
      await this._launchChrome();
    }
    const newPage = await this.browser.newPage();
    return newPage;
  }
  async getBrowser() {
    if (this.isLaunched === false) {
      await this._launchChrome();
    }
    return this.browser;
  }
}

export let browser = new Browser();
