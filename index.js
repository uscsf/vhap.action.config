const core = require("@actions/core");
const github = require("@actions/github");

try {
  //   const nameToGreet = core.getInput("who-to-greet");
  //   console.log(`Hello ${nameToGreet}!`);

  //   const time = new Date().toTimeString();
  //   core.setOutput("time", time);

  //   const payload = JSON.stringify(github.context.payload, undefined, 2);
  //   console.log(`The event payload: ${payload}`);

  const branch = core.getInput("branch");
  console.log(branch);

  const appconfig = {
    build: {
      branch: branch,
    },
  };
  const config = JSON.stringify(appconfig);
  core.setOutput("config", config);
} catch (error) {
  core.setFailed(error.message);
}
