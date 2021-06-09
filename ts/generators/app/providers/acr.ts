import Generator = require('yeoman-generator');

import { Registry } from "./registry";
import { Formatter } from '../formatter';

export const acr: Registry = {
  prompts(answers: any): Generator.Questions<any> {
    return [
      {
        type: 'input',
        name: 'registryName',
        message: 'What is the name of the ACR registry to publish the module to?',
        default: answers.authorName + 'wasm',
      }
    ];
  },

  workflowInstructions(fmt: Formatter): ReadonlyArray<string> {
    return [
      'The release workflow depends on one variable and two secrets:',
      '',
      `* ${fmt.ev('ACR_NAME')} (defined in .github/workflows/release.yml): the`,
      '  name of the Azure Container Registry where you\'d like to',
      '  publish releases. We\'ve set this up for you.',
      `* ${fmt.ev('ACR_SP_ID')} (secret you need to create in GitHub): the ID`,
      '  of a service principal with push access to the registry.',
      `* ${fmt.ev('ACR_SP_PASSWORD')} (secret you need to create in GitHub): the`,
      '  password of the service principal identified in ACR_SP_ID.',
      '',
      'See https://bit.ly/2ZsmeQS for creating a service principal',
      'for use with ACR, and https://bit.ly/2ZqS3cB for creating the',
      'secrets in your GitHub repository.',
    ];
  },

  localInstructions(): ReadonlyArray<string> {
    return [];
  },

  languageFiles(): ReadonlyArray<string> {
    return [];
  },

  releaseTemplate(): string {
    return 'release.azurecr.yml';
  }
}
