import Generator = require('yeoman-generator');
import { default as chalk } from 'chalk';
import * as fspath from 'path';

import { Registry } from './providers/registry';
import { acr } from './providers/acr';
import { hippo } from './providers/hippo';
import { noRegistry } from './providers/none';

import { Language } from './languages/language';
import { rust } from './languages/rust';
import { clang } from './languages/c';
import { assemblyScript } from './languages/assembly-script';
import { failed } from './utils/errorable';
import { swift } from './languages/swift';
import { tinygo } from './languages/tinygo';
import { FMT_CHALK, FMT_MARKDOWN } from './formatter';
import { ask, Moarable } from './question-sequence';

const REGISTRY_CHOICE_ACR = "Azure Container Registry";
const REGISTRY_CHOICE_HIPPO = "Hippo";
const REGISTRY_CHOICE_NONE = "I don't want to publish the module";

const PROJ_KIND_CONSOLE = "Console or batch job";
const PROJ_KIND_WAGI = "Web service or application using WAGI";

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

    const prompts: (Generator.Question<any> & Moarable)[] = [
      {
        type: 'input',
        name: 'moduleName',
        message: 'What is the name of the WASM module?',
        default: appname
      },
      {
        type: 'list',
        name: 'moduleKind',
        message: 'What type of application is the module?',
        choices: [
          PROJ_KIND_CONSOLE,
          PROJ_KIND_WAGI,
        ],
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
        choices: [ // In alphabetical order
          'AssemblyScript',
          'C',
          'Rust',
          'Swift',
          'TinyGo'
        ],
        default: 'Rust'
      },
      {
        type: 'list',
        name: 'registryProvider',
        message: 'Where do you plan to publish the module?',
        choices: [
          REGISTRY_CHOICE_ACR,
          REGISTRY_CHOICE_HIPPO,
          REGISTRY_CHOICE_NONE
        ],
        default: 'Azure Container Registry'
      }
    ];

    const answers = await ask(prompts, (q) => this.prompt(q));

    const languagePrompts = await languageSpecificPrompts(answers);
    const languageAnswers = await ask(languagePrompts, (q) => this.prompt(q), answers);

    const providerPrompts = providerSpecificPrompts(answers);
    const providerAnswers = await ask(providerPrompts, (q) => this.prompt(q), answers);

    const answerConversions = simplify(answers);

    // To access answers later, use this.answers.*
    this.answers = Object.assign({}, answers, languageAnswers, providerAnswers, answerConversions);
  }

  writing() {
    const language = languageProvider(this.answers.language);
    const registry = provider(this.answers.registryProvider);

    const templateFolder = language.templateFolder();
    const templateValues = language.augment(this.answers);

    for (const path of language.templateFiles()) {
      this.fs.copyTpl(
        this.templatePath(fspath.join(templateFolder, path)),
        removeSuppressionExtension(this.destinationPath(path)),
        templateValues
      );
    }

    const appendToReadMe = (line: string) =>
      this.fs.append(this.destinationPath("README.md"), line, { trimEnd: false });

    logParagraph(appendToReadMe, '## Dev releases', registry.localInstructions(FMT_MARKDOWN, this.answers));
    logParagraph(appendToReadMe, '## CI releases', registry.workflowInstructions(FMT_MARKDOWN, this.answers));
    appendToReadMe('');

    for (const path of registry.languageFiles()) {
      this.fs.copyTpl(
        this.templatePath(fspath.join(templateFolder, path)),
        removeSuppressionExtension(this.destinationPath(path)),
        templateValues
      );
    }

    const tasksFilePath = this.destinationPath('.vscode/tasks.json');
    if (this.fs.exists(tasksFilePath)) {
      const tasksFile = this.fs.readJSON(tasksFilePath) as unknown as TasksFile;
      tasksFile.tasks = purgeIrrelevant(tasksFile.tasks, this.answers.registryProvider);
      this.fs.writeJSON(tasksFilePath, tasksFile);
    }

    const buildTemplate = 'build.yml';
    this.fs.copyTpl(
      this.templatePath(fspath.join(templateFolder, `.github/workflows/${buildTemplate}`)),
      this.destinationPath(".github/workflows/build.yml"),
      templateValues
    );

    const releaseTemplate = registry.releaseTemplate();
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
    const language = languageProvider(this.answers.language);
    const registry = provider(this.answers.registryProvider);
    const errors = Array.of<string>();

    this.log('');
    this.log(chalk.green('Created project and GitHub workflows'));

    if (this.answers.installTools) {
      this.log('');
      this.log('Installing tools...');
      const installResult = await language.installTools(this.destinationPath('.'));
      if (failed(installResult)) {
        this.log(`${chalk.red('Tool installation failed!')} Install tools manually.`);
        this.log(`Error details: ${installResult.error[0]}`);
        errors.push('* Error installing tools');
      } else {
        this.log('Installation complete');
      }
    }

    const prepareError = await registry.prepareRegistry(this.answers, this.log);
    if (prepareError) {
      errors.push('* Error setting up publishing');
    }

    logParagraph(this.log, chalk.yellow('Building'), language.instructions(FMT_CHALK));
    logParagraph(this.log, chalk.yellow('Dev releases'), registry.localInstructions(FMT_CHALK, this.answers));
    logParagraph(this.log, chalk.yellow('CI releases'), registry.workflowInstructions(FMT_CHALK, this.answers));
    logParagraph(this.log, chalk.underline(chalk.red('There were errors during setup: see above for details')), errors);
    this.log('');
  }
};

