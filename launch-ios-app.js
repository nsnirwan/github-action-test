const wd = require("wd");

const opts = {
  path: "/",
  port: 4723,
  capabilities: {

    platformName: "Mac",            // ✅ must be "iOS"
    automationName: "Mac2",     // ✅ correct driver
    bundleId: "com.codeyug.assessprep-osx",
  }
};

async function main() {
  const driver = wd.promiseChainRemote(opts);
  await driver.init(opts.capabilities);
  console.log("✅ App launched!");
  await driver.quit();
}

main();

