const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Forces Puppeteer to download Chrome directly into your project folder
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};