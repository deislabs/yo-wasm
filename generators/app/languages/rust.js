const rust = {
  templateFolder() {
    return 'rust';
  },

  templateFiles() {
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

module.exports = rust;
