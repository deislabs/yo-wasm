import * as https from 'https';
import { URL } from 'url';
import chalk from "chalk";
import { HippoClient } from "hippo-js";

import { Registry } from "./registry";
import { Formatter } from '../formatter';

export const hippo: Registry = {
  prompts() {
    return [
      {
        type: 'input',
        name: 'hippoUrl',
        message: "What is the URL of your Hippo service?",
        default: process.env['HIPPO_URL'] || 'https://hippos.rocks/',
      },
      {
        type: 'input',
        name: 'serverUrl',
        message: "What is the URL of your Hippo's Bindle server?",
        default: process.env['BINDLE_URL'] || 'https://bindle.hippos.rocks/v1',
      },
      {
        type: 'confirm',
        name: 'hippoCreateApp',
        message: "Would you like to create a new Hippo application for this project?",
        default: true,
        moar: {
          askIf: (ans) => !!ans,
          moarQuestions: (ans) => [
            {
              type: 'input',
              name: 'bindleId',
              message: "What storage ID (bindle name) would you like for your Hippo app?",
              default: bindleise(ans.authorName, ans.moduleName),
            },
            {
              type: 'input',
              name: 'domainName',
              message: "What domain name would you like for your Hippo app?",
              default: `${ans.moduleName}.${sharedDomainOf(ans.hippoUrl)}`,
            },
            {
              type: 'input',
              name: 'hippoUsername',
              message: "Enter your Hippo user name (will become app owner)",
              default: process.env['HIPPO_USERNAME'] || '',
            },
            {
              type: 'password',
              name: 'hippoPassword',
              mask: '*',
              message: "Enter your Hippo password",
              default: process.env['HIPPO_PASSWORD'] || '',
            },
          ]
        },
      },
    ];
  },

  workflowInstructions(fmt: Formatter): ReadonlyArray<string> {
    return [
      'The release workflow depends on two variable and two secrets:',
      '',
      `* ${fmt.ev('HIPPO_URL')} (defined in .github/workflows/release.yml): the`,
      '  URL of the Hippo where you\'d like to',
      '  publish releases. We\'ve set this up for you.',
      `* ${fmt.ev('BINDLE_SERVICE_URL')} (defined in .github/workflows/release.yml): the`,
      '  URL of the Bindle server where your Hippo server',
      '  gets modules from. We\'ve set this up for you.',
      `* ${fmt.ev('HIPPO_USERNAME')} (secret you need to create in GitHub): the ID`,
      '  of a user with write permissions on the Hippo service.',
      `* ${fmt.ev('HIPPO_PASSWORD')} (secret you need to create in GitHub): the`,
      '  password of the user identified in HIPPO_USERNAME.',
      // `* ${fmt.ev('BINDLE_USER_ID')} (secret you need to create in GitHub): the ID`,
      // '  of a user with push access to the Bindle server.',
      // `* ${fmt.ev('BINDLE_PASSWORD')} (secret you need to create in GitHub): the`,
      // '  password of the user identified in BINDLE_USER_ID.',
      '',
      'See https://bit.ly/2ZqS3cB for more information about creating the',
      'secrets in your GitHub repository.',
    ];
  },

  localInstructions(fmt: Formatter): ReadonlyArray<string> {
    return [
      `* ${fmt.emph('You will need the Hippo uploader to publish dev builds.')} Download this from`,
      '  https://github.com/deislabs/hippofactory/releases and install on your path.',
    ]
  },

  languageFiles(): ReadonlyArray<string> {
    return ['HIPPOFACTS'];
  },

  releaseTemplate(): string {
    return 'release.hippo.yml';
  },

  async prepareRegistry(answers: any, log: (line: string) => void): Promise<Error | undefined> {
    if (!answers.hippoCreateApp) {
      return;
    }

    log('');
    log(chalk.green('Setting up your Hippo application...'));

    let user = process.env['USER'] ||
      process.env["USERNAME"] ||
      '';

    try {
      const { hippoUrl, hippoUsername, hippoPassword } = answers;
      const agent = new https.Agent({ rejectUnauthorized: false });
      const client = await HippoClient.new(hippoUrl, hippoUsername, hippoPassword, agent);
      const appId = await client.createApplication(answers.moduleName, answers.bindleId);
      await client.createChannel(appId, "Latest Release", "latest." + answers.domainName, { revisionRange: "*" });
      await client.createChannel(appId, "Canary", "canary." + answers.domainName, { revisionRange: "P:*-canary-*" });
      await client.createChannel(appId, `Development: ${user}`, `${user}.` + answers.domainName, { revisionRange: `P:*-${user}-*` });
      log(chalk.green('Setup complete'));
      return undefined;
    } catch (e) {
      log(`${chalk.red('Setup failed!')} You will need to create the Hippo app manually.`);
      log(`The error was: ${e}`);
      return e;
    }
  }
}

function bindleise(user: string, app: string): string {
  const ns = user.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
  const safeApp = app.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
  return `${ns}/${safeApp}`;
}

function sharedDomainOf(url: string): string {
  // motivation:
  // https://hippos.rocks -> hippos.rocks
  // http://hippo.foo.com/ -> foo.com
  // bar.foo.com -> foo.com
  try {
    const hostname = (new URL(url)).hostname;
    if (hostname.split('.').length <= 2) {
      return hostname;
    }
    const subdomainParse = hostname.indexOf('.');
    return hostname.substr(subdomainParse + 1);
  } catch {
    return 'hippos.rocks';
  }
}
