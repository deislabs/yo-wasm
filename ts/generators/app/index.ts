import Generator = require('yeoman-generator');
import { default as chalk } from 'chalk';
import * as fspath from 'path';

import { Registry } from './providers/registry';
import { acr } from './providers/acr';
import { noRegistry } from './providers/none';

import { Language } from './languages/language';
import { rust } from './languages/rust';
import { clang } from './languages/c';
import { assemblyScript } from './languages/assembly-script';
import { failed } from './utils/errorable';

const REGISTRY_CHOICE_ACR = "Azure Container Registry";
const REGISTRY_CHOICE_NONE = "I don't want to publish to an OCI registry";

module.exports = class extends Generator {
  private answers: any = undefined;

  constructor(args: string | string[], options: Generator.GeneratorOptions) {
    super(args, options);
    // NOTE: at run time, __dirname will end up referring to the JavaScript output
    // directory, NOT the TypeScript source directory. That's why this relative path
    // looks a bit hinky!
    this.sourceRoot(fspath.join(__dirname, '../../templates'));
  }

  async prompting() {
    const username = this.user.git.name() || process.env.USER || process.env.USERNAME;
    const appname = this.appname.replace(/ /g, '-');

    const prompts: Generator.Questions<any> = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What is the name of the WASM module?',
        default: appname
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
          'Rust',
          'AssemblyScript',
          'C'
        ],
        default: 'Rust'
      },
      {
        type: 'list',
        name: 'registryProvider',
        message: 'What registry provider do you plan to publish the module to?',
        choices: [
          REGISTRY_CHOICE_ACR,
          REGISTRY_CHOICE_NONE
        ],
        default: 'Azure Container Registry'
      }
    ];

    const answers = await this.prompt(prompts);

    const languagePrompts = await languageSpecificPrompts(answers);
    const languageAnswers = await this.prompt(languagePrompts);

    const providerPrompts = providerSpecificPrompts(answers);
    const providerAnswers = await this.prompt(providerPrompts);

    // To access answers later, use this.answers.*
    this.answers = Object.assign({}, answers, languageAnswers, providerAnswers);
  }

  writing() {
    const language = languageProvider(this.answers.language);
    const templateFolder = language.templateFolder();
    const templateValues = language.augment(this.answers);

    for (const path of language.templateFiles()) {
      this.fs.copyTpl(
        this.templatePath(fspath.join(templateFolder, path)),
        removeSuppressionExtension(this.destinationPath(path)),
        templateValues
      );
    }

    const buildTemplate = 'build.yml';
    this.fs.copyTpl(
      this.templatePath(fspath.join(templateFolder, `.github/workflows/${buildTemplate}`)),
      this.destinationPath(".github/workflows/build.yml"),
      templateValues
    );

    const releaseTemplate = providerReleaseTemplate(this.answers.registryProvider);
    this.fs.copyTpl(
      this.templatePath(fspath.join(templateFolder, `.github/workflows/${releaseTemplate}`)),
      this.destinationPath(".github/workflows/release.yml"),
      templateValues
    );

    // It would be good to install the language toolchain (and other local tools) here,
    // and also to set up appropriate VS Code settings files etc.  But the install is
    // something we'd like to be able to run on other boxes (when the generated project
    // is cloned) so this needs to be a script that we emit not just something we
    // do during generation.
  }

  async end() {
    this.log('');
    this.log(chalk.green('Created project and GitHub workflows'));
    if (this.answers.installTools) {
      this.log('');
      this.log('Installing tools...');
      const installResult = await languageProvider(this.answers.language).installTools(this.destinationPath('.'));
      if (failed(installResult)) {
        this.log(`${chalk.red('Tool installation failed!')} Install tools manually.`);
        this.log(`Error details: ${installResult.error[0]}`);
      } else {
        this.log('Installation complete');
      }
    }
    this.log('');
    for (const instruction of providerSpecificInstructions(this.answers)) {
      this.log(instruction);
    }
    this.log('');
    for (const instruction of languageSpecificInstructions(this.answers)) {
      this.log(instruction);
    }
    this.log('');
  }
};

function provider(registryProvider: string): Registry {
  switch (registryProvider) {
    case REGISTRY_CHOICE_ACR:
      return acr;
    case REGISTRY_CHOICE_NONE:
      return noRegistry;
    default:
      return noRegistry;
  }
}

function languageProvider(language: string): Language {
  switch (language) {
    case 'Rust':
      return rust;
    case 'AssemblyScript':
      return assemblyScript;
    case 'C':
      return clang;
    default:
      throw new Error("You didn't choose a language");
  }
}

function providerSpecificPrompts(answers: any): any {
  return provider(answers.registryProvider).prompts(answers);
}

function providerSpecificInstructions(answers: any): ReadonlyArray<string> {
  return provider(answers.registryProvider).instructions(answers);
}

function providerReleaseTemplate(registryProvider: string): string {
  return provider(registryProvider).releaseTemplate();
}

async function languageSpecificPrompts(answers: any): Promise<Generator.Questions<any>> {
  const toolOffer = await languageProvider(answers.language).offerToInstallTools();
  const installationPrompts = toolOffer ?
    [
      {
        type: 'confirm',
        name: 'installTools',
        message: `Would you like to install build tools (${toolOffer})?`,
        default: true,
      }
    ]
    : [];
  return installationPrompts;
}

function languageSpecificInstructions(answers: any): ReadonlyArray<string> {
  return languageProvider(answers.language).instructions();
}

function removeSuppressionExtension(path: string): string {
  if (fspath.extname(path) === '.removeext') {
    return path.substring(0, path.length - '.removeext'.length);
  }
  return path;
}
