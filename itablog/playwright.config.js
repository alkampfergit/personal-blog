const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:1314/itablog/',
    headless: true,
  },
  webServer: {
    command: '../bin/hugo server -D --port 1314',
    url: 'http://localhost:1314/itablog/',
    reuseExistingServer: true,
    timeout: 10000,
  },
  projects: [
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
