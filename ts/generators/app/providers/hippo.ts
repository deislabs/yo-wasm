import Generator = require('yeoman-generator');

import { Registry } from "./registry";
import { Formatter } from '../formatter';

export const hippo: Registry = {
  prompts(): Generator.Questions<any> {
    return [
      {
        type: 'input',
        name: 'hippoUrl',
        message: "What is the URL of your Hippo service?",
        default: 'https://hippos.rocks',
      },
      {
        type: 'input',
        name: 'serverUrl',
        message: "What is the URL of your Hippo's Bindle server?",
        default: 'https://bindle.hippos.rocks/v1',
      }
    ];
  },

  workflowInstructions(fmt: Formatter): ReadonlyArray<string> {
    return [
      'The release workflow depends on two variable and two secrets:',
      '',
      `* ${fmt.ev('HIPPO_SERVICE_URL')} (defined in .github/workflows/release.yml): the`,
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
  }
}
