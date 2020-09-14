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
      '.vscode/settings.json',
      'src/main.rs'
    ];
  }
}

module.exports = rust;
