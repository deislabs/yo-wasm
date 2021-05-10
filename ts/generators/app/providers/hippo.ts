import Generator = require('yeoman-generator');
import { default as chalk } from 'chalk';

import { Registry } from "./registry";

export const hippo: Registry = {
  prompts(): Generator.Questions<any> {
    return [
      {
        type: 'input',
        name: 'serverUrl',
        message: "What is the URL of your Hippo's Bindle server?",
        default: 'https://bindle.hippos.rocks/v1',
      }
    ];
  },

  instructions(): ReadonlyArray<string> {
    return [
      'The release workflow depends on one variable and two secrets:',
      '',
      `* ${chalk.cyan('BINDLE_URL')} (defined in .github/workflows/release.yml): the`,
      '  URL of the Bindle server where you\'d like to',
      '  publish releases. We\'ve set this up for you.',
      `* ${chalk.cyan('BINDLE_USER_ID')} (secret you need to create in GitHub): the ID`,
      '  of a user with push access to the Bindle server.',
      `* ${chalk.cyan('BINDLE_PASSWORD')} (secret you need to create in GitHub): the`,
      '  password of the user identified in BINDLE_USER_ID.',
      '',
      'See https://bit.ly/2ZqS3cB for more information about creating the',
      'secrets in your GitHub repository.',
    ];
  },

  languageFiles(): ReadonlyArray<string> {
    return ['HIPPOFACTS'];
  },

  releaseTemplate(): string {
    return 'release.hippo.yml';
  }
}
