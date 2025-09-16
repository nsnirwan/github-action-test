const wd = require("wd");
const http = require("http");


const { remote } = require('webdriverio');

async function stopApp() {
  try {
    const driver = await remote({
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      logLevel: 'info',
      capabilities: {
        platformName: 'Mac',
        'appium:automationName': 'Mac2',
        'appium:bundleId': 'com.codeyug.assessprep-osx'
      }
    });

    console.log("✅ Connected to the app!");

    // Stop the app by deleting the session
    await driver.deleteSession();
    console.log("✅ App stopped successfully!");
  } catch (err) {
    console.error("❌ Failed to stop the app:", err.message);
    process.exit(1);
  }
}

stopApp();
