import Generator = require('yeoman-generator');
import { Formatter } from '../formatter';

export interface Registry {
  prompts(answers: any): Generator.Questions<any>;
  localInstructions(fmt: Formatter, answers: any): ReadonlyArray<string>;
  workflowInstructions(fmt: Formatter, answers: any): ReadonlyArray<string>;
  languageFiles(): ReadonlyArray<string>;
  releaseTemplate(): string;
}
