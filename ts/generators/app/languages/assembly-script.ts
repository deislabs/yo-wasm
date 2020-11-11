import { Language } from './language';

export const assemblyScript: Language = {
  instructions(): ReadonlyArray<string> {
    return [
      'Run npm install to set up your app.'
    ];
  },

  templateFolder(): string {
    return 'assembly-script';
  },

  templateFiles(): string[] {
    return [
      '.gitignore',
      'asconfig.json',
      'LICENSE',
      'package.json',
      'README.md',
      // '.vscode/extensions.json',
      // '.vscode/launch.json',
      // '.vscode/settings.json',
      // '.vscode/tasks.json',
      'assembly/index.ts',
      'assembly/tsconfig.json'
    ];
  }
}
