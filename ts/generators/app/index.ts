'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fspath = require('path');

import * as acr from './providers/acr';
import * as defaultProvider from './providers/default';

import * as rust from './languages/rust';

module.exports = class extends Generator {
  async prompting() {
    const username = this.user.git.name() || process.env.USER || process.env.USERNAME;

    const prompts = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What is the name of the WASM module?',
        default: this.appname
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'What is the name of the author?',
        default: username
      },
      {
        type: 'list',
        name: 'language',
        message: 'What programming language will you write the module in?',
        choices: [
          'Rust'
        ],
        default: 'Rust'
      },
      {
        type: 'list',
        name: 'registryProvider',
        message: 'What registry provider do you plan to publish the module to?',
        choices: [
          'Azure Container Registry'
        ],
        default: 'Azure Container Registry'
      }
    ];

    const answers = await this.prompt(prompts);

    const additionalPrompts = providerSpecificPrompts(answers);
    const additionalAnswers = await this.prompt(additionalPrompts);

    // To access answers later, use this.answers.*
    this.answers = Object.assign({}, answers, additionalAnswers);
  }

  writing() {
    const language = languageProvider(this.answers.language);
    const templateFolder = language.templateFolder();

    for (const path of language.templateFiles()) {
      this.fs.copyTpl(
        this.templatePath(fspath.join(templateFolder, path)),
        this.destinationPath(path),
        this.answers
      );
    }

    const releaseTemplate = providerReleaseTemplate(this.answers.registryProvider);
    this.fs.copyTpl(
      this.templatePath(fspath.join(templateFolder, `.github/workflows/${releaseTemplate}`)),
      this.destinationPath(".github/workflows/release.yml"),
      this.answers
    );

    // It would be good to install the language toolchain (and other local tools) here,
    // and also to set up appropriate VS Code settings files etc.  But the install is
    // something we'd like to be able to run on other boxes (when the generated project
    // is cloned) so this needs to be a script that we emit not just something we
    // do during generation.
  }

  end() {
    this.log('');
    this.log(chalk.green('Created project and GitHub workflows'));
    this.log('');
    for (const instruction of providerSpecificInstructions(this.answers)) {
      this.log(instruction);
    }
    this.log('');
  }
};

function provider(registryProvider: string): any {
  switch (registryProvider) {
    case 'Azure Container Registry':
      return acr;
    default:
      return defaultProvider;
  }
}

function languageProvider(language: string): any {
  switch (language) {
    case 'Rust':
      return rust;
    default:
      throw new Error("You didn't choose a language");
  }
}

function providerSpecificPrompts(answers: any): any {
  return provider(answers.registryProvider).prompts(answers);
}

function providerSpecificInstructions(answers: any): any {
  return provider(answers.registryProvider).instructions(answers);
}

function providerReleaseTemplate(registryProvider: string): string {
  return provider(registryProvider).releaseTemplate();
}
