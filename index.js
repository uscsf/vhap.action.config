const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const WEBCONFIG = `
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url="^(?!services|sfi.dit.web/|sfi|legacy|iwalk.api|iwitness.admin|identitystore|ofi.api).*$" />
          <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
`;

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(payload);

  const tag = "";

  const branch = core.getInput("branch");
  console.log(branch);

  const hash = core.getInput("hash");
  console.log(hash);

  const time = github.context.payload.repository.pushed_at;
  console.log(time);

  const date = "";

  const author = core.getInput("author");
  console.log(author);

  const appconfig = {
    build: {
      tag: tag,
      branch: branch,
      hash: hash,
      time: time,
      date: date,
      author: author,
    },
    version: `${tag} ${branch} ${hash}`,
    basehref: "/",
  };
  const config = JSON.stringify(appconfig, null, 3);
  core.setOutput("config", config);

  const folder = core.getInput("folder");
  console.log(folder);

  const _appconfigjson = `${folder}/app.config.json`;
  console.log(_appconfigjson);
  fs.writeFileSync(_appconfigjson, config, { encoding: "utf-8" });
  console.log(fs.readFileSync(_appconfigjson, { encoding: "utf-8" }));

  const _webconfig = `${folder}/web.config`;
  console.log(_webconfig);
  fs.writeFileSync(_webconfig, WEBCONFIG, { encoding: "utf-8" });
  console.log(fs.readFileSync(_webconfig, { encoding: "utf-8" }));
} catch (error) {
  core.setFailed(error.message);
}
