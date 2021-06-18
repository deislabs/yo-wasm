import { Registry } from './registry';

export const noRegistry: Registry = {
  prompts() { return []; },
  localInstructions(): ReadonlyArray<string> { return []; },
  workflowInstructions(): ReadonlyArray<string> { return []; },
  languageFiles(): ReadonlyArray<string> { return []; },
  releaseTemplate(): string { return 'release.nopublish.yml'; },
  async prepareRegistry() { return undefined; }
}
