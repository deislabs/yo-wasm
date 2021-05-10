import Generator = require('yeoman-generator');

export interface Registry {
  prompts(answers: any): Generator.Questions<any>;
  instructions(answers: any): ReadonlyArray<string>;
  languageFiles(): ReadonlyArray<string>;
  releaseTemplate(): string;
}
