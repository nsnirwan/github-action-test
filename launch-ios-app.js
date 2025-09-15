const wd = require("wd");

async function launchApp() {
  const driver = wd.promiseChainRemote("http://127.0.0.1:4723");

  const caps = {
    platformName: "mac",
    "appium:automationName": "Mac2",
    "appium:bundleId": "com.codeyug.assessprep-osx"
  };

  await driver.init(caps);
  console.log("App launched!");
}

launchApp().catch(console.error);
