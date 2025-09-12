const wd = require("wd");

const driver = wd.promiseChainRemote("http://localhost:4723/wd/hub");

async function run() {
  const desiredCaps = {
    platformName: "iOS",
    automationName: "XCUITest",
    deviceName: "iPhone 14",            // Or any simulator/device name you have
    platformVersion: "17.4",            // Adjust to your simulator's version
    app: "/Applications/AssessPrep.app",     // Replace with full absolute path
    noReset: true
  };

  await driver.init(desiredCaps);
  console.log("✅ AssessPrep app launched on iOS");
  await driver.quit();
}

run().catch(console.error);