function logParagraph(log: (line: string) => void, title: string, lines: ReadonlyArray<string>) {
  if (lines.length === 0) {
    return;
  }
  log('');
  log(title);
  log('');
  for (const line of lines) {
    log(line);
  }
}

function provider(registryProvider: string): Registry {
  switch (registryProvider) {
    case REGISTRY_CHOICE_ACR:
      return acr;
    case REGISTRY_CHOICE_HIPPO:
      return hippo;
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
    case 'Swift':
      return swift;
    case 'TinyGo':
      return tinygo;
    default:
      throw new Error("You didn't choose a language");
  }
}

function providerSpecificPrompts(answers: any): (Generator.Question<any> & Moarable)[] {
  const registry = provider(answers.registryProvider);
  const p = registry.prompts;
  return p(answers);
}

async function languageSpecificPrompts(answers: any): Promise<(Generator.Question<any> & Moarable)[]> {
  const toolOffer = await languageProvider(answers.language).offerToInstallTools();
  const installationPrompts = toolOffer ?
    [
      {
        type: 'confirm' as const,
        name: 'installTools',
        message: `Would you like to install build tools (${toolOffer})?`,
        default: true,
      }
    ]
    : [];
  return installationPrompts;
}

function removeSuppressionExtension(path: string): string {
  if (fspath.extname(path) === '.removeext') {
    return path.substring(0, path.length - '.removeext'.length);
  }
  return path;
}

function simplify(answers: any): any {
  return {
    wagi: (answers.moduleKind === PROJ_KIND_WAGI),
    bindleId: (answers.bindleId || answers.moduleName),
  };
}

interface TasksFile {
  version: string;
  tasks: TasksFileTask[];
}

interface TasksFileTask {
  label: string;
  [key: string]: any;
}

function purgeIrrelevant(tasks: TasksFileTask[], registry: string): TasksFileTask[] {
  return tasks.filter((t) => isRelevant(t, registry)).map(removeLabelPrefix);
}

function isRelevant(task: TasksFileTask, registry: string): boolean {
  // It's relevant if it applies to this registry, or always applies
  return task.label.startsWith(`#OPT:${registry}# `) || !task.label.startsWith('#OPT');
}

function removeLabelPrefix(task: TasksFileTask): TasksFileTask {
  if (task.label.startsWith('#OPT')) {
    task.label = task.label.substr(task.label.indexOf('# ') + 2).trimLeft();
  }
  return task;
}
