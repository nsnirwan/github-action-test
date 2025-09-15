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

async function launchApp() {
  const driver = wd.promiseChainRemote(SERVER_URL);

  const caps = {
    platformName: "mac",
    "appium:automationName": "Mac2",
    "appium:bundleId": "com.codeyug.assessprep-osx"
  };

  await waitForServer();
  await driver.init(caps);
  console.log("🚀 App launched successfully!");
}

launchApp().catch((err) => {
  console.error("❌ Failed to launch app:", err.message);
  process.exit(1);
});
