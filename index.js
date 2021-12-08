const core = require("@actions/core");
const github = require("@actions/github");

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(payload);

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
