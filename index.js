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
          <action type="Rewrite" url="[base]index.html" />
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
  const hash = core.getInput("hash");
  const time = github.context.payload.repository.pushed_at;
  const date = "";
  const author = core.getInput("author");
  const base = core.getInput("base");
  const folder = core.getInput("folder");

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
    basehref: base,
  };
  const config = JSON.stringify(appconfig, null, 3);
  core.setOutput("config", config);

  const _appconfigjson = `${folder}/app.config.json`;
  fs.writeFileSync(_appconfigjson, config, { encoding: "utf-8" });
  console.log(fs.readFileSync(_appconfigjson, { encoding: "utf-8" }));

  const _webconfig = `${folder}/web.config`;
  const _WEBCONFIG = WEBCONFIG.replace("[base]", base).trim();
  fs.writeFileSync(_webconfig, _WEBCONFIG, { encoding: "utf-8" });
  console.log(fs.readFileSync(_webconfig, { encoding: "utf-8" }));
} catch (error) {
  core.setFailed(error.message);
}
