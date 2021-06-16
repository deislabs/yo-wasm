import Generator = require('yeoman-generator');
import { Formatter } from '../formatter';
import { Moarable } from '../question-sequence';

export interface Registry {
  prompts(answers: any): (Generator.Question<any> & Moarable)[];
  localInstructions(fmt: Formatter, answers: any): ReadonlyArray<string>;
  workflowInstructions(fmt: Formatter, answers: any): ReadonlyArray<string>;
  languageFiles(): ReadonlyArray<string>;
  releaseTemplate(): string;
  prepareRegistry(answers: any, log: (line: string) => void): Promise<Error | undefined>;
}
