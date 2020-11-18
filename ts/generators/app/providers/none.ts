import Generator = require('yeoman-generator');

export const noRegistry = {
  prompts(): Generator.Questions<any> { return []; },
  instructions(): ReadonlyArray<string> { return []; },
  releaseTemplate(): string { return 'release.nopublish.yml'; }
}
