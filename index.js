const core = require("@actions/core");
const github = require("@actions/github");

const { writeFileSync } = require("fs-extra");

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(payload);

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
      tag: "",
      branch: branch,
      hash: hash,
      time: time,
      date: "",
      author: author,
    },
    version: `${tag} ${branch} ${hash}`,
    basehref: "/",
  };
  const config = JSON.stringify(appconfig, null, 3);
  core.setOutput("config", config);

  const folder = core.getInput("folder");
  console.log(folder);

  const file = `${folder}/app.config.json`;
  console.log(file);
  writeFileSync(file, config, { encoding: "utf-8" });
} catch (error) {
  core.setFailed(error.message);
}
