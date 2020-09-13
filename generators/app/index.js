'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

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

function providerSpecificPrompts(answers) {
  switch (answers.registryProvider) {
    case 'Azure Container Registry':
      return acrPrompts(answers);
    default:
      return [];
  }
}

function acrPrompts(answers) {
  return [
    {
      type: 'input',
      name: 'registryName',
      message: 'What is the name of the ACR registry to publish the module to?',
      default: answers.authorName + 'wasm',
    }
  ];
}

function providerSpecificInstructions(answers) {
  switch (answers.registryProvider) {
    case 'Azure Container Registry':
      return acrInstructions();
    default:
      return [];
  }
}

function acrInstructions() {
  return [
    'The release workflow depends on one variable and two secrets:',
    '',
    `* ${chalk.cyan('ACR_NAME')} (defined in .github/workflows/release.yml): the`,
    '  name of the Azure Container Registry where you\'d like to',
    '  publish releases. We\'ve set this up for you.',
    `* ${chalk.cyan('ACR_SP_ID')} (secret you need to create in GitHub): the ID`,
    '  of a service principal with push access to the registry.',
    `* ${chalk.cyan('ACR_SP_PASSWORD')} (secret you need to create in GitHub): the`,
    '  password of the service principal identified in ACR_SP_ID.',
    '',
    'See https://bit.ly/2ZsmeQS for creating a service principal',
    'for use with ACR, and https://bit.ly/2ZqS3cB for creating the.',
    'secrets in your GitHub repository.',
  ];
}

function providerReleaseTemplate(registryProvider) {
  switch (registryProvider) {
    case 'Azure Container Registry':
      return 'release.azurecr.yml';
    default:
      return 'release.yml';
  }
}
