'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

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

    const prompts = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What is the name of the WASM module?',
        default: this.appname
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
};
