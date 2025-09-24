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

      describe("Login Test", () => {
        it("should enter email, password and click login", async () => {
          // Locate Email field by placeholder
          const emailField = await $('-ios predicate string:type == "XCUIElementTypeTextField" AND placeholderValue == "Email"');
          await emailField.waitForDisplayed({ timeout: 10000 });
          await emailField.click();
          await emailField.setValue("studentdp1@testing.com");
      
          // Locate Password field by placeholder
          const passwordField = await $('-ios predicate string:type == "XCUIElementTypeSecureTextField" AND placeholderValue == "Password"');
          await passwordField.waitForDisplayed({ timeout: 10000 });
          await passwordField.click();
          await passwordField.setValue("rockpaper");
      
          // Locate Login button by title
          const loginBtn = await $('-ios predicate string:type == "XCUIElementTypeButton" AND title == "Login"');
          await loginBtn.waitForDisplayed({ timeout: 10000 });
          await loginBtn.click();
      
          // Optional: verify navigation or error
          await driver.pause(3000);
        });
      });
      



      
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
