const wd = require("wd");

const opts = {
  path: "/wd/hub",
  port: 4723,
  capabilities: {
    platformName: "iOS",            // ✅ must be "iOS"
    automationName: "XCUITest",     // ✅ correct driver
    deviceName: "iPhone 14",        // match installed simulator
    platformVersion: "17.0",        // check `xcrun simctl list` for actual version
    app: "/Applications/AssessPrep.app", // must be a valid .app or .ipa
    noReset: true
  }
};

async function main() {
  const driver = wd.promiseChainRemote(opts);
  await driver.init(opts.capabilities);
  console.log("✅ App launched!");
  await driver.quit();
}

main();

