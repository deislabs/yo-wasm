export function  templateFolder(): string {
  return 'rust';
}

export function templateFiles(): string[] {
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
