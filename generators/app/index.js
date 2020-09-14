'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const acr = require('./providers/acr');
const defaultProvider = require('./providers/default');

const TEMPLATE_FILES = [
  '.gitignore',
  'Cargo.toml',
  'LICENSE',
  'README.md',
  '.github/workflows/build.yml',
  '.vscode/settings.json',
  'src/main.rs'
];

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
    for (const path of TEMPLATE_FILES) {
      this.fs.copyTpl(
        this.templatePath(path),
        this.destinationPath(path),
        this.answers
      );
    }

    const releaseTemplate = providerReleaseTemplate(this.answers.registryProvider);
    this.fs.copyTpl(
      this.templatePath(`.github/workflows/${releaseTemplate}`),
      this.destinationPath(".github/workflows/release.yml"),
      this.answers
    );
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

function provider(registryProvider) {
  switch (registryProvider) {
    case 'Azure Container Registry':
      return acr;
    default:
      return defaultProvider;
  }
}

function providerSpecificPrompts(answers) {
  return provider(answers.registryProvider).prompts(answers);
}

function providerSpecificInstructions(answers) {
  return provider(answers.registryProvider).instructions(answers);
}

function providerReleaseTemplate(registryProvider) {
  return provider(registryProvider).releaseTemplate();
}
