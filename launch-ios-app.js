const wd = require("wd");
const http = require("http");

const SERVER_URL = "http://127.0.0.1:4723";
const STATUS_URL = `${SERVER_URL}/status`;

async function waitForServer(timeout = 30000, interval = 2000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        http.get(STATUS_URL, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Bad status code: ${res.statusCode}`));
          }
        }).on("error", reject);
      });
      console.log("✅ Appium server is ready!");
      return true;
    } catch (err) {
      console.log(`⏳ Waiting for Appium... (${err.message})`);
      await new Promise((r) => setTimeout(r, interval));
    }
  }
  throw new Error("❌ Appium server did not become ready in time.");
}

const { remote } = require('webdriverio');

async function launchApp() {
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
        // 'appium:app': '/Users/rajeshap/Documents/narendra/AssessPrep.app'
      }
    });


    // Wait 3 seconds so you can see it running
    await driver.pause(3000);
    console.log("✅ App launched!");
    try {

      async function typeText(element, text, delay = 80) {
        await element.click();
      
        // 1️⃣ Try fast setValue first
        await element.setValue(text);
        let currentValue = await element.getText();
      
        if (currentValue !== text) {
          console.warn(`⚠️ setValue failed (got "${currentValue}"), retrying with macOS keys...`);
          await element.clearValue();
      
          // 2️⃣ Use macOS-level keystrokes
          await driver.execute('macos: keys', { keys: text });
      
          // 3️⃣ Verify again
          currentValue = await element.getText();
          if (currentValue !== text) {
            console.error(`❌ Even macos: keys failed, last value: "${currentValue}"`);
          }
        }
      }
      // Wait for login screen to appear      
      

      
      // Email
      const emailField = await driver.$('//XCUIElementTypeTextField[@placeholderValue="Email"]');
      await typeText(emailField, 'studentdp1@testing.com');

      // Password
      const passwordField = await driver.$('//XCUIElementTypeSecureTextField[@placeholderValue="Password"]');
      await typeText(passwordField, 'rockpaper');

      // Login
      const loginBtn = await driver.$('//XCUIElementTypeButton[@title="Login"]');
      await loginBtn.click();

      console.log("✅ Login flow completed");



      
    } catch (err) {
      console.error('❌ Test failed:', err);
    }

    

    // Close app
    // await driver.deleteSession();
    // console.log("✅ App closed!");
  } catch (err) {
    console.error("❌ Failed to launch app:", err.message);
    process.exit(1);
  }
}

launchApp();


// import { remote } from 'webdriverio';

// async function launchApp() {
//   const driver = await remote({
//     hostname: '127.0.0.1',
//     port: 4723,
//     path: '/',
//     logLevel: 'info',
//     capabilities: {
//       platformName: 'Mac',
//       'appium:automationName': 'Mac2',
//       'appium:bundleId': 'com.codeyug.assessprep-osx'
//     }
//   });

//   console.log("✅ App launched!");

//   // Example: wait and then close
//   await driver.pause(3000);
//   await driver.deleteSession();
// }

// launchApp().catch(err => {
//   console.error("❌ Failed to launch app:", err.message);
//   process.exit(1);
// });



// const { remote } = require("appium-client");


// async function launchApp() {
//   try {
//     const driver = await remote({
//       protocol: "http",
//       hostname: "127.0.0.1",
//       port: 4723,
//       path: "/",
//       capabilities: {
//         platformName: "mac",
//         "appium:automationName": "Mac2",
//         "appium:bundleId": "com.codeyug.assessprep-osx"
//       }
//     });

//     console.log("✅ App launched successfully!");
//     await driver.deleteSession();
//   } catch (err) {
//     console.error("❌ Failed to launch app:", err.message);
//     process.exit(1);
//   }
// }

// launchApp();


// async function launchApp() {
//   const driver = wd.promiseChainRemote(SERVER_URL);

//   const caps = {
//     platformName: "mac",
//     "appium:automationName": "Mac2",
//     "appium:bundleId": "com.codeyug.assessprep-osx"
//   };

//   await waitForServer();
//   await driver.init({
//     capabilities: {
//       alwaysMatch: {
//         platformName: "mac",
//         "appium:automationName": "Mac2",
//         "appium:bundleId": "com.codeyug.assessprep-osx"
//       },
//       firstMatch: [{}]
//     }
//   });

//   console.log("🚀 App launched successfully!");
// }

// launchApp().catch((err) => {
//   console.error("❌ Failed to launch app:", err.message);
//   process.exit(1);
// });
