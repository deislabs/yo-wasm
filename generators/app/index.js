'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const TEMPLATE_FILES = [
  '.gitignore',
  'Cargo.toml',
  'LICENSE',
  'README.md',
  '.github/workflows/build.yml',
  '.github/workflows/release.yml',
  '.vscode/settings.json',
  'src/main.rs'
];

module.exports = class extends Generator {
  prompting() {
    const username =
      this.user.git.name() || process.env.USER || process.env.USERNAME;

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
        type: 'input',
        name: 'registryName',
        message:
          'What registry do you plan to publish the module to (currently ACR only)?',
        default: username + 'acrwasm'
      }
    ];

    return this.prompt(prompts).then(answers => {
      // To access answers later, use this.answers.*
      this.answers = answers;
    });
  }

  writing() {
    for (const path of TEMPLATE_FILES) {
      this.fs.copyTpl(
        this.templatePath(path),
        this.destinationPath(path),
        this.answers
      );
    }
  }

  end() {
    this.log('');
    this.log(chalk.green('Created project and GitHub workflows'));
    this.log('');
    this.log('The release workflow depends on one variable and two secrets:');
    this.log('');
    this.log(
			`* ${chalk.cyan(
				'ACR_NAME'
			)} (defined in .github/workflows/release.yml): the`
		);
    this.log('  name of the Azure Container Registry where you\'d like to');
    this.log('  publish releases. We\'ve set this up for you.');
    this.log(
			`* ${chalk.cyan(
				'ACR_SP_ID'
			)} (secret you need to create in GitHub): the ID`
		);
    this.log('  of a service principal with push access to the registry.');
    this.log(
			`* ${chalk.cyan(
				'ACR_SP_PASSWORD'
			)} (secret you need to create in GitHub): the`
		);
    this.log('  of the service principal identified in ACR_SP_ID.');
    this.log('');
    this.log('See https://bit.ly/2ZsmeQS for creating a service principal');
    this.log('for use with ACR, and https://bit.ly/2ZqS3cB for creating the.');
    this.log('secrets in your GitHub repository.');
    this.log('');
  }
};
