import { Language } from './language';

export const rust: Language = {
  instructions(): ReadonlyArray<string> {
    return [];
  },

  templateFolder(): string {
    return 'rust';
  },

  templateFiles(): string[] {
    return [
      '.gitignore',
      'Cargo.toml',
      'LICENSE',
      'README.md',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/settings.json',
      '.vscode/tasks.json',
      'src/main.rs'
    ];
  }
}
