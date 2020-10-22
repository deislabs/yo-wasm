import Generator = require('yeoman-generator');

export const defaultRegistry = {
  prompts(): Generator.Questions<any> { return []; },
  instructions(): ReadonlyArray<string> { return []; },
  releaseTemplate(): string { return 'release.yml'; }
}
