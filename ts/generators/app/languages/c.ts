import { Language } from './language';

export const clang: Language = {
  // TODO: better still help with setup, instead of just giving a bald message
  instructions(): ReadonlyArray<string> {
    return [
      "If you don't have the WASI SDK, please install it from",
      "https://github.com/WebAssembly/wasi-sdk#install.",
      '',
      'If you already have the WASI SDK, or after you have installed it,',
      'please update the Makefile to refer to the location of the WASI SDK.'
    ];
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
