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

const capabilities = {
  platformName: 'Mac',
  // "appium:platformVersion": "13.4",
  "appium:platformName": "Mac",
  "appium:automationName": "Mac2",
  "appium:bundleId": "com.codeyug.assessprep-osx",
  "appium:wdaStartupRetries": "4",
  "appium:iosInstallPause": "8000",
  "appium:wdaStartupRetryInterval": "20000",
  "appium:systemPort": "10100",
  "appium:app": "/Users/rajeshap/Documents/narendra/AssessPrep.app"
};

const wdOpts = {
  host: "127.0.0.1",// //process.env.APPIUM_HOST || 'localhost',
  port: 4723,
  path: "/",//"/wd/hub",
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
//   let elementsOne = await driver.AccessibilityId("496FDF6F-ADBA-43FC-94A2-EAE63F35B28C");
//   console.log("batteyItem===>",batteryItem)
  //let elementsOne =  await $('-ios class chain:**/XCUIElementTypeSecureTextField[`value == "Password"`]').setValue('testUser');
  

const userNameTextEl = '**/XCUIElementTypeWebView[`label == "AssessPrep - Online Assessment Platform for Every School"`]/XCUIElementTypeGroup[3]/XCUIElementTypeGroup[2]/XCUIElementTypeGroup[1]/XCUIElementTypeTextField'


const userNameText = await driver.$(`-ios class chain:${userNameTextEl}`)
await userNameText.setValue('studentdp1@testing.com') 
 
const passwordTextEl = '**/XCUIElementTypeWebView[`label == "AssessPrep - Online Assessment Platform for Every School"`]/XCUIElementTypeGroup[3]/XCUIElementTypeGroup[2]/XCUIElementTypeGroup[2]'
const passwordText = await driver.$(`-ios class chain:${passwordTextEl}`)
await passwordText.setValue('rockpaper')
  
  
const loginButtonSelector = '**/XCUIElementTypeWebView[`label == "AssessPrep - Online Assessment Platform for Every School"`]/XCUIElementTypeGroup[3]/XCUIElementTypeGroup[2]/XCUIElementTypeGroup[4]/XCUIElementTypeButton'
const loginButton = await driver.$(`-ios class chain:${loginButtonSelector}`)
await loginButton.click()


// const quitnButtonSelector = '**/XCUIElementTypeWebView[`label == "AssessPrep - Online Assessment Platform for Every School"`]/XCUIElementTypeGroup[1]/XCUIElementTypeGroup[10]/XCUIElementTypeButton'
// const quitButton = await driver.$(`-ios class chain:${quitnButtonSelector}`)
// await quitButton.click()







  
  //await driver.setValueImmediate("496FDF6F-ADBA-43FC-94A2-EAE63F35B28C", "studentdp1@testing.com")
//   try {
//     const batteryItem = await driver.$('//*[@text="undefined_1_email"]');
//     console.log("batteyItem===>",batteryItem)
//     //await batteryItem.click();
//   } finally {
//     await driver.pause(1000);
//     await driver.deleteSession();
//   }
}

runTest().catch(console.error);





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
