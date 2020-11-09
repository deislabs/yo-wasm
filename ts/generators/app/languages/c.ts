import { Language } from './language';

export const clang: Language = {
  // TODO: this is a placeholder; before release we need to give more info, or
  // better still help with setup, instead of just giving a bald message
  instructions(): ReadonlyArray<string> {
    return ['Please update Makefile to refer to location of WASI SDK'];
  },

  templateFolder(): string {
    return 'c';
  },

  templateFiles(): string[] {
    return [
      '.gitignore',
      'LICENSE',
      'Makefile',
      'README.md',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/tasks.json',
      'src/main.c'
    ];
  }
}
