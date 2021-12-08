/*
 * TODO: VERIFY enquirer package is trustworthy
 */

const { execFile } = require('child_process');
const { writeFileSync } = require('fs-extra');
const { Select } = require('enquirer');
const { COPYFILE_FICLONE_FORCE } = require('constants');

/********************************************************************/

var application = '';
var target = '';

console.log('');
_application();

function _application() {
  const application_prompt = new Select({
    name: 'application',
    message: 'Application',
    choices: ['IWItness', 'VHA'],
  });

  application_prompt
    .run()
    .then((answer) => {
      application = answer.toLowerCase();
      _target();
    })
    .catch(console.error);
}

function _target() {
  const target_prompt = new Select({
    name: 'target',
    message: 'Target',
    choices: ['dev', 'test', 'stage', 'prod'],
  });

  target_prompt
    .run()
    .then((answer) => {
      target = answer;
      _write_web_config();
    })
    .catch(console.error);
}

const WEBCONFIG = `
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="willesdenlane" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="willesdenlane" />
          <action type="Redirect" url="https://iwitness.usc.edu/sites/willesdenproject" />
        </rule>
        <rule name="willesdenproject" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="willesdenproject" />
          <action type="Redirect" url="https://iwitness.usc.edu/sites/willesdenproject" />
        </rule>
        <rule name="wesharethesamesky" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="wesharethesamesky" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Sites/wstss" />
        </rule>
        <rule name="agedu" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="agedu" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Sites/Armenia" />
        </rule>
        <rule name="cn" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="cn" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Global/Portal.aspx?pid=6c17efa8-3645-4b7a-bdc9-46bea4062217" />
        </rule>
        <rule name="cz" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="cz" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Global/Portal.aspx?pid=382470E2-52AE-419D-A1BC-DA2096666DF3" />
        </rule>
        <rule name="hu" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="hu" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Global/Portal.aspx?pid=4C731CBB-D8FB-473A-90DD-2685C9252124" />
        </rule>
        <rule name="pl" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="pl" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Global/Portal.aspx?pid=FDA418B4-BD8B-4A07-BABF-1B6AD96E98CF" />
        </rule>
        <rule name="ua" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="ua" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Global/Portal.aspx?pid=B01C07CB-B05B-4793-8368-185D884862AF" />
        </rule>
        <rule name="iwalk" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="iwalk" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Sites/iwalk/philadelphia" />
        </rule>
        <rule name="360" patternSyntax="ExactMatch" stopProcessing="true">
          <match url="360" />
          <action type="Redirect" url="https://iwitness.usc.edu/sfi/Sites/360" />
        </rule>


        <rule name="Angular Routes" stopProcessing="true">
          <match url="^(?!services|sfi.dit.web/|sfi|legacy|iwalk.api|iwitness.admin|identitystore|ofi.api).*$" />
          <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="_URL_" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
`;

function _write_web_config() {
  var url = '/index.html';
  switch (target) {
    case 'dev':
    case 'test':
      url = `/${application}-${target}/index.html`;
      break;
  }
  const webconfig = WEBCONFIG.replace('_URL_', url);
  writeFileSync('web.config', webconfig, { encoding: 'utf-8' });
  _version();
}

/********************************************************************/

var tag = '';
var branch = '';
var hash = '41b5bd9';

function _version() {
  execFile('git', ['describe', '--tags', '--abbrev=0'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    } else {
      tag = stdout.trim();
      _branch();
    }
  });
}

function _branch() {
  execFile('git', ['rev-parse', '--abbrev-ref', 'HEAD'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    } else {
      branch = stdout.trim();
      _hash();
    }
  });
}

function _hash() {
  execFile('git', ['rev-parse', '--short', 'HEAD'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    } else {
      hash = stdout.trim();
      _author();
    }
  });
}

function _author() {
  execFile('git', ['show', '-s', `--format=%an`, hash], (error, stdout, stderr) => {
    if (error) {
      throw error;
    } else {
      author = stdout.trim();
      _write_app_config();
    }
  });
}

function _write_app_config() {
  const version = `${tag} ${branch} ${hash}`;

  var basehref = '/';
  switch (target) {
    case 'dev':
    case 'test':
      basehref = `/${application}-${target}/`;
      break;
  }

  const appconfig = {
    build: {
      tag: tag,
      branch: branch,
      hash: hash,
      time: Date.now(),
      date: new Date().toLocaleString(),
      author: author,
    },
    version: version,
    basehref: basehref,
  };
  const json = JSON.stringify(appconfig, null, 3);
  writeFileSync('app.config.json', json, { encoding: 'utf-8' });

  _info(appconfig);
}

function _info(appconfig) {
  console.log('\x1b[34m', appconfig.version);

  var _configuration = '';
  var _basehref = '';

  switch (target) {
    case 'dev':
      _basehref = `--base-href=/${application}-${target}/`;
      break;
    case 'test':
      _configuration = '-c=test';
      _basehref = `--base-href=/${application}-${target}/`;
      break;
    case 'stage':
      _configuration = '-c=stage';
      break;
    case 'prod':
      _configuration = '--prod';
      break;
  }

  const _lint = 'nx run-many --target=lint --all'; // `nx lint ${application}`;
  console.log('\x1b[0m\x1b[2m', _lint);

  const _build = `nx build ${application} ${_configuration} ${_basehref}`;
  console.log('\x1b[0m\x1b[2m', _build);

  console.log('\x1b[0m');
}
