"use strict";
const Generator = require("yeoman-generator");

const TEMPLATE_FILES = [
  ".gitignore",
  "Cargo.toml",
  "LICENSE",
  "README.md",
  ".github/workflows/build.yml",
  ".github/workflows/release.yml",
  ".vscode/settings.json",
  "src/main.rs"
];

module.exports = class extends Generator {
  prompting() {
    const username = this.user.git.name() || process.env.USER || process.env.USERNAME;

    const prompts = [
      {
        type: "input",
        name: "moduleName",
        message: "What is the name of the WASM module?",
        default: this.appname
      },
      {
        type: "input",
        name: "authorName",
        message: "What is the name of the author?",
        default: username
      },
      {
        type: "input",
        name: "registryName",
        message: "What registry do you plan to publish the module to (currently ACR only)?",
        default: username + "acrwasm"
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
