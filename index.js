const core = require("@actions/core");
const github = require("@actions/github");

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(payload);

  const action = core.getInput("action");
  console.log(action);

  const branch = core.getInput("branch");
  console.log(branch);

  const hash = core.getInput("hash");
  console.log(hash);

  const time = github.context.payload.repository.pushed_at;
  console.log(time);

  const author = core.getInput("author");
  console.log(author);

  const appconfig = {
    build: {
      action: action,
      tag: "",
      branch: branch,
      hash: hash,
      time: time,
      date: "",
      author: author,
    },
  };
  const config = JSON.stringify(appconfig);
  core.setOutput("config", config);
} catch (error) {
  core.setFailed(error.message);
}
