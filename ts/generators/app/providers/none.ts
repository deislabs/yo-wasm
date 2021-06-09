import Generator = require('yeoman-generator');

export const noRegistry = {
  prompts(): Generator.Questions<any> { return []; },
  localInstructions(): ReadonlyArray<string> { return []; },
  workflowInstructions(): ReadonlyArray<string> { return []; },
  languageFiles(): ReadonlyArray<string> { return []; },
  releaseTemplate(): string { return 'release.nopublish.yml'; }
}
