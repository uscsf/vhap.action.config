const core = require("@actions/core");
const github = require("@actions/github");

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(payload);

  const branch = core.getInput("branch");
  console.log(branch);

  const hash = core.getInput("hash");
  console.log(hash);

  const appconfig = {
    build: {
      tag: "",
      branch: branch,
      hash: hash,
      time: "",
      date: "",
      author: "",
    },
  };
  const config = JSON.stringify(appconfig);
  core.setOutput("config", config);
} catch (error) {
  core.setFailed(error.message);
}
