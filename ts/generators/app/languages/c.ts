import { Language } from './language';

export const clang: Language = {
  templateFolder(): string {
    return 'c';
  },

  templateFiles(): string[] {
    return [
      '.gitignore',
      'LICENSE',
      'Makefile',
      'README.md',
      // '.vscode/extensions.json',
      // '.vscode/launch.json',
      // '.vscode/settings.json',
      // '.vscode/tasks.json',
      'src/main.c'
    ];
  }
}
